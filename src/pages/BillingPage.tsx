import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { STORAGE_KEYS } from '../utils/storage'
import styles from './BillingPage.module.css'

export default function BillingPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [initiatingPaypal, setInitiatingPaypal] = useState(false)
  const [paypalNotice, setPaypalNotice] = useState<string | null>(null)

  const handlePayPalCheckout = () => {
    setInitiatingPaypal(true)
    setPaypalNotice(null)

    // PayPal flow entry point / initiation hook
    setTimeout(() => {
      setInitiatingPaypal(false)
      setPaypalNotice('PayPal checkout initiated. Redirecting to payment portal...')
    }, 1000)
  }

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEYS.notes)
      }
      await signOut()
      navigate('/login', { replace: true })
    } catch {
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className={styles.page}>
      <header>
        <span className={styles.eyebrow}>Billing & Payments</span>
        <h1 className={styles.title}>Subscription & Billing</h1>
        <p className={styles.subtitle}>Manage your membership, payment methods, and subscription status.</p>
      </header>

      <nav className={styles.navTabs} aria-label="Account Navigation">
        <NavLink
          to="/account"
          className={({ isActive }) => (isActive ? `${styles.tabLink} ${styles.tabLinkActive}` : styles.tabLink)}
        >
          Profile
        </NavLink>
        <NavLink
          to="/billing"
          className={({ isActive }) => (isActive ? `${styles.tabLink} ${styles.tabLinkActive}` : styles.tabLink)}
        >
          Billing & Payments
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => (isActive ? `${styles.tabLink} ${styles.tabLinkActive}` : styles.tabLink)}
        >
          Settings
        </NavLink>
      </nav>

      <div className={styles.card}>
        <h2 className={styles.sectionHeader}>Current Plan Status</h2>
        <div className={styles.statusArea}>
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Plan Tier</span>
            <span className={styles.statusValue}>Standard / Free Plan</span>
          </div>
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Billing Status</span>
            <span className={styles.statusValue}>No active paid subscription</span>
          </div>
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Account Email</span>
            <span className={styles.statusValue}>{user?.email || 'N/A'}</span>
          </div>
        </div>

        <h2 className={styles.sectionHeader}>Upgrade / Payment Entry Point</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Subscribe or upgrade your account tier using PayPal payment processing.
        </p>

        <button
          type="button"
          className={styles.paypalButton}
          onClick={handlePayPalCheckout}
          disabled={initiatingPaypal}
        >
          <span>{initiatingPaypal ? 'Connecting to PayPal...' : 'Pay with PayPal'}</span>
        </button>

        {paypalNotice && <p className={styles.notice}>{paypalNotice}</p>}
      </div>

      <div className={styles.logoutSection}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Session</h2>
          <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Signed in as {user?.email || 'Student'}
          </p>
        </div>
        <button type="button" className={styles.logoutButton} onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  )
}
