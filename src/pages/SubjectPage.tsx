import { useParams } from 'react-router-dom'

export default function SubjectPageProtected() {
  const { subject } = useParams()
  return (
    <div>
      <h1>Subject (auth): {subject}</h1>
      <p>Placeholder for authenticated subject content.</p>
    </div>
  )
}
