import React from 'react'
import { Link } from 'react-router-dom'
import { useNotes } from '../contexts/NotesContext'
import { useFormulas } from '../contexts/FormulaContext'
import { useCalculator } from '../contexts/CalculatorContext'
import { useAuth } from '../contexts/AuthContext'
import styles from './Dashboard.module.css'
import subjects from '../data/subjects'
import EmptyState from '../components/EmptyState'

export const Dashboard: React.FC = () => {
  const { notes } = useNotes()
  const { formulas } = useFormulas()
  const { history } = useCalculator()
  const { user } = useAuth()

  const recentNotes = [...notes].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 4)

  const displayName = user?.displayName ?? user?.email ?? null

  return (
    <section className={styles.page} aria-labelledby="dashboard-title">
      <header className={styles.header}>
        <p className={styles.eyebrow} aria-hidden="true">Welcome back</p>
        <h1 id="dashboard-title" className={styles.title}>
          {displayName ? `Hi ${displayName}` : 'Welcome back'}
        </h1>
        <p className={styles.subtitle}>Write, draw, calculate, and organise — your workspace is here.</p>
      </header>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{notes.length}</span>
          <span className={styles.statLabel}>Notes</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{formulas.length}</span>
          <span className={styles.statLabel}>Saved formulas</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{history.length}</span>
          <span className={styles.statLabel}>Calculations</span>
        </div>
      </div>

      <section style={{ marginBottom: '1.5rem' }}>
        <h2 className={styles.sectionTitle}>Continue where you left off</h2>
        {recentNotes.length === 0 ? (
          <EmptyState title="No recent work" description="You have no recent notes or activity — start with a new note or open a subject to begin." />
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {recentNotes.map((note) => (
              <Link key={note.id} to={`/notes/${note.id}`} className={styles.recentItem}>
                <span>{note.title || 'Untitled note'}</span>
                <span className={styles.recentMeta}>{note.subject}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h2 className={styles.sectionTitle}>Quick access to subjects</h2>
        <div className={styles.grid}>
          {subjects
            .filter((s) =>
              ['mathematics', 'additional-mathematics', 'physics', 'chemistry', 'design-technology'].includes(s.slug),
            )
            .map((s) => (
              <Link key={s.slug} to={`/dashboard/subjects/${s.slug}`} className={styles.featureCard}>
                <span className={styles.featureIcon} aria-hidden="true">📚</span>
                <h2>{s.name}</h2>
                <p>{s.shortDescription}</p>
              </Link>
            ))}
        </div>
      </section>

      <div className={styles.grid}>
        <Link to="/workspace" className={styles.featureCard}>
          <span className={styles.featureIcon} aria-hidden="true">🧠</span>
          <h2>Study Workspace</h2>
          <p>Write, draw, and calculate side-by-side in one focused session.</p>
        </Link>
        <Link to="/notes" className={styles.featureCard}>
          <span className={styles.featureIcon} aria-hidden="true">🗒️</span>
          <h2>My Notes</h2>
          <p>Browse, search, and edit your notebook.</p>
        </Link>
        <Link to="/my-work" className={styles.featureCard}>
          <span className={styles.featureIcon} aria-hidden="true">📋</span>
          <h2>My Work</h2>
          <p>A unified view of every note, formula, and drawing.</p>
        </Link>
      </div>
    </section>
  )
}

export default Dashboard