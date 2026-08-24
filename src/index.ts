// Components
export { Button } from './components/Button'
export type { ButtonProps } from './components/Button.interface'

export { Card } from './components/Card'
export type { CardProps } from './components/Card.interface'

export { Input } from './components/Input'
export type { InputProps } from './components/Input.interface'

export { Select } from './components/Select'
export type { SelectProps } from './components/Select.interface'

export { Badge } from './components/Badge'
export type { BadgeProps } from './components/Badge.interface'

export { Tabs } from './components/Tabs'
export type { TabsProps } from './components/Tabs.interface'

export { Modal } from './components/Modal'
export type { ModalProps } from './components/Modal.interface'

export { Alert } from './components/Alert'
export type { AlertProps } from './components/Alert.interface'

export { Spinner } from './components/Spinner'
export type { SpinnerProps } from './components/Spinner.interface'

export { ThemeToggle } from './components/ThemeToggle'

// Dashboard
export { DashboardLayout } from './components/DashboardLayout'
export { DashboardSidebar } from './components/DashboardSidebar'
export { MobileNavigation } from './components/MobileNavigation'
export { DashboardHeader } from './components/DashboardHeader'
export { ContinueCard } from './components/ContinueCard'
export { QuickActions } from './components/QuickActions'
export { WorkspaceCard } from './components/WorkspaceCard'
export { EmptyState } from './components/EmptyState'
export type { WorkItem, ContinueItem, DashboardUser, WorkItemType, SubjectType } from './types/dashboard'

// Layouts
export { MainLayout } from './layouts/MainLayout'
export type { MainLayoutProps } from './layouts/MainLayout.interface'

// Contexts
export { ThemeProvider, useTheme } from './contexts/ThemeContext'
export type { ThemeContextType } from './contexts/ThemeContext'
