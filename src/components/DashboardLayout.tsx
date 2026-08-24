import React, { useState } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import { MobileNavigation } from './MobileNavigation'
import { DashboardHeader } from './DashboardHeader'
import { ContinueCard } from './ContinueCard'
import { QuickActions } from './QuickActions'
import { WorkspaceCard } from './WorkspaceCard'
import { EmptyState } from './EmptyState'
import { demoUser, demoContinueItem, demoWorkItems } from '../data/demoData'
import styles from './DashboardLayout.module.css'

export const DashboardLayout: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard')

  const handleNavClick = (itemId: string) => {
    setActiveNav(itemId)
  }

  const handleCardClick = (cardId: string) => {
    console.log(`Opening card: ${cardId}`)
  }

  const handleContinue = () => {
    console.log('Continuing study session')
  }

  const handleQuickAction = (actionId: string) => {
    console.log(`Quick action: ${actionId}`)
  }

  const renderItems = (type?: string) => {
    const items = type ? demoWorkItems.filter((item) => item.type === type) : demoWorkItems

    if (items.length === 0) {
      return (
        <EmptyState
          icon="📝"
          title="No work here yet"
          description="Create something new and it will appear in your workspace."
          actionLabel="Create your first note"
          onAction={() => handleQuickAction('note')}
        />
      )
    }

    return items.map((item, index) => (
      <WorkspaceCard
        key={item.id}
        item={item}
        size={index === 0 ? 'large' : index % 3 === 0 ? 'small' : 'medium'}
        onClick={() => handleCardClick(item.id)}
      />
    ))
  }

  const renderContent = () => {
    if (activeNav === 'dashboard') {
      return (
        <div className={styles.mainContent}>
          <ContinueCard item={demoContinueItem} onContinue={handleContinue} />
          <QuickActions onActionClick={handleQuickAction} />
          <section className={styles.section} aria-labelledby="recent-work-title">
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.eyebrow}>Your workspace</p>
                <h2 id="recent-work-title" className={styles.sectionTitle}>Recent work</h2>
              </div>
              <span className={styles.itemCount}>{demoWorkItems.length} items</span>
            </div>
            <div className={styles.grid}>{renderItems()}</div>
          </section>
        </div>
      )
    }

    const contentByNav: Record<string, { title: string; type?: string; icon: string; description: string }> = {
      notes: { title: 'My Notes', type: 'note', icon: '📝', description: 'Your saved notes will live here.' },
      research: { title: 'Research', type: 'research', icon: '🔍', description: 'Organize research and sources in one place.' },
      work: { title: 'My Work', type: 'assignment', icon: '✅', description: 'Track assignments and projects here.' },
      saved: { title: 'Saved', type: 'saved', icon: '⭐', description: 'Keep useful materials close by.' },
      calculator: { title: 'Calculator', icon: '🧮', description: 'The calculator will be available in a later step.' },
      settings: { title: 'Settings', icon: '⚙️', description: 'Personal preferences will be available soon.' },
    }

    const page = contentByNav[activeNav] ?? contentByNav.dashboard

    return (
      <div className={styles.mainContent}>
        <section className={styles.section} aria-labelledby="page-title">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Personal workspace</p>
              <h2 id="page-title" className={styles.sectionTitle}>{page.title}</h2>
            </div>
          </div>
          {page.type ? (
            <div className={styles.grid}>{renderItems(page.type)}</div>
          ) : (
            <EmptyState icon={page.icon} title={page.title} description={page.description} />
          )}
        </section>
      </div>
    )
  }

  return (
    <div className={styles.layout}>
      <DashboardSidebar activeItem={activeNav} onItemClick={handleNavClick} />
      <div className={styles.main}>
        <DashboardHeader userName={demoUser.name} />
        <div className={styles.workspace}>{renderContent()}</div>
      </div>
      <MobileNavigation activeItem={activeNav} onItemClick={handleNavClick} />
    </div>
  )
}
