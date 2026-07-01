import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { checkupContent } from './checkupContent'
import { computeResults } from './scoring'
import QuestionStep from './QuestionStep'
import Results from './Results'
import { Sunrise, ArrowRight, Check } from '../components/Icons'

const STORAGE_KEY = 'fine-companion.checkup.v1'

function readSaved() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && parsed.answers) return parsed
  } catch {
    /* ignore */
  }
  return null
}

function isAnswered(question, value) {
  if (question.type === 'number') {
    if (value === '' || value == null) return false
    const n = Number(value)
    if (!Number.isFinite(n) || n < 0) return false
    if (question.id === 'income' && n <= 0) return false
    return true
  }
  // choice values can legitimately be 0
  return value !== undefined && value !== null
}

export default function CheckupFlow() {
  const { lang } = useLanguage()
  const [stage, setStage] = useState('intro')
  const [qIndex, setQIndex] = useState(0)
  const [currency, setCurrency] = useState(lang === 'ko' ? 'krw' : 'usd')
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [saved, setSaved] = useState(() => readSaved())

  const c = checkupContent[lang]
  const questions = c.questions
  const total = questions.length

  const persist = (finalAnswers, computed) => {
    const payload = { answers: finalAnswers, ts: Date.now() }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      /* ignore persistence failures */
    }
    setSaved(payload)
    return computed
  }

  const beginNew = () => {
    setAnswers({ currency })
    setQIndex(0)
    setResult(null)
    setStage('questions')
  }

  const viewSaved = () => {
    if (!saved) return
    setResult(computeResults(saved.answers))
    setStage('results')
  }

  const clearSaved = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setSaved(null)
  }

  const setValue = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }))

  const goNext = () => {
    if (qIndex < total - 1) {
      setQIndex((i) => i + 1)
      window.scrollTo({ top: 0 })
    } else {
      const finalAnswers = { ...answers, currency }
      const computed = computeResults(finalAnswers)
      persist(finalAnswers, computed)
      setResult(computed)
      setStage('results')
      window.scrollTo({ top: 0 })
    }
  }

  const goBack = () => {
    if (qIndex > 0) {
      setQIndex((i) => i - 1)
      window.scrollTo({ top: 0 })
    } else {
      setStage('intro')
    }
  }

  const restart = () => {
    setStage('intro')
    setQIndex(0)
    setResult(null)
    setAnswers({})
  }

  /* ------------------------------ Intro ------------------------------ */
  if (stage === 'intro') {
    return (
      <main className="checkup">
        <div className="checkup__inner ck-intro">
          <span className="ck-intro__icon" aria-hidden="true">
            <Sunrise size={30} />
          </span>
          <p className="eyebrow eyebrow--accent">{c.intro.eyebrow}</p>
          <h1 className="display ck-intro__title">{c.intro.title}</h1>
          <p className="ck-intro__sub">{c.intro.sub}</p>

          <div className="ck-intro__meta">
            <span>{c.intro.time}</span>
            <span aria-hidden="true">·</span>
            <span>{c.intro.privacy}</span>
          </div>

          {c.intro.assure && (
            <ul className="ck-assure" aria-label={c.intro.privacy}>
              {c.intro.assure.map((a) => (
                <li key={a}>
                  <Check size={13} aria-hidden="true" />
                  {a}
                </li>
              ))}
            </ul>
          )}

          <div className="ck-currency" role="group" aria-label={c.currency.label}>
            <span className="ck-currency__label">{c.currency.label}</span>
            <div className="ck-currency__opts">
              <button
                type="button"
                className={`ck-currency__btn${currency === 'usd' ? ' is-active' : ''}`}
                aria-pressed={currency === 'usd'}
                onClick={() => setCurrency('usd')}
              >
                {c.currency.usd}
              </button>
              <button
                type="button"
                className={`ck-currency__btn${currency === 'krw' ? ' is-active' : ''}`}
                aria-pressed={currency === 'krw'}
                onClick={() => setCurrency('krw')}
              >
                {c.currency.krw}
              </button>
            </div>
          </div>

          <button type="button" className="btn btn--primary btn--lg" onClick={beginNew}>
            {c.intro.start}
            <ArrowRight size={18} />
          </button>

          {saved && (
            <div className="ck-intro__saved">
              <p className="ck-intro__saved-note">{c.intro.resumeTitle}</p>
              <div className="ck-intro__saved-actions">
                <button type="button" className="ck-link" onClick={viewSaved}>
                  {c.intro.resume}
                </button>
                <button type="button" className="ck-link ck-link--muted" onClick={clearSaved}>
                  {c.intro.clear}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    )
  }

  /* ----------------------------- Results ----------------------------- */
  if (stage === 'results' && result) {
    return (
      <main className="checkup">
        <div className="checkup__inner">
          <Results result={result} onRestart={restart} />
        </div>
      </main>
    )
  }

  /* ---------------------------- Questions ---------------------------- */
  const question = questions[qIndex]
  const value = answers[question.id]
  const answered = isAnswered(question, value)
  const isLast = qIndex === total - 1
  const progress = Math.round(((qIndex + 1) / total) * 100)

  return (
    <main className="checkup">
      <div className="checkup__inner">
        <div className="ck-progress">
          <div className="ck-progress__meta">
            <span>
              {c.nav.step} {qIndex + 1} {c.nav.of} {total}
            </span>
          </div>
          <div className="ck-progress__bar">
            <span className="ck-progress__fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <QuestionStep
          key={question.id}
          question={question}
          value={value}
          onChange={(v) => setValue(question.id, v)}
          currency={currency}
        />

        {c.qReassure && <p className="ck-reassure">{c.qReassure}</p>}

        <div className="ck-nav">
          <button type="button" className="btn btn--ghost" onClick={goBack}>
            {c.nav.back}
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={goNext}
            disabled={!answered}
          >
            {isLast ? c.nav.see : c.nav.next}
            {!isLast && <ArrowRight size={17} />}
          </button>
        </div>

        <p className="ck-exit">
          <Link to="/">{checkupContent[lang].results.home}</Link>
        </p>
      </div>
    </main>
  )
}
