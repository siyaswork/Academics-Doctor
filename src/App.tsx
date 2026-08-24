import React from 'react'
import { DashboardLayout } from './components/DashboardLayout'
import { NotesProvider } from './contexts/NotesContext'
import { ThemeProvider } from './contexts/ThemeContext'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <NotesProvider>
        <div className="app-container">
          <DashboardLayout />
        </div>
      </NotesProvider>
    </ThemeProvider>
  )
}

export default App
