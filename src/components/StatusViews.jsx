// Small presentational components for the loading / error / empty states every data view needs

export function GridSkeleton({ count = 8 }) {
  return (
    <div className="grid" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card skeleton" />
      ))}
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="state" role="alert">
      <p className="state-title">{message}</p>
      <p>Check your connection and try again.</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, children }) {
  return (
    <div className="state">
      <p className="state-title">{title}</p>
      {children}
    </div>
  )
}
