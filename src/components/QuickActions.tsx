import React from 'react'
import styles from './QuickActions.module.css'

interface QuickActionsProps {
  onActionClick?: (actionId: string) => void
}

const actions = [
  { id: 'note', label: 'New Note', icon: '📝' },
  { id: 'research', label: 'Research', icon: '🔍' },
  { id: 'work', label: 'My Work', icon: '✅' },
  { id: 'calculator', label: 'Calculator', icon: '🧮' },
]

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  return (
    <section className={styles.section} aria-labelledby="quick-actions-title">
      <div className={styles.header}>
        <h2 id="quick-actions-title" className={styles.title}>Quick Actions</h2>
      </div>
      <div className={styles.grid}>
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className={styles.action}
            onClick={() => onActionClick?.(action.id)}
            aria-label={action.label}
          >
            <span className={styles.icon} aria-hidden="true">{action.icon}</span>
            <span className={styles.label}>{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
