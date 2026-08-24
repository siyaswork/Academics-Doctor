import React from 'react'
import styles from './SplitWorkspace.module.css'

interface SplitWorkspaceProps {
  text: React.ReactNode
  visual: React.ReactNode
  textLabel?: string
  visualLabel?: string
}

/**
 * Generic two-pane layout (Step 5, Feature 6): TEXT | VISUAL side by side on
 * tablet/desktop, stacked vertically on mobile. Never causes horizontal
 * overflow — both panes use min-width: 0 so long unbroken content shrinks
 * instead of pushing the layout wider.
 */
export const SplitWorkspace: React.FC<SplitWorkspaceProps> = ({ text, visual, textLabel = 'Notes', visualLabel = 'Canvas' }) => {
  return (
    <div className={styles.split}>
      <section className={styles.pane} aria-label={textLabel}>
        {text}
      </section>
      <section className={styles.pane} aria-label={visualLabel}>
        {visual}
      </section>
    </div>
  )
}
