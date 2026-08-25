import React from 'react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { FavoriteList } from '../../components/Favorites/FavoriteList';
import styles from './FavoritesPage.module.css';

export const FavoritesPage: React.FC = () => {
  const { favorites, removeFavorite, getFavorites } = useFavorites();
  const favoriteItems = getFavorites();

  const noteCount = favorites.filter(f => f.itemType === 'note').length;
  const researchCount = favorites.filter(f => f.itemType === 'research').length;
  const workCount = favorites.filter(f => f.itemType === 'work').length;
  const formulaCount = favorites.filter(f => f.itemType === 'formula').length;

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.container}>
        <h1>⭐ Favorites</h1>

        {favorites.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⭐</div>
            <p>No favorites yet</p>
            <p className={styles.emptyDescription}>
              Mark notes, research, work, or formulas as favorites to access them quickly.
            </p>
          </div>
        ) : (
          <>
            <div className={styles.statsSection}>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>📝</span>
                <div>
                  <div className={styles.statLabel}>Notes</div>
                  <div className={styles.statValue}>{noteCount}</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>🔍</span>
                <div>
                  <div className={styles.statLabel}>Research</div>
                  <div className={styles.statValue}>{researchCount}</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>📋</span>
                <div>
                  <div className={styles.statLabel}>Work</div>
                  <div className={styles.statValue}>{workCount}</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>∑</span>
                <div>
                  <div className={styles.statLabel}>Formulas</div>
                  <div className={styles.statValue}>{formulaCount}</div>
                </div>
              </div>
            </div>

            <div className={styles.favoritesSection}>
              <FavoriteList
                favorites={favoriteItems}
                onRemove={removeFavorite}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
