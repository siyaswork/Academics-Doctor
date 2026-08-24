import type { ResearchProject } from '../types/research'
import { formatShortDate } from '../utils/date'
import { FavoriteButton } from './FavoriteButton'
import styles from './ResearchCard.module.css'

interface ResearchCardProps { project: ResearchProject; subjectName?: string; onOpen: (id: string) => void; onToggleFavorite: () => void }

export const ResearchCard = ({ project, subjectName, onOpen, onToggleFavorite }: ResearchCardProps) => <button type="button" className={styles.card} onClick={() => onOpen(project.id)}><div className={styles.header}><div><strong>{project.title}</strong><p>{subjectName ?? 'General research'}</p></div><FavoriteButton isFavorited={project.isFavorited} onToggle={onToggleFavorite} label={`Toggle favorite for ${project.title}`} /></div><p className={styles.description}>{project.description || 'Add your project summary.'}</p><div className={styles.meta}><span>{project.sources.length} sources</span><span>Updated {formatShortDate(project.updatedAt)}</span></div></button>
