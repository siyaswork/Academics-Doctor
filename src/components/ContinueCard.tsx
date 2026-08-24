import React from 'react'
import { ContinueItem, SubjectType } from '../types/dashboard'
import { Button } from './Button'
import styles from './ContinueCard.module.css'

const subjectLabels: Record<SubjectType, string> = {
  math: 'Mathematics',
  science: 'Science',
  history: 'History',
  literature: 'Literature',
  other: 'Other',
}

interface ContinueCardProps {
  item: ContinueItem
  onContinue?: () => void
}

export const ContinueCard: React.FC<ContinueCardProps> = ({ item, onContinue }) => {
  const lastOpened = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const hoursAgo = Math.max(1, Math.round((Date.now() - item.lastOpened.getTime()) / (1000 * 60 * 60)))

  return (
    <section className={styles.card} aria-labelledby="continue-title">
      <div className={styles.content}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Continue Studying</p>
          <h2 id="continue-title" className={styles.title}>{item.title}</h2>
          <p className={styles.subtitle}>
            {subjectLabels[item.subject]} • Opened {lastOpened.format(-hoursAgo, 'hour')}
          </p>
        </div>

        <div className={styles.progressBlock}>
          <div className={styles.progressHeader}>
            <span>Progress</span>
            <span>{item.progress}%</span>
          </div>
          <div className={styles.progressBar} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.progress}>
            <div className={styles.progressFill} style={{ width: `${item.progress}%` }} />
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="primary" size="md" onClick={onContinue}>Continue</Button>
        </div>
      </div>
    </section>
  )
}
