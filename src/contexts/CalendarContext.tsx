import React, { useState, useEffect } from 'react';
import { CalendarEvent, UpcomingEvent } from '../types/calendar';
import { storage } from '../utils/storage';
import { generateId } from '../utils/id';
import { getDaysUntil, getDisplayDate } from '../utils/date';

const CalendarContext = React.createContext<{
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id' | 'reminderIds' | 'createdAt' | 'updatedAt'>) => CalendarEvent;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: number) => CalendarEvent[];
  getUpcomingEvents: (days?: number) => UpcomingEvent[];
  getEventById: (id: string) => CalendarEvent | undefined;
} | null>(null);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const saved = storage.get<CalendarEvent[]>('calendarEvents');
    if (saved) {
      setEvents(saved);
    }
  }, []);

  const addEvent = (
    event: Omit<CalendarEvent, 'id' | 'reminderIds' | 'createdAt' | 'updatedAt'>
  ): CalendarEvent => {
    const newEvent: CalendarEvent = {
      ...event,
      id: generateId(),
      reminderIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [...events, newEvent];
    storage.set('calendarEvents', updated);
    setEvents(updated);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    const updated = events.map(e => (e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e));
    storage.set('calendarEvents', updated);
    setEvents(updated);
  };

  const deleteEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    storage.set('calendarEvents', updated);
    setEvents(updated);
  };

  const getEventsByDate = (date: number): CalendarEvent[] => {
    const targetDate = new Date(date);
    const dayStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    return events.filter(e => e.date >= dayStart.getTime() && e.date < dayEnd.getTime());
  };

  const getUpcomingEvents = (days = 7): UpcomingEvent[] => {
    const now = Date.now();
    const futureEvents = events
      .filter(e => e.date >= now)
      .sort((a, b) => a.date - b.date)
      .slice(0, days * 3);

    return futureEvents.map(e => ({
      event: e,
      daysUntil: getDaysUntil(e.date),
      displayDate: getDisplayDate(e.date),
    }));
  };

  const getEventById = (id: string) => events.find(e => e.id === id);

  return (
    <CalendarContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent, getEventsByDate, getUpcomingEvents, getEventById }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = React.useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider');
  }
  return context;
};
