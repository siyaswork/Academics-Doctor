import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import styles from './DashboardHeader.module.css'

interface DashboardHeaderProps {
  userName?: string
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'Alex',
}) => {
  const { theme, setTheme } = useTheme()

  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const currentGreeting = getTimeGreeting()

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.greeting}>
          <h1 className={styles.title}>{currentGreeting}, {userName}</h1>
          <p className={styles.subtitle}>Welcome back to your workspace</p>
        </div>

        <div className={styles.actions}>
          <div className={styles.search}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search notes, assignments..."
              aria-label="Search"
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>

          <div className={styles.controls}>
            <button
              className={styles.themeToggle}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <div className={styles.avatar}>
              <span>{userName.charAt(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
