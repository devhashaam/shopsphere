import { useEffect, useState } from 'react'
import { useGetCategoriesQuery } from '../services/productsApi.js'
import useDebounce from '../hooks/useDebounce.js'

export const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating-desc', label: 'Top rated' },
  { value: 'title-asc', label: 'Name: A to Z' },
]

export default function Filters({ q, category, sort, onChange }) {
  const { data: categories = [] } = useGetCategoriesQuery()
  // Local state keeps typing instant; the URL (and the request) update after a pause
  const [text, setText] = useState(q)
  const debounced = useDebounce(text, 350)

  useEffect(() => {
    if (debounced !== q) onChange({ q: debounced.trim(), category: '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  // Keep the box in sync when the URL changes (back button, "clear filters")
  useEffect(() => setText(q), [q])

  return (
    <section className="filters" aria-label="Filter products">
      <div className="field field-search">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="search"
          placeholder="Search phones, laptops, shoes…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => {
            setText('')
            onChange({ category: e.target.value, q: '' })
          }}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="sort">Sort by</label>
        <select id="sort" value={sort} onChange={(e) => onChange({ sort: e.target.value })}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  )
}
