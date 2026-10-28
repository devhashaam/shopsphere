import { useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PAGE_SIZE, useGetProductsQuery } from '../services/productsApi.js'
import Filters from '../components/Filters.jsx'
import Pagination from '../components/Pagination.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { EmptyState, ErrorState, GridSkeleton } from '../components/StatusViews.jsx'

export default function CatalogPage() {
  // The URL is the source of truth for filters, so results are shareable and the back button works
  const [params, setParams] = useSearchParams()
  const filters = {
    q: params.get('q') ?? '',
    category: params.get('category') ?? '',
    sort: params.get('sort') ?? '',
    page: Math.max(1, Number(params.get('page')) || 1),
  }

  const { data, isLoading, isFetching, isError, refetch } = useGetProductsQuery(filters)
  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0

  const update = useCallback(
    (patch) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev)
        Object.entries(patch).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)))
        if (!('page' in patch)) next.delete('page') // a new filter starts again at page 1
        return next
      })
    },
    [setParams]
  )

  useEffect(() => {
    document.title = filters.q ? `"${filters.q}" | ShopSphere` : 'ShopSphere | React + Redux Toolkit Store'
  }, [filters.q])

  const goToPage = (page) => {
    update({ page: page > 1 ? String(page) : '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <section className="hero">
        <h1>Find something you'll love</h1>
        <p>194 products across 24 categories. Search, filter and sort, all on the server.</p>
      </section>

      <Filters q={filters.q} category={filters.category} sort={filters.sort} onChange={update} />

      <p className="result-count" aria-live="polite">
        {data && `${data.total} product${data.total === 1 ? '' : 's'}${filters.q ? ` for "${filters.q}"` : ''}`}
        {isFetching && !isLoading && <span className="updating"> · updating…</span>}
      </p>

      {isLoading ? (
        <GridSkeleton />
      ) : isError ? (
        <ErrorState message="We couldn't load the products." onRetry={refetch} />
      ) : data.products.length === 0 ? (
        <EmptyState title="No products match your search.">
          <button type="button" className="btn btn-ghost" onClick={() => update({ q: '', category: '', sort: '' })}>
            Clear filters
          </button>
        </EmptyState>
      ) : (
        // Dim old results while new ones load, instead of flashing a skeleton
        <div className="grid" style={{ opacity: isFetching ? 0.6 : 1 }}>
          {data.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <Pagination page={filters.page} totalPages={totalPages} onPage={goToPage} />
    </>
  )
}
