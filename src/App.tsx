import { useMemo } from 'react'
import { MobileNav } from './components/MobileNav'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { CommandMenu } from './components/CommandMenu'
import { GlobalSearch } from './components/GlobalSearch'
import { CalculatorPage } from './components/CalculatorPage'
import { CalendarPage } from './components/CalendarPage'
import { DashboardPage } from './components/DashboardPage'
import { FavoritesPage } from './components/FavoritesPage'
import { FormulasPage } from './components/FormulasPage'
import { MyWorkPage } from './components/MyWorkPage'
import { NotesPage } from './components/NotesPage'
import { ResearchPage } from './components/ResearchPage'
import { SettingsPage } from './components/SettingsPage'
import { StudySessionsPage } from './components/StudySessionsPage'
import { SubjectDetailPage } from './components/SubjectDetailPage'
import { SubjectsPage } from './components/SubjectsPage'
import { useAppContext } from './contexts/AppContext'
import styles from './App.module.css'

const App = () => {
  const { activeSection, searchOpen, commandMenuOpen } = useAppContext()

  const content = useMemo(() => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage />
      case 'notes':
        return <NotesPage />
      case 'research':
        return <ResearchPage />
      case 'work':
        return <MyWorkPage />
      case 'subjects':
        return <SubjectsPage />
      case 'subject-detail':
        return <SubjectDetailPage />
      case 'formulas':
        return <FormulasPage />
      case 'calculator':
        return <CalculatorPage />
      case 'study-sessions':
        return <StudySessionsPage />
      case 'calendar':
        return <CalendarPage />
      case 'favorites':
        return <FavoritesPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <DashboardPage />
    }
  }, [activeSection])

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainShell}>
        <TopBar />
        <main className={styles.mainContent} role="main">
          {content}
        </main>
      </div>
      <MobileNav />
      {searchOpen && <GlobalSearch />}
      {commandMenuOpen && <CommandMenu />}
    </div>
  )
}

export default App
