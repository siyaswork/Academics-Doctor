// Theme utilities
export function getColorVariable(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim()
}

export function getSpacingVariable(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--spacing-${name}`).trim()
}

export function getFontSizeVariable(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--font-size-${name}`).trim()
}

// Utility functions for common tasks
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
