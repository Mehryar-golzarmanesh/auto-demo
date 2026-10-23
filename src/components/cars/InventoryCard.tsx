import Image from 'next/image'
import Link from 'next/link'
import type { Car } from '@/payload-types'
import { toPersianPrice } from '@/lib/utils'

type CardCar = Pick<
  Car,
  | 'id'
  | 'slug'
  | 'brand'
  | 'model'
  | 'year'
  | 'price'
  | 'mileage'
  | 'transmission'
  | 'fuelType'
  | 'color'
  | 'images'
  | 'isFeatured'
  | 'inspectionGrade'
>

const transmissionLabels = { manual: 'دنده‌ای', automatic: 'اتوماتیک' } as const
const fuelLabels = { petrol: 'بنزین', diesel: 'دیزل', hybrid: 'هیبرید', electric: 'برقی' } as const
const fa = new Intl.NumberFormat('fa-IR')

// A plain server component: no state, no client JavaScript shipped for it.
export default function InventoryCard({
  car,
  priority = false,
}: {
  car: CardCar
  priority?: boolean
}) {
  const brand = typeof car.brand === 'object' ? car.brand : null
  const firstImage = car.images?.[0]?.image
  const image = typeof firstImage === 'object' ? firstImage : null
  const mileage = car.mileage ?? 0
  const title = `${brand?.name ?? ''} ${car.model} ${car.year}`.trim()

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-xl bg-[#181c22] shadow-xl transition-shadow duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.7)]">
      <div>
        {/* The image is a link too. It is hidden from keyboards and screen readers because the title link below does the same job. */}
        <Link
          href={`/cars/${car.slug}`}
          aria-hidden
          tabIndex={-1}
          className="relative block aspect-[16/10] overflow-hidden bg-[#31353c]"
        >
          {image?.url ? (
            <Image
              src={image.sizes?.thumbnail?.url ?? image.url}
              alt={image.alt || title}
              fill
              priority={priority} // only the first row is preloaded; the rest lazy-load
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#d2c4b6]">
              تصویری ثبت نشده
            </div>
          )}

          <div className="absolute end-2.5 top-2.5 z-10 flex flex-wrap gap-1.5">
            {car.inspectionGrade === 'a-plus' && (
              <span className="rounded-full bg-[#f7ce97] px-2.5 py-0.5 text-[11px] font-bold text-[#432c03]">
                تاییدیه کارشناسی A+
              </span>
            )}
            {mileage === 0 && (
              <span className="rounded-full bg-[#0a0e14]/90 px-2.5 py-0.5 text-[11px] text-[#fccd91]">
                صفر کیلومتر
              </span>
            )}
          </div>
          <span className="absolute bottom-2 start-2 z-10 rounded-md bg-[#0a0e14]/90 px-2 py-0.5 text-[11px] text-[#dfe2eb]">
            {car.year}
          </span>
        </Link>

        <div className="p-5">
          <div className="mb-1 flex items-center justify-between text-xs text-[#d2c4b6]">
            <span>{brand?.name}</span>
            <span className="text-[#fccd91]">{car.color}</span>
          </div>
          <h3 className="font-bold">
            <Link
              href={`/cars/${car.slug}`}
              className="text-[#dfe2eb] transition-colors hover:text-[#f7ce97] group-hover:text-[#f7ce97]"
            >
              {title}
            </Link>
          </h3>

          <div className="mt-3 grid grid-cols-3 gap-1 rounded-lg bg-[#1c2026]/60 p-2 text-center">
            <div>
              <span className="block text-[10px] text-[#d2c4b6]">کارکرد</span>
              <span className="text-xs font-semibold text-[#dfe2eb]">
                {mileage === 0 ? '۰' : fa.format(mileage)} KM
              </span>
            </div>
            <div className="border-x border-[#4e453b]/20">
              <span className="block text-[10px] text-[#d2c4b6]">گیربکس</span>
              <span className="text-xs font-semibold text-[#dfe2eb]">
                {car.transmission ? transmissionLabels[car.transmission] : '—'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-[#d2c4b6]">سوخت</span>
              <span className="text-xs font-semibold text-[#dfe2eb]">
                {car.fuelType ? fuelLabels[car.fuelType] : '—'}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <span className="text-[11px] text-[#d2c4b6]">قیمت کارشناسی شده:</span>
            <p className="mt-0.5 flex items-baseline gap-1">
              <span className="text-[22px] font-extrabold tracking-tight text-[#f7ce97]">
                {toPersianPrice(car.price)}
              </span>
              <span className="text-xs text-[#d2c4b6]">تومان</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 p-5 pt-0">
        <Link
          href={`/cars/${car.slug}`}
          className="rounded-lg bg-[#f7ce97] py-2.5 text-center text-xs font-bold text-[#432c03] transition-colors hover:bg-[#fccd91]"
        >
          مشاهده کارشناسی
        </Link>
        <Link
          href={`/cars/${car.slug}#test-drive`}
          className="rounded-lg bg-[#31353c] py-2.5 text-center text-xs font-semibold text-[#dfe2eb] transition-colors hover:bg-[#262a31]"
        >
          رزرو نوبت بازدید
        </Link>
      </div>
    </article>
  )
}
