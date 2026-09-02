import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export const PublicLayout: React.FC = () => {
  return (
    <div>
      <header style={{ padding: 16, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <NavLink to="/" style={{ fontWeight: 'bold', textDecoration: 'none' }}>🩺 Academics Doctor</NavLink>
        </div>
        <nav style={{ display: 'flex', gap: 12 }}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/subjects">Subjects</NavLink>
          <NavLink to="/how-it-works">How It Works</NavLink>
          <NavLink to="/pricing">Pricing</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <div style={{ display: 'flex', gap: 8 }}>
          <NavLink to="/login">Log In</NavLink>
          <NavLink to="/signup">Start Learning</NavLink>
        </div>
      </header>

      <main style={{ padding: 16 }}>
        <Outlet />
      </main>

      <footer style={{ padding: 16, borderTop: '1px solid #eee', marginTop: 24 }}>
        © Academics Doctor
      </footer>
    </div>
  )
}
export default PublicLayout
