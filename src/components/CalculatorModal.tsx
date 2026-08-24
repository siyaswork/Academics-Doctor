import React, { useMemo, useState } from 'react'
import { evaluateExpression } from '../lib/calculator'
import { Modal } from './Modal'
import styles from './CalculatorModal.module.css'

interface CalculatorModalProps {
  isOpen: boolean
  onClose: () => void
}

const keypad = [
  ['(', ')', '%', '/'],
  ['7', '8', '9', '*'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '⌫', '='],
]

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose }) => {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState('')

  const helperText = useMemo(() => 'Supports +, -, *, /, decimals, %, and parentheses.', [])

  const evaluate = () => {
    try {
      const value = evaluateExpression(expression)
      setResult(Number.isInteger(value) ? String(value) : String(Number(value.toFixed(8))))
      setError('')
    } catch (evaluationError) {
      setError(evaluationError instanceof Error ? evaluationError.message : 'Invalid expression')
      setResult('')
    }
  }

  const handleKey = (key: string) => {
    if (key === '=') {
      evaluate()
      return
    }

    if (key === '⌫') {
      setExpression((previous) => previous.slice(0, -1))
      return
    }

    setExpression((previous) => `${previous}${key}`)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Calculator" size="sm">
      <div className={styles.calculator}>
        <label className={styles.label}>
          <span>Expression</span>
          <input
            value={expression}
            onChange={(event) => setExpression(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                evaluate()
              }
              if (event.key === 'Escape') {
                onClose()
              }
            }}
            placeholder="e.g. (24.5 + 5%) / 3"
            aria-describedby="calculator-helper"
            autoFocus
          />
        </label>
        <p id="calculator-helper" className={styles.helper}>{helperText}</p>
        <div className={styles.output} aria-live="polite">
          <span className={styles.outputLabel}>Result</span>
          <strong>{result || '—'}</strong>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.keypad}>
          {keypad.flat().map((key) => (
            <button key={key} type="button" onClick={() => handleKey(key)} className={key === '=' ? styles.equals : ''}>
              {key}
            </button>
          ))}
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={() => { setExpression(''); setResult(''); setError('') }}>
            Clear
          </button>
          <button type="button" onClick={evaluate}>
            Calculate
          </button>
        </div>
      </div>
    </Modal>
  )
}
