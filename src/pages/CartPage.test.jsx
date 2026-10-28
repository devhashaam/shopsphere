import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CartPage from './CartPage.jsx'
import { renderWithProviders } from '../test/renderWithProviders.jsx'

const cartWith = (...items) => ({
  cart: { items: Object.fromEntries(items.map((i) => [i.id, i])) },
})
const mug = { id: 3, title: 'Coffee Mug', price: 12, thumbnail: 'm.webp', stock: 5, quantity: 2 }
const lamp = { id: 4, title: 'Desk Lamp', price: 85, thumbnail: 'l.webp', stock: 1, quantity: 1 }

describe('CartPage', () => {
  it('shows an empty state when there is nothing in the cart', () => {
    renderWithProviders(<CartPage />)
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Start shopping' })).toBeInTheDocument()
  })

  it('adds shipping under $100 and makes it free once the subtotal reaches $100', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CartPage />, { preloadedState: cartWith(mug) })

    // 2 × $12 = $24 + $9.99 shipping
    expect(screen.getByTestId('order-total')).toHaveTextContent('$33.99')
    expect(screen.getByText(/more for free shipping/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Increase Coffee Mug' }))
    expect(screen.getByTestId('order-total')).toHaveTextContent('$45.99')
  })

  it('applies free shipping and caps quantity at stock', () => {
    renderWithProviders(<CartPage />, { preloadedState: cartWith(mug, lamp) })
    // $24 + $85 = $109, free shipping
    expect(screen.getByTestId('order-total')).toHaveTextContent('$109.00')
    expect(screen.getByRole('button', { name: 'Increase Desk Lamp' })).toBeDisabled()
  })

  it('removes an item, then shows a confirmation after placing the order', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<CartPage />, { preloadedState: cartWith(mug, lamp) })

    await user.click(screen.getAllByRole('button', { name: 'Remove' })[0])
    expect(screen.getByRole('heading', { name: 'Your cart (1)' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Place order' }))
    expect(screen.getByText('Order placed! 🎉')).toBeInTheDocument()
    expect(store.getState().cart.items).toEqual({})
  })
})
