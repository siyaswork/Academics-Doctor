import type { ReactNode } from 'react'

function AuthGuarded({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (user) return <Navigate to="/dashboard" replace />
  return children
}
