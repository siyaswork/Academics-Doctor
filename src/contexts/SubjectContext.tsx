import React, { useState, useEffect } from 'react';
import { Subject } from '../types/subject';
import { storage } from '../utils/storage';
import { generateId } from '../utils/id';
import { DEFAULT_SUBJECTS } from '../utils/constants';

const SubjectContext = React.createContext<{
  subjects: Subject[];
  addSubject: (name: string, color: string, description?: string) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  getSubjectById: (id: string) => Subject | undefined;
  isLoading: boolean;
} | null>(null);

export const SubjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedSubjects = storage.get<Subject[]>('subjects');
    if (savedSubjects && savedSubjects.length > 0) {
      setSubjects(savedSubjects);
    } else {
      const defaultSubjects: Subject[] = DEFAULT_SUBJECTS.map(s => ({
        id: generateId(),
        name: s.name,
        accentColor: s.color,
        notesCount: 0,
        researchCount: 0,
        workCount: 0,
        formulasCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }));
      storage.set('subjects', defaultSubjects);
      setSubjects(defaultSubjects);
    }
    setIsLoading(false);
  }, []);

  const addSubject = (name: string, color: string, description?: string): Subject => {
    const newSubject: Subject = {
      id: generateId(),
      name,
      description,
      accentColor: color,
      notesCount: 0,
      researchCount: 0,
      workCount: 0,
      formulasCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [...subjects, newSubject];
    storage.set('subjects', updated);
    setSubjects(updated);
    return newSubject;
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    const updated = subjects.map(s =>
      s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
    );
    storage.set('subjects', updated);
    setSubjects(updated);
  };

  const deleteSubject = (id: string) => {
    const updated = subjects.filter(s => s.id !== id);
    storage.set('subjects', updated);
    setSubjects(updated);
  };

  const getSubjectById = (id: string) => subjects.find(s => s.id === id);

  return (
    <SubjectContext.Provider
      value={{ subjects, addSubject, updateSubject, deleteSubject, getSubjectById, isLoading }}
    >
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubjects = () => {
  const context = React.useContext(SubjectContext);
  if (!context) {
    throw new Error('useSubjects must be used within SubjectProvider');
  }
  return context;
};
