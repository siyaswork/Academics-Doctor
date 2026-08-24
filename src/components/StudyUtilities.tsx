import React, { useEffect, useRef, useState } from 'react'
import { AdvancedCalculator } from './AdvancedCalculator'
import { CalculatorHistory } from './CalculatorHistory'
import { FormulaLibrary } from './FormulaLibrary'
import { useWorkspacePrefs } from '../contexts/WorkspacePrefsContext'
import styles from './StudyUtilities.module.css'

type TabId = 'calculator' | 'formulas' | 'drawing' | 'ai'

interface StudyUtilitiesProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: TabId
}

const TABS: Array<{ id: TabId; label: string; disabled?: boolean }> = [
  { id: 'calculator', label: 'Calculator' },
  { id: 'formulas', label: 'Formula Library' },
  { id: 'drawing', label: 'Drawing Tools' },
  { id: 'ai', label: 'AI (Coming soon)', disabled: true },
]

/**
 * Reusable Study Utilities panel (Step 5, Feature 8): a tabbed side panel on
 * desktop/tablet, a bottom sheet on mobile. Keyboard navigable and closes on
 * Escape.
 */
export const StudyUtilities: React.FC<StudyUtilitiesProps> = ({ isOpen, onClose, initialTab = 'calculator' }) => {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)
  const panelRef = useRef<HTMLDivElement>(null)
  const { gridEnabled, snapEnabled, toggleGrid, toggleSnap } = useWorkspacePrefs()

  useEffect(() => {
    if (isOpen) setActiveTab(initialTab)
  }, [isOpen, initialTab])

  useEffect(() => {
    if (!isOpen) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    panelRef.current?.focus()
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-label="Study utilities"
        aria-modal="true"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Study Utilities</h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close study utilities">
            ✕
          </button>
        </div>
        <div className={styles.tabs} role="tablist" aria-label="Study utility sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              disabled={tab.disabled}
              className={activeTab === tab.id ? styles.tabActive : styles.tab}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className={styles.content} role="tabpanel">
          {activeTab === 'calculator' && (
            <div className={styles.stack}>
              <AdvancedCalculator />
              <CalculatorHistory />
            </div>
          )}
          {activeTab === 'formulas' && <FormulaLibrary />}
          {activeTab === 'drawing' && (
            <div className={styles.drawingTab}>
              <p className={styles.drawingHint}>
                These preferences apply to any drawing canvas open in your Study Workspace.
              </p>
              <label className={styles.toggleRow}>
                <input type="checkbox" checked={gridEnabled} onChange={toggleGrid} />
                Show grid
              </label>
              <label className={styles.toggleRow}>
                <input type="checkbox" checked={snapEnabled} onChange={toggleSnap} />
                Snap to grid
              </label>
              <p className={styles.drawingHint}>
                Open the <strong>Draw</strong> or <strong>Study</strong> mode in Study Workspace to sketch with pens,
                shapes, arrows, sticky notes, and more.
              </p>
            </div>
          )}
          {activeTab === 'ai' && (
            <div className={styles.aiTab} aria-disabled="true">
              <p>AI-assisted recognition, solving, explanations, and summaries are coming soon.</p>
              <p className={styles.drawingHint}>This feature is intentionally disabled in this build.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
