import type { WorkItem } from '../types/work'
import { FavoriteButton } from './FavoriteButton'
import { formatShortDate } from '../utils/date'
import styles from './WorkCard.module.css'

interface WorkCardProps { item: WorkItem; subjectName?: string; onOpen: (id: string) => void; onToggleFavorite: () => void }

export const WorkCard = ({ item, subjectName, onOpen, onToggleFavorite }: WorkCardProps) => <button type="button" className={styles.card} onClick={() => onOpen(item.id)}><div className={styles.header}><div><strong>{item.title}</strong><p>{subjectName ?? 'Independent work'}</p></div><FavoriteButton isFavorited={item.isFavorited} onToggle={onToggleFavorite} label={`Toggle favorite for ${item.title}`} /></div><span className={`badge ${styles.status}`}>{item.status}</span><p className={styles.description}>{item.description || 'Add more detail for this task.'}</p><div className={styles.meta}><span>{item.type}</span><span>Updated {formatShortDate(item.updatedAt)}</span></div></button>
