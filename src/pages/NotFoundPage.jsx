import { Link } from 'react-router-dom'
import { EmptyState } from '../components/StatusViews.jsx'

export default function NotFoundPage() {
  return (
    <EmptyState title="Page not found.">
      <Link to="/" className="btn">Back to the shop</Link>
    </EmptyState>
  )
}
