export const plainTextFromHtml = (value: string): string => {
  if (typeof document === 'undefined') {
    return value
  }

  const wrapper = document.createElement('div')
  wrapper.innerHTML = value
  return wrapper.textContent?.replace(/\s+/g, ' ').trim() ?? ''
}
