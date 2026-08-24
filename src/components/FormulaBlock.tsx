import React, { useState } from 'react'
import { useCalculator } from '../contexts/CalculatorContext'
import type { RichTextContent } from '../types/notes'
import styles from './FormulaBlock.module.css'

interface FormulaBlockProps {
  block: RichTextContent
  onDelete?: () => void
}

/**
 * Renders a formula block embedded in a note: name, formula text, and
 * Copy / Insert into note / Calculate actions (Step 5, Feature 7).
 */
export const FormulaBlock: React.FC<FormulaBlockProps> = ({ block, onDelete }) => {
  const { openCalculator, insertBlockIntoNote } = useCalculator()
  const [copied, setCopied] = useState(false)

  const name = block.formulaName || 'Formula'
  const text = block.formulaText || block.content

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API unavailable — silently ignore, nothing destructive happened.
    }
  }

  const insert = () => {
    insertBlockIntoNote({
      type: 'formula',
      content: `${name}: ${text}`,
      formulaId: block.formulaId,
      formulaName: name,
      formulaText: text,
      formulaSubject: block.formulaSubject,
    })
  }

  const calculate = () => openCalculator(text)

  return (
    <div className={styles.block} role="group" aria-label={`Formula block: ${name}`}>
      <div className={styles.header}>
        <span className={styles.name}>{name}</span>
        {block.formulaSubject && <span className={styles.subject}>{block.formulaSubject}</span>}
      </div>
      <p className={styles.formula}>{text}</p>
      <div className={styles.actions}>
        <button type="button" onClick={copy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button type="button" onClick={insert}>
          Insert into note
        </button>
        <button type="button" className={styles.calculate} onClick={calculate}>
          Calculate
        </button>
        {onDelete && (
          <button type="button" className={styles.delete} onClick={onDelete} aria-label={`Remove ${name} block`}>
            Remove
          </button>
        )}
      </div>
    </div>
  )
}
