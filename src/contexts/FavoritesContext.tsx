import React, { useState, useEffect } from 'react';
import { Favorite, FavoriteItem, FavoriteType } from '../types/favorites';
import { storage } from '../utils/storage';
import { generateId } from '../utils/id';

const FavoritesContext = React.createContext<{
  favorites: Favorite[];
  addFavorite: (itemType: FavoriteType, itemId: string, itemTitle: string, subjectId?: string) => void;
  removeFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  getFavorites: () => FavoriteItem[];
} | null>(null);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const saved = storage.get<Favorite[]>('favorites');
    if (saved) {
      setFavorites(saved);
    }
  }, []);

  const addFavorite = (
    itemType: FavoriteType,
    itemId: string,
    itemTitle: string,
    subjectId?: string
  ) => {
    if (favorites.some(f => f.itemId === itemId)) return;
    const newFavorite: Favorite = {
      id: generateId(),
      itemType,
      itemId,
      itemTitle,
      subjectId,
      createdAt: Date.now(),
    };
    const updated = [...favorites, newFavorite];
    storage.set('favorites', updated);
    setFavorites(updated);
  };

  const removeFavorite = (itemId: string) => {
    const updated = favorites.filter(f => f.itemId !== itemId);
    storage.set('favorites', updated);
    setFavorites(updated);
  };

  const isFavorite = (itemId: string): boolean => {
    return favorites.some(f => f.itemId === itemId);
  };

  const getFavorites = (): FavoriteItem[] => {
    return favorites.map(f => ({
      id: f.id,
      type: f.itemType,
      title: f.itemTitle,
      subjectName: f.subjectId,
      timestamp: f.createdAt,
    }));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, getFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = React.useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
