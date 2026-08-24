import { useAppContext } from '../contexts/AppContext'
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut'
import styles from './TopBar.module.css'

export const TopBar = () => {
  const { openCommandMenu, openSearch, preferences, updatePreferences } = useAppContext()
  useKeyboardShortcut((event) => (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k', () => openCommandMenu())
  return (
    <header className={styles.topBar}>
      <button type="button" className="buttonSecondary" onClick={openSearch}>🔎 Search everything</button>
      <div className={styles.actions}>
        <button type="button" className="buttonGhost" onClick={openCommandMenu}>⌘K Command menu</button>
        <button type="button" className="iconButton" aria-label="Toggle theme" onClick={() => updatePreferences({ theme: preferences.theme === 'system' ? 'light' : preferences.theme === 'light' ? 'dark' : 'system' })}>{preferences.theme === 'dark' ? '🌙' : preferences.theme === 'light' ? '☀️' : '🖥️'}</button>
      </div>
    </header>
  )
}
