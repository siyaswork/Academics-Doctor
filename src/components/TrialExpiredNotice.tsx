import { Link } from 'react-router-dom'

export function TrialExpiredNotice() {
  return (
    <div style={{ padding: 24, textAlign: 'center', maxWidth: 480, margin: '40px auto' }}>
      <h1 style={{ marginBottom: 8 }}>Your free trial has ended</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>
        Subscribe for $4.99/month to keep full access to subjects and topics.
      </p>
      <Link to="/billing">
        <button
          type="button"
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: 8,
            border: 'none',
            background: 'var(--color-primary, #1c2b39)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Go to Billing
        </button>
      </Link>
    </div>
  )
}
