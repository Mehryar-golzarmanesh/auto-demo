import CarCard from '@/components/CarCard'
import { CircleIcon } from 'lucide-react'
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import CarFilters from '@/components/CarFilters'
import { getFilter } from '@/components/car-filters'

interface Props {
  category?: string // comes from the URL: /?category=suv
}

const HeroThree = async ({ category }: Props) => {
  const filter = getFilter(category)
  const payload = await getPayload({ config })
  const { docs: cars } = await payload.find({
    collection: 'cars',
    depth: 1,
    limit: 6,
    sort: 'createdAt',
    where: {
      and: [{ isAvailable: { equals: true } }, ...filter.where],
    },
  })
  return (
    <div className="bg-[#0a0e14] max-w-7xl mx-auto pt-5 p-10 2xl:p-0 2xl:pt-10">
      <div className="flex flex-col lg:flex-row gap-5 justify-between items-end border-b border-[#18191c] pb-5">
        <div className="flex flex-col gap-3">
          <p className="text-gold flex items-center gap-2 text-xs">
            <CircleIcon size={10} /> موجودی تحویل روز
          </p>
          <h2 className="text-3xl font-semibold text-white">خودروهای آماده تحویل در ارم خودرو</h2>
          <p className="text-[#d2c4b6] text-xs">
            تمام خودروها دارای برگه تاییدیه کارشناسی رسمی و امکان تحویل آنی هستند
          </p>
        </div>
        <CarFilters activeKey={filter.key} basePath="/" className="max-w-full lg:w-fit" />
      </div>

      {cars.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-5">
          {cars.map((car) => (
            <CarCard car={car} key={car.slug} />
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-2xl bg-[#1c2026] p-10 text-center text-sm text-[#d2c4b6]">
          در حال حاضر خودرویی در این دسته موجود نیست.
        </p>
      )}
    </div>
  )
}

export default HeroThree
