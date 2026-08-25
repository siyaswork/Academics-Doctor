import React, { useState, useEffect } from 'react';
import { UserPreferences, AppearancePreferences, WorkspacePreferences, StudyPreferences } from '../types/preferences';
import { storage } from '../utils/storage';

const defaultPreferences: UserPreferences = {
  appearance: {
    theme: 'system',
    reducedMotion: false,
  },
  workspace: {
    defaultNoteColor: '#FFE5B4',
    dashboardLayout: 'comfortable',
    hiddenDashboardSections: [],
    favoritesSectionEnabled: true,
  },
  study: {
    defaultStudyDuration: 30,
    sessionBeforeBreak: 25,
  },
  updatedAt: Date.now(),
};

const PreferencesContext = React.createContext<{
  preferences: UserPreferences;
  updateAppearance: (appearance: Partial<AppearancePreferences>) => void;
  updateWorkspace: (workspace: Partial<WorkspacePreferences>) => void;
  updateStudy: (study: Partial<StudyPreferences>) => void;
  resetPreferences: () => void;
} | null>(null);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    const saved = storage.get<UserPreferences>('preferences');
    if (saved) {
      setPreferences({ ...defaultPreferences, ...saved });
    }
  }, []);

  const updateAppearance = (appearance: Partial<AppearancePreferences>) => {
    const updated: UserPreferences = {
      ...preferences,
      appearance: { ...preferences.appearance, ...appearance },
      updatedAt: Date.now(),
    };
    storage.set('preferences', updated);
    setPreferences(updated);
  };

  const updateWorkspace = (workspace: Partial<WorkspacePreferences>) => {
    const updated: UserPreferences = {
      ...preferences,
      workspace: { ...preferences.workspace, ...workspace },
      updatedAt: Date.now(),
    };
    storage.set('preferences', updated);
    setPreferences(updated);
  };

  const updateStudy = (study: Partial<StudyPreferences>) => {
    const updated: UserPreferences = {
      ...preferences,
      study: { ...preferences.study, ...study },
      updatedAt: Date.now(),
    };
    storage.set('preferences', updated);
    setPreferences(updated);
  };

  const resetPreferences = () => {
    storage.set('preferences', defaultPreferences);
    setPreferences(defaultPreferences);
  };

  return (
    <PreferencesContext.Provider
      value={{ preferences, updateAppearance, updateWorkspace, updateStudy, resetPreferences }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = React.useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
};
