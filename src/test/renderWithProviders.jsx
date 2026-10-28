import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { makeStore } from '../app/store.js'
import { ROUTER_FUTURE } from '../app/router.js'

// Renders a component with its own Redux store and router, so tests never share state
export function renderWithProviders(ui, { preloadedState, route = '/' } = {}) {
  const store = makeStore(preloadedState ?? { cart: { items: {} } })
  const result = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]} future={ROUTER_FUTURE}>{ui}</MemoryRouter>
    </Provider>
  )
  return { store, ...result }
}

export const sampleProduct = {
  id: 7,
  title: 'Wireless Earbuds',
  price: 49.99,
  category: 'mobile-accessories',
  thumbnail: 'https://example.com/earbuds.webp',
  rating: 4.4,
  stock: 2,
  discountPercentage: 12.5,
}
