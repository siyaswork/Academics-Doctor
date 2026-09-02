   import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Container from '../../components/Container'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Button from '../../components/Button'

export default function Pricing() {
  useEffect(() => {
    document.title = 'Pricing — Academics Doctor'
  }, [])

  // Do NOT hard-code pricing here. The checkout flow displays the configured price.
  return (
    <Container>
      <PageHeader title="Simple pricing. Serious studying." subtitle="A single subscription gives full access to content and the student experience." />

      <section style={{ marginTop: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 12 }}>
          <div>
            <Card>
              <h3 className="section-title">What the subscription provides</h3>
              <ul style={{ color: 'var(--color-text-secondary)' }}>
                <li>Full access to subject content</li>
                <li>Save notes and access your workspace (student features)</li>
                <li>Responsive access across devices</li>
                <li>No advertising</li>
              </ul>
            </Card>

            <Card style={{ marginTop: 12 }}>
              <h3 className="section-title">Billing and cancellation</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Billing frequency and cancellation terms are handled by the checkout/billing integration. Please continue to the signup flow for the exact price and billing frequency.
              </p>
            </Card>

            <Card style={{ marginTop: 12 }}>
              <h3 className="section-title">Who it's for</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Learners seeking structured, focused study guidance across core academic subjects.
              </p>
            </Card>
          </div>

          <aside>
            <Card>
              <h4 style={{ marginTop: 0 }}>Subscription</h4>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Simple subscription pricing — continue to the signup/payment flow to view the current price and complete checkout.
              </p>

              <div style={{ marginTop: 12 }}>
                <Link to="/signup"><Button variant="primary">Sign up / View price</Button></Link>
              </div>
            </Card>
          </aside>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <h3 className="section-title">Billing FAQ</h3>
        <div style={{ color: 'var(--color-text-secondary)' }}>
          <strong>How do I see the price?</strong>
          <div>Price and billing frequency are shown in the signup/payment flow; this page links to that flow rather than duplicating the configured value.</div>
        </div>
      </section>
    </Container>
  )
}
