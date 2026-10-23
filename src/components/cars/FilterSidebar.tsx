'use client'

import { useState } from 'react'
import { RotateCcwIcon, SlidersHorizontalIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  BODY_TYPES,
  PRICE_STEP,
  YEAR_GROUPS,
  activeFilterCount,
  type BodyValue,
  type CarFilters,
  type Facets,
  type YearKey,
} from '@/lib/car-filters/schema'
import DualRange from './DualRange'
import scroll from './scrollbar.module.css'
import { setParam, useUrlNavigate } from './useUrlNavigate'

const fa = new Intl.NumberFormat('fa-IR')
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)
const toggle = <T,>(list: T[], value: T) =>
  list.includes(value) ? list.filter((x) => x !== value) : [...list, value]

// The "draft" is what the visitor is choosing right now. Nothing is fetched until they press apply.
type Draft = {
  brands: string[]
  years: YearKey[]
  body?: BodyValue
  price: [number, number]
  topInspection: boolean
  warranty: boolean
  installment: boolean
}

const draftFrom = (f: CarFilters, facets: Facets): Draft => ({
  brands: f.brands,
  years: f.years,
  body: f.body,
  price: [
    clamp(f.minPrice ?? facets.priceMin, facets.priceMin, facets.priceMax),
    clamp(f.maxPrice ?? facets.priceMax, facets.priceMin, facets.priceMax),
  ],
  topInspection: f.topInspection,
  warranty: f.warranty,
  installment: f.installment,
})

const FILTER_KEYS = ['brand', 'year', 'body', 'minPrice', 'maxPrice', 'inspection', 'warranty', 'installment']

const checkClass = 'h-4 w-4 cursor-pointer rounded accent-[#f7ce97]'
const rowClass = 'flex cursor-pointer items-center gap-2.5 rounded-lg bg-[#1c2026]/60 p-2 transition-colors hover:bg-[#1c2026]'
const legendClass = 'mb-2.5 text-sm font-bold text-[#dfe2eb]'

interface Props {
  filters: CarFilters
  facets: Facets
}

export default function FilterSidebar({ filters, facets }: Props) {
  const { update, isPending } = useUrlNavigate()
  const [open, setOpen] = useState(false) // only used on mobile, where the panel is collapsible
  const [draft, setDraft] = useState<Draft>(() => draftFrom(filters, facets))
  const activeCount = activeFilterCount(filters)
  const patch = (changes: Partial<Draft>) => setDraft((d) => ({ ...d, ...changes }))

  const apply = () => {
    update((p) => {
      setParam(p, 'brand', draft.brands.join(','))
      setParam(p, 'year', draft.years.join(','))
      setParam(p, 'body', draft.body ?? '')
      // Only write a price to the URL when it differs from the full range
      setParam(p, 'minPrice', draft.price[0] > facets.priceMin ? String(draft.price[0]) : '')
      setParam(p, 'maxPrice', draft.price[1] < facets.priceMax ? String(draft.price[1]) : '')
      setParam(p, 'inspection', draft.topInspection ? '1' : '')
      setParam(p, 'warranty', draft.warranty ? '1' : '')
      setParam(p, 'installment', draft.installment ? '1' : '')
    })
    setOpen(false)
  }

  const reset = () => {
    setDraft(draftFrom({ ...filters, brands: [], years: [], body: undefined, minPrice: undefined, maxPrice: undefined, topInspection: false, warranty: false, installment: false }, facets))
    update((p) => FILTER_KEYS.forEach((key) => p.delete(key))) // keeps the search text and sort order
    setOpen(false)
  }

  return (
    <aside className="lg:sticky lg:top-24">
      {/* Mobile: a button that opens the panel. Desktop: the panel is always visible. */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="filter-panel"
        className="mb-3 flex w-full items-center justify-between rounded-xl bg-[#181c22] p-4 text-sm font-bold text-[#dfe2eb] lg:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontalIcon size={18} className="text-[#f7ce97]" /> فیلترهای پیشرفته
        </span>
        {activeCount > 0 && <span className="rounded bg-[#d9b37e]/20 px-2 py-0.5 text-xs text-[#f7ce97]">{fa.format(activeCount)}</span>}
      </button>

      {/* Outer box: rounded, coloured, a little padding so the scrollbar floats away from the edge.
          Inner box: the one that actually scrolls. */}
      <div id="filter-panel" className={cn('rounded-xl bg-[#181c22] lg:block lg:p-1.5', open ? 'block' : 'hidden')}>
        <div className={cn('flex flex-col gap-5 p-5 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:p-3.5', scroll.thin)}>
        <div className="flex items-center justify-between border-b border-[#4e453b]/30 pb-3">
          <h2 className="flex items-center gap-2 font-bold text-[#dfe2eb]">
            <SlidersHorizontalIcon size={20} className="text-[#f7ce97]" aria-hidden /> فیلترهای پیشرفته
          </h2>
          {activeCount > 0 && (
            <span className="rounded bg-[#d9b37e]/20 px-2 py-0.5 text-[11px] text-[#f7ce97]">{fa.format(activeCount)} فیلتر فعال</span>
          )}
        </div>

        {/* Brands */}
        <fieldset>
          <legend className={legendClass}>برند و کمپانی سازنده</legend>
          <div className={cn('flex max-h-52 flex-col gap-2 overflow-y-auto pe-2', scroll.thin)}>
            {facets.brands.map((brand) => (
              <label key={brand.slug} className={cn(rowClass, 'justify-between')}>
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    className={checkClass}
                    checked={draft.brands.includes(brand.slug)}
                    onChange={() => patch({ brands: toggle(draft.brands, brand.slug) })}
                  />
                  <span className="text-sm text-[#dfe2eb]">{brand.name}</span>
                </span>
                <span className="rounded bg-[#31353c] px-1.5 py-0.5 text-xs text-[#f7ce97]">{fa.format(brand.count)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Price */}
        <fieldset className="border-t border-[#4e453b]/20 pt-4">
          <legend className={legendClass}>بازه قیمت (تومان)</legend>
          <DualRange
            min={facets.priceMin}
            max={facets.priceMax}
            step={PRICE_STEP}
            value={draft.price}
            onChange={(price) => patch({ price })}
            minLabel="حداقل قیمت"
            maxLabel="حداکثر قیمت"
          />
          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-[#31353c]/60 p-1.5">
              <span className="block text-[10px] text-[#d2c4b6]">حداقل</span>
              <span className="text-xs font-bold text-[#f7ce97]">{fa.format(draft.price[0])}</span>
            </div>
            <div className="rounded-lg bg-[#31353c]/60 p-1.5">
              <span className="block text-[10px] text-[#d2c4b6]">حداکثر</span>
              <span className="text-xs font-bold text-[#f7ce97]">{fa.format(draft.price[1])}</span>
            </div>
          </div>
        </fieldset>

        {/* Year */}
        <fieldset className="border-t border-[#4e453b]/20 pt-4">
          <legend className={legendClass}>سال ساخت</legend>
          <div className="grid grid-cols-2 gap-2">
            {YEAR_GROUPS.map((group) => (
              <label key={group.key} className={rowClass}>
                <input
                  type="checkbox"
                  className={checkClass}
                  checked={draft.years.includes(group.key)}
                  onChange={() => patch({ years: toggle(draft.years, group.key) })}
                />
                <span className="text-xs text-[#dfe2eb]">{group.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Body type: pick one, or press the active one again to clear it */}
        <fieldset className="border-t border-[#4e453b]/20 pt-4">
          <legend className={legendClass}>کلاس بدنه</legend>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              aria-pressed={draft.body === undefined}
              onClick={() => patch({ body: undefined })}
              className={cn('rounded-lg px-3 py-1.5 text-xs transition-colors', draft.body === undefined ? 'bg-[#f7ce97] font-semibold text-[#432c03]' : 'bg-[#31353c] text-[#d2c4b6] hover:text-[#f7ce97]')}
            >
              همه کلاس‌ها
            </button>
            {BODY_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                aria-pressed={draft.body === type.value}
                onClick={() => patch({ body: draft.body === type.value ? undefined : type.value })}
                className={cn('rounded-lg px-3 py-1.5 text-xs transition-colors', draft.body === type.value ? 'bg-[#f7ce97] font-semibold text-[#432c03]' : 'bg-[#31353c] text-[#d2c4b6] hover:text-[#f7ce97]')}
              >
                {type.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Technical */}
        <fieldset className="border-t border-[#4e453b]/20 pt-4">
          <legend className={legendClass}>وضعیت فنی و ضمانت</legend>
          <div className="flex flex-col gap-2">
            <label className={cn(rowClass, 'bg-[#d9b37e]/10')}>
              <input type="checkbox" className={checkClass} checked={draft.topInspection} onChange={() => patch({ topInspection: !draft.topInspection })} />
              <span className="flex flex-col">
                <span className="text-xs font-bold text-[#f7ce97]">فقط دارای کارشناسی گرید A+</span>
                <span className="text-[10px] text-[#d2c4b6]">رنگ، شاسی و سلامت موتور تایید شده</span>
              </span>
            </label>
            <label className={rowClass}>
              <input type="checkbox" className={checkClass} checked={draft.warranty} onChange={() => patch({ warranty: !draft.warranty })} />
              <span className="text-xs text-[#dfe2eb]">دارای گارانتی فعال شرکتی</span>
            </label>
            <label className={rowClass}>
              <input type="checkbox" className={checkClass} checked={draft.installment} onChange={() => patch({ installment: !draft.installment })} />
              <span className="text-xs text-[#dfe2eb]">امکان پرداخت اقساطی ویژه</span>
            </label>
          </div>
        </fieldset>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={apply}
            disabled={isPending}
            className="flex-1 rounded-xl bg-[#f7ce97] py-3 text-sm font-bold text-[#432c03] shadow-[0_4px_20px_rgba(247,206,151,0.25)] transition-colors hover:bg-[#fccd91] disabled:opacity-60"
          >
            {isPending ? 'در حال اعمال...' : 'اعمال فیلترها'}
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="ریست فیلترها"
            className="rounded-xl bg-[#31353c] p-3 text-[#d2c4b6] transition-colors hover:text-[#ffb4ab]"
          >
            <RotateCcwIcon size={20} />
          </button>
        </div>
        </div>
      </div>
    </aside>
  )
}
