import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h1>404 — Page not found</h1>
      <p>The page you requested was not found.</p>
      <p><Link to="/">Back to Home</Link></p>
    </div>
  )
}
