// Shared progress helpers. Privacy-first: everything stays in the browser.

const EXPLORED_KEY = 'fine-companion.explored.v1'
const CHECKUP_KEY = 'fine-companion.checkup.v1'

export function getExplored() {
  try {
    const raw = window.localStorage.getItem(EXPLORED_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function markExplored(id) {
  try {
    const e = getExplored()
    e[id] = { ts: Date.now() }
    window.localStorage.setItem(EXPLORED_KEY, JSON.stringify(e))
  } catch {
    /* ignore */
  }
}

export function isExplored(id) {
  return Boolean(getExplored()[id])
}

export function exploredIds() {
  return Object.keys(getExplored())
}

export function getCheckup() {
  try {
    const raw = window.localStorage.getItem(CHECKUP_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const CHECKIN_KEY = 'fine-companion.checkin.v1'

// Monthly check-in: embodies "revisit as life changes." Stores last check-in time.
export function getLastCheckin() {
  try {
    const raw = window.localStorage.getItem(CHECKIN_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function markCheckin(changes) {
  try {
    window.localStorage.setItem(CHECKIN_KEY, JSON.stringify({ ts: Date.now(), changes: changes || [] }))
  } catch {
    /* ignore */
  }
}

// Days since the last check-in, or null if never.
export function daysSinceCheckin() {
  const last = getLastCheckin()
  if (!last || !last.ts) return null
  return Math.floor((Date.now() - last.ts) / 86400000)
}
