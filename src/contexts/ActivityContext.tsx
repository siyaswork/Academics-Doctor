import React, { useState, useEffect } from 'react';
import { Activity } from '../types/activity';
import { storage } from '../utils/storage';
import { generateId } from '../utils/id';

const ActivityContext = React.createContext<{
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  getRecentActivities: (limit?: number) => Activity[];
  clearActivities: () => void;
} | null>(null);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const saved = storage.get<Activity[]>('activities');
    if (saved) {
      setActivities(saved);
    }
  }, []);

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: generateId(),
    };
    const updated = [newActivity, ...activities].slice(0, 100);
    storage.set('activities', updated);
    setActivities(updated);
  };

  const getRecentActivities = (limit = 10) => {
    return activities.slice(0, limit);
  };

  const clearActivities = () => {
    storage.remove('activities');
    setActivities([]);
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity, getRecentActivities, clearActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = React.useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within ActivityProvider');
  }
  return context;
};
