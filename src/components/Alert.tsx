import React from 'react'
import styles from './Alert.module.css'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
  children: React.ReactNode
  onClose?: () => void
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
  ...props
}) => {
  const icons: Record<AlertVariant, string> = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠️',
    error: '✕',
  }

  return (
    <div
      className={`${styles.alert} ${styles[variant]} ${className}`}
      role="alert"
      {...props}
    >
      <div className={styles.iconContent}>
        <span className={styles.icon}>{icons[variant]}</span>
        <div className={styles.message}>
          {title && <div className={styles.title}>{title}</div>}
          <div className={styles.body}>{children}</div>
        </div>
      </div>
      {onClose && (
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  )
}
