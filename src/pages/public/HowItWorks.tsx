   import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Container from '../../components/Container'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Button from '../../components/Button'

export default function HowItWorks() {
  useEffect(() => {
    document.title = 'How It Works — Academics Doctor'
  }, [])

  return (
    <Container>
      <PageHeader title="How Academics Doctor works" subtitle="A focused, practical path to better understanding." />

      <section style={{ marginTop: 12 }}>
        <div style={{ display: 'grid', gap: 12 }}>
          <Card>
            <h3 className="section-title">1. Choose what to study</h3>
            <p className="section-subtitle">Start at a subject page and navigate to the category and topic that match what you need to learn.</p>
          </Card>

          <Card>
            <h3 className="section-title">2. Progress topic by topic</h3>
            <p className="section-subtitle">Each topic has a concise explanation and worked examples so you can learn with clarity.</p>
          </Card>

          <Card>
            <h3 className="section-title">3. Save notes and continue</h3>
            <p className="section-subtitle">Where supported, save your notes and return to your work to continue learning.</p>
          </Card>

          <Card>
            <h3 className="section-title">4. Track and return</h3>
            <p className="section-subtitle">Track what you have completed and pick up where you left off in your study sessions.</p>
          </Card>
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3 className="section-title">Public site vs student experience</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          The public site is a presentation of the product, subject catalogue and subscription information. The student experience (after signup/login) includes the personalised workspace, saved notes and other student-only features.
        </p>
      </section>

      <section style={{ marginTop: 20 }}>
        <Link to="/signup"><Button variant="primary">Start learning</Button></Link>
      </section>
    </Container>
  )
}
