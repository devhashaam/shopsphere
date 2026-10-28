import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const PAGE_SIZE = 12

const FIELDS = 'title,price,category,thumbnail,rating,stock,discountPercentage,brand'

// The API can search OR filter by category, not both, so the URL depends on which is set
export function productsUrl({ q = '', category = '', sort = '', page = 1 }) {
  const params = new URLSearchParams({
    limit: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
    select: FIELDS,
  })
  if (q) params.set('q', q)
  if (sort) {
    const [sortBy, order] = sort.split('-')
    params.set('sortBy', sortBy)
    params.set('order', order)
  }
  const path = q ? '/products/search' : category ? `/products/category/${encodeURIComponent(category)}` : '/products'
  return `${path}?${params}`
}

// RTK Query: caching, de-duplicated requests and loading/error state for free
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com' }),
  keepUnusedDataFor: 300, // seconds
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (filters) => productsUrl(filters),
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
    }),
    getCategories: builder.query({
      query: () => '/products/categories',
      keepUnusedDataFor: 3600,
    }),
  }),
})

export const { useGetProductsQuery, useGetProductQuery, useGetCategoriesQuery, usePrefetch } = productsApi
