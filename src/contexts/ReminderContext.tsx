import React, { useState, useEffect } from 'react';
import { Reminder } from '../types/reminder';
import { storage } from '../utils/storage';
import { generateId } from '../utils/id';

const ReminderContext = React.createContext<{
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => Reminder;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  completeReminder: (id: string) => void;
  getActiveReminders: () => Reminder[];
  getRemindersByTarget: (targetId: string) => Reminder[];
  getReminderById: (id: string) => Reminder | undefined;
} | null>(null);

export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    const saved = storage.get<Reminder[]>('reminders');
    if (saved) {
      setReminders(saved);
    }
  }, []);

  const addReminder = (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>): Reminder => {
    const newReminder: Reminder = {
      ...reminder,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [...reminders, newReminder];
    storage.set('reminders', updated);
    setReminders(updated);
    return newReminder;
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    const updated = reminders.map(r => (r.id === id ? { ...r, ...updates, updatedAt: Date.now() } : r));
    storage.set('reminders', updated);
    setReminders(updated);
  };

  const deleteReminder = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    storage.set('reminders', updated);
    setReminders(updated);
  };

  const completeReminder = (id: string) => {
    updateReminder(id, { isCompleted: true });
  };

  const getActiveReminders = (): Reminder[] => {
    return reminders.filter(r => r.isActive && !r.isCompleted);
  };

  const getRemindersByTarget = (targetId: string): Reminder[] => {
    return reminders.filter(r => r.targetId === targetId);
  };

  const getReminderById = (id: string) => reminders.find(r => r.id === id);

  return (
    <ReminderContext.Provider
      value={{
        reminders,
        addReminder,
        updateReminder,
        deleteReminder,
        completeReminder,
        getActiveReminders,
        getRemindersByTarget,
        getReminderById,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminders = () => {
  const context = React.useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminders must be used within ReminderProvider');
  }
  return context;
};
