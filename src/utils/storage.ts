/**
 * Small localStorage helpers shared by every persisted feature in Step 5.
 * Every read recovers gracefully from missing/malformed JSON by falling back
 * to the supplied default instead of throwing.
 */

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    if (parsed === null || parsed === undefined) return fallback
    return parsed as T
  } catch {
    return fallback
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable (e.g. private browsing) — fail silently.
  }
}

export function removeKey(key: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export const STORAGE_KEYS = {
  calcHistory: 'academ_calc_history',
  formulas: 'academ_formulas',
  drawing: (noteId: string) => `academ_drawing_${noteId}`,
  notes: 'academ_notes',
  workspacePrefs: 'academ_workspace_prefs',
} as const
