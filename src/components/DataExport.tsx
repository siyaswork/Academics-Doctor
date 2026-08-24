import { STORAGE_KEYS } from '../utils/constants'

export const DataExport = () => {
  const handleExport = () => {
    const payload = Object.values(STORAGE_KEYS).reduce<Record<string, string | null>>((accumulator, key) => {
      accumulator[key] = window.localStorage.getItem(key)
      return accumulator
    }, {})
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `academics-export-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }
  return <button type="button" className="buttonSecondary" onClick={handleExport}>Export JSON</button>
}
