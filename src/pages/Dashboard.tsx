import React from 'react'
import { Link } from 'react-router-dom'
import { useNotes } from '../contexts/NotesContext'
import { useFormulas } from '../contexts/FormulaContext'
import { useCalculator } from '../contexts/CalculatorContext'
import styles from './Dashboard.module.css'

export const Dashboard: React.FC = () => {
  const { notes } = useNotes()
  const { formulas } = useFormulas()
  const { history } = useCalculator()

  const recentNotes = [...notes].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 4)

  return (
    <section className={styles.page} aria-labelledby="dashboard-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Welcome back</p>
        <h1 id="dashboard-title" className={styles.title}>
          Your study dashboard
        </h1>
        <p className={styles.subtitle}>Write, draw, calculate, and organize — all in one calm workspace.</p>
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

      <div className={styles.grid}>
        <Link to="/workspace" className={styles.featureCard}>
          <span className={styles.featureIcon} aria-hidden="true">
            🧠
          </span>
          <h2>Study Workspace</h2>
          <p>Write, draw, and calculate side-by-side in one focused session.</p>
        </Link>
        <Link to="/notes" className={styles.featureCard}>
          <span className={styles.featureIcon} aria-hidden="true">
            🗒️
          </span>
          <h2>My Notes</h2>
          <p>Browse, search, and edit your notebook.</p>
        </Link>
        <Link to="/research" className={styles.featureCard}>
          <span className={styles.featureIcon} aria-hidden="true">
            🔎
          </span>
          <h2>Research</h2>
          <p>Collect sources and quick findings for a topic.</p>
        </Link>
        <Link to="/my-work" className={styles.featureCard}>
          <span className={styles.featureIcon} aria-hidden="true">
            📋
          </span>
          <h2>My Work</h2>
          <p>A unified view of every note, formula, and drawing.</p>
        </Link>
      </div>

      <section className={styles.recent} aria-labelledby="recent-notes-title">
        <h2 id="recent-notes-title" className={styles.sectionTitle}>
          Recently edited
        </h2>
        {recentNotes.length === 0 ? (
          <p className={styles.empty}>No notes yet — create one to get started.</p>
        ) : (
          <ul className={styles.recentList}>
            {recentNotes.map((note) => (
              <li key={note.id}>
                <Link to={`/notes/${note.id}`} className={styles.recentItem}>
                  <span>{note.title}</span>
                  <span className={styles.recentMeta}>{note.subject}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}
