import React from 'react'
import styles from './DashboardSidebar.module.css'

interface NavItem {
  id: string
  label: string
  icon: string
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'notes', label: 'My Notes', icon: '📝' },
  { id: 'research', label: 'Research', icon: '🔍' },
  { id: 'work', label: 'My Work', icon: '💼' },
  { id: 'saved', label: 'Saved', icon: '⭐' },
  { id: 'calculator', label: 'Calculator', icon: '🧮' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

interface DashboardSidebarProps {
  activeItem?: string
  onItemClick?: (itemId: string) => void
  isCollapsed?: boolean
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeItem = 'dashboard',
  onItemClick,
  isCollapsed = false,
}) => {
  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        {!isCollapsed && <span className={styles.logoText}>Academics</span>}
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeItem === item.id ? styles.active : ''}`}
            onClick={() => onItemClick?.(item.id)}
            title={isCollapsed ? item.label : undefined}
          >
            <span className={styles.icon}>{item.icon}</span>
            {!isCollapsed && <span className={styles.label}>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className={styles.footer}>
        <p className={styles.footerText}>Step 2: Dashboard</p>
      </div>
    </aside>
  )
}
