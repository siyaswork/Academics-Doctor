import React, { useEffect } from 'react'
import { useNotes } from '../contexts/NotesContext'
import { useCalculator } from '../contexts/CalculatorContext'
import { RichTextEditor } from './RichTextEditor'
import { NoteBlock } from './NoteBlock'
import type { Note, RichTextContent } from '../types/notes'
import styles from './NoteEditor.module.css'

interface NoteEditorProps {
  note: Note
  /** Hides the trailing formula/divider block list — useful for a distraction-free WRITE mode. */
  hideExtraBlocks?: boolean
}

const isExtraBlock = (block: RichTextContent) => block.type === 'formula' || block.type === 'divider'

/**
 * Composes the classic rich-text prose (paragraph/heading/list) with the new
 * block model (formula/divider blocks) for a single note (Step 5, Feature 7).
 * Registers this note as the active insert target for the Calculator and
 * Formula Library while mounted.
 */
export const NoteEditor: React.FC<NoteEditorProps> = ({ note, hideExtraBlocks }) => {
  const { updateNoteContent, appendBlock } = useNotes()
  const { registerInsertHandler, registerBlockInsertHandler } = useCalculator()

  useEffect(() => {
    registerInsertHandler((text) => appendBlock(note.id, { type: 'paragraph', content: text }))
    registerBlockInsertHandler((block) => appendBlock(note.id, block))
    return () => {
      registerInsertHandler(null)
      registerBlockInsertHandler(null)
    }
  }, [note.id, appendBlock, registerInsertHandler, registerBlockInsertHandler])

  const textBlocks = note.content.filter((block) => !isExtraBlock(block))
  const extraBlocks = note.content.filter(isExtraBlock)

  const handleTextChange = (nextTextBlocks: RichTextContent[]) => {
    updateNoteContent(note.id, [...nextTextBlocks, ...extraBlocks])
  }

  const removeExtraBlock = (target: RichTextContent) => {
    updateNoteContent(
      note.id,
      note.content.filter((block) => block !== target),
    )
  }

  const addDivider = () => {
    appendBlock(note.id, { type: 'divider', content: '' })
  }

  return (
    <div className={styles.editor}>
      <RichTextEditor content={textBlocks} onChange={handleTextChange} />
      {!hideExtraBlocks && (
        <div className={styles.extraBlocks}>
          {extraBlocks.map((block, index) => (
            <NoteBlock key={`${block.type}-${index}`} block={block} onDelete={() => removeExtraBlock(block)} />
          ))}
          <button type="button" className={styles.addDivider} onClick={addDivider}>
            ＋ Add divider
          </button>
        </div>
      )}
    </div>
  )
}
