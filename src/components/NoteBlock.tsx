import React from 'react'
import type { RichTextContent } from '../types/notes'
import { FormulaBlock } from './FormulaBlock'
import styles from './NoteBlock.module.css'

interface NoteBlockProps {
  block: RichTextContent
  onDelete?: () => void
}

/**
 * Renders a single block from a note's content array (Step 5, Feature 7).
 * Handles the new 'formula' and 'divider' block kinds; falls back to a plain
 * text rendering for the classic paragraph/heading/list/image/drawing kinds
 * so older notes keep rendering unchanged.
 */
export const NoteBlock: React.FC<NoteBlockProps> = ({ block, onDelete }) => {
  if (block.type === 'formula') return <FormulaBlock block={block} onDelete={onDelete} />

  if (block.type === 'divider') {
    return (
      <div className={styles.dividerRow}>
        <hr className={styles.divider} />
        {onDelete && (
          <button type="button" className={styles.removeDivider} onClick={onDelete} aria-label="Remove divider">
            ✕
          </button>
        )}
      </div>
    )
  }

  if (block.type === 'heading') {
    const tag = `h${block.level || 2}`
    return React.createElement(tag, { className: styles.heading }, block.content)
  }

  if (block.type === 'list') {
    return (
      <ul className={styles.list}>
        <li>{block.content}</li>
      </ul>
    )
  }

  return <p className={styles.paragraph}>{block.content}</p>
}
