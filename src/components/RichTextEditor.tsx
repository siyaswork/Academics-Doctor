import React, { useEffect, useRef, useState } from 'react'
import type { RichTextContent } from '../types/notes'
import { MathToolbar } from './MathToolbar'
import styles from './RichTextEditor.module.css'

interface RichTextEditorProps {
  content: RichTextContent[]
  onChange: (content: RichTextContent[]) => void
  /**
   * Called on blur so the parent can immediately flush any pending debounced
   * save for this content instead of waiting out the debounce timer.
   */
  onBlurFlush?: () => void
}

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const contentToHtml = (content: RichTextContent[]) => content.map((block) => {
  if (block.type === 'divider') return '<hr />'
  const text = escapeHtml(block.content)
  if (block.type === 'heading') return `<h${block.level || 2}>${text}</h${block.level || 2}>`
  if (block.type === 'list') return `<${block.listType === 'numbered' ? 'ol' : 'ul'}><li>${text}</li></${block.listType === 'numbered' ? 'ol' : 'ul'}>`
  return `<p>${text}</p>`
}).join('')

// FIXED: previously used `wrapper.children`, which only returns Element
// nodes. Browsers frequently insert the very first characters typed into an
// empty contentEditable as a bare Text node (no wrapping <p>), especially
// right after the div is cleared/empty. That text was silently dropped,
// converting freshly-typed content into an empty array — invisible while
// focused, but the moment the editor blurred and re-synced from that now-
// empty saved state, the typed text visibly disappeared.
const htmlToContent = (html: string): RichTextContent[] => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = html
  const blocks: RichTextContent[] = []

  wrapper.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? ''
      if (text.trim() === '') return
      blocks.push({ type: 'paragraph', content: text })
      return
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return

    const element = node as HTMLElement
    const tag = element.tagName.toLowerCase()
    if (tag === 'br') return
    if (tag === 'hr') {
      blocks.push({ type: 'divider', content: '' })
      return
    }
    if (/^h[1-6]$/.test(tag)) {
      blocks.push({ type: 'heading', level: Number(tag[1]), content: element.textContent || '' })
      return
    }
    if (tag === 'ul' || tag === 'ol') {
      blocks.push({ type: 'list', listType: tag === 'ol' ? ('numbered' as const) : ('bullet' as const), content: element.textContent || '' })
      return
    }
    blocks.push({ type: 'paragraph', content: element.textContent || '' })
  })

  // Safety net: if nothing was parsed as a block but there's real text in the
  // wrapper (an edge case we haven't anticipated), never silently drop it —
  // fall back to a single paragraph rather than returning an empty array.
  if (blocks.length === 0) {
    const fallback = wrapper.textContent ?? ''
    if (fallback.trim() !== '') return [{ type: 'paragraph', content: fallback }]
  }

  return blocks
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, onBlurFlush }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  // Latest content the user actually typed; used to distinguish echoes of our
  // own onChange emissions from genuinely external updates. This keeps blur and
  // parent re-renders from snapping visible text back to a stale committed
  // value before the pending debounced save has been flushed.
  const lastEmitted = useRef<RichTextContent[] | null>(null)

  useEffect(() => {
    if (!editorRef.current) return
    // Never re-sync from committed state while the editor is focused, and never
    // re-sync when the incoming content is just the echo of what we emitted.
    if (isFocused) return
    if (lastEmitted.current === content) return
    // An external change (note switched, content reloaded from the server)
    // replaces whatever is on screen, including any local draft.
    editorRef.current.innerHTML = contentToHtml(content)
  }, [content, isFocused])

  const emitChange = (next: RichTextContent[]) => {
    lastEmitted.current = next
    onChange(next)
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Flush the pending debounced save immediately so nothing typed is lost;
    // the draft stays on screen regardless of when the save resolves.
    onBlurFlush?.()
  }

  const runCommand = (command: string, value?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    if (editorRef.current) emitChange(htmlToContent(editorRef.current.innerHTML))
  }

  return (
    <div className={styles.editorShell}>
      <div className={styles.toolbar} role="toolbar" aria-label="Text formatting">
        <select aria-label="Text style" defaultValue="p" onChange={(event) => runCommand('formatBlock', event.target.value)}>
          <option value="p">Text</option><option value="h2">Heading</option><option value="h3">Subheading</option>
        </select>
        <button type="button" onClick={() => runCommand('bold')} aria-label="Bold"><strong>B</strong></button>
        <button type="button" onClick={() => runCommand('italic')} aria-label="Italic"><em>I</em></button>
        <button type="button" onClick={() => runCommand('underline')} aria-label="Underline"><u>U</u></button>
        <button type="button" onClick={() => runCommand('insertUnorderedList')} aria-label="Bulleted list">•</button>
        <button type="button" onClick={() => runCommand('insertOrderedList')} aria-label="Numbered list">1.</button>
        <button type="button" onClick={() => runCommand('justifyLeft')} aria-label="Align left">≡</button>
        <button type="button" onClick={() => runCommand('justifyCenter')} aria-label="Align center">≡</button>
        <button type="button" onClick={() => runCommand('justifyRight')} aria-label="Align right">≡</button>
        <span className={styles.divider} aria-hidden="true" />
        <MathToolbar onInsert={(text) => runCommand('insertText', text)} />
      </div>
      <div ref={editorRef} className={styles.editor} contentEditable role="textbox" aria-multiline="true" aria-label="Note content" suppressContentEditableWarning onFocus={() => setIsFocused(true)} onBlur={handleBlur} onInput={() => editorRef.current && emitChange(htmlToContent(editorRef.current.innerHTML))} />
    </div>
  )
}
