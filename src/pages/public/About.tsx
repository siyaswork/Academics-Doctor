   import { useEffect } from 'react'
import Container from '../../components/Container'
import PageHeader from '../../components/PageHeader'
import Button from '../../components/Button'
import { Link } from 'react-router-dom'

export default function About() {
  useEffect(() => {
    document.title = 'About — Academics Doctor'
  }, [])

  return (
    <Container>
      <PageHeader title="About Academics Doctor" subtitle="Making studying clearer, calmer and more effective." />

      <section style={{ marginTop: 12 }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Academics Doctor is focused on providing structured lessons, clear explanations and worked examples across core academic subjects.
          The platform exists because many learners struggle with scattered materials, unclear guidance and no clear sequence for learning.
        </p>

        <h3 style={{ marginTop: 16 }}>Our philosophy</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          We prioritise clarity, structure and a calm learning environment. Lessons are designed to be concise and practical — helping learners understand concepts and apply them through examples.
        </p>

        <div style={{ marginTop: 20 }}>
          <Link to="/subjects"><Button variant="secondary">Explore subjects</Button></Link>
          <Link to="/signup" style={{ marginLeft: 8 }}><Button variant="primary">Start learning</Button></Link>
        </div>
      </section>
    </Container>
  )
}
