import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultWorkspacePrefs, type WorkspaceMode, type WorkspacePrefs } from '../types/workspace'
import { STORAGE_KEYS, readJSON, writeJSON } from '../utils/storage'

interface WorkspacePrefsContextType extends WorkspacePrefs {
  setMode: (mode: WorkspaceMode) => void
  toggleSplit: () => void
  toggleGrid: () => void
  toggleSnap: () => void
}

const WorkspacePrefsContext = createContext<WorkspacePrefsContextType | undefined>(undefined)

export const WorkspacePrefsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prefs, setPrefs] = useState<WorkspacePrefs>(() =>
    readJSON<WorkspacePrefs>(STORAGE_KEYS.workspacePrefs, defaultWorkspacePrefs),
  )

  useEffect(() => {
    writeJSON(STORAGE_KEYS.workspacePrefs, prefs)
  }, [prefs])

  const setMode = useCallback((mode: WorkspaceMode) => setPrefs((prev) => ({ ...prev, mode })), [])
  const toggleSplit = useCallback(() => setPrefs((prev) => ({ ...prev, splitEnabled: !prev.splitEnabled })), [])
  const toggleGrid = useCallback(() => setPrefs((prev) => ({ ...prev, gridEnabled: !prev.gridEnabled })), [])
  const toggleSnap = useCallback(() => setPrefs((prev) => ({ ...prev, snapEnabled: !prev.snapEnabled })), [])

  const value = useMemo<WorkspacePrefsContextType>(
    () => ({ ...prefs, setMode, toggleSplit, toggleGrid, toggleSnap }),
    [prefs, setMode, toggleSplit, toggleGrid, toggleSnap],
  )

  return <WorkspacePrefsContext.Provider value={value}>{children}</WorkspacePrefsContext.Provider>
}

export const useWorkspacePrefs = () => {
  const context = useContext(WorkspacePrefsContext)
  if (!context) throw new Error('useWorkspacePrefs must be used within WorkspacePrefsProvider')
  return context
}
