export const readStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export const writeStorage = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore write errors
  }
}

export const clearStorageKeys = (keys: string[]) => {
  if (typeof window === 'undefined') return
  keys.forEach((key) => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // ignore clear errors
    }
  })
}
