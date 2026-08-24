import React from 'react'
import styles from './Spinner.module.css'

type SpinnerSize = 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?: SpinnerSize
  label?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label = 'Loading...' }) => {
  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`} role="status">
        <span className="sr-only">{label}</span>
      </div>
    </div>
  )
}
