import { getPayload } from 'payload'
import config from '@payload-config'
import { PRICE_STEP, type Facets } from './schema'

// "Facets" = the data the sidebar needs to draw itself: which brands exist,
// how many cars each has, and the cheapest / most expensive car.
// Two tiny queries run in parallel; only the fields we need are fetched.
export async function getFacets(): Promise<Facets> {
  const payload = await getPayload({ config })

  const [brandsRes, carsRes] = await Promise.all([
    payload.find({
      collection: 'brands',
      where: { isActive: { equals: true } },
      pagination: false,
      depth: 0,
      select: { name: true, slug: true },
    }),
    payload.find({
      collection: 'cars',
      where: { isAvailable: { equals: true } },
      pagination: false,
      depth: 0,
      select: { brand: true, price: true },
    }),
  ])

  const counts = new Map<number | string, number>()
  let min = Infinity
  let max = 0

  for (const car of carsRes.docs) {
    const brandId = typeof car.brand === 'object' ? car.brand.id : car.brand
    counts.set(brandId, (counts.get(brandId) ?? 0) + 1)
    min = Math.min(min, car.price)
    max = Math.max(max, car.price)
  }

  const priceMin = Number.isFinite(min) ? Math.floor(min / PRICE_STEP) * PRICE_STEP : 0
  const priceMax = max > 0 ? Math.ceil(max / PRICE_STEP) * PRICE_STEP : PRICE_STEP * 2

  return {
    brands: brandsRes.docs
      .map((b) => ({ slug: b.slug, name: b.name, count: counts.get(b.id) ?? 0 }))
      .filter((b) => b.count > 0)
      .sort((a, b) => b.count - a.count),
    priceMin,
    priceMax: Math.max(priceMax, priceMin + PRICE_STEP),
    total: carsRes.docs.length,
  }
}
