import styles from './FavoriteButton.module.css'

interface FavoriteButtonProps { isFavorited?: boolean; onToggle: () => void; label: string }

export const FavoriteButton = ({ isFavorited, onToggle, label }: FavoriteButtonProps) => (
  <button type="button" className={`${styles.button} ${isFavorited ? styles.active : ''}`} onClick={(event) => { event.stopPropagation(); onToggle() }} aria-label={label}>
    {isFavorited ? '★' : '☆'}
  </button>
)
