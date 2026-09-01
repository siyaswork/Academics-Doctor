import { useRef, useCallback } from 'react'

export function useDebouncedCallback<T extends (...args: any[]) => any>(fn: T, delay = 1000) {
  const timer = useRef<number | null>(null)

  const cancel = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  const call = useCallback((...args: Parameters<T>) => {
    if (timer.current) window.clearTimeout(timer.current)
    // @ts-ignore - window.setTimeout returns number in browsers
    timer.current = window.setTimeout(() => {
      fn(...args)
    }, delay)
  }, [fn, delay])

  return { call, cancel }
}
