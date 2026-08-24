import React from 'react'
import styles from './MainLayout.module.css'

interface MainLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  hasSidebar?: boolean
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  sidebar,
  header,
  footer,
  hasSidebar = false,
}) => {
  return (
    <div className={styles.layout}>
      {header && <header className={styles.header}>{header}</header>}
      <div className={`${styles.main} ${hasSidebar ? styles.withSidebar : ''}`}>
        {hasSidebar && sidebar && <aside className={styles.sidebar}>{sidebar}</aside>}
        <main className={styles.content}>{children}</main>
      </div>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </div>
  )
}
