import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../../components/Container'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { supabase } from '../../lib/supabase'

export default function Subjects() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSubjects() {
      const { data, error } = await supabase
        .from('content_subjects')
        .select('*')
        .eq('is_published', true)
        .order('display_order')

      if (error) console.error(error)
      else setSubjects(data ?? [])
      setLoading(false)
    }
    fetchSubjects()
  }, [])

  if (loading) {
    return (
      <Container>
        <p>Loading subjects...</p>
      </Container>
    )
  }

  return (
    <Container>
      <div className="page-header">
        <PageHeader
          title="Subjects"
          subtitle="Explore our subject library — structured lessons, worked examples, and clear explanations to support focused learning."
        />
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
          <Link to="/signup">
            <Button variant="primary">Start learning — free</Button>
          </Link>
          <Link to="/how-it-works">
            <Button variant="secondary">How it works</Button>
          </Link>
        </div>
      </div>

      <section style={{ marginTop: '1.5rem' }}>
        <h2 className="section-title">Subject catalogue</h2>
        <p className="section-subtitle">Core subjects organised into clear categories so you can find a topic and start practicing quickly.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {subjects.map((s) => (
            <Card key={s.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{s.name}</h3>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{s.description}</p>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <Link to={`/subjects/${s.slug}`}>
                  <Button variant="outline">Explore subject</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2 className="section-title">How content is organised</h2>
        <p className="section-subtitle">Subjects are divided into categories and topics. Each topic provides concise explanations, examples, and practice problems so you can learn progressively.</p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2 className="section-title">Learning levels</h2>
        <p className="section-subtitle">Academics Doctor supports learners from school-level foundations through advanced university-introductory material where appropriate. Content clearly indicates the typical level so you can choose the right starting point.</p>
      </section>

      <section style={{ marginTop: '2.5rem', textAlign: 'center' }}>
        <Link to="/signup">
          <Button variant="primary">Start learning — it's free</Button>
        </Link>
      </section>
    </Container>
  )
}
