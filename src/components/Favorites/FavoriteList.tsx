import React from 'react';
import { FavoriteItem } from '../../types/favorites';
import styles from './Favorites.module.css';

interface FavoriteListProps {
  favorites: FavoriteItem[];
  onRemove?: (itemId: string) => void;
  onClick?: (item: FavoriteItem) => void;
}

const getFavoriteIcon = (type: string): string => {
  const icons: Record<string, string> = {
    note: '📝',
    research: '🔍',
    work: '📋',
    formula: '∑',
  };
  return icons[type] || '⭐';
};

export const FavoriteList: React.FC<FavoriteListProps> = ({ favorites, onRemove, onClick }) => {
  if (favorites.length === 0) {
    return (
      <div className={styles.favoriteList}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⭐</div>
          <p>No favorites yet</p>
          <span>Add items to your favorites to access them quickly</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.favoriteList}>
      {favorites.map(favorite => (
        <div
          key={favorite.id}
          className={styles.favoriteItem}
          onClick={() => onClick?.(favorite)}
        >
          <span className={styles.favoriteIcon}>{getFavoriteIcon(favorite.type)}</span>
          <div className={styles.favoriteContent}>
            <div className={styles.favoriteTitle}>{favorite.title}</div>
            {favorite.subjectName && (
              <div className={styles.favoriteSubject}>{favorite.subjectName}</div>
            )}
          </div>
          {onRemove && (
            <button
              className={styles.removeButton}
              onClick={e => {
                e.stopPropagation();
                onRemove(favorite.id);
              }}
              title="Remove from favorites"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
