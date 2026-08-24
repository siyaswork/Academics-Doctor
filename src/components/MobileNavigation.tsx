import React from 'react'
import styles from './MobileNavigation.module.css'

interface MobileNavigationProps {
  activeItem?: string
  onItemClick?: (itemId: string) => void
}

const navigationItems = [
  { id: 'dashboard', label: 'Home', icon: '⌂' },
  { id: 'notes', label: 'Notes', icon: '📝' },
  { id: 'research', label: 'Research', icon: '🔍' },
  { id: 'work', label: 'Work', icon: '✅' },
  { id: 'saved', label: 'Saved', icon: '⭐' },
]

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeItem = 'dashboard',
  onItemClick,
}) => {
  return (
    <nav className={styles.navigation} aria-label="Mobile navigation">
      {navigationItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`${styles.item} ${activeItem === item.id ? styles.active : ''}`}
          onClick={() => onItemClick?.(item.id)}
          aria-current={activeItem === item.id ? 'page' : undefined}
        >
          <span className={styles.icon} aria-hidden="true">{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
