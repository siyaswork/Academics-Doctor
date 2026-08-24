import React from 'react'
import { ThemeToggle } from '../components/ThemeToggle'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { Badge } from '../components/Badge'
import styles from './FoundationDemo.module.css'

export const FoundationDemo: React.FC = () => {
  const [inputValue, setInputValue] = React.useState('')
  const [inputError, setInputError] = React.useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setInputError('')
  }

  const handleValidate = () => {
    if (!inputValue.trim()) {
      setInputError('This field cannot be empty')
    }
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.brandSection}>
            <div className={styles.logo}>🌟</div>
            <div>
              <h1 className={styles.title}>Academics Doctor</h1>
              <p className={styles.subtitle}>Design Foundation & Component Library</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container">
        {/* Typography Section */}
        <section className={styles.section}>
          <h2>Typography Hierarchy</h2>
          <div className={styles.grid}>
            <Card>
              <h1>Display Heading (H1)</h1>
              <p className="text-secondary">var(--font-size-4xl) - Bold and prominent</p>
            </Card>
            <Card>
              <h2>Page Heading (H2)</h2>
              <p className="text-secondary">var(--font-size-3xl) - Section headers</p>
            </Card>
            <Card>
              <h3>Section Heading (H3)</h3>
              <p className="text-secondary">var(--font-size-2xl) - Subsections</p>
            </Card>
            <Card>
              <h4>Subheading (H4)</h4>
              <p className="text-secondary">var(--font-size-xl) - Small headers</p>
            </Card>
            <Card>
              <p>Body Text (default)</p>
              <p className="text-secondary">var(--font-size-base) - Main content</p>
            </Card>
            <Card>
              <p className="text-secondary">Secondary Text</p>
              <p className="text-tertiary">var(--color-text-secondary) - Supporting text</p>
            </Card>
            <Card>
              <p className="text-muted">Muted Text</p>
              <p className="text-tertiary">var(--color-text-muted) - Metadata</p>
            </Card>
            <Card>
              <p className="text-sm">Small Text (Caption)</p>
              <p className="text-tertiary">var(--font-size-sm) - Labels, hints</p>
            </Card>
          </div>
        </section>

        {/* Buttons Section */}
        <section className={styles.section}>
          <h2>Button Variants & Sizes</h2>
          <div className={styles.subsection}>
            <h3>Variants</h3>
            <div className={styles.flex}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
          <div className={styles.subsection}>
            <h3>Sizes</h3>
            <div className={styles.flex}>
              <Button size="sm" variant="primary">Small</Button>
              <Button size="md" variant="primary">Medium</Button>
              <Button size="lg" variant="primary">Large</Button>
            </div>
          </div>
          <div className={styles.subsection}>
            <h3>States</h3>
            <div className={styles.flex}>
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="outline" disabled>Disabled</Button>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className={styles.section}>
          <h2>Card Surfaces</h2>
          <div className={styles.grid}>
            <Card>
              <h3>Default Card</h3>
              <p className="text-secondary">Surface with subtle shadow</p>
              <Button variant="outline" size="sm" className={styles.mt}>Learn more</Button>
            </Card>
            <Card elevated>
              <h3>Elevated Card</h3>
              <p className="text-secondary">Elevated surface with enhanced shadow</p>
              <Button variant="primary" size="sm" className={styles.mt}>Explore</Button>
            </Card>
            <Card>
              <h3>Card with Content</h3>
              <div className={styles.cardContent}>
                <p><strong>Feature:</strong> Clean and minimal design</p>
                <p><strong>Theme:</strong> Light & Dark mode</p>
                <p><strong>Responsive:</strong> Mobile-first</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Forms Section */}
        <section className={styles.section}>
          <h2>Form Elements</h2>
          <Card>
            <div className={styles.formLayout}>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={inputValue}
                onChange={handleInputChange}
                error={inputError}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
              />
              <Input
                label="Subject (with error state)"
                placeholder="Try submitting empty"
                error={inputError}
              />
              <Button variant="primary" onClick={handleValidate}>
                Validate Form
              </Button>
            </div>
          </Card>
        </section>

        {/* Badges Section */}
        <section className={styles.section}>
          <h2>Badges & Pills</h2>
          <Card>
            <div className={styles.badgeGroup}>
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
            </div>
          </Card>
        </section>

        {/* Colors Section */}
        <section className={styles.section}>
          <h2>Color Palette</h2>
          <div className={styles.colorGrid}>
            <div className={styles.colorBlock}>
              <div className={styles.colorSwatch} style={{ backgroundColor: '#5e4fc0' }}></div>
              <p className="text-sm"><strong>Primary</strong></p>
              <p className="text-muted text-sm">#5e4fc0</p>
            </div>
            <div className={styles.colorBlock}>
              <div className={styles.colorSwatch} style={{ backgroundColor: '#00a8e8' }}></div>
              <p className="text-sm"><strong>Secondary</strong></p>
              <p className="text-muted text-sm">#00a8e8</p>
            </div>
            <div className={styles.colorBlock}>
              <div className={styles.colorSwatch} style={{ backgroundColor: '#06d6a0' }}></div>
              <p className="text-sm"><strong>Success</strong></p>
              <p className="text-muted text-sm">#06d6a0</p>
            </div>
            <div className={styles.colorBlock}>
              <div className={styles.colorSwatch} style={{ backgroundColor: '#f4d35e' }}></div>
              <p className="text-sm"><strong>Warning</strong></p>
              <p className="text-muted text-sm">#f4d35e</p>
            </div>
            <div className={styles.colorBlock}>
              <div className={styles.colorSwatch} style={{ backgroundColor: '#ef476f' }}></div>
              <p className="text-sm"><strong>Error</strong></p>
              <p className="text-muted text-sm">#ef476f</p>
            </div>
          </div>
        </section>

        {/* Responsive Section */}
        <section className={styles.section}>
          <h2>Responsive Design</h2>
          <Card>
            <p><strong>📱 Mobile:</strong> Single-column layout, large touch targets, compact spacing</p>
            <p className={styles.mt}><strong>📱 Tablet:</strong> Two-column layouts, portrait & landscape support</p>
            <p className={styles.mt}><strong>🖥️ Desktop:</strong> Multi-column layouts, expanded navigation, efficient use of space</p>
            <p className={`${styles.mt} text-secondary`}>Resize your browser to see the responsive behavior in action.</p>
          </Card>
        </section>

        {/* Accessibility Section */}
        <section className={styles.section}>
          <h2>Accessibility Features</h2>
          <div className={styles.grid}>
            <Card>
              <h3>✓ Semantic HTML</h3>
              <p className="text-secondary">Proper use of heading levels, buttons, and form elements</p>
            </Card>
            <Card>
              <h3>✓ Keyboard Navigation</h3>
              <p className="text-secondary">Full keyboard support with visible focus indicators</p>
            </Card>
            <Card>
              <h3>✓ Color Contrast</h3>
              <p className="text-secondary">WCAG AA compliant contrast ratios throughout</p>
            </Card>
            <Card>
              <h3>✓ Touch Friendly</h3>
              <p className="text-secondary">Minimum 44x44px touch targets for all interactive elements</p>
            </Card>
            <Card>
              <h3>✓ Motion Respect</h3>
              <p className="text-secondary">Respects prefers-reduced-motion user preference</p>
            </Card>
            <Card>
              <h3>✓ ARIA Support</h3>
              <p className="text-secondary">Proper ARIA labels where semantics alone aren't sufficient</p>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p className="text-secondary">Academics Doctor Foundation • Step 1: Design System</p>
          <p className="text-muted text-sm">This is a demonstration of the global design system and component library. Future features will build on this foundation.</p>
        </footer>
      </main>
    </div>
  )
}
