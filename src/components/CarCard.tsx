import type { Car } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'
import { Button } from './ui/button'
import { toPersianPrice } from '@/lib/utils'

interface Props {
  car: Car
}

const transmissionLabels = {
  manual: 'دنده‌ای',
  automatic: 'اتوماتیک',
} as const

const fuelLabels = {
  petrol: 'بنزین',
  diesel: 'دیزل',
  hybrid: 'هیبرید',
  electric: 'برقی',
} as const

const formatNumber = (n: number) => new Intl.NumberFormat('fa-IR').format(n)

const CarCard = ({ car }: Props) => {
  // Relationships are `number | Brand`: they are only objects when the query used depth >= 1.
  const brand = typeof car.brand === 'object' ? car.brand : null

  // `images` is an optional array of { image: number | Media }. Take the first populated one.
  const firstImage = car.images?.[0]?.image
  const image = typeof firstImage === 'object' ? firstImage : null

  const mileage = car.mileage ?? 0
  const isNew = mileage === 0

  // One badge on the image, by priority.
  const badge = !car.isAvailable ? 'فروخته شده' : car.isFeatured ? 'ویژه' : null
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-[#181b20]">
      {/* Image */}
      <div className="relative aspect-16/10 w-full bg-[#1f2329]">
        <Link href={`/cars/${car.slug}`}>
          {image?.url ? (
            <Image
              unoptimized
              src={image.url}
              alt={image.alt || `${brand?.name ?? ''} ${car.model}`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className={`object-cover ${car.isAvailable ? '' : 'opacity-60'}`}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              تصویری ثبت نشده
            </div>
          )}
        </Link>
        <span className="absolute inset-e-3 top-3 rounded-lg bg-[#f5c48a] px-2.5 py-1 text-xs font-semibold text-[#2a1b05]">
          {car.year}
        </span>
        {badge && (
          <span className="absolute inset-s-3 top-3 rounded-lg bg-[#1c2026]/90 px-2.5 py-1 text-xs text-white">
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5">
        {/* Title */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-[#cec0b6]">{brand?.name}</p>
            <h3 className="text-lg text-[#dfe2eb]">
              <Link href={`/cars/${car.slug}`}>
                {brand?.name} {car.model} {car.year}
              </Link>
            </h3>
          </div>
          {isNew && <p className="text-xs text-gold">صفر کیلومتر</p>}
        </div>

        {/* Specs */}
        <dl className="grid grid-cols-3 rounded-xl bg-[#1f2329] py-3 text-center">
          <div className="flex flex-col gap-1 border-e border-[#2c323a] px-2">
            <dt className="text-xs text-gray-400">کارکرد</dt>
            <dd className="text-xs text-[#dfe2eb]">
              {isNew ? '۰' : formatNumber(mileage)} کیلومتر
            </dd>
          </div>
          <div className="flex flex-col gap-1 border-e border-[#2c323a] px-2">
            <dt className="text-xs text-gray-400">گیربکس</dt>
            <dd className="text-xs text-[#dfe2eb]">
              {car.transmission ? transmissionLabels[car.transmission] : '—'}
            </dd>
          </div>
          <div className="flex flex-col gap-1 px-2">
            <dt className="text-xs text-gray-400">{car.fuelType ? 'سوخت' : 'رنگ'}</dt>
            <dd className="text-xs text-[#dfe2eb]">
              {car.fuelType ? fuelLabels[car.fuelType] : (car.color ?? '—')}
            </dd>
          </div>
        </dl>

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between border-t border-[#2c323a] pt-4">
          <div>
            <p className="text-xs text-[#d2c4b6]">قیمت نهایی:</p>
            <p className="text-base text-gold">
              {toPersianPrice(car.price)} <span className="text-xs text-[#d2c4b6]">تومان</span>
            </p>
          </div>
          <Link href={`/cars/${car.slug}`}>
            <Button variant="secondary" className={`cursor-pointer`}>
              مشخصات <ArrowLeftIcon size={15} />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default CarCard
