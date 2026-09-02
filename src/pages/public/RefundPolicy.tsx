   import { useEffect } from 'react'
import Container from '../../components/Container'
import PageHeader from '../../components/PageHeader'

export default function RefundPolicy() {
  useEffect(() => {
    document.title = 'Refund Policy — Academics Doctor'
  }, [])

  return (
    <Container>
      <PageHeader title="Refund Policy" subtitle="Subscription and refund information" />
      <section style={{ marginTop: 12, maxWidth: 800 }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Refunds and cancellations are handled by the billing provider. Where the repository includes explicit refund terms, surface them here. This page provides a readable, structured policy placeholder until the approved legal language is added.
        </p>
      </section>
    </Container>
  )
}
