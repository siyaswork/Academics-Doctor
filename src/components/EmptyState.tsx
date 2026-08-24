import React from 'react'
import { Button } from './Button'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '✨',
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>{icon}</div>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {actionLabel && (
          <Button variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
