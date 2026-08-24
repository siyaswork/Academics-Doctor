import React, { useState } from 'react'
import styles from './MathToolbar.module.css'

const GREEK_LETTERS = ['α', 'β', 'γ', 'δ', 'π', 'θ', 'λ', 'μ', 'σ', 'φ', 'ω', 'Δ', 'Σ']

const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  n: 'ⁿ', x: 'ˣ', '+': '⁺', '-': '⁻',
}
const SUBSCRIPT_MAP: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  n: 'ₙ', x: 'ₓ', '+': '₊', '-': '₋',
}

interface MathToolbarProps {
  /** Inserts plain text/Unicode at the caller's current cursor position. */
  onInsert: (text: string) => void
}

/**
 * Math-friendly text entry toolbar (Step 5, Feature 9): superscript,
 * subscript, fraction, square-root, and a Greek letter picker. Everything
 * inserts plain Unicode characters, so it works inside any text field.
 */
export const MathToolbar: React.FC<MathToolbarProps> = ({ onInsert }) => {
  const [showGreek, setShowGreek] = useState(false)

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Math symbols">
      <button type="button" onClick={() => onInsert(SUPERSCRIPT_MAP['2'])} aria-label="Insert superscript 2 (x squared)">
        x²
      </button>
      <button type="button" onClick={() => onInsert(SUBSCRIPT_MAP['2'])} aria-label="Insert subscript 2">
        x₂
      </button>
      <button type="button" onClick={() => onInsert('a/b')} aria-label="Insert fraction template">
        a/b
      </button>
      <button type="button" onClick={() => onInsert('√')} aria-label="Insert square root symbol">
        √x
      </button>
      <div className={styles.greekWrapper}>
        <button
          type="button"
          aria-haspopup="true"
          aria-expanded={showGreek}
          onClick={() => setShowGreek((prev) => !prev)}
        >
          α β…
        </button>
        {showGreek && (
          <div className={styles.greekPopover} role="menu" aria-label="Greek letters" onKeyDown={(e) => e.key === 'Escape' && setShowGreek(false)}>
            {GREEK_LETTERS.map((letter) => (
              <button
                key={letter}
                type="button"
                role="menuitem"
                onClick={() => {
                  onInsert(letter)
                  setShowGreek(false)
                }}
              >
                {letter}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
