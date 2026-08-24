export function getColorVariable(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim()
}

export function getSpacingVariable(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--spacing-${name}`).trim()
}

export function getFontSizeVariable(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--font-size-${name}`).trim()
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>

  return function executedFunction(...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return function throttledFunction(...args: Parameters<T>) {
    if (inThrottle) {
      return
    }

    func(...args)
    inThrottle = true
    setTimeout(() => {
      inThrottle = false
    }, limit)
  }
}
