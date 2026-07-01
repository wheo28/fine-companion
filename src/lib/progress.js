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
