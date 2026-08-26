# Updated App with Auth wiring
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
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'
import { ForgotPassword } from './pages/auth/ForgotPassword'

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotesProvider>
          <FormulaProvider>
            <CalculatorProvider>
              <WorkspacePrefsProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
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
      </AuthProvider>
    </ThemeProvider>
  )
}
