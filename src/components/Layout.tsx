import React from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useCalculator } from '../contexts/CalculatorContext'
import { AdvancedCalculator } from './AdvancedCalculator'
import { CalculatorHistory } from './CalculatorHistory'
import styles from './Layout.module.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/notes', label: 'My Notes' },
  { to: '/my-work', label: 'My Work' },
  { to: '/workspace', label: 'Study Workspace' },
]

export const Layout: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const { isOpen, closeCalculator, openCalculator } = useCalculator()
  const [isNavOpen, setIsNavOpen] = React.useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Close the mobile nav whenever the route changes
  React.useEffect(() => {
    setIsNavOpen(false)
  }, [location.pathname])

  return (
    <div className={styles.shell}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to content
      </a>
      <header className={styles.topBar}>
        <div className={styles.brand}>
          <span aria-hidden="true">🩺</span> Academics Doctor
        </div>
        <nav
          id="primary-nav"
          className={`${styles.nav} ${isNavOpen ? styles.navOpen : ''}`}
          aria-label="Primary"
          onKeyDown={(event) => {
            if (event.key === 'Escape') setIsNavOpen(false)
          }}
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.searchButton}
            onClick={() => navigate('/search')}
            aria-label="Search notes"
            title="Search notes"
          >
            🔍
          </button>
          <button type="button" className={styles.calcButton} onClick={() => openCalculator()} aria-label="Open calculator">
            🧮
          </button>
          <button
            type="button"
            className={styles.themeButton}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setIsNavOpen((open) => !open)}
            aria-expanded={isNavOpen}
            aria-controls="primary-nav"
            aria-label={isNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <span aria-hidden="true">{isNavOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </header>
      <main id="main-content" className={styles.content}>
        <Outlet />
      </main>

      {isOpen && (
        <div
          className={styles.calcOverlay}
          onClick={closeCalculator}
          role="presentation"
        >
          <div
            className={styles.calcModal}
            role="dialog"
            aria-modal="true"
            aria-label="Calculator"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.key === 'Escape' && closeCalculator()}
          >
            <div className={styles.calcModalHeader}>
              <h2>Calculator</h2>
              <button type="button" onClick={closeCalculator} aria-label="Close calculator">
                ✕
              </button>
            </div>
            <AdvancedCalculator />
            <CalculatorHistory />
          </div>
        </div>
      )}
    </div>
  )
}
