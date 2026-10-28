import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCartCount } from '../features/cart/cartSlice.js'

export default function Header() {
  const count = useSelector(selectCartCount)

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          Shop<span>Sphere</span>
        </Link>
        <nav aria-label="Main">
          <NavLink to="/" end>
            Shop
          </NavLink>
          <NavLink to="/cart" className="cart-link" aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}>
            🛒 Cart <span className="badge">{count}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
