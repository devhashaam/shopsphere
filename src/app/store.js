import { configureStore } from '@reduxjs/toolkit'
import { productsApi } from '../services/productsApi.js'
import cartReducer from '../features/cart/cartSlice.js'

const CART_KEY = 'shopsphere-cart'

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY))
    return saved && typeof saved.items === 'object' ? saved : undefined
  } catch {
    return undefined
  }
}

// A factory (not a singleton) so every test can start from its own clean store
export function makeStore(preloadedState) {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      [productsApi.reducerPath]: productsApi.reducer,
    },
    preloadedState: preloadedState ?? { cart: loadCart() },
    middleware: (getDefault) => getDefault().concat(productsApi.middleware),
  })

  // Persist only the cart, and only when it actually changes
  let lastCart = store.getState().cart
  store.subscribe(() => {
    const { cart } = store.getState()
    if (cart === lastCart) return
    lastCart = cart
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
    } catch {
      /* storage blocked or full: the cart still works for this visit */
    }
  })

  return store
}
