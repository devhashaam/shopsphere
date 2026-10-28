import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useGetProductQuery } from '../services/productsApi.js'
import { addItem, selectQuantityInCart } from '../features/cart/cartSlice.js'
import { formatPrice, humanize } from '../utils/format.js'
import Rating from '../components/Rating.jsx'
import { ErrorState } from '../components/StatusViews.jsx'

export default function ProductPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { data: product, isLoading, isError, error, refetch } = useGetProductQuery(id)
  const inCart = useSelector((state) => selectQuantityInCart(state, Number(id)))
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    setActiveImage(0)
    if (product) document.title = `${product.title} | ShopSphere`
  }, [product])

  if (isLoading) return <div className="skeleton-block" aria-busy="true" aria-label="Loading product" />

  if (isError) {
    return error?.status === 404 ? (
      <div className="state">
        <p className="state-title">Product not found.</p>
        <Link to="/" className="btn">Back to the shop</Link>
      </div>
    ) : (
      <ErrorState message="We couldn't load this product." onRetry={refetch} />
    )
  }

  const images = product.images?.length ? product.images : [product.thumbnail]
  const maxedOut = inCart >= product.stock

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Shop</Link> / <Link to={`/?category=${product.category}`}>{humanize(product.category)}</Link> /{' '}
        <span aria-current="page">{product.title}</span>
      </nav>

      <article className="product">
        <div className="gallery">
          <img className="gallery-main" src={images[activeImage]} alt={product.title} width="600" height="600" />
          {images.length > 1 && (
            <div className="thumbs" role="group" aria-label="Product images">
              {images.map((src, i) => (
                <button
                  type="button"
                  key={src}
                  onClick={() => setActiveImage(i)}
                  aria-pressed={i === activeImage}
                  aria-label={`Show image ${i + 1}`}
                >
                  <img src={src} alt="" width="72" height="72" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <p className="card-category">
            {humanize(product.category)}
            {product.brand && ` · ${product.brand}`}
          </p>
          <h1>{product.title}</h1>
          <Rating value={product.rating} />
          <p className="product-price">
            {formatPrice(product.price)}
            {product.discountPercentage >= 1 && (
              <span className="discount-inline">-{Math.round(product.discountPercentage)}%</span>
            )}
          </p>
          <p className="product-desc">{product.description}</p>

          <p className={product.stock > 10 ? 'stock' : 'stock low'}>
            {product.stock === 0 ? 'Out of stock' : product.stock > 10 ? 'In stock' : `Only ${product.stock} left`}
          </p>

          <button
            type="button"
            className="btn btn-big"
            disabled={product.stock === 0 || maxedOut}
            onClick={() => dispatch(addItem(product))}
          >
            {maxedOut && product.stock > 0 ? 'Maximum in cart' : 'Add to cart'}
          </button>
          {inCart > 0 && (
            <p className="in-cart">
              {inCart} in your cart · <Link to="/cart">View cart</Link>
            </p>
          )}

          <dl className="specs">
            {product.shippingInformation && (<><dt>Shipping</dt><dd>{product.shippingInformation}</dd></>)}
            {product.warrantyInformation && (<><dt>Warranty</dt><dd>{product.warrantyInformation}</dd></>)}
            {product.returnPolicy && (<><dt>Returns</dt><dd>{product.returnPolicy}</dd></>)}
          </dl>
        </div>
      </article>

      {product.reviews?.length > 0 && (
        <section className="reviews" aria-labelledby="reviews-title">
          <h2 id="reviews-title">Reviews</h2>
          <ul>
            {product.reviews.map((r) => (
              <li key={`${r.reviewerName}-${r.date}`}>
                <Rating value={r.rating} />
                <p>{r.comment}</p>
                <p className="review-by">{r.reviewerName}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
