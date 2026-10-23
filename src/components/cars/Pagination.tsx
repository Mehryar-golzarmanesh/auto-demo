import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { carsUrl, type CarFilters } from '@/lib/car-filters/schema'
import PageLink from './PageLink'

const fa = new Intl.NumberFormat('fa-IR')

// Shows: first, current ±1, last, with "…" in the gaps.
const pagesToShow = (page: number, total: number) => {
  const set = new Set([1, total, page - 1, page, page + 1].filter((n) => n >= 1 && n <= total))
  const sorted = [...set].sort((a, b) => a - b)
  const out: (number | 'gap')[] = []
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push('gap')
    out.push(n)
  })
  return out
}

const itemClass = 'flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm transition-colors'

export default function Pagination({ filters, totalPages }: { filters: CarFilters; totalPages: number }) {
  const page = filters.page
  const href = (n: number) => carsUrl({ ...filters, page: n })

  return (
    <nav aria-label="صفحه‌بندی" className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-xs text-[#d2c4b6]">
        صفحه {fa.format(page)} از {fa.format(totalPages)}
      </span>
      <div className="flex items-center gap-2">
        {/* In RTL, "previous" is on the right, so it gets the right-pointing chevron */}
        {page > 1 ? (
          <PageLink href={href(page - 1)} aria-label="صفحه قبل" className={cn(itemClass, 'bg-[#31353c] text-[#dfe2eb] hover:bg-[#262a31]')}>
            <ChevronRightIcon size={18} />
          </PageLink>
        ) : (
          <span className={cn(itemClass, 'bg-[#31353c]/40 text-[#d2c4b6]/40')}><ChevronRightIcon size={18} /></span>
        )}

        {pagesToShow(page, totalPages).map((n, i) =>
          n === 'gap' ? (
            <span key={`gap-${i}`} className="px-1 text-[#d2c4b6]">…</span>
          ) : (
            <PageLink
              key={n}
              href={href(n)}
             
              aria-current={n === page ? 'page' : undefined}
              className={cn(itemClass, n === page ? 'bg-[#f7ce97] font-bold text-[#432c03]' : 'bg-[#31353c] text-[#dfe2eb] hover:bg-[#262a31]')}
            >
              {fa.format(n)}
            </PageLink>
          ),
        )}

        {page < totalPages ? (
          <PageLink href={href(page + 1)} aria-label="صفحه بعد" className={cn(itemClass, 'bg-[#31353c] text-[#dfe2eb] hover:bg-[#262a31]')}>
            <ChevronLeftIcon size={18} />
          </PageLink>
        ) : (
          <span className={cn(itemClass, 'bg-[#31353c]/40 text-[#d2c4b6]/40')}><ChevronLeftIcon size={18} /></span>
        )}
      </div>
    </nav>
  )
}
