import React from 'react'
import { WorkItem, SubjectType } from '../types/dashboard'
import styles from './WorkspaceCard.module.css'

const subjectColors: Record<SubjectType, string> = {
  math: '🔢',
  science: '🔬',
  history: '📜',
  literature: '📚',
  other: '✨',
}

const subjectLabels: Record<SubjectType, string> = {
  math: 'Mathematics',
  science: 'Science',
  history: 'History',
  literature: 'Literature',
  other: 'Other',
}

const formatDate = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

interface WorkspaceCardProps {
  item: WorkItem
  onClick?: () => void
  size?: 'small' | 'medium' | 'large'
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  item,
  onClick,
  size = 'medium',
}) => {
  const typeIcons: Record<string, string> = {
    note: '📝',
    research: '🔍',
    assignment: '✅',
    saved: '⭐',
  }

  return (
    <div
      className={`${styles.card} ${styles[size]}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.()
        }
      }}
    >
      <div className={styles.header}>
        <div className={styles.typeIcon}>{typeIcons[item.type]}</div>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{item.title}</h3>
          <div className={styles.subject}>
            <span className={styles.subjectIcon}>{subjectColors[item.subject]}</span>
            <span className={styles.subjectLabel}>{subjectLabels[item.subject]}</span>
          </div>
        </div>
      </div>

      {item.preview && (
        <div className={styles.preview}>
          <p>{item.preview}</p>
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.metadata}>
          {item.metadata?.progress !== undefined && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${item.metadata.progress}%` }}
                />
              </div>
              <span className={styles.progressText}>{item.metadata.progress}%</span>
            </div>
          )}
          {item.metadata?.sources !== undefined && (
            <span className={styles.metaItem}>{item.metadata.sources} sources</span>
          )}
          {item.metadata?.status && (
            <span className={styles.status}>{item.metadata.status}</span>
          )}
        </div>
        <div className={styles.time}>
          <span className={styles.timeText}>{formatDate(item.lastEdited)}</span>
        </div>
      </div>
    </div>
  )
}
