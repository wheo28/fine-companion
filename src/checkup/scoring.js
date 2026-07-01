// Pure, framework-free scoring for the Financial Wellness Checkup.
// Everything here is descriptive and educational — it classifies a person's
// own numbers into plain-language states, then builds a supportive narrative.
// It never recommends products, investments, insurance, tax, or legal strategies.

function num(v) {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}

function clamp04(v) {
  const n = Number(v)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(4, n))
}

export function computeResults(answers) {
  const income = num(answers.income)
  const essentials = num(answers.essentials)
  const discretionary = num(answers.discretionary)
  const debt = num(answers.debt)
  const savings = num(answers.savings)

  const mustPays = essentials + debt
  const totalOut = essentials + discretionary + debt
  const leftover = income - totalOut
  const cashflowRatio = income > 0 ? leftover / income : 0

  const emergencyMonths = mustPays > 0 ? savings / mustPays : savings > 0 ? 99 : 0
  const debtRatio = income > 0 ? debt / income : 0

  // ----- States -----
  let cashflowState = 'strong'
  if (cashflowRatio < 0) cashflowState = 'short'
  else if (cashflowRatio < 0.1) cashflowState = 'even'
  else if (cashflowRatio < 0.2) cashflowState = 'healthy'

  let emergencyState = 'cushioned'
  if (emergencyMonths < 1) emergencyState = 'none'
  else if (emergencyMonths < 3) emergencyState = 'building'
  else if (emergencyMonths < 6) emergencyState = 'solid'

  let debtState = 'none'
  if (debtRatio > 0.36) debtState = 'heavy'
  else if (debtRatio >= 0.15) debtState = 'moderate'
  else if (debtRatio > 0) debtState = 'light'

  const insuranceState = answers.insurance || 'notAtAll'
  const retirementState = answers.retirement || 'notsure'

  // ----- Basic scores -----
  const stressSum = clamp04(answers.stressWorry) + clamp04(answers.stressControl)
  const stressScore = Math.round((stressSum / 8) * 100)
  let stressBand = 'low'
  if (stressScore > 75) stressBand = 'high'
  else if (stressScore > 50) stressBand = 'elevated'
  else if (stressScore > 25) stressBand = 'moderate'

  const riskScore = Math.round((clamp04(answers.risk) / 4) * 100)
  let riskBand = 'cautious'
  if (riskScore > 66) riskBand = 'comfortable'
  else if (riskScore > 33) riskBand = 'balanced'

  // ----- Roadmap focus selection (weighted concerns) -----
  const focuses = []
  if (cashflowState === 'short') focuses.push({ key: 'cashflow', w: 5 })
  if (emergencyState === 'none') focuses.push({ key: 'emergency', w: 4 })
  else if (emergencyState === 'building') focuses.push({ key: 'emergency', w: 2 })
  if (debtState === 'heavy') focuses.push({ key: 'debt', w: 4 })
  else if (debtState === 'moderate') focuses.push({ key: 'debt', w: 2 })
  if (retirementState === 'notyet') focuses.push({ key: 'retirement', w: 3 })
  else if (retirementState === 'notsure') focuses.push({ key: 'retirement', w: 2 })
  if (insuranceState === 'notAtAll') focuses.push({ key: 'insurance', w: 3 })
  else if (insuranceState === 'somewhat') focuses.push({ key: 'insurance', w: 1 })
  if (stressBand === 'high') focuses.push({ key: 'stress', w: 3 })
  else if (stressBand === 'elevated') focuses.push({ key: 'stress', w: 1 })

  focuses.sort((a, b) => b.w - a.w)
  const top = focuses[0] ? focuses[0].key : 'steady'
  const second = focuses[1] ? focuses[1].key : null

  let sixTwelve
  if (second && second !== top) sixTwelve = second
  else if (top === 'steady') sixTwelve = 'retirement'
  else if (top === 'retirement') sixTwelve = 'emergency'
  else sixTwelve = 'retirement'

  const longtermVariant = top === 'steady' ? 'strengthening' : 'building'

  // ----- Narrative (tone, strengths, single priority) -----
  const strengthKeys = []
  if (emergencyState === 'solid' || emergencyState === 'cushioned') strengthKeys.push('emergency')
  if (cashflowState === 'healthy' || cashflowState === 'strong') strengthKeys.push('cashflow')
  if (debtState === 'none' || debtState === 'light') strengthKeys.push('debt')
  if (retirementState === 'regularly') strengthKeys.push('retirement')
  if (insuranceState === 'mostly' || insuranceState === 'veryClear') strengthKeys.push('insurance')
  if (stressBand === 'low') strengthKeys.push('stress')

  const hardConcern =
    cashflowState === 'short' || emergencyState === 'none' || debtState === 'heavy' || stressBand === 'high'
  const strengthsCount = strengthKeys.length
  const concernsCount = focuses.length

  let tone
  if (strengthsCount >= 4 && !hardConcern) tone = 'strong'
  else if (strengthsCount >= 2 && concernsCount <= 2 && !hardConcern) tone = 'stable'
  else if (hardConcern && strengthsCount <= 1) tone = 'stretched'
  else tone = 'mixed'

  // Always surface 2–3 genuine positives; fall back to universal ones.
  const displayStrengths = [...strengthKeys]
  for (const fb of ['reflection', 'clarity']) {
    if (displayStrengths.length >= 3) break
    if (!displayStrengths.includes(fb)) displayStrengths.push(fb)
  }
  const strengths = displayStrengths.slice(0, 3)

  return {
    currency: answers.currency || 'usd',
    cashflow: { state: cashflowState, leftover, ratioPct: Math.round(cashflowRatio * 100) },
    emergency: {
      state: emergencyState,
      months: emergencyMonths,
      monthsDisplay: emergencyMonths >= 12 ? '12+' : emergencyMonths.toFixed(1),
    },
    debt: { state: debtState, ratioPct: Math.round(debtRatio * 100) },
    insurance: { state: insuranceState },
    retirement: { state: retirementState },
    stress: { score: stressScore, band: stressBand },
    risk: { score: riskScore, band: riskBand },
    narrative: { tone, strengths, priority: top },
    roadmap: { today: top, next30: top, sixTwelve, longterm: longtermVariant },
  }
}

export function formatCurrency(value, currency = 'usd') {
  const n = Math.round(Number(value) || 0)
  const symbol = currency === 'krw' ? '₩' : '$'
  const sign = n < 0 ? '-' : ''
  const body = Math.abs(n).toLocaleString('en-US')
  return `${sign}${symbol}${body}`
}
