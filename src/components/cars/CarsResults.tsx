import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { buildWhere } from '@/lib/car-filters/build-query'
import { CARS_PATH, PAGE_SIZE, SORT_OPTIONS, type CarFilters } from '@/lib/car-filters/schema'
import InventoryCard from './InventoryCard'
import Pagination from './Pagination'

const fa = new Intl.NumberFormat('fa-IR')

export default async function CarsResults({ filters }: { filters: CarFilters }) {
  const payload = await getPayload({ config })

  // ONE database query: filtering, sorting and paging are all done by the database.
  const result = await payload.find({
    collection: 'cars',
    where: buildWhere(filters),
    sort: SORT_OPTIONS[filters.sort].payload,
    page: filters.page,
    limit: PAGE_SIZE,
    depth: 1, // brand and image come back as objects...
    // ...and we only ask for the few fields the cards actually show.
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
    populate: {
      brands: { name: true, slug: true },
    },
  })

  if (result.docs.length === 0) {
    return (
      <div className="rounded-2xl bg-[#181c22] p-10 text-center">
        <p className="text-[#dfe2eb]">خودرویی با این فیلترها پیدا نشد.</p>
        <Link
          href={CARS_PATH}
          className="mt-4 inline-block rounded-lg bg-[#f7ce97] px-5 py-2.5 text-sm font-bold text-[#432c03]"
        >
          حذف فیلترها
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-[#d2c4b6]">
        نمایش <b className="text-[#dfe2eb]">{fa.format(result.docs.length)}</b> خودرو از مجموع{' '}
        <b className="text-[#dfe2eb]">{fa.format(result.totalDocs)}</b> خودروی منطبق
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {result.docs.map((car, index) => (
          <InventoryCard key={car.id} car={car} priority={index < 3} />
        ))}
      </div>

      {result.totalPages > 1 && <Pagination filters={filters} totalPages={result.totalPages} />}
    </div>
  )
}
