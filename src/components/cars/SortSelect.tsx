'use client'

import { ChevronDownIcon } from 'lucide-react'
import { DEFAULT_SORT, SORT_OPTIONS } from '@/lib/car-filters/schema'
import { setParam, useUrlNavigate } from './useUrlNavigate'

export default function SortSelect() {
  const { update, isPending, searchParams } = useUrlNavigate()
  const raw = searchParams.get('sort') ?? ''
  const value = (Object.keys(SORT_OPTIONS) as string[]).includes(raw) ? raw : DEFAULT_SORT

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="whitespace-nowrap text-xs text-[#d2c4b6]">
        مرتب‌سازی:
      </label>
      <div className="relative">
        <select
          id="sort-select"
          value={value}
          aria-busy={isPending}
          onChange={(e) => update((p) => setParam(p, 'sort', e.target.value === DEFAULT_SORT ? '' : e.target.value))}
          className="cursor-pointer appearance-none rounded-lg bg-[#31353c] py-2 pe-3 ps-8 text-xs text-[#dfe2eb] [color-scheme:dark] focus:outline-none"
        >
          {Object.entries(SORT_OPTIONS).map(([key, option]) => (
            <option key={key} value={key}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon size={14} className="pointer-events-none absolute start-2 top-1/2 -translate-y-1/2 text-[#d2c4b6]" />
      </div>
    </div>
  )
}
