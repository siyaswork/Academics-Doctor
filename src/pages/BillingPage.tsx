import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase/client'
import { STORAGE_KEYS } from '../utils/storage'
import styles from './BillingPage.module.css'

const MONTHLY_PRICE = '$4.99'
const PAYPAL_CLIENT_ID = 'BAAHshxgeFe2tdsq9gO2g4S8I7LTcYgN7lt0b7gKAwR-r1VEtIsp_UPo_kHLpv9GNL5Jgiii2CCD2USzBM'
const FUNCTIONS_BASE = 'https://mclrsjpykirklszrfnau.supabase.co/functions/v1'

interface SubscriptionRow {
  status: 'trialing' | 'active' | 'canceled'
  trial_ends_at: string
  paid_at: string | null
  next_payment_at: string | null
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
}

declare global {
  interface Window {
    paypal?: any
  }
}

export default function BillingPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [paypalError, setPaypalError] = useState<string | null>(null)
  const [sdkReady, setSdkReady] = useState(false)
  const buttonContainerRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (window.paypal) {
      setSdkReady(true)
      return
    }
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`
    script.async = true
    script.onload = () => setSdkReady(true)
    script.onerror = () => setPaypalError('Could not load PayPal. Please try again later.')
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const isActive = subscription?.status === 'active'

  useEffect(() => {
    if (!sdkReady || !window.paypal || isActive || !buttonContainerRef.current || !user) return

    buttonContainerRef.current.innerHTML = ''

    window.paypal
      .Buttons({
        createOrder: async () => {
          setPaypalError(null)
          const { data: sessionData } = await supabase.auth.getSession()
          const accessToken = sessionData.session?.access_token
          const res = await fetch(`${FUNCTIONS_BASE}/paypal-create-order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
              apikey: 'sb_publishable_35UxzFPbR6WWZnUr9wWtyQ_983Zka7r',
            },
          })
          const data = await res.json()
          if (!res.ok || !data.id) {
            setPaypalError(data.error || 'Could not start checkout.')
            throw new Error(data.error || 'Could not start checkout')
          }
          return data.id
        },
        onApprove: async (data: { orderID: string }) => {
          const { data: sessionData } = await supabase.auth.getSession()
          const accessToken = sessionData.session?.access_token
          const res = await fetch(`${FUNCTIONS_BASE}/paypal-capture-order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
              apikey: 'sb_publishable_35UxzFPbR6WWZnUr9wWtyQ_983Zka7r',
            },
            body: JSON.stringify({ orderId: data.orderID }),
          })
          const result = await res.json()
          if (!res.ok || !result.ok) {
            setPaypalError(result.error || 'Payment could not be confirmed.')
            return
          }
          setSubscription(result.subscription as SubscriptionRow)
        },
        onError: () => {
          setPaypalError('Something went wrong with PayPal. Please try again.')
        },
      })
      .render(buttonContainerRef.current)
  }, [sdkReady, isActive, user])

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
  const trialExpired = isTrialing && subscription && new Date(subscription.trial_ends_at) < new Date()

  return (
    <div className={styles.page}>
      <header>
        <span className={styles.eyebrow}>Billing & Payments</span>
        <h1 className={styles.title}>Subscription & Billing</h1>
        <p className={styles.subtitle}>Manage your membership, payment methods, and subscription status.</p>
      </header>

      <nav className={styles.navTabs} aria-label="Account Navigation">
        <NavLink to="/account" className={({ isActive }) => (isActive ? `${styles.tabLink} ${styles.tabLinkActive}` : styles.tabLink)}>
          Profile
        </NavLink>
        <NavLink to="/billing" className={({ isActive }) => (isActive ? `${styles.tabLink} ${styles.tabLinkActive}` : styles.tabLink)}>
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
              Subscribe for {MONTHLY_PRICE}/month to keep full access after your free trial. This is running in PayPal Sandbox mode for testing — no real money is charged yet.
            </p>

            <div ref={buttonContainerRef} />
            {!sdkReady && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Loading PayPal...</p>}
            {paypalError && <p style={{ color: 'var(--color-danger, #b3261e)', fontSize: '0.85rem', marginTop: 8 }}>{paypalError}</p>}
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
