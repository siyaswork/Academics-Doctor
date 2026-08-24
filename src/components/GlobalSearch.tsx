import { useEffect, useMemo, useState } from 'react'
import { useAppContext } from '../contexts/AppContext'
import styles from './GlobalSearch.module.css'

interface SearchResult { id: string; title: string; subtitle: string; group: string; action: () => void }

export const GlobalSearch = () => {
  const { closeSearch, navigate, notes, research, work, subjects, formulas, calendarEvents, tags, setSelectedNote, setSelectedResearch, setSelectedWork, setSelectedFormula, openSubject } = useAppContext()
  const [query, setQuery] = useState('')
  useEffect(() => { const listener = (event: KeyboardEvent) => { if (event.key === 'Escape') closeSearch() }; window.addEventListener('keydown', listener); return () => window.removeEventListener('keydown', listener) }, [closeSearch])
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return [] as SearchResult[]
    return [
      ...notes.filter((item) => `${item.title} ${item.content.map((block) => block.content).join(' ')}`.toLowerCase().includes(q)).map<SearchResult>((item) => ({ id: item.id, title: item.title, subtitle: 'Note', group: 'Notes', action: () => { navigate('notes'); setSelectedNote(item.id); closeSearch() } })),
      ...research.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(q)).map<SearchResult>((item) => ({ id: item.id, title: item.title, subtitle: 'Research', group: 'Research', action: () => { navigate('research'); setSelectedResearch(item.id); closeSearch() } })),
      ...work.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(q)).map<SearchResult>((item) => ({ id: item.id, title: item.title, subtitle: 'Work', group: 'My Work', action: () => { navigate('work'); setSelectedWork(item.id); closeSearch() } })),
      ...subjects.filter((item) => item.name.toLowerCase().includes(q)).map<SearchResult>((item) => ({ id: item.id, title: item.name, subtitle: 'Subject', group: 'Subjects', action: () => { openSubject(item.id); closeSearch() } })),
      ...formulas.filter((item) => `${item.name} ${item.formula}`.toLowerCase().includes(q)).map<SearchResult>((item) => ({ id: item.id, title: item.name, subtitle: item.formula, group: 'Formulas', action: () => { navigate('formulas'); setSelectedFormula(item.id); closeSearch() } })),
      ...calendarEvents.filter((item) => item.title.toLowerCase().includes(q)).map<SearchResult>((item) => ({ id: item.id, title: item.title, subtitle: 'Calendar event', group: 'Calendar', action: () => { navigate('calendar'); closeSearch() } })),
      ...tags.filter((tag) => tag.toLowerCase().includes(q)).map<SearchResult>((tag) => ({ id: tag, title: tag, subtitle: 'Tag', group: 'Tags', action: () => { navigate('work'); closeSearch() } })),
    ].slice(0, 30)
  }, [calendarEvents, closeSearch, formulas, navigate, notes, openSubject, query, research, setSelectedFormula, setSelectedNote, setSelectedResearch, setSelectedWork, subjects, tags, work])
  const grouped = useMemo(() => results.reduce<Record<string, SearchResult[]>>((accumulator, result) => { accumulator[result.group] = [...(accumulator[result.group] ?? []), result]; return accumulator }, {}), [results])
  return <div className="modalOverlay" onClick={closeSearch}><div className="modalCard" onClick={(event) => event.stopPropagation()}><div className={styles.header}><h2>Search everything</h2><button type="button" className="iconButton" onClick={closeSearch} aria-label="Close search">✕</button></div><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notes, subjects, formulas, events, and tags" /><div className={styles.results}>{query.trim() ? Object.entries(grouped).map(([group, items]) => <section key={group} className={styles.group}><h3>{group}</h3>{items.map((item) => <button key={`${group}-${item.id}`} type="button" className={styles.result} onClick={item.action}><strong>{item.title}</strong><span>{item.subtitle}</span></button>)}</section>) : <div className="emptyState">Start typing to search across your workspace.</div>}</div></div></div>
}
