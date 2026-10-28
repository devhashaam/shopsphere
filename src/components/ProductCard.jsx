import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, selectQuantityInCart } from '../features/cart/cartSlice.js'
import { usePrefetch } from '../services/productsApi.js'
import { formatPrice, humanize } from '../utils/format.js'
import Rating from './Rating.jsx'

// memo: a card re-renders only when its own product (or cart quantity) changes
function ProductCard({ product }) {
  const dispatch = useDispatch()
  const inCart = useSelector((state) => selectQuantityInCart(state, product.id))
  const prefetchProduct = usePrefetch('getProduct')
  const soldOut = product.stock === 0
  const maxedOut = inCart >= product.stock

  return (
    <article className="card">
      <Link
        to={`/product/${product.id}`}
        className="card-link"
        // Start loading the detail page as soon as the user shows intent
        onMouseEnter={() => prefetchProduct(product.id)}
        onFocus={() => prefetchProduct(product.id)}
      >
        <div className="card-media">
          <img src={product.thumbnail} alt="" width="300" height="300" loading="lazy" decoding="async" />
          {product.discountPercentage >= 10 && (
            <span className="discount">-{Math.round(product.discountPercentage)}%</span>
          )}
        </div>
        <p className="card-category">{humanize(product.category)}</p>
        <h3 className="card-title">{product.title}</h3>
      </Link>
      <Rating value={product.rating} />
      <div className="card-foot">
        <span className="price">{formatPrice(product.price)}</span>
        <button
          type="button"
          className="btn btn-small"
          onClick={() => dispatch(addItem(product))}
          disabled={soldOut || maxedOut}
          aria-label={`Add ${product.title} to cart`}
        >
          {soldOut ? 'Sold out' : inCart ? `In cart (${inCart})` : 'Add to cart'}
        </button>
      </div>
    </article>
  )
}

export default memo(ProductCard)
