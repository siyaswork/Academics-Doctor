import { useEffect } from 'react'

export const useKeyboardShortcut = (matcher: (event: KeyboardEvent) => boolean, handler: () => void, enabled = true) => {
  useEffect(() => {
    if (!enabled) return
    const listener = (event: KeyboardEvent) => {
      if (!matcher(event)) return
      event.preventDefault()
      handler()
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [enabled, handler, matcher])
}
