import React, { useEffect, useMemo, useRef, useState } from 'react'
import { RichTextContent, TextAlignment } from '../types/notes'
import styles from './RichTextEditor.module.css'

interface RichTextEditorProps {
  content: RichTextContent[]
  onChange: (content: RichTextContent[]) => void
}

const allowedInlineTags: Record<string, string> = {
  b: 'strong',
  strong: 'strong',
  i: 'em',
  em: 'em',
  u: 'u',
  br: 'br',
  sub: 'sub',
  sup: 'sup',
}

const alignments: TextAlignment[] = ['left', 'center', 'right', 'justify']

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const sanitizeInlineNode = (node: ChildNode): string => {
  if (node.nodeType === Node.TEXT_NODE) {
    return escapeHtml(node.textContent ?? '')
  }

  if (!(node instanceof HTMLElement)) {
    return ''
  }

  const tag = node.tagName.toLowerCase()
  const children = Array.from(node.childNodes).map((child) => sanitizeInlineNode(child)).join('')

  if (tag === 'br') {
    return '<br>'
  }

  if (allowedInlineTags[tag]) {
    const mappedTag = allowedInlineTags[tag]
    return `<${mappedTag}>${children}</${mappedTag}>`
  }

  return children
}

const sanitizeBlockContent = (element: HTMLElement) =>
  Array.from(element.childNodes)
    .map((child) => sanitizeInlineNode(child))
    .join('')

const getAlignment = (element: HTMLElement): TextAlignment | undefined => {
  const alignment = element.style.textAlign as TextAlignment
  return alignments.includes(alignment) ? alignment : undefined
}

const contentToHtml = (content: RichTextContent[]) => {
  const html: string[] = []
  let index = 0

  while (index < content.length) {
    const block = content[index]

    if (block.type === 'list') {
      const tag = block.listType === 'numbered' ? 'ol' : 'ul'
      const items: string[] = []
      const alignment = block.alignment ? ` style="text-align:${block.alignment}"` : ''

      while (
        index < content.length &&
        content[index].type === 'list' &&
        content[index].listType === block.listType &&
        content[index].alignment === block.alignment
      ) {
        items.push(`<li>${content[index].content || '<br>'}</li>`)
        index += 1
      }

      html.push(`<${tag}${alignment}>${items.join('')}</${tag}>`)
      continue
    }

    const alignment = block.alignment ? ` style="text-align:${block.alignment}"` : ''

    if (block.type === 'heading') {
      const level = Math.min(3, Math.max(1, block.level ?? 2))
      html.push(`<h${level}${alignment}>${block.content || '<br>'}</h${level}>`)
      index += 1
      continue
    }

    html.push(`<p${alignment}>${block.content || '<br>'}</p>`)
    index += 1
  }

  return html.join('')
}

const htmlToContent = (html: string): RichTextContent[] => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = html

  const blocks: RichTextContent[] = []

  Array.from(wrapper.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      blocks.push({ type: 'paragraph', content: escapeHtml(node.textContent) })
      return
    }

    if (!(node instanceof HTMLElement)) {
      return
    }

    const tag = node.tagName.toLowerCase()
    const alignment = getAlignment(node)

    if (/^h[1-6]$/.test(tag)) {
      blocks.push({
        type: 'heading',
        level: Number(tag[1]),
        alignment,
        content: sanitizeBlockContent(node),
      })
      return
    }

    if (tag === 'ul' || tag === 'ol') {
      Array.from(node.children).forEach((item) => {
        if (item instanceof HTMLElement) {
          blocks.push({
            type: 'list',
            listType: tag === 'ol' ? 'numbered' : 'bullet',
            alignment,
            content: sanitizeBlockContent(item),
          })
        }
      })
      return
    }

    if (tag === 'div' && !node.textContent?.trim()) {
      return
    }

    blocks.push({
      type: /^h[1-6]$/.test(tag) ? 'heading' : 'paragraph',
      alignment,
      content: sanitizeBlockContent(node),
    })
  })

  return blocks.length ? blocks : [{ type: 'paragraph', content: '' }]
}

const toolbarButtons = [
  { label: 'Bold', icon: 'B', command: 'bold' },
  { label: 'Italic', icon: 'I', command: 'italic' },
  { label: 'Underline', icon: 'U', command: 'underline' },
  { label: 'Bulleted list', icon: '•', command: 'insertUnorderedList' },
  { label: 'Numbered list', icon: '1.', command: 'insertOrderedList' },
  { label: 'Align left', icon: '⇤', command: 'justifyLeft' },
  { label: 'Align center', icon: '≡', command: 'justifyCenter' },
  { label: 'Align right', icon: '⇥', command: 'justifyRight' },
]

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const initialHtml = useMemo(() => contentToHtml(content), [content])

  useEffect(() => {
    if (editorRef.current && !isFocused) {
      editorRef.current.innerHTML = initialHtml
    }
  }, [initialHtml, isFocused])

  const syncContent = () => {
    if (editorRef.current) {
      onChange(htmlToContent(editorRef.current.innerHTML))
    }
  }

  const runCommand = (command: string, value?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    syncContent()
  }

  return (
    <div className={styles.editorShell}>
      <div className={styles.toolbar} role="toolbar" aria-label="Text formatting">
        <select
          aria-label="Text style"
          defaultValue="p"
          onChange={(event) => runCommand('formatBlock', event.target.value)}
          title="Change text style"
        >
          <option value="p">Text</option>
          <option value="h1">Title</option>
          <option value="h2">Heading</option>
          <option value="h3">Subheading</option>
        </select>
        {toolbarButtons.map((button) => (
          <button
            key={button.command}
            type="button"
            onClick={() => runCommand(button.command)}
            aria-label={button.label}
            title={button.label}
          >
            {button.icon}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        className={styles.editor}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label="Note content"
        suppressContentEditableWarning
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
          syncContent()
        }}
        onInput={syncContent}
      />
    </div>
  )
}
