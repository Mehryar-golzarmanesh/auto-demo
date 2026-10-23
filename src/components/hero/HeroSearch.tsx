'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDaysIcon, CarFrontIcon, ChevronDownIcon, SearchIcon, WalletIcon } from 'lucide-react'
import { YEAR_GROUPS, carsUrl, type YearKey } from '@/lib/car-filters/schema'

const fa = new Intl.NumberFormat('fa-IR')
const BILLION = 1_000_000_000

// Each option becomes a minimum and/or maximum price in the URL: /cars?minPrice=...&maxPrice=...
const PRICE_OPTIONS = [
  { value: '', label: 'همه قیمت‌ها' },
  { value: 'lt1', label: 'زیر ۱ میلیارد تومان (اقتصادی)', max: 1 * BILLION },
  { value: '1to5', label: '۱ تا ۵ میلیارد تومان (نیمه‌لوکس)', min: 1 * BILLION, max: 5 * BILLION },
  { value: '5to15', label: '۵ تا ۱۵ میلیارد تومان (لوکس وارداتی)', min: 5 * BILLION, max: 15 * BILLION },
  { value: 'gt15', label: 'بالای ۱۵ میلیارد تومان (سوپرلوکس کلکسیونی)', min: 15 * BILLION },
] as const

const selectClass =
  'w-full cursor-pointer appearance-none rounded-xl border border-[#4e453b]/30 bg-[#0a0e14] py-2.5 ps-3.5 pe-10 text-sm text-[#dfe2eb] focus:outline-none focus:ring-1 focus:ring-[#f7ce97] [color-scheme:dark]'
const labelClass = 'mb-1.5 flex items-center gap-1 text-[13px] text-[#d2c4b6]'

interface Props {
  brands: { slug: string; name: string }[]
  total: number
}

export default function HeroSearch({ brands, total }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [brand, setBrand] = useState('')
  const [price, setPrice] = useState('')
  const [year, setYear] = useState('')

  // The hero search just builds a /cars link using the same filter model as the sidebar
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const range = PRICE_OPTIONS.find((o) => o.value === price)
    const url = carsUrl({
      brands: brand ? [brand] : [],
      minPrice: range && 'min' in range ? range.min : undefined,
      maxPrice: range && 'max' in range ? range.max : undefined,
      years: year ? [year as YearKey] : [],
    })
    startTransition(() => router.push(url))
  }

  return (
    <div className="mt-6 rounded-2xl border border-[#4e453b]/40 bg-[#262a31]/90 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.6)] lg:p-6">
      <form onSubmit={onSubmit} className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <label htmlFor="hero-brand" className={labelClass}>
            <CarFrontIcon size={16} className="text-[#f7ce97]" aria-hidden /> برند خودرو
          </label>
          <div className="relative">
            <select id="hero-brand" value={brand} onChange={(e) => setBrand(e.target.value)} className={selectClass}>
              <option value="">همه برندها (داخلی و وارداتی)</option>
              {brands.map((b) => (
                <option key={b.slug} value={b.slug}>{b.name}</option>
              ))}
            </select>
            <ChevronDownIcon size={18} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[#d2c4b6]" aria-hidden />
          </div>
        </div>

        <div className="lg:col-span-3">
          <label htmlFor="hero-price" className={labelClass}>
            <WalletIcon size={16} className="text-[#f7ce97]" aria-hidden /> بازه قیمتی
          </label>
          <div className="relative">
            <select id="hero-price" value={price} onChange={(e) => setPrice(e.target.value)} className={selectClass}>
              {PRICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDownIcon size={18} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[#d2c4b6]" aria-hidden />
          </div>
        </div>

        <div className="lg:col-span-3">
          <label htmlFor="hero-year" className={labelClass}>
            <CalendarDaysIcon size={16} className="text-[#f7ce97]" aria-hidden /> سال ساخت
          </label>
          <div className="relative">
            <select id="hero-year" value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
              <option value="">همه سال‌ها</option>
              {YEAR_GROUPS.map((g) => (
                <option key={g.key} value={g.key}>{g.label}</option>
              ))}
            </select>
            <ChevronDownIcon size={18} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[#d2c4b6]" aria-hidden />
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f7ce97] px-5 py-2.5 font-bold text-[#432c03] shadow-lg transition-colors hover:bg-[#fccd91] disabled:opacity-60"
          >
            <SearchIcon size={20} aria-hidden />
            {isPending ? 'در حال انتقال...' : `جستجو در ${fa.format(total)} خودروی موجود`}
          </button>
        </div>
      </form>
    </div>
  )
}
