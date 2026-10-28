const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export const formatPrice = (amount) => usd.format(amount)

// "mens-shirts" -> "Mens Shirts"
export const humanize = (slug) => slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
