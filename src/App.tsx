import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotesProvider } from './contexts/NotesContext'
import { FormulaProvider } from './contexts/FormulaContext'
import { CalculatorProvider } from './contexts/CalculatorContext'
import { WorkspacePrefsProvider } from './contexts/WorkspacePrefsContext'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { NotesListPage } from './pages/NotesListPage'
import { NoteDetailPage } from './pages/NoteDetailPage'
import { ResearchPage } from './pages/ResearchPage'
import { MyWorkPage } from './pages/MyWorkPage'
import { StudyWorkspace } from './components/StudyWorkspace'

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NotesProvider>
        <FormulaProvider>
          <CalculatorProvider>
            <WorkspacePrefsProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="notes" element={<NotesListPage />} />
                    <Route path="notes/:id" element={<NoteDetailPage />} />
                    <Route path="research" element={<ResearchPage />} />
                    <Route path="my-work" element={<MyWorkPage />} />
                    <Route path="workspace" element={<StudyWorkspace />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </WorkspacePrefsProvider>
          </CalculatorProvider>
        </FormulaProvider>
      </NotesProvider>
    </ThemeProvider>
  )
}
