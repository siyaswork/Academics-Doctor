import React, { useEffect } from 'react'
import Container from '../../components/Container'
import PageHeader from '../../components/PageHeader'

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms — Academics Doctor'
  }, [])

  return (
    <Container>
      <PageHeader title="Terms of Service" subtitle="Important terms for using Academics Doctor" />

      <section style={{ marginTop: 12, maxWidth: 800 }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          This page contains the service terms. If a full terms document is available in this repository, it should be placed here.
          At present this page serves as the public terms page with clear sections and readable layout.
        </p>

        <h3 style={{ marginTop: 12 }}>1. Acceptance</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          By using Academics Doctor you accept these terms. For the full legal text please consult the authorised terms document.
        </p>

        <h3 style={{ marginTop: 12 }}>2. Services</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Academics Doctor provides organised subject content and a student workspace for registered users.
        </p>
      </section>
    </Container>
  )
}
