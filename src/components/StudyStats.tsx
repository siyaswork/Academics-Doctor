import type { StudySession } from '../types/studySessions'
import { secondsToReadable } from '../utils/date'
import styles from './StudyStats.module.css'

const getLastSevenDays = () => { const days: string[] = []; for (let index = 6; index >= 0; index -= 1) { const date = new Date(); date.setDate(date.getDate() - index); days.push(date.toISOString().slice(0, 10)) } return days }

export const StudyStats = ({ sessions }: { sessions: StudySession[] }) => {
  const total = sessions.reduce((sum, item) => sum + item.duration, 0)
  const mostStudied = Object.entries(sessions.reduce<Record<string, number>>((acc, session) => { const key = session.subjectName ?? 'General'; acc[key] = (acc[key] ?? 0) + session.duration; return acc }, {})).sort((a, b) => b[1] - a[1])[0]
  const bars = getLastSevenDays().map((date) => ({ date, totalSeconds: sessions.filter((session) => session.date === date).reduce((sum, session) => sum + session.duration, 0) }))
  const max = Math.max(...bars.map((bar) => bar.totalSeconds), 1)
  return <section className="panel stack"><div className="statsGrid"><div><strong>{secondsToReadable(total)}</strong><p>Total study time</p></div><div><strong>{sessions.length}</strong><p>Completed sessions</p></div><div><strong>{mostStudied?.[0] ?? '—'}</strong><p>Most studied subject</p></div></div><div><h3>Last 7 days</h3><div className={styles.chart}>{bars.map((bar) => <div key={bar.date} className={styles.column}><span className={styles.bar} style={{ height: `${(bar.totalSeconds / max) * 100 || 6}%` }} /><small>{bar.date.slice(5)}</small></div>)}</div></div></section>
}
