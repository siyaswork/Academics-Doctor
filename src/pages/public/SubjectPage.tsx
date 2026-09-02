import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Container from '../../components/Container'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Button from '../../components/Button'
import subjectsData from '../../data/subjects'
import EmptyState from '../../components/EmptyState'

export default function SubjectPage() {
  const { subject } = useParams()
  const subj = subjectsData.find((s) => s.slug === subject)

  useEffect(() => {
    if (subj) {
      document.title = `${subj.name} — Academics Doctor`
    }
  }, [subj])

  if (!subj) {
    return (
      <Container>
        <EmptyState title="Subject not found" description="The subject you requested does not exist." />
      </Container>
    )
  }

  return (
    <Container>
      <nav style={{ marginBottom: '1rem' }} aria-label="Breadcrumb">
        <Link to="/subjects" className="ad-link">Subjects</Link> / <span style={{ color: 'var(--color-text-secondary)' }}>{subj.name}</span>
      </nav>

      <PageHeader title={subj.name} subtitle={subj.shortDescription} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1rem', marginTop: '1rem' }}>
        <div>
          <Card>
            <h3 className="section-title">What you'll learn</h3>
            <p className="section-subtitle">Key subject areas and categories.</p>
            <ul>
              {subj.categories.map((c) => (
                <li key={c} style={{ marginBottom: '0.4rem' }}>{c}</li>
              ))}
            </ul>
          </Card>

          <Card style={{ marginTop: '1rem' }}>
            <h3 className="section-title">Example topic previews</h3>
            <p className="section-subtitle">Representative sample topics from this subject.</p>
            <ul>
              {subj.exampleTopics.map((t) => (
                <li key={t} style={{ marginBottom: '0.4rem' }}>{t}</li>
              ))}
            </ul>
          </Card>

          <Card style={{ marginTop: '1rem' }}>
            <h3 className="section-title">Why study {subj.name} here</h3>
            <p>Structured explanations, focused study sessions, worked examples, and the ability to save your notes and work for later review.</p>
          </Card>
        </div>

        <aside>
          <Card>
            <h4 style={{ marginTop: 0 }}>Get started</h4>
            <p style={{ color: 'var(--color-text-secondary)' }}>{subj.shortDescription}</p>
            <div style={{ marginTop: '1rem' }}>
              <Link to="/signup">
                <Button variant="primary">Start learning — free</Button>
              </Link>
            </div>
          </Card>

          <Card style={{ marginTop: '1rem' }}>
            <h4 style={{ marginTop: 0 }}>Study approach</h4>
            <p style={{ color: 'var(--color-text-secondary)' }}>Concepts, worked examples and practice — bite-sized lessons to build confidence and understanding.</p>
          </Card>
        </aside>
      </div>
    </Container>
  )
}
