import React from 'react'
import { Link } from 'react-router-dom'
import { useNotes } from '../contexts/NotesContext'
import { useFormulas } from '../contexts/FormulaContext'
import { useCalculator } from '../contexts/CalculatorContext'
import styles from './MyWorkPage.module.css'

export const MyWorkPage: React.FC = () => {
  const { notes } = useNotes()
  const { formulas } = useFormulas()
  const { history, reuseResult } = useCalculator()

  const sortedNotes = [...notes].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

  return (
    <section className={styles.page} aria-labelledby="my-work-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Unified workspace</p>
        <h1 id="my-work-title" className={styles.title}>
          My Work
        </h1>
        <p className={styles.subtitle}>Every note, saved formula, and recent calculation in one place.</p>
      </header>

      <div className={styles.columns}>
        <section className={styles.column} aria-labelledby="work-notes-title">
          <h2 id="work-notes-title">Notes ({sortedNotes.length})</h2>
          <ul className={styles.list}>
            {sortedNotes.map((note) => (
              <li key={note.id}>
                <Link to={`/notes/${note.id}`} className={styles.item}>
                  <span>{note.title}</span>
                  <span className={styles.meta}>{note.subject}</span>
                </Link>
              </li>
            ))}
            {sortedNotes.length === 0 && <p className={styles.empty}>No notes yet.</p>}
          </ul>
        </section>

        <section className={styles.column} aria-labelledby="work-formulas-title">
          <h2 id="work-formulas-title">Formulas ({formulas.length})</h2>
          <ul className={styles.list}>
            {formulas.map((formula) => (
              <li key={formula.id} className={styles.item}>
                <span>{formula.name}</span>
                <span className={styles.meta}>{formula.subject}</span>
              </li>
            ))}
            {formulas.length === 0 && <p className={styles.empty}>No saved formulas yet.</p>}
          </ul>
        </section>

        <section className={styles.column} aria-labelledby="work-history-title">
          <h2 id="work-history-title">Recent calculations ({history.length})</h2>
          <ul className={styles.list}>
            {history.slice(0, 8).map((entry) => (
              <li key={entry.id}>
                <button type="button" className={styles.item} onClick={() => reuseResult(entry)}>
                  <span>{entry.expression}</span>
                  <span className={styles.meta}>= {entry.result}</span>
                </button>
              </li>
            ))}
            {history.length === 0 && <p className={styles.empty}>No calculations yet.</p>}
          </ul>
        </section>
      </div>
    </section>
  )
}
