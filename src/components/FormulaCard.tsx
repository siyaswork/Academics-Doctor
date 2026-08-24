import React from 'react'
import type { Formula } from '../types/formulas'
import styles from './FormulaCard.module.css'

interface FormulaCardProps {
  formula: Formula
  onEdit: (formula: Formula) => void
  onDelete: (id: string) => void
  onInsert: (formula: Formula) => void
  onCalculate: (formula: Formula) => void
}

export const FormulaCard: React.FC<FormulaCardProps> = ({ formula, onEdit, onDelete, onInsert, onCalculate }) => {
  return (
    <article className={styles.card} aria-label={`Formula: ${formula.name}`}>
      <div className={styles.top}>
        <span className={styles.subject}>{formula.subject}</span>
        <div className={styles.iconActions}>
          <button type="button" onClick={() => onEdit(formula)} aria-label={`Edit ${formula.name}`}>
            ✎
          </button>
          <button type="button" onClick={() => onDelete(formula.id)} aria-label={`Delete ${formula.name}`}>
            🗑
          </button>
        </div>
      </div>
      <h4 className={styles.name}>{formula.name}</h4>
      <p className={styles.formula}>{formula.formula}</p>
      {formula.description && <p className={styles.description}>{formula.description}</p>}
      <div className={styles.actions}>
        <button type="button" onClick={() => onInsert(formula)}>
          Insert into note
        </button>
        <button type="button" className={styles.calculate} onClick={() => onCalculate(formula)}>
          Calculate
        </button>
      </div>
    </article>
  )
}
