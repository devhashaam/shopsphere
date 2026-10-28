import { describe, expect, it } from 'vitest'
import reducer, {
  addItem,
  clearCart,
  removeItem,
  selectCartCount,
  selectCartTotal,
  setQuantity,
} from './cartSlice.js'

const phone = { id: 1, title: 'Phone', price: 199.99, thumbnail: 'p.webp', stock: 3 }
const case_ = { id: 2, title: 'Case', price: 10.5, thumbnail: 'c.webp', stock: 10 }
const asState = (cart) => ({ cart })

describe('cart slice', () => {
  it('adds a new product with quantity 1', () => {
    const state = reducer(undefined, addItem(phone))
    expect(state.items[1]).toMatchObject({ id: 1, title: 'Phone', quantity: 1 })
  })

  it('increments an existing product but never above its stock', () => {
    let state = reducer(undefined, addItem(phone))
    state = reducer(state, addItem(phone))
    state = reducer(state, addItem(phone))
    state = reducer(state, addItem(phone)) // 4th add, stock is 3
    expect(state.items[1].quantity).toBe(3)
  })

  it('does not add a product that is out of stock', () => {
    const state = reducer(undefined, addItem({ ...phone, stock: 0 }))
    expect(state.items).toEqual({})
  })

  it('sets a quantity, capped at stock, and removes the item at 0', () => {
    let state = reducer(undefined, addItem(case_))
    state = reducer(state, setQuantity({ id: 2, quantity: 50 }))
    expect(state.items[2].quantity).toBe(10)
    state = reducer(state, setQuantity({ id: 2, quantity: 0 }))
    expect(state.items[2]).toBeUndefined()
  })

  it('removes one item and clears the whole cart', () => {
    let state = reducer(undefined, addItem(phone))
    state = reducer(state, addItem(case_))
    state = reducer(state, removeItem(1))
    expect(Object.keys(state.items)).toEqual(['2'])
    state = reducer(state, clearCart())
    expect(state.items).toEqual({})
  })

  it('calculates the item count and total, rounded to cents', () => {
    let state = reducer(undefined, addItem(phone))
    state = reducer(state, addItem(case_))
    state = reducer(state, setQuantity({ id: 2, quantity: 3 }))
    expect(selectCartCount(asState(state))).toBe(4)
    expect(selectCartTotal(asState(state))).toBe(231.49) // 199.99 + 3 × 10.50
  })
})
