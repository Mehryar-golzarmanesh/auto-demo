import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

// `cache` makes this run ONCE per request, even though both generateMetadata and the page call it.
export const getCar = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'cars',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1, // brand, gallery photos and the inspection PDF come back as full objects
  })
  return docs[0] ?? null
})
