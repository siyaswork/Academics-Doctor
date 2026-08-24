import React, { useMemo, useState } from 'react'
import { demoContinueItem, demoUser, demoWorkItems } from '../data/demoData'
import { useNotes } from '../contexts/NotesContext'
import { plainTextFromHtml } from '../lib/richText'
import { WorkItem } from '../types/dashboard'
import { ContinueCard } from './ContinueCard'
import { DashboardHeader } from './DashboardHeader'
import { DashboardSidebar } from './DashboardSidebar'
import { EmptyState } from './EmptyState'
import { MobileNavigation } from './MobileNavigation'
import { NotesWorkspace } from './NotesWorkspace'
import { QuickActions } from './QuickActions'
import { WorkspaceCard } from './WorkspaceCard'
import styles from './DashboardLayout.module.css'

const noteToWorkItem = (note: ReturnType<typeof useNotes>['notes'][number]): WorkItem => ({
  id: note.id,
  type: 'note',
  title: note.title || 'Untitled Note',
  subject: note.subject,
  lastEdited: note.updatedAt,
  preview: plainTextFromHtml(note.content.find((block) => block.type !== 'drawing')?.content || 'Open your note'),
  metadata: {
    status: note.hasDrawings ? 'Has drawings' : 'Saved',
  },
})

export const DashboardLayout: React.FC = () => {
  const { notes, openNote, createNote } = useNotes()
  const [activeNav, setActiveNav] = useState('dashboard')

  const noteItems = useMemo(
    () => [...notes].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).map((note) => noteToWorkItem(note)),
    [notes],
  )

  const workItems = useMemo(() => {
    const nonNoteItems = demoWorkItems.filter((item) => item.type !== 'note')
    return [...noteItems, ...nonNoteItems]
  }, [noteItems])

  const handleNavClick = (itemId: string) => {
    setActiveNav(itemId)
  }

  const handleCardClick = (item: WorkItem) => {
    if (item.type === 'note') {
      setActiveNav('notes')
      openNote(item.id)
    }
  }

  const handleContinue = () => {
    setActiveNav('notes')
    if (noteItems[0]) {
      openNote(noteItems[0].id)
    }
  }

  const handleQuickAction = (actionId: string) => {
    if (actionId === 'note') {
      setActiveNav('notes')
      createNote('Untitled Note', 'other')
      return
    }

    if (actionId === 'calculator') {
      setActiveNav('notes')
      if (!noteItems[0]) {
        createNote('Untitled Note', 'other')
      } else {
        openNote(noteItems[0].id)
      }
      return
    }

    setActiveNav(actionId)
  }

  const renderItems = (type?: WorkItem['type']) => {
    const items = type ? workItems.filter((item) => item.type === type) : workItems

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
        onClick={() => handleCardClick(item)}
      />
    ))
  }

  const renderContent = () => {
    if (activeNav === 'notes') {
      return <NotesWorkspace />
    }

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
              <span className={styles.itemCount}>{workItems.length} items</span>
            </div>
            <div className={styles.grid}>{renderItems()}</div>
          </section>
        </div>
      )
    }

    const contentByNav: Record<string, { title: string; type?: WorkItem['type']; icon: string; description: string }> = {
      research: { title: 'Research', type: 'research', icon: '🔍', description: 'Organize research and sources in one place.' },
      work: { title: 'My Work', type: 'assignment', icon: '✅', description: 'Track assignments and projects here.' },
      saved: { title: 'Saved', type: 'saved', icon: '⭐', description: 'Keep useful materials close by.' },
      calculator: { title: 'Calculator', icon: '🧮', description: 'Open any note to use the built-in calculator.' },
      settings: { title: 'Settings', icon: '⚙️', description: 'Personal preferences will be available soon.' },
    }

    const page = contentByNav[activeNav]

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
