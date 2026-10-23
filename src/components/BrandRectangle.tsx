import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'

const BrandRectangle = async () => {
  const payload = await getPayload({ config })

  // 1. Fetch the first 8 active brands.
  //    depth: 1 populates `logo` (an upload) as a full media object instead of just an ID.
  const { docs: brands } = await payload.find({
    collection: 'brands',
    where: { isActive: { equals: true } },
    sort: 'createdAt',
    limit: 8,
    depth: 1,
    select: { name: true, slug: true, logo: true },
  })

  // 2. Count the available cars for each brand (all 8 queries run in parallel).
  const carCounts = await Promise.all(
    brands.map((brand) =>
      payload.count({
        collection: 'cars',
        where: {
          and: [{ brand: { equals: brand.id } }, { isAvailable: { equals: true } }],
        },
      }),
    ),
  )

  // 3. Render one card per brand.
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
      {brands.map((brand, i) => {
        // `logo` is a number (ID) or a populated media object, so check the type first.
        const logo = typeof brand.logo === 'object' ? brand.logo : null

        return (
          <Link
            key={brand.id}
            href={`/cars?brand=${brand.slug}`}
            className="flex flex-col items-center gap-4 rounded-2xl bg-[#1c2026] p-6 transition hover:bg-[#252b33]"
          >
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#2c323a] text-gold">
              {logo?.url ? (
                <Image
                  src={logo.url}
                  alt={logo.alt ?? brand.name}
                  height={12}
                  width={12}
                  className="h-6 w-6 object-contain text-gold"
                />
              ) : (
                // Fallback when the brand has no logo yet: first letter of the name
                <span className="text-lg font-semibold text-[#f5c48a]">{brand.name.charAt(0)}</span>
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
              <p className="font-semibold text-white">{brand.name}</p>
              <p className="text-xs text-gold">{carCounts[i].totalDocs} دستگاه</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default BrandRectangle
