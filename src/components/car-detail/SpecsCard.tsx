import { SlidersHorizontalIcon } from 'lucide-react'
import type { Car } from '@/payload-types'

const fa = new Intl.NumberFormat('fa-IR')
const transmissionLabels = { manual: 'دنده‌ای', automatic: 'اتوماتیک' } as const
const fuelLabels = { petrol: 'بنزین', diesel: 'دیزل', hybrid: 'هیبرید', electric: 'برقی' } as const

type Row = { label: string; value?: string | null; highlight?: boolean; ltr?: boolean }

export default function SpecsCard({ car }: { car: Car }) {
  const specs = car.specs
  const brand = typeof car.brand === 'object' ? car.brand : null
  const mileage = car.mileage ?? 0

  // Each row only appears if it has a value, so half-filled cars still look clean.
  const rows: Row[] = [
    { label: 'سال تولید', value: String(car.year) },
    { label: 'کارکرد ثبت شده', value: mileage === 0 ? 'صفر کیلومتر' : `${fa.format(mileage)} کیلومتر` },
    { label: 'پیشرانه و حجم موتور', value: specs?.engine },
    { label: 'بیشینه توان خروجی', value: specs?.horsepower ? `${fa.format(specs.horsepower)} اسب بخار` : null },
    { label: 'بیشینه گشتاور', value: specs?.torque },
    { label: 'جعبه دنده (گیربکس)', value: specs?.gearbox ?? (car.transmission ? transmissionLabels[car.transmission] : null) },
    { label: 'انتقال قدرت', value: specs?.drivetrain },
    { label: 'شتاب ۰ تا ۱۰۰ کیلومتر', value: specs?.acceleration ? `${fa.format(specs.acceleration)} ثانیه` : null, highlight: true },
    { label: 'حداکثر سرعت', value: specs?.topSpeed ? `${fa.format(specs.topSpeed)} کیلومتر بر ساعت` : null },
    { label: 'نوع سوخت', value: car.fuelType ? fuelLabels[car.fuelType] : null },
    { label: 'رنگ بیرونی بدنه', value: car.color },
    { label: 'رنگ تودوزی داخلی', value: specs?.interiorColor },
    { label: 'شماره شناسایی خودرو (VIN)', value: specs?.vin, ltr: true },
  ].filter((row) => row.value)

  const options = (car.options ?? []).filter((o) => o.name)

  return (
    <section className="flex flex-col gap-5 rounded-xl bg-[#181c22] p-6 shadow-lg" aria-labelledby="specs-title">
      <div className="flex items-center justify-between">
        <h2 id="specs-title" className="flex items-center gap-2 font-bold text-[#dfe2eb]">
          <SlidersHorizontalIcon size={22} className="text-[#f7ce97]" aria-hidden /> مشخصات فنی کامل
        </h2>
        {brand && <span className="text-xs text-[#d2c4b6]">مشخصات رسمی {brand.name}</span>}
      </div>

      <dl className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 rounded-lg bg-[#1c2026]/40 px-3 py-2.5">
            <dt className="text-sm text-[#d2c4b6]">{row.label}</dt>
            <dd dir={row.ltr ? 'ltr' : undefined} className={row.highlight ? 'text-sm font-bold text-[#f7ce97]' : 'text-sm font-semibold text-[#dfe2eb]'}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {options.length > 0 && (
        <div className="flex flex-col gap-2 pt-1">
          <h3 className="text-sm font-bold text-[#dfe2eb]">آپشن‌های نصب‌شده:</h3>
          <ul className="flex flex-wrap gap-2">
            {options.map((option) => (
              <li key={option.id ?? option.name} className="rounded-lg bg-[#262a31] px-3 py-1 text-xs text-[#d2c4b6]">
                {option.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
