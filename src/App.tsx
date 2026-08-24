import { ThemeProvider } from './contexts/ThemeContext'
import { DashboardLayout } from './components/DashboardLayout'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <DashboardLayout />
      </div>
    </ThemeProvider>
  )
}

export default App
