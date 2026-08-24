import { useEffect, useRef, useState } from 'react'
import type { Formula } from '../types/formulas'
import type { RichTextContent } from '../types/notes'
import styles from './RichTextEditor.module.css'

interface RichTextEditorProps { content: RichTextContent[]; formulas?: Formula[]; onChange: (content: RichTextContent[]) => void; onInsertDrawing?: () => void }

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const contentToHtml = (content: RichTextContent[]) => content.map((block) => { const text = escapeHtml(block.content); if (block.type === 'heading') return `<h${block.level || 2}>${text}</h${block.level || 2}>`; if (block.type === 'list') return `<${block.listType === 'numbered' ? 'ol' : 'ul'}><li>${text}</li></${block.listType === 'numbered' ? 'ol' : 'ul'}>`; return `<p>${text}</p>` }).join('')
const htmlToContent = (html: string): RichTextContent[] => { const wrapper = document.createElement('div'); wrapper.innerHTML = html; return Array.from(wrapper.children).map((element) => { const tag = element.tagName.toLowerCase(); if (/^h[1-6]$/.test(tag)) return { type: 'heading' as const, level: Number(tag[1]), content: element.textContent || '' }; if (tag === 'ul' || tag === 'ol') return { type: 'list' as const, listType: tag === 'ol' ? 'numbered' as const : 'bullet' as const, content: element.textContent || '' }; return { type: 'paragraph' as const, content: element.textContent || '' } }) }

export const RichTextEditor = ({ content, formulas = [], onChange, onInsertDrawing }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  useEffect(() => { if (editorRef.current && !isFocused) editorRef.current.innerHTML = contentToHtml(content) }, [content, isFocused])
  const syncChange = () => { if (editorRef.current) onChange(htmlToContent(editorRef.current.innerHTML)) }
  const runCommand = (command: string, value?: string) => { editorRef.current?.focus(); document.execCommand(command, false, value); syncChange() }
  return <div className={styles.editorShell}><div className={styles.toolbar} role="toolbar" aria-label="Text formatting"><select aria-label="Text style" defaultValue="p" onChange={(event) => runCommand('formatBlock', event.target.value)}><option value="p">Text</option><option value="h2">Heading</option><option value="h3">Subheading</option></select><button type="button" onClick={() => runCommand('bold')} aria-label="Bold"><strong>B</strong></button><button type="button" onClick={() => runCommand('italic')} aria-label="Italic"><em>I</em></button><button type="button" onClick={() => runCommand('underline')} aria-label="Underline"><u>U</u></button><button type="button" onClick={() => runCommand('insertUnorderedList')} aria-label="Bulleted list">•</button><button type="button" onClick={() => runCommand('insertOrderedList')} aria-label="Numbered list">1.</button>{formulas.length > 0 && <select aria-label="Insert formula" defaultValue="" onChange={(event) => { if (!event.target.value) return; runCommand('insertText', event.target.value); event.target.value = '' }}><option value="">Insert formula</option>{formulas.map((formula) => <option key={formula.id} value={formula.formula}>{formula.name}</option>)}</select>}{onInsertDrawing && <button type="button" onClick={onInsertDrawing} aria-label="Open drawing canvas">✏️</button>}</div><div ref={editorRef} className={styles.editor} contentEditable role="textbox" aria-multiline="true" aria-label="Note content" suppressContentEditableWarning onFocus={() => setIsFocused(true)} onBlur={() => { setIsFocused(false); syncChange() }} onInput={syncChange} /></div>
}
