import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotesProvider } from './contexts/NotesContext'
import { FormulaProvider } from './contexts/FormulaContext'
import { CalculatorProvider } from './contexts/CalculatorContext'
import { WorkspacePrefsProvider } from './contexts/WorkspacePrefsContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

// Layouts
import { PublicLayout } from './components/PublicLayout'
import { Layout as DashboardLayout } from './components/Layout'

// Public pages
import Home from './pages/public/Home'
import HowItWorks from './pages/public/HowItWorks'
import Pricing from './pages/public/Pricing'
import About from './pages/public/About'
import Contact from './pages/public/Contact'
import Terms from './pages/public/Terms'
import Privacy from './pages/public/Privacy'
import RefundPolicy from './pages/public/RefundPolicy'
import NotFound from './pages/NotFound'

// Auth
import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'
import { ForgotPassword } from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

// Protected/student pages
import { Dashboard } from './pages/Dashboard'
import { MyWorkPage } from './pages/MyWorkPage'
import { NotesListPage } from './pages/NotesListPage'
import { NoteDetailPage } from './pages/NoteDetailPage'
import SubjectsPage from './pages/SubjectsPage'
import SubjectPage from './pages/SubjectPage'
import LearnPage from './pages/LearnPage'
import SearchPage from './pages/SearchPage'
import AccountPage from './pages/AccountPage'
import SettingsPage from './pages/SettingsPage'
import BillingPage from './pages/BillingPage'

function AuthGuarded({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

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
                    {/* Public site */}
                    <Route path="/" element={<PublicLayout />}>
                      <Route index element={<Home />} />
                      <Route path="how-it-works" element={<HowItWorks />} />
                      <Route path="pricing" element={<Pricing />} />
                      <Route path="about" element={<About />} />
                      <Route path="contact" element={<Contact />} />
                      <Route path="terms" element={<Terms />} />
                      <Route path="privacy" element={<Privacy />} />
                      <Route path="refund-policy" element={<RefundPolicy />} />
                      <Route path="login" element={<AuthGuarded><Login /></AuthGuarded>} />
                      <Route path="signup" element={<AuthGuarded><Signup /></AuthGuarded>} />
                      <Route path="forgot-password" element={<ForgotPassword />} />
                      <Route path="reset-password" element={<ResetPassword />} />
                    </Route>

                    {/* Protected student app — uses DashboardLayout shell */}
                    <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="subjects" element={<SubjectsPage />} />
                      <Route path="subjects/:subject" element={<SubjectPage />} />
                      <Route path="learn/:subject/:topic" element={<LearnPage />} />
                      <Route path="my-work" element={<MyWorkPage />} />
                      <Route path="notes" element={<NotesListPage />} />
                      <Route path="notes/:noteId" element={<NoteDetailPage />} />
                      <Route path="search" element={<SearchPage />} />
                      <Route path="account" element={<AccountPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                      <Route path="billing" element={<BillingPage />} />
                    </Route>

                    {/* Catch-all 404 */}
                    <Route path="*" element={<NotFound />} />
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
