import React, { useEffect, useState } from 'react'
import Container from '../../components/Container'
import PageHeader from '../../components/PageHeader'
import Button from '../../components/Button'
import Card from '../../components/Card'
import { Link } from 'react-router-dom'

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact — Academics Doctor'
  }, [])

  // Repository inspection did not reveal a configured contact email or submission backend.
  // The page offers clear guidance without implying messages are delivered by the site.
  const [method, setMethod] = useState<'general' | 'account' | 'billing' | 'feedback'>('general')

  return (
    <Container>
      <PageHeader title="Contact" subtitle="Questions, feedback or corrections — how to get in touch." />

      <section style={{ marginTop: 12, maxWidth: 800 }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          If you need help or want to suggest improvements, here are the recommended ways to contact the team. This site does not currently provide an on-site message submission backend.
        </p>

        <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
          <Card>
            <label style={{ display: 'block', marginBottom: 8 }}>
              <div style={{ marginBottom: 6 }}>What is this about?</div>
              <select value={method} onChange={(e) => setMethod(e.target.value as any)} style={{ width: '100%' }}>
                <option value="general">General enquiries</option>
                <option value="account">Account help</option>
                <option value="billing">Billing questions</option>
                <option value="feedback">Feedback / content correction</option>
              </select>
            </label>

            <div style={{ marginTop: 8 }}>
              {method === 'general' && (
                <div>
                  <strong>General enquiries</strong>
                  <div style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>
                    For product questions and general information, view the About and Pricing pages, or open an issue on the project repository to report product feedback.
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <a href="https://github.com/siyaswork/Academics-Doctor/issues" target="_blank" rel="noreferrer">Open an issue on GitHub</a>
                  </div>
                </div>
              )}

              {method === 'account' && (
                <div>
                  <strong>Account support</strong>
                  <div style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>
                    For account-related help (sign in, password reset), use the in-app support pages and authentication flows. If you cannot sign in, use the Forgot Password flow from the login page.
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Link to="/forgot-password"><Button variant="outline">Forgot password</Button></Link>
                    <Link to="/login" style={{ marginLeft: 8 }}><Button variant="secondary">Sign in</Button></Link>
                  </div>
                </div>
              )}

              {method === 'billing' && (
                <div>
                  <strong>Billing questions</strong>
                  <div style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>
                    Billing and subscription management is handled through the checkout and billing integration. Please sign up or sign in and visit the Billing page in your account for subscription details.
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Link to="/signup"><Button variant="primary">Sign up</Button></Link>
                    <Link to="/login" style={{ marginLeft: 8 }}><Button variant="secondary">Log in</Button></Link>
                  </div>
                </div>
              )}

              {method === 'feedback' && (
                <div>
                  <strong>Feedback or content correction</strong>
                  <div style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>
                    We welcome corrections and product feedback. Please open an issue on the project repository describing the correction or suggestion and include any relevant links or screenshots.
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <a href="https://github.com/siyaswork/Academics-Doctor/issues/new" target="_blank" rel="noreferrer">Create feedback issue</a>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h4 style={{ marginTop: 0 }}>Privacy note</h4>
            <div style={{ color: 'var(--color-text-secondary)' }}>
              This page does not collect or transmit messages. If you provide personal information via GitHub issues, note that those contributions are public. Do not share sensitive personal data in public issue trackers.
            </div>
          </Card>
        </div>
      </section>
    </Container>
  )
}
