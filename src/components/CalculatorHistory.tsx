import React from 'react'
import { useCalculator } from '../contexts/CalculatorContext'
import styles from './CalculatorHistory.module.css'

interface CalculatorHistoryProps {
  onInsert?: (text: string) => void
}

const formatTime = (timestamp: number) =>
  new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric' }).format(
    new Date(timestamp),
  )

export const CalculatorHistory: React.FC<CalculatorHistoryProps> = ({ onInsert }) => {
  const { history, clearHistory, openCalculator, insertIntoNote, hasInsertTarget } = useCalculator()

  return (
    <section className={styles.history} aria-label="Calculator history">
      <header className={styles.header}>
        <h3 className={styles.title}>History</h3>
        <button type="button" className={styles.clearButton} onClick={clearHistory} disabled={!history.length}>
          Clear
        </button>
      </header>
      {history.length === 0 ? (
        <p className={styles.empty}>Calculations you run will appear here.</p>
      ) : (
        <ul className={styles.list}>
          {history.map((entry) => (
            <li key={entry.id} className={styles.entry}>
              <div className={styles.entryText}>
                <span className={styles.expression}>{entry.expression}</span>
                <span className={styles.equalsResult}>= {entry.result}</span>
                <span className={styles.timestamp}>{formatTime(entry.timestamp)}</span>
              </div>
              <div className={styles.entryActions}>
                <button type="button" onClick={() => openCalculator(entry.result.split(' ')[0])}>
                  Reuse
                </button>
                <button
                  type="button"
                  onClick={() => (onInsert ?? insertIntoNote)(`${entry.expression} = ${entry.result}`)}
                  disabled={!onInsert && !hasInsertTarget}
                >
                  Insert
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
