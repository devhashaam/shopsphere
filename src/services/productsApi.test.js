import { describe, expect, it } from 'vitest'
import { productsUrl } from './productsApi.js'
import { pageList } from '../components/Pagination.jsx'

describe('productsUrl', () => {
  const parse = (url) => {
    const [path, query] = url.split('?')
    return { path, params: Object.fromEntries(new URLSearchParams(query)) }
  }

  it('builds the default listing URL with page size and offset', () => {
    const { path, params } = parse(productsUrl({ page: 3 }))
    expect(path).toBe('/products')
    expect(params).toMatchObject({ limit: '12', skip: '24' })
  })

  it('uses the search endpoint when there is a query, even if a category is set', () => {
    const { path, params } = parse(productsUrl({ q: 'phone', category: 'laptops' }))
    expect(path).toBe('/products/search')
    expect(params.q).toBe('phone')
  })

  it('uses the category endpoint and passes sorting', () => {
    const { path, params } = parse(productsUrl({ category: 'mens-shoes', sort: 'price-desc' }))
    expect(path).toBe('/products/category/mens-shoes')
    expect(params).toMatchObject({ sortBy: 'price', order: 'desc' })
  })
})

describe('pageList', () => {
  it('shows neighbours of the current page with gaps', () => {
    expect(pageList(5, 17)).toEqual([1, '…', 4, 5, 6, '…', 17])
  })

  it('has no gaps when pages are contiguous', () => {
    expect(pageList(2, 4)).toEqual([1, 2, 3, 4])
  })
})
