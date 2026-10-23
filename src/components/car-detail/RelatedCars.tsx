import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'
import type { Car } from '@/payload-types'
import InventoryCard from '@/components/cars/InventoryCard'

export default async function RelatedCars({ car }: { car: Car }) {
  const payload = await getPayload({ config })
  const brandId = typeof car.brand === 'object' ? car.brand.id : car.brand

  // "Similar" = same brand OR same body type
  const similar: Where[] = [{ brand: { equals: brandId } }]
  if (car.bodyType) similar.push({ bodyType: { equals: car.bodyType } })

  const { docs } = await payload.find({
    collection: 'cars',
    where: {
      and: [{ isAvailable: { equals: true } }, { id: { not_equals: car.id } }, { or: similar }],
    },
    limit: 3,
    depth: 1,
    sort: '-createdAt',
    // Same lean field list as the /cars page, because the card is the same component
    select: {
      slug: true,
      brand: true,
      model: true,
      year: true,
      price: true,
      mileage: true,
      transmission: true,
      fuelType: true,
      color: true,
      images: true,
      isFeatured: true,
      inspectionGrade: true,
    },
    populate: { brands: { name: true, slug: true } },
  })

  if (docs.length === 0) return null

  return (
    <section className="mt-12 bg-[#0a0e14]/60 py-12" aria-labelledby="related-title">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 lg:px-12">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-widest text-[#f7ce97]">
              CURATED ALTERNATIVES
            </span>
            <h2 id="related-title" className="text-2xl font-bold text-white">
              خودروهای مشابه در شوروم مرکزی
            </h2>
            <p className="mt-1 text-xs text-[#d2c4b6]">خودروهای هم‌رده موجود با ضمانت کارشناسی</p>
          </div>
          <Link
            href="/cars"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#f7ce97] hover:underline"
          >
            مشاهده کل نمایشگاه <ArrowLeftIcon size={16} aria-hidden />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {docs.map((related) => (
            <InventoryCard key={related.id} car={related} />
          ))}
        </div>
      </div>
    </section>
  )
}
