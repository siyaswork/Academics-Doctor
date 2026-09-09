import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase/client'
import { STORAGE_KEYS } from '../utils/storage'
import styles from './BillingPage.module.css'

const MONTHLY_PRICE = '$4.99'

interface SubscriptionRow {
  status: 'trialing' | 'active' | 'canceled'
  trial_ends_at: string
  paid_at: string | null
  next_payment_at: string | null
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
}

export default function BillingPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    async function loadSubscription() {
      if (!user) {
        setLoading(false)
        return
      }
      setLoading(true)

      const { data: existing } = await supabase
        .from('subscriptions')
        .select('status, trial_ends_at, paid_at, next_payment_at')
        .eq('user_id', user.id)
        .maybeSingle()

      if (existing) {
        setSubscription(existing as SubscriptionRow)
        setLoading(false)
        return
      }

      // No subscription row yet — start the free trial now.
      const trialEndsAt = new Date()
      trialEndsAt.setMonth(trialEndsAt.getMonth() + 1)

      const { data: created } = await supabase
        .from('subscriptions')
        .insert({ user_id: user.id, status: 'trialing', trial_ends_at: trialEndsAt.toISOString() })
        .select('status, trial_ends_at, paid_at, next_payment_at')
        .single()

      setSubscription((created as SubscriptionRow) ?? null)
      setLoading(false)
    }

    void loadSubscription()
  }, [user])

  const handleCheckout = async () => {
    if (!user) return
    setCheckingOut(true)

    // Payment provider integration entry point — this records the payment
    // outcome in our own subscriptions table. Wiring this button to an actual
    // PayPal/Stripe checkout flow is a separate task.
    const paidAt = new Date()
    const nextPaymentAt = new Date(paidAt)
    nextPaymentAt.setMonth(nextPaymentAt.getMonth() + 1)

    const { data } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        paid_at: paidAt.toISOString(),
        next_payment_at: nextPaymentAt.toISOString(),
        updated_at: paidAt.toISOString(),
      })
      .eq('user_id', user.id)
      .select('status, trial_ends_at, paid_at, next_payment_at')
      .single()

    if (data) setSubscription(data as SubscriptionRow)
    setCheckingOut(false)
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

  const isTrialing = subscription?.status === 'trialing'
  const isActive = subscription?.status === 'active'
  const trialExpired = isTrialing && subscription && new Date(subscription.trial_ends_at) < new Date()

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
      </nav>

      <div className={styles.card}>
        <h2 className={styles.sectionHeader}>Current Plan Status</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.statusArea}>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Plan</span>
              <span className={styles.statusValue}>
                {isActive
                  ? `Active — ${MONTHLY_PRICE}/month`
                  : trialExpired
                    ? 'Trial expired'
                    : `Free trial`}
              </span>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Billing Status</span>
              <span className={styles.statusValue}>
                {isActive && subscription?.paid_at
                  ? `Paid on ${formatDate(subscription.paid_at)} — next payment ${subscription.next_payment_at ? formatDate(subscription.next_payment_at) : 'N/A'}`
                  : trialExpired
                    ? 'Your free trial has ended. Subscribe to keep full access.'
                    : subscription
                      ? `Free trial until ${formatDate(subscription.trial_ends_at)}, then ${MONTHLY_PRICE}/month`
                      : 'N/A'}
              </span>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Account Email</span>
              <span className={styles.statusValue}>{user?.email || 'N/A'}</span>
            </div>
          </div>
        )}

        {!isActive && (
          <>
            <h2 className={styles.sectionHeader}>Checkout</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Subscribe for {MONTHLY_PRICE}/month to keep full access after your free trial.
            </p>

            <button
              type="button"
              className={styles.paypalButton}
              onClick={handleCheckout}
              disabled={checkingOut}
            >
              <span>{checkingOut ? 'Processing...' : `Proceed to checkout — ${MONTHLY_PRICE}/month`}</span>
            </button>
          </>
        )}
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
