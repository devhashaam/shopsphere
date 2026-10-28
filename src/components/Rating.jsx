export default function Rating({ value }) {
  const rounded = Math.round(value * 10) / 10
  return (
    <p className="rating" aria-label={`Rated ${rounded} out of 5`}>
      <span className="stars" aria-hidden="true" style={{ '--fill': `${(value / 5) * 100}%` }}>
        ★★★★★
      </span>
      <span className="rating-num">{rounded.toFixed(1)}</span>
    </p>
  )
}
