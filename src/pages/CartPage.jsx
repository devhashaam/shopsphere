import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearCart,
  removeItem,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  setQuantity,
} from '../features/cart/cartSlice.js'
import { formatPrice } from '../utils/format.js'
import QuantityStepper from '../components/QuantityStepper.jsx'
import { EmptyState } from '../components/StatusViews.jsx'

export const FREE_SHIPPING_FROM = 100
export const SHIPPING_FEE = 9.99

export default function CartPage() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const count = useSelector(selectCartCount)
  const subtotal = useSelector(selectCartTotal)
  const [ordered, setOrdered] = useState(false)

  useEffect(() => {
    document.title = 'Your cart | ShopSphere'
  }, [])

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE
  const total = subtotal + shipping

  if (ordered) {
    return (
      <EmptyState title="Order placed! 🎉">
        <p>This is a demo, so nothing was charged or shipped.</p>
        <Link to="/" className="btn">Keep shopping</Link>
      </EmptyState>
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState title="Your cart is empty.">
        <Link to="/" className="btn">Start shopping</Link>
      </EmptyState>
    )
  }

  return (
    <div className="cart-page">
      <section aria-labelledby="cart-title">
        <div className="cart-head">
          <h1 id="cart-title">Your cart ({count})</h1>
          <button type="button" className="link-btn" onClick={() => dispatch(clearCart())}>
            Remove all
          </button>
        </div>
        <ul className="cart-list">
          {items.map((item) => (
            <li key={item.id} className="cart-item">
              <img src={item.thumbnail} alt="" width="88" height="88" loading="lazy" />
              <div className="cart-item-info">
                <Link to={`/product/${item.id}`} className="cart-item-title">{item.title}</Link>
                <span className="muted">{formatPrice(item.price)} each</span>
                <button type="button" className="link-btn" onClick={() => dispatch(removeItem(item.id))}>
                  Remove
                </button>
              </div>
              <QuantityStepper
                value={item.quantity}
                max={item.stock}
                label={item.title}
                onChange={(quantity) => dispatch(setQuantity({ id: item.id, quantity }))}
              />
              <span className="line-total">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
      </section>

      <aside className="summary" aria-labelledby="summary-title">
        <h2 id="summary-title">Order summary</h2>
        <dl>
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
          <dt>Shipping</dt>
          <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
          <dt className="total">Total</dt>
          <dd className="total" data-testid="order-total">{formatPrice(total)}</dd>
        </dl>
        {shipping > 0 && (
          <p className="muted">Add {formatPrice(FREE_SHIPPING_FROM - subtotal)} more for free shipping.</p>
        )}
        <button
          type="button"
          className="btn btn-big"
          onClick={() => {
            dispatch(clearCart())
            setOrdered(true)
          }}
        >
          Place order
        </button>
      </aside>
    </div>
  )
}
