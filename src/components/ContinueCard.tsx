import React from 'react'
import { ContinueItem } from '../types/dashboard'
import styles from './ContinueCard.module.css'

interface ContinueCardProps {
  item: ContinueItem
  onContinue: () => void
}

export const ContinueCard: React.FC<ContinueCardProps> = ({ item, onContinue }) => {
  return (
    <section className={styles.card} aria-labelledby="continue-card-title">
      <div>
        <p className={styles.eyebrow}>Continue where you left off</p>
        <h2 id="continue-card-title" className={styles.title}>{item.title}</h2>
        <p className={styles.meta}>{item.timeSpent} • {item.progress}% complete</p>
      </div>
      <div className={styles.progress} aria-hidden="true">
        <span style={{ width: `${item.progress}%` }} />
      </div>
      <button type="button" className={styles.button} onClick={onContinue}>Continue</button>
    </section>
  )
}
