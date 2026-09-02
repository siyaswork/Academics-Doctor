import { NavLink, Outlet } from 'react-router-dom'
import type { FC } from 'react'

export const PublicLayout: FC = () => {
  return (
    <div>
      <header style={{ padding: 16, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <NavLink to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>Academics Doctor</NavLink>
        </div>

        <nav style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <NavLink to="/" end style={{ textDecoration: 'none' }}>Home</NavLink>
          <NavLink to="/subjects" style={{ textDecoration: 'none' }}>Subjects</NavLink>
          <NavLink to="/how-it-works" style={{ textDecoration: 'none' }}>How It Works</NavLink>
          <NavLink to="/pricing" style={{ textDecoration: 'none' }}>Pricing</NavLink>
          <NavLink to="/about" style={{ textDecoration: 'none' }}>About</NavLink>
        </nav>

        <div style={{ display: 'flex', gap: 8 }}>
          <NavLink to="/login">Log In</NavLink>
          <NavLink to="/signup">Start Learning</NavLink>
        </div>
      </header>

      <main style={{ padding: 16 }}>
        <Outlet />
      </main>

      <footer style={{ padding: 20, borderTop: '1px solid #eee', marginTop: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <div>
            <strong>Product</strong>
            <div><NavLink to="/subjects">Subjects</NavLink></div>
            <div><NavLink to="/how-it-works">How It Works</NavLink></div>
            <div><NavLink to="/pricing">Pricing</NavLink></div>
          </div>

          <div>
            <strong>Company</strong>
            <div><NavLink to="/about">About</NavLink></div>
            <div><NavLink to="/contact">Contact</NavLink></div>
          </div>

          <div>
            <strong>Legal</strong>
            <div><NavLink to="/terms">Terms</NavLink></div>
            <div><NavLink to="/privacy">Privacy</NavLink></div>
            <div><NavLink to="/refund-policy">Refund Policy</NavLink></div>
          </div>

          <div>
            <strong>Account</strong>
            <div><NavLink to="/login">Log In</NavLink></div>
            <div><NavLink to="/signup">Sign Up</NavLink></div>
          </div>
        </div>

        <div style={{ marginTop: 12, color: 'var(--color-text-secondary)' }}>
          © {new Date().getFullYear()} Academics Doctor — All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout
