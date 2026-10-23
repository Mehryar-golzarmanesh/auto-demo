import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

// Only the fields the hero actually shows: a smaller query and a smaller response.
const select = {
  slug: true,
  brand: true,
  model: true,
  year: true,
  price: true,
  mileage: true,
  description: true,
  images: true,
  isFeatured: true,
  inspectionGrade: true,
  tour360Url: true,
  specs: { acceleration: true, horsepower: true },
  inspection: { score: true, returnGuaranteeDays: true },
} as const

// Only the brand is trimmed down. The photos are loaded completely: an upload's `url` is built from
// other fields of the file (like its filename), and trimming those away can leave the url empty.
const populate = {
  brands: { name: true, slug: true },
} as const

// A hero slide without a photo looks broken, so only cars that have at least one photo qualify.
const hasPhoto = { 'images.image': { exists: true } } as const

// The "top" cars: featured cars first (most expensive first). If fewer than `count` cars are
// marked as featured (and photographed), the rest are filled with the most expensive available cars that have photos.
export const getHeroCars = cache(async (count = 3) => {
  const payload = await getPayload({ config })

  const featured = await payload.find({
    collection: 'cars',
    where: { and: [{ isAvailable: { equals: true } }, { isFeatured: { equals: true } }, hasPhoto] },
    sort: '-price',
    limit: count,
    depth: 1,
    select,
    populate,
  })

  const cars = [...featured.docs]

  if (cars.length < count) {
    const filler = await payload.find({
      collection: 'cars',
      where: {
        and: [
          { isAvailable: { equals: true } },
          hasPhoto,
          ...(cars.length ? [{ id: { not_in: cars.map((car) => car.id) } }] : []),
        ],
      },
      sort: '-price',
      limit: count - cars.length,
      depth: 1,
      select,
      populate,
    })
    cars.push(...filler.docs)
  }

  return cars
})
