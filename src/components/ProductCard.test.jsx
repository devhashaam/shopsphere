import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductCard from './ProductCard.jsx'
import Header from './Header.jsx'
import { renderWithProviders, sampleProduct } from '../test/renderWithProviders.jsx'

describe('ProductCard', () => {
  it('shows the product name, price, category and discount', () => {
    renderWithProviders(<ProductCard product={sampleProduct} />)
    expect(screen.getByRole('heading', { name: 'Wireless Earbuds' })).toBeInTheDocument()
    expect(screen.getByText('$49.99')).toBeInTheDocument()
    expect(screen.getByText('Mobile Accessories')).toBeInTheDocument()
    expect(screen.getByText('-13%')).toBeInTheDocument()
  })

  it('adds to the cart, updates the header badge, and stops at the stock limit', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(
      <>
        <Header />
        <ProductCard product={sampleProduct} />
      </>
    )
    const button = screen.getByRole('button', { name: 'Add Wireless Earbuds to cart' })

    await user.click(button)
    expect(screen.getByRole('link', { name: 'Cart, 1 item' })).toBeInTheDocument()
    expect(button).toHaveTextContent('In cart (1)')

    await user.click(button) // stock is 2
    expect(button).toBeDisabled()
    expect(store.getState().cart.items[7].quantity).toBe(2)
  })

  it('disables the button when the product is sold out', () => {
    renderWithProviders(<ProductCard product={{ ...sampleProduct, stock: 0 }} />)
    expect(screen.getByRole('button', { name: /add wireless earbuds/i })).toHaveTextContent('Sold out')
    expect(screen.getByRole('button', { name: /add wireless earbuds/i })).toBeDisabled()
  })
})
