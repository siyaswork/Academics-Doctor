import React, { useState } from 'react';
import { useSubjects } from '../../contexts/SubjectContext';
import { SubjectCard } from '../../components/Subject/SubjectCard';
import { SubjectForm } from '../../components/Subject/SubjectForm';
import { COLORS } from '../../utils/constants';
import styles from './SubjectsPage.module.css';

export const SubjectsPage: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject } = useSubjects();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSubject = (name: string, description: string, color: string) => {
    addSubject(name, color, description);
    setIsCreating(false);
  };

  const handleUpdateSubject = (id: string, name: string, description: string, color: string) => {
    updateSubject(id, { name, description, accentColor: color });
    setEditingId(null);
  };

  const handleDeleteSubject = (id: string) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      deleteSubject(id);
    }
  };

  const editingSubject = editingId ? subjects.find(s => s.id === editingId) : null;

  return (
    <div className={styles.subjectsPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>My Subjects</h1>
          <button
            className={styles.createButton}
            onClick={() => setIsCreating(true)}
            disabled={isCreating || editingId !== null}
          >
            + New Subject
          </button>
        </div>

        {(isCreating || editingId) && (
          <div className={styles.formSection}>
            <SubjectForm
              initialName={editingSubject?.name}
              initialDescription={editingSubject?.description}
              initialColor={editingSubject?.accentColor}
              onSubmit={(name, description, color) => {
                if (editingId) {
                  handleUpdateSubject(editingId, name, description, color);
                } else {
                  handleCreateSubject(name, description, color);
                }
              }}
              onCancel={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
            />
          </div>
        )}

        {subjects.length > 0 && (
          <div className={styles.searchSection}>
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        )}

        {filteredSubjects.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📚</div>
            <p>No subjects yet</p>
            <button onClick={() => setIsCreating(true)} className={styles.createLink}>
              Create your first subject
            </button>
          </div>
        ) : (
          <div className={styles.subjectsGrid}>
            {filteredSubjects.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onEdit={() => setEditingId(subject.id)}
                onDelete={() => handleDeleteSubject(subject.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
