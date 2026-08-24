import { useMemo, useState } from 'react'
import styles from './TagSelector.module.css'

interface TagSelectorProps { value: string[]; options: string[]; onChange: (tags: string[]) => void }

export const TagSelector = ({ value, options, onChange }: TagSelectorProps) => {
  const [draft, setDraft] = useState('')
  const suggestions = useMemo(() => options.filter((tag) => tag.toLowerCase().includes(draft.toLowerCase()) && !value.includes(tag)).slice(0, 6), [draft, options, value])
  const addTag = (tag: string) => { if (!tag.trim() || value.includes(tag.trim())) return; onChange([...value, tag.trim()]); setDraft('') }
  return (
    <div className={styles.wrapper}>
      <div className={styles.tags}>{value.map((tag) => <button key={tag} type="button" className="chip" onClick={() => onChange(value.filter((item) => item !== tag))}>{tag} ×</button>)}</div>
      <div className={styles.inputRow}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Add tag" /><button type="button" className="buttonGhost" onClick={() => addTag(draft)}>Add tag</button></div>
      {Boolean(suggestions.length) && <div className={styles.suggestions}>{suggestions.map((tag) => <button key={tag} type="button" className="buttonGhost" onClick={() => addTag(tag)}>{tag}</button>)}</div>}
    </div>
  )
}
