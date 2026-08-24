import { useMemo } from 'react'
import { useAppContext } from '../contexts/AppContext'

export const ProgressIndicators = () => {
  const { notes, research, work, studySessions } = useAppContext()
  const stats = useMemo(() => [{ label: 'Notes', value: notes.length }, { label: 'Research', value: research.length }, { label: 'Completed work', value: work.filter((item) => item.status === 'completed').length }, { label: 'Study sessions', value: studySessions.length }], [notes, research, work, studySessions])
  return <section className="panel"><div className="statsGrid">{stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><p>{stat.label}</p></div>)}</div></section>
}
