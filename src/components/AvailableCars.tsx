import { getPayload } from 'payload'
import config from '@payload-config'
import CarCard from './CarCard'
import CarFilters from './CarFilters'
import { getFilter } from './car-filters'

interface Props {
  category?: string // comes from the URL: ?category=suv
}

const AvailableCars = async ({ category }: Props) => {
  const filter = getFilter(category)
  const payload = await getPayload({ config })

  const { docs: cars } = await payload.find({
    collection: 'cars',
    depth: 1, // so CarCard receives the brand and images as full objects
    limit: 12,
    sort: '-createdAt',
    where: {
      // always only available cars, plus whatever the active filter adds
      and: [{ isAvailable: { equals: true } }, ...filter.where],
    },
  })

  return (
    <section id="cars" className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs text-gold">موجودی تحویل روز</p>
        <h2 className="text-2xl font-bold text-white md:text-4xl">خودروهای آماده تحویل در ارم خودرو</h2>
        <p className="text-sm text-[#d2c4b6]">
          تمام خودروها دارای برگه تاییدیه کارشناسی رسمی و امکان تحویل آنی هستند
        </p>
      </header>

      <CarFilters activeKey={filter.key} basePath="/" />

      {cars.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-[#1c2026] p-10 text-center text-[#d2c4b6]">
          در حال حاضر خودرویی در این دسته موجود نیست.
        </p>
      )}
    </section>
  )
}

export default AvailableCars
