// app/(frontend)/page.tsx
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function HomePage() {
  const payload = await getPayload({ config })

  const featuredCars = await payload.find({
    collection: 'cars',
    where: { isFeatured: { equals: true } },
    limit: 6,
    depth: 2,
  })

  return (
    <div className="">
      {/* Hero slider */}
      {/* Featured cars grid */}
      {/* Brand strip */}
      Hello world!
    </div>
  )
}
