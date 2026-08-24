import React from 'react'
import styles from './QuickActions.module.css'

interface QuickActionsProps {
  onActionClick: (actionId: string) => void
}

const actions = [
  { id: 'note', label: 'New note', icon: '📝' },
  { id: 'research', label: 'Research', icon: '🔍' },
  { id: 'work', label: 'My work', icon: '✅' },
  { id: 'calculator', label: 'Calculator', icon: '🧮' },
]

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  return (
    <section className={styles.section} aria-labelledby="quick-actions-title">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Quick actions</p>
          <h2 id="quick-actions-title" className={styles.title}>Jump in fast</h2>
        </div>
      </div>
      <div className={styles.grid}>
        {actions.map((action) => (
          <button key={action.id} type="button" className={styles.action} onClick={() => onActionClick(action.id)}>
            <span aria-hidden="true">{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
