import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Container from '../../components/Container'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { supabase } from '../../lib/supabase'

export default function SubjectPage() {
  const { subject: slug } = useParams()
  const [subject, setSubject] = useState<any>(null)
  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchSubject() {
      setLoading(true)

      const { data: subjectData, error: subjectError } = await supabase
        .from('content_subjects')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

      if (subjectError || !subjectData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setSubject(subjectData)

      const { data: topicsData, error: topicsError } = await supabase
        .from('content_topics')
        .select('*')
        .eq('subject_id', subjectData.id)
        .eq('is_published', true)

      if (topicsError) console.error(topicsError)
      else setTopics(topicsData ?? [])

      setLoading(false)
    }

    if (slug) fetchSubject()
  }, [slug])

  if (loading) {
    return (
      <Container>
        <p>Loading subject...</p>
      </Container>
    )
  }

  if (notFound || !subject) {
    return (
      <Container>
        <PageHeader title="Subject not found" subtitle="We couldn't find that subject." />
        <Link to="/subjects">
          <Button variant="secondary">Back to subjects</Button>
        </Link>
      </Container>
    )
  }

  return (
    <Container>
      <div className="page-header">
        <PageHeader title={subject.name} subtitle={subject.description} />
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
          <Link to="/signup">
            <Button variant="primary">Start learning — free</Button>
          </Link>
          <Link to="/subjects">
            <Button variant="secondary">All subjects</Button>
          </Link>
        </div>
      </div>

      <section style={{ marginTop: '1.5rem' }}>
        <h2 className="section-title">Topics</h2>
        <p className="section-subtitle">Topics covered under {subject.name}.</p>

        {topics.length === 0 ? (
          <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
            No topics published yet — check back soon.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {topics.map((t) => (
              <Card key={t.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{t.topic}</h3>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{t.summary}</p>
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <Link to={`/learn/${subject.slug}/${t.slug}`}>
                    <Button variant="outline">View topic</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </Container>
  )
          }        <div>
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
