import React, { useState } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
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
    console.log(`Navigating to: ${itemId}`)
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

  // Show different content based on navigation
  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <div className={styles.mainContent}>
            <ContinueCard item={demoContinueItem} onContinue={handleContinue} />
            <QuickActions onActionClick={handleQuickAction} />
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Recent Work</h2>
              <div className={styles.grid}>
                {demoWorkItems.length > 0 ? (
                  demoWorkItems.map((item) => (
                    <WorkspaceCard
                      key={item.id}
                      item={item}
                      onClick={() => handleCardClick(item.id)}
                    />
                  ))
                ) : (
                  <div className={styles.emptyContainer}>
                    <EmptyState
                      icon="📝"
                      title="No work yet"
                      description="Start creating notes, research, or work to see them here"
                      actionLabel="Create your first note"
                      onAction={() => handleQuickAction('note')}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 'notes':
        return (
          <div className={styles.mainContent}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>My Notes</h2>
              <div className={styles.grid}>
                {demoWorkItems.filter((i) => i.type === 'note').length > 0 ? (
                  demoWorkItems
                    .filter((i) => i.type === 'note')
                    .map((item) => (
                      <WorkspaceCard
                        key={item.id}
                        item={item}
                        onClick={() => handleCardClick(item.id)}
                      />
                    ))
                ) : (
                  <EmptyState
                    icon="📝"
                    title="No notes yet"
                    description="Create your first note to get started"
                    actionLabel="New Note"
                  />
                )}
              </div>
            </div>
          </div>
        )

      case 'research':
        return (
          <div className={styles.mainContent}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Research</h2>
              <div className={styles.grid}>
                {demoWorkItems.filter((i) => i.type === 'research').length > 0 ? (
                  demoWorkItems
                    .filter((i) => i.type === 'research')
                    .map((item) => (
                      <WorkspaceCard
                        key={item.id}
                        item={item}
                        onClick={() => handleCardClick(item.id)}
                      />
                    ))
                ) : (
                  <EmptyState
                    icon="🔍"
                    title="No research yet"
                    description="Start building your research collection"
                    actionLabel="New Research"
                  />
                )}
              </div>
            </div>
          </div>
        )

      case 'work':
        return (
          <div className={styles.mainContent}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>My Work</h2>
              <div className={styles.grid}>
                {demoWorkItems.filter((i) => i.type === 'assignment').length > 0 ? (
                  demoWorkItems
                    .filter((i) => i.type === 'assignment')
                    .map((item) => (
                      <WorkspaceCard
                        key={item.id}
                        item={item}
                        onClick={() => handleCardClick(item.id)}
                      />
                    ))
                ) : (
                  <EmptyState
                    icon="✅"
                    title="No work yet"
                    description="Create your first assignment"
                    actionLabel="New Work"
                  />
                )}
              </div>
            </div>
          </div>
        )

      case 'saved':
        return (
          <div className={styles.mainContent}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Saved Items</h2>
              <div className={styles.grid}>
                {demoWorkItems.filter((i) => i.type === 'saved').length > 0 ? (
                  demoWorkItems
                    .filter((i) => i.type === 'saved')
                    .map((item) => (
                      <WorkspaceCard
                        key={item.id}
                        item={item}
                        onClick={() => handleCardClick(item.id)}
                      />
                    ))
                ) : (
                  <EmptyState
                    icon="⭐"
                    title="No saved items"
                    description="Save your favorite materials for quick access"
                  />
                )}
              </div>
            </div>
          </div>
        )

      case 'calculator':
        return (
          <div className={styles.mainContent}>
            <div className={styles.section}>
              <EmptyState
                icon="🧮"
                title="Calculator"
                description="The calculator feature will be available soon"
              />
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className={styles.mainContent}>
            <div className={styles.section}>
              <EmptyState
                icon="⚙️"
                title="Settings"
                description="Settings will be available soon"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.layout}>
      <DashboardSidebar activeItem={activeNav} onItemClick={handleNavClick} />
      <div className={styles.main}>
        <DashboardHeader userName={demoUser.name} />
        <div className={styles.workspace}>{renderContent()}</div>
      </div>
    </div>
  )
}
