import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Card from '../../components/Card'
import subjects from '../../data/subjects'

export default function Home() {
  useEffect(() => {
    document.title = 'Academics Doctor — Understand more. Study smarter.'
  }, [])

  const coreSubjects = subjects.filter((s) =>
    ['mathematics', 'additional-mathematics', 'physics', 'chemistry', 'design-technology'].includes(s.slug),
  )

  return (
    <Container>
      {/* HERO */}
      <section style={{ display: 'grid', gap: 16, marginTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 720 }}>
            <h1 style={{ margin: '0 0 8px 0', lineHeight: 1.05 }}>Understand more. Study smarter.</h1>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>
              Academics Doctor is a focused academic learning platform that helps students understand subjects in a structured, step-by-step way.
              Find concise explanations, worked examples and organised topic paths so you can study with purpose.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div>
                <Link to="/signup">
                  <Button variant="primary">Start studying</Button>
                </Link>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: 6, textAlign: 'center' }}>
                  1 month free trial, then $4.99/month
                </div>
              </div>
              <Link to="/subjects">
                <Button variant="secondary">Explore subjects</Button>
              </Link>
            </div>
          </div>
        </div>


      </section>

      {/* PROBLEM / SOLUTION */}
      <section style={{ marginTop: 28 }}>
        <h2 className="section-title">The problem</h2>
        <p className="section-subtitle">
          Many learners face scattered resources, unclear explanations and no clear path from basics to mastery. Time is wasted deciding what to study next.
        </p>

        <h3 style={{ marginTop: 12 }}>The Academics Doctor approach</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          We provide organised subject paths, concise explanations and worked examples so learning is structured, focused and efficient.
        </p>
      </section>

      {/* SUBJECTS */}
      <section style={{ marginTop: 28 }}>
        <h2 className="section-title">Core subjects</h2>
        <p className="section-subtitle">Five core areas to start from. Sign up to unlock the full subject pages, categories, and topics.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 12 }}>
          {coreSubjects.map((s) => (
            <Card key={s.slug} style={{ padding: 12 }}>
              <h3 style={{ margin: '0 0 8px 0' }}>{s.name}</h3>
              <div style={{ color: 'var(--color-text-secondary)' }}>{s.shortDescription}</div>
            </Card>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <Link to="/subjects">
            <Button variant="ghost">View all subjects</Button>
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS PREVIEW */}
      <section style={{ marginTop: 28 }}>
        <h2 className="section-title">How it works</h2>
        <p className="section-subtitle">A simple, focused path to learning.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 12 }}>
          <Card><strong>1. Choose a subject</strong><div style={{ color: 'var(--color-text-secondary)' }}>Pick from organised subject pages.</div></Card>
          <Card><strong>2. Find the topic</strong><div style={{ color: 'var(--color-text-secondary)' }}>Navigate category to topic to target the concept you need.</div></Card>
          <Card><strong>3. Learn with structure</strong><div style={{ color: 'var(--color-text-secondary)' }}>Concise explanations and worked examples.</div></Card>
          <Card><strong>4. Save & continue</strong><div style={{ color: 'var(--color-text-secondary)' }}>Save notes and return where supported.</div></Card>
        </div>

        <div style={{ marginTop: 12 }}>
          <Link to="/how-it-works"><Button variant="secondary">See full how it works</Button></Link>
        </div>
      </section>

      {/* PRODUCT EXPERIENCE & BENEFITS */}
      <section style={{ marginTop: 28 }}>
        <h2 className="section-title">What the product feels like</h2>
        <div style={{ color: 'var(--color-text-secondary)' }}>
          Structured learning, a calm focused environment, notes and saved work, progress tracking where supported, and no distracting advertisements.
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <Card style={{ padding: 12, minWidth: 160 }}><strong>Structured</strong><div style={{ color: 'var(--color-text-secondary)' }}>Clear learning paths</div></Card>
          <Card style={{ padding: 12, minWidth: 160 }}><strong>Focused</strong><div style={{ color: 'var(--color-text-secondary)' }}>No unnecessary clutter</div></Card>
          <Card style={{ padding: 12, minWidth: 160 }}><strong>Clear</strong><div style={{ color: 'var(--color-text-secondary)' }}>Concise explanations</div></Card>
          <Card style={{ padding: 12, minWidth: 160 }}><strong>Accessible</strong><div style={{ color: 'var(--color-text-secondary)' }}>Responsive across devices</div></Card>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section style={{ marginTop: 28 }}>
        <h2 className="section-title">Pricing</h2>
        <p className="section-subtitle">1 month free trial, then $4.99/month for full access. See the Pricing page for details.</p>
        <div style={{ marginTop: 12 }}>
          <Link to="/pricing"><Button variant="primary">View pricing</Button></Link>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ marginTop: 28 }}>
        <h2 className="section-title">FAQ</h2>
        <div style={{ marginTop: 8 }}>
          <strong>What is Academics Doctor?</strong>
          <div style={{ color: 'var(--color-text-secondary)', marginBottom: 8 }}>A focused academic learning platform with organised subject paths and concise lessons.</div>

          <strong>Which subjects are available?</strong>
          <div style={{ color: 'var(--color-text-secondary)', marginBottom: 8 }}>Mathematics, Additional Mathematics, Physics, Chemistry and Design & Technology — see Subjects for full details.</div>

          <strong>Who is it for?</strong>
          <div style={{ color: 'var(--color-text-secondary)', marginBottom: 8 }}>Students seeking structured, focused study support across core subjects.</div>

          <strong>Can I use it on my phone?</strong>
          <div style={{ color: 'var(--color-text-secondary)', marginBottom: 8 }}>Yes — the platform is responsive and works across devices.</div>

          <strong>Is there advertising?</strong>
          <div style={{ color: 'var(--color-text-secondary)', marginBottom: 8 }}>No — the public messaging emphasises a no-ads experience where applicable.</div>

          <strong>How does the subscription work?</strong>
          <div style={{ color: 'var(--color-text-secondary)' }}>Get a 1 month free trial, then $4.99/month for full access. See the Pricing page for details.</div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ marginTop: 28, textAlign: 'center' }}>
        <h3>Ready to study smarter?</h3>
        <Link to="/signup"><Button variant="primary">Start studying</Button></Link>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: 6 }}>
          1 month free trial, then $4.99/month
        </div>
      </section>
    </Container>
  )
}
