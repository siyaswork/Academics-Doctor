   import { useEffect } from 'react'
import Container from '../../components/Container'
import PageHeader from '../../components/PageHeader'

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy — Academics Doctor'
  }, [])

  return (
    <Container>
      <PageHeader title="Privacy Policy" subtitle="How we handle data" />
      <section style={{ marginTop: 12, maxWidth: 800 }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          This page describes the privacy approach. If a detailed privacy policy exists in the repository, include it here. Otherwise, keep this page as a readable policy summary and link to the full approved legal document when available.
        </p>

        <h3 style={{ marginTop: 12 }}>Information we collect</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>Account information and any content you save to your workspace. Authentication and storage are handled by the application's configured backend services.</p>
      </section>
    </Container>
  )
}
