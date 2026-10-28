export default function QuantityStepper({ value, max, onChange, label }) {
  return (
    <div className="stepper" role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" onClick={() => onChange(value - 1)} aria-label={`Decrease ${label}`}>
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Increase ${label}`}>
        +
      </button>
    </div>
  )
}
