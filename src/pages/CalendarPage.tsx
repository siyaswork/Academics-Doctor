import React, { useState } from 'react';
import { useCalendar } from '../../contexts/CalendarContext';
import { useSubjects } from '../../contexts/SubjectContext';
import { CalendarEventComponent } from '../../components/Calendar/CalendarEvent';
import { CalendarEventForm } from '../../components/Calendar/CalendarEventForm';
import styles from './CalendarPage.module.css';

export const CalendarPage: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, getUpcomingEvents } = useCalendar();
  const { subjects } = useSubjects();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const upcomingEvents = getUpcomingEvents(30);

  const handleCreateEvent = (data: any) => {
    addEvent({
      title: data.title,
      type: data.type,
      date: data.date,
      time: data.time,
      subjectId: data.subjectId,
      subjectName: data.subjectId ? subjects.find(s => s.id === data.subjectId)?.name : undefined,
      description: data.description,
    });
    setIsCreating(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Delete this event?')) {
      deleteEvent(id);
    }
  };

  const editingEvent = editingId ? events.find(e => e.id === editingId) : null;

  return (
    <div className={styles.calendarPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>📅 Calendar</h1>
          <button
            className={styles.createButton}
            onClick={() => setIsCreating(true)}
            disabled={isCreating || editingId !== null}
          >
            + New Event
          </button>
        </div>

        {(isCreating || editingId) && (
          <div className={styles.formSection}>
            <CalendarEventForm
              subjects={subjects}
              initialEvent={editingEvent}
              onSubmit={data => {
                if (editingId) {
                  updateEvent(editingId, data);
                  setEditingId(null);
                } else {
                  handleCreateEvent(data);
                }
              }}
              onCancel={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
            />
          </div>
        )}

        <div className={styles.upcomingSection}>
          <h2>Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <div className={styles.emptyState}>No upcoming events. Create one to get started!</div>
          ) : (
            <div className={styles.eventsList}>
              {upcomingEvents.slice(0, 10).map(({ event, displayDate }) => (
                <div key={event.id} className={styles.eventWrapper}>
                  <CalendarEventComponent
                    event={event}
                    onEdit={() => setEditingId(event.id)}
                    onDelete={() => handleDeleteEvent(event.id)}
                  />
                  <div className={styles.eventDate}>{displayDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
