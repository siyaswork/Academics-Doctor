import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useCalculator } from '../contexts/CalculatorContext'
import { evaluateExpression, formatResult, toFraction } from '../utils/mathExpression'
import type { CalculatorMode } from '../types/calculator'
import styles from './AdvancedCalculator.module.css'

interface AdvancedCalculatorProps {
  /** Called when the user asks to insert the current result into the active note. */
  onInsert?: (text: string) => void
}

const BASIC_KEYS: Array<{ label: string; value: string; kind?: 'op' | 'action' }> = [
  { label: 'C', value: 'clear', kind: 'action' },
  { label: '(', value: '(' },
  { label: ')', value: ')' },
  { label: '⌫', value: 'backspace', kind: 'action' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '÷', value: '/', kind: 'op' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '×', value: '*', kind: 'op' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '−', value: '-', kind: 'op' },
  { label: '0', value: '0' },
  { label: '.', value: '.' },
  { label: '%', value: '%', kind: 'op' },
  { label: '+', value: '+', kind: 'op' },
]

const SCIENTIFIC_KEYS: Array<{ label: string; value: string }> = [
  { label: 'sin', value: 'sin(' },
  { label: 'cos', value: 'cos(' },
  { label: 'tan', value: 'tan(' },
  { label: 'asin', value: 'asin(' },
  { label: 'acos', value: 'acos(' },
  { label: 'atan', value: 'atan(' },
  { label: 'log', value: 'log(' },
  { label: 'ln', value: 'ln(' },
  { label: '√x', value: 'sqrt(' },
  { label: 'x^y', value: '^' },
  { label: 'π', value: 'π' },
  { label: 'e', value: 'e' },
  { label: 'x!', value: '!' },
]

export const AdvancedCalculator: React.FC<AdvancedCalculatorProps> = ({ onInsert }) => {
  const { pendingExpression, addHistoryEntry, insertIntoNote, hasInsertTarget } = useCalculator()
  const [expression, setExpression] = useState('')
  const [mode, setMode] = useState<CalculatorMode>('basic')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastPending = useRef<string | undefined>(undefined)

  // Pick up expressions handed in from history / formula library.
  useEffect(() => {
    if (pendingExpression && pendingExpression !== lastPending.current) {
      setExpression(pendingExpression)
      setError(null)
    }
    lastPending.current = pendingExpression
  }, [pendingExpression])

  const preview = useMemo(() => {
    if (!expression.trim()) return ''
    try {
      const value = evaluateExpression(expression, 'deg')
      return formatResult(value)
    } catch {
      return ''
    }
  }, [expression])

  const append = useCallback((token: string) => {
    setError(null)
    setExpression((prev) => prev + token)
  }, [])

  const backspace = useCallback(() => {
    setError(null)
    setExpression((prev) => prev.slice(0, -1))
  }, [])

  const clear = useCallback(() => {
    setExpression('')
    setError(null)
  }, [])

  const equals = useCallback(() => {
    if (!expression.trim()) return
    try {
      const value = evaluateExpression(expression, 'deg')
      const formatted = formatResult(value)
      const fraction = toFraction(value)
      const display = fraction ? `${formatted} (${fraction})` : formatted
      addHistoryEntry(expression, display)
      setExpression(formatted)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid expression')
    }
  }, [expression, addHistoryEntry])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const { key } = event
      if (/^[0-9.+\-*/%^()]$/.test(key)) {
        event.preventDefault()
        append(key)
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault()
        equals()
      } else if (key === 'Backspace') {
        event.preventDefault()
        backspace()
      } else if (key === 'Escape') {
        clear()
      }
    },
    [append, equals, backspace, clear],
  )

  const flashMessage = (text: string) => {
    setMessage(text)
    window.setTimeout(() => setMessage((current) => (current === text ? null : current)), 1800)
  }

  const handleInsertResult = () => {
    const text = expression.trim()
    if (!text) return
    const target = onInsert ?? (hasInsertTarget ? insertIntoNote : undefined)
    if (target) {
      target(text)
      flashMessage('Inserted into note')
    } else {
      flashMessage('Open a note first to insert')
    }
  }

  return (
    <div
      ref={containerRef}
      className={styles.calculator}
      role="group"
      aria-label="Advanced calculator"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.modeRow} role="tablist" aria-label="Calculator mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'basic'}
          className={mode === 'basic' ? styles.modeActive : styles.mode}
          onClick={() => setMode('basic')}
        >
          Basic
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'scientific'}
          className={mode === 'scientific' ? styles.modeActive : styles.mode}
          onClick={() => setMode('scientific')}
        >
          Scientific
        </button>
      </div>

      <div className={styles.display}>
        <label className={styles.srOnly} htmlFor="calculator-expression">
          Expression
        </label>
        <input
          id="calculator-expression"
          className={styles.expressionInput}
          value={expression}
          onChange={(event) => {
            setError(null)
            setExpression(event.target.value)
          }}
          placeholder="0"
          inputMode="decimal"
          aria-label="Current expression"
        />
        <div className={styles.result} aria-live="polite">
          {error ? <span className={styles.error}>{error}</span> : preview || '\u00A0'}
        </div>
      </div>

      {mode === 'scientific' && (
        <div className={styles.sciGrid} role="group" aria-label="Scientific functions">
          {SCIENTIFIC_KEYS.map((key) => (
            <button key={key.label} type="button" className={styles.sciKey} onClick={() => append(key.value)}>
              {key.label}
            </button>
          ))}
        </div>
      )}

      <div className={styles.keypad} role="group" aria-label="Calculator keypad">
        {BASIC_KEYS.map((key) => (
          <button
            key={key.label}
            type="button"
            className={key.kind === 'op' ? styles.opKey : key.kind === 'action' ? styles.actionKey : styles.key}
            onClick={() => {
              if (key.value === 'clear') clear()
              else if (key.value === 'backspace') backspace()
              else append(key.value)
            }}
            aria-label={key.value === 'clear' ? 'Clear' : key.value === 'backspace' ? 'Backspace' : key.label}
          >
            {key.label}
          </button>
        ))}
        <button type="button" className={styles.equalsKey} onClick={equals} aria-label="Equals">
          =
        </button>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.secondaryAction} onClick={handleInsertResult}>
          Insert into note
        </button>
        {message && <span className={styles.toast} role="status">{message}</span>}
      </div>
    </div>
  )
}
