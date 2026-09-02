import { useParams } from 'react-router-dom'

export default function LearnPage() {
  const { subject, topic } = useParams()
  return (
    <div>
      <h1>Learn: {subject} — {topic}</h1>
      <p>Protected learning content (placeholder). Ensure subscription checks are enforced inside this page.</p>
    </div>
  )
}
