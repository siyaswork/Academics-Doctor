import React, { useState, useEffect } from 'react';
import { StudentProfile, ProfileSettings } from '../types/profile';
import { storage } from '../utils/storage';
import { generateId } from '../utils/id';

const ProfileContext = React.createContext<{
  profile: StudentProfile | null;
  updateProfile: (settings: ProfileSettings) => void;
  isLoading: boolean;
} | null>(null);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedProfile = storage.get<StudentProfile>('profile');
    if (savedProfile) {
      setProfile(savedProfile);
    } else {
      const newProfile: StudentProfile = {
        id: generateId(),
        displayName: 'Student',
        preferredSubjects: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      storage.set('profile', newProfile);
      setProfile(newProfile);
    }
    setIsLoading(false);
  }, []);

  const updateProfile = (settings: ProfileSettings) => {
    if (!profile) return;
    const updated: StudentProfile = {
      ...profile,
      ...settings,
      updatedAt: Date.now(),
    };
    storage.set('profile', updated);
    setProfile(updated);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = React.useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
};
