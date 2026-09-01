import React, { useMemo, useState } from 'react'
import { useFormulas, type FormulaInput } from '../contexts/FormulaContext'
import { useCalculator } from '../contexts/CalculatorContext'
import type { Formula } from '../types/formulas'
import { FormulaCard } from './FormulaCard'
import styles from './FormulaLibrary.module.css'

const emptyForm: FormulaInput = { name: '', formula: '', subject: 'math', description: '' }

export const FormulaLibrary: React.FC = () => {
  const { formulas, createFormula, updateFormula, deleteFormula } = useFormulas()
  const { openCalculator, insertBlockIntoNote, hasInsertTarget } = useCalculator()
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormulaInput>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const filtered = useMemo(
    () =>
      formulas.filter((formula) => {
        const haystack = `${formula.name} ${formula.formula} ${formula.subject} ${formula.description ?? ''}`.toLowerCase()
        return haystack.includes(query.toLowerCase())
      }),
    [formulas, query],
  )

  const startCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const startEdit = (formula: Formula) => {
    setEditingId(formula.id)
    setForm({ name: formula.name, formula: formula.formula, subject: formula.subject, description: formula.description ?? '' })
    setShowForm(true)
  }

  const flash = (text: string) => {
    setMessage(text)
    window.setTimeout(() => setMessage((current) => (current === text ? null : current)), 1800)
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.name.trim() || !form.formula.trim()) return
    if (editingId) updateFormula(editingId, form)
    else createFormula(form)
    setShowForm(false)
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleInsert = (formula: Formula) => {
    const inserted = insertBlockIntoNote({
      type: 'formula',
      content: `${formula.name}: ${formula.formula}`,
      formulaId: formula.id,
      formulaName: formula.name,
      formulaText: formula.formula,
      formulaSubject: formula.subject,
    })
    flash(inserted ? 'Inserted into note' : 'Open a note first to insert')
  }

  const handleCalculate = (formula: Formula) => {
    openCalculator(formula.formula)
  }

  return (
    <section className={styles.library} aria-label="Formula library">
      <header className={styles.header}>
        <h3 className={styles.title}>Formula Library</h3>
        <button type="button" className={styles.newButton} onClick={startCreate}>
          ＋ New
        </button>
      </header>

      <label className={styles.search}>
        <span className={styles.srOnly}>Search formulas</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search formulas…" />
      </label>

      {showForm && (
        <form className={styles.form} onSubmit={submit} aria-label={editingId ? 'Edit formula' : 'Create formula'}>
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>
          <label>
            Formula
            <input
              required
              value={form.formula}
              onChange={(event) => setForm((prev) => ({ ...prev, formula: event.target.value }))}
              placeholder="e.g. E = mc²"
            />
          </label>
          <label>
            Subject
            <select
              value={form.subject}
              onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
            >
              <option value="math">Math</option>
              <option value="science">Science</option>
              <option value="history">History</option>
              <option value="literature">Literature</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Description (optional)
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              rows={2}
            />
          </label>
          <div className={styles.formActions}>
            <button type="submit">{editingId ? 'Save changes' : 'Create formula'}</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {message && <p role="status" className={styles.toast}>{message}</p>}

      {filtered.length === 0 ? (
        <p className={styles.empty}>No formulas match your search.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((formula) => (
            <FormulaCard
              key={formula.id}
              formula={formula}
              onEdit={startEdit}
              onDelete={deleteFormula}
              onInsert={handleInsert}
              onCalculate={handleCalculate}
            />
          ))}
        </div>
      )}
      {!hasInsertTarget && <p className={styles.hint}>Tip: open a note to enable "Insert into note".</p>}
    </section>
  )
}
