import Link from 'next/link'
import { XIcon } from 'lucide-react'
import {
  BODY_TYPES,
  YEAR_GROUPS,
  carsUrl,
  type CarFilters,
  type Facets,
} from '@/lib/car-filters/schema'

const fa = new Intl.NumberFormat('fa-IR')

// Every chip is a plain link to the same page WITHOUT that one filter. No JavaScript needed.
export default async function ActiveFilters({
  filters,
  facets,
}: {
  filters: CarFilters
  facets: Promise<Facets>
}) {
  const { brands } = await facets
  const nameOf = (slug: string) => brands.find((b) => b.slug === slug)?.name ?? slug
  const without = (patch: Partial<CarFilters>) => carsUrl({ ...filters, ...patch, page: 1 })

  const chips: { label: string; href: string }[] = []

  if (filters.q) chips.push({ label: `جستجو: ${filters.q}`, href: without({ q: '' }) })

  for (const slug of filters.brands) {
    chips.push({
      label: `برند: ${nameOf(slug)}`,
      href: without({ brands: filters.brands.filter((b) => b !== slug) }),
    })
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const from = filters.minPrice !== undefined ? `از ${fa.format(filters.minPrice)} ` : ''
    const to = filters.maxPrice !== undefined ? `تا ${fa.format(filters.maxPrice)} ` : ''
    chips.push({
      label: `قیمت: ${from}${to}تومان`,
      href: without({ minPrice: undefined, maxPrice: undefined }),
    })
  }

  for (const key of filters.years) {
    const group = YEAR_GROUPS.find((g) => g.key === key)
    chips.push({
      label: `سال: ${group?.label ?? key}`,
      href: without({ years: filters.years.filter((y) => y !== key) }),
    })
  }

  if (filters.body) {
    const label = BODY_TYPES.find((b) => b.value === filters.body)?.label
    chips.push({ label: `کلاس: ${label}`, href: without({ body: undefined }) })
  }
  if (filters.topInspection) chips.push({ label: 'کارشناسی A+', href: without({ topInspection: false }) })
  if (filters.warranty) chips.push({ label: 'گارانتی شرکتی', href: without({ warranty: false }) })
  if (filters.installment) chips.push({ label: 'پرداخت اقساطی', href: without({ installment: false }) })

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {chips.map((chip) => (
        <Link
          key={chip.label}
          href={chip.href}
          scroll={false}
          aria-label={`حذف فیلتر ${chip.label}`}
          className="inline-flex items-center gap-1 rounded-full bg-[#31353c] px-2.5 py-1 text-xs text-[#f7ce97] transition-colors hover:text-[#ffb4ab]"
        >
          {chip.label}
          <XIcon size={12} aria-hidden />
        </Link>
      ))}
      <Link
        href={carsUrl({ sort: filters.sort })}
        scroll={false}
        className="pe-1 text-xs text-[#fccd91] hover:underline"
      >
        حذف تمام فیلترها
      </Link>
    </div>
  )
}
