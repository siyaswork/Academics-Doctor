import type { ActivityItem } from '../types/activity'
import { formatDateTime } from '../utils/date'
import styles from './ActivityFeed.module.css'

const labels: Record<ActivityItem['type'], string> = { note_created: 'Created note', note_edited: 'Edited note', research_created: 'Created research project', research_edited: 'Updated research project', source_added: 'Added a source', formula_saved: 'Saved formula', work_updated: 'Updated work', subject_created: 'Created subject', study_session_completed: 'Completed study session', event_created: 'Created event' }

export const ActivityFeed = ({ items }: { items: ActivityItem[] }) => {
  if (!items.length) return <div className="emptyState">Recent activity will appear here as you work.</div>
  return <div className={styles.feed}>{items.map((item) => <article key={item.id} className={styles.item}><div><strong>{labels[item.type]}</strong><p>{item.linkedTitle}</p></div><span>{formatDateTime(item.timestamp)}</span></article>)}</div>
}
