import { createSelector, createSlice } from '@reduxjs/toolkit'

// Items are keyed by product id so lookups and updates are O(1)
const initialState = { items: {} }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Redux Toolkit uses Immer, so "mutating" here produces a new immutable state
    addItem(state, { payload: product }) {
      const existing = state.items[product.id]
      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, existing.stock)
      } else if (product.stock > 0) {
        const { id, title, price, thumbnail, stock } = product
        state.items[id] = { id, title, price, thumbnail, stock, quantity: 1 }
      }
    },
    setQuantity(state, { payload: { id, quantity } }) {
      const item = state.items[id]
      if (!item) return
      if (quantity <= 0) delete state.items[id]
      else item.quantity = Math.min(quantity, item.stock)
    },
    removeItem(state, { payload: id }) {
      delete state.items[id]
    },
    clearCart(state) {
      state.items = {}
    },
  },
})

export const { addItem, setQuantity, removeItem, clearCart } = cartSlice.actions
export default cartSlice.reducer

// ----- Selectors (memoised: recomputed only when the cart changes) -----
const selectItemsMap = (state) => state.cart.items

export const selectCartItems = createSelector([selectItemsMap], (items) => Object.values(items))

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)
)

export const selectCartTotal = createSelector([selectCartItems], (items) =>
  Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100
)

export const selectQuantityInCart = (state, id) => state.cart.items[id]?.quantity ?? 0
