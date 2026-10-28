// Shows: first, last, current and its neighbours, with "…" for gaps
export function pageList(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ['…', p] : [p]))
}

export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null

  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" onClick={() => onPage(page - 1)} disabled={page === 1}>
        ← Prev
      </button>
      {pageList(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="gap" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            type="button"
            key={p}
            onClick={() => onPage(p)}
            aria-current={p === page ? 'page' : undefined}
            aria-label={`Page ${p}`}
          >
            {p}
          </button>
        )
      )}
      <button type="button" onClick={() => onPage(page + 1)} disabled={page === totalPages}>
        Next →
      </button>
    </nav>
  )
}
