import React from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { FoundationDemo } from './pages/FoundationDemo'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <FoundationDemo />
      </div>
    </ThemeProvider>
  )
}

export default App
