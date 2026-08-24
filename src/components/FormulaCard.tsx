import type { Formula } from '../types/formulas'
import { FavoriteButton } from './FavoriteButton'
import styles from './FormulaCard.module.css'

interface FormulaCardProps { formula: Formula; subjectName?: string; onOpen: (id: string) => void; onToggleFavorite: () => void; onCopy: () => void }

export const FormulaCard = ({ formula, subjectName, onOpen, onToggleFavorite, onCopy }: FormulaCardProps) => <div className={styles.card}><button type="button" className={styles.main} onClick={() => onOpen(formula.id)}><strong>{formula.name}</strong><p>{subjectName ?? 'General formula'}</p><code>{formula.formula}</code></button><div className={styles.actions}><button type="button" className="buttonGhost" onClick={onCopy}>Copy</button><FavoriteButton isFavorited={formula.isFavorited} onToggle={onToggleFavorite} label={`Toggle favorite for ${formula.name}`} /></div></div>
