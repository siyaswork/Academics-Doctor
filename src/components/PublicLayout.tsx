import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import type { FC } from 'react'
import styles from './PublicLayout.module.css'

export const PublicLayout: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { to: '/', label: 'Home', end: true },
    { to: '/subjects', label: 'Subjects' },
    { to: '/how-it-works', label: 'How it works' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
  ]

  return (
    <div>
      <header className={styles.header}>
        <NavLink to="/" className={styles.brand}>Academics Doctor</NavLink>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={styles.navLink} style={{ textDecoration: 'none', color: 'inherit' }}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.authLinks}>
          <NavLink to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Log in</NavLink>
          <NavLink to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>Start studying</NavLink>
        </div>

        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '\u00d7' : '\u2630'}
        </button>
      </header>

      <div className={`${styles.mobilePanel} ${menuOpen ? styles.open : ''}`}>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={styles.navLink} onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
            {item.label}
          </NavLink>
        ))}
        <NavLink to="/login" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit', padding: '12px 4px' }}>Log in</NavLink>
        <NavLink to="/signup" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit', padding: '12px 4px' }}>Start studying</NavLink>
      </div>

      <main style={{ padding: 16 }}>
        <Outlet />
      </main>

      <footer style={{ padding: 20, borderTop: '1px solid #eee', marginTop: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <div>
            <strong>Product</strong>
            <div><NavLink to="/subjects">Subjects</NavLink></div>
            <div><NavLink to="/how-it-works">How It Works</NavLink></div>
            <div><NavLink to="/pricing">Pricing</NavLink></div>
          </div>
          <div>
            <strong>Company</strong>
            <div><NavLink to="/about">About</NavLink></div>
            <div><NavLink to="/contact">Contact</NavLink></div>
          </div>
          <div>
            <strong>Legal</strong>
            <div><NavLink to="/terms">Terms</NavLink></div>
            <div><NavLink to="/privacy">Privacy</NavLink></div>
            <div><NavLink to="/refund-policy">Refund Policy</NavLink></div>
          </div>
          <div>
            <strong>Account</strong>
            <div><NavLink to="/login">Log In</NavLink></div>
            <div><NavLink to="/signup">Sign Up</NavLink></div>
          </div>
        </div>
        <div style={{ marginTop: 12, color: 'var(--color-text-secondary)' }}>
          &copy; {new Date().getFullYear()} Academics Doctor — All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout
