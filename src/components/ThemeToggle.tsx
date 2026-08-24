import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import styles from './ThemeToggle.module.css'

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${theme === 'light' ? styles.active : ''}`}
        onClick={() => setTheme('light')}
        title="Light mode"
        aria-label="Switch to light mode"
      >
        ☀️
      </button>
      <button
        className={`${styles.button} ${theme === 'system' ? styles.active : ''}`}
        onClick={() => setTheme('system')}
        title="System preference"
        aria-label="Use system preference"
      >
        🖥️
      </button>
      <button
        className={`${styles.button} ${theme === 'dark' ? styles.active : ''}`}
        onClick={() => setTheme('dark')}
        title="Dark mode"
        aria-label="Switch to dark mode"
      >
        🌙
      </button>
    </div>
  )
}
