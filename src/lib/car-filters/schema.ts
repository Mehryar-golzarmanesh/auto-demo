// Shared by server AND client code, so it must not import anything server-only.
// This file defines what a "filter" is, how to read it from the URL, and how to write it back.

export const CARS_PATH = '/cars'
export const PAGE_SIZE = 9
export const PRICE_STEP = 50_000_000 // slider step: 50 million toman

export const SORT_OPTIONS = {
  expensive: { label: 'گران‌ترین به ارزان‌ترین', payload: '-price' },
  cheap: { label: 'ارزان‌ترین به گران‌ترین', payload: 'price' },
  year: { label: 'جدیدترین سال ساخت', payload: '-year' },
  mileage: { label: 'کمترین کارکرد', payload: 'mileage' },
} as const
export type SortKey = keyof typeof SORT_OPTIONS
export const DEFAULT_SORT: SortKey = 'expensive'

export const BODY_TYPES = [
  { value: 'suv', label: 'شاسی‌بلند (SUV)' },
  { value: 'sedan', label: 'سدان لوکس' },
  { value: 'coupe', label: 'کوپه اسپرت' },
  { value: 'hatchback', label: 'هاچ‌بک' },
] as const
export type BodyValue = (typeof BODY_TYPES)[number]['value']

// Domestic cars store the Jalali year and foreign cars the Gregorian year,
// so each group lists both (1403 = 2024) and matches either.
export const YEAR_GROUPS = [
  { key: '1403', label: '۱۴۰۳ / ۲۰۲۴', years: [1403, 2024] },
  { key: '1402', label: '۱۴۰۲ / ۲۰۲۳', years: [1402, 2023] },
  { key: '1401', label: '۱۴۰۱ / ۲۰۲۲', years: [1401, 2022] },
  { key: 'older', label: 'قبل از ۱۴۰۰', years: [] as number[] }, // handled specially in build-query.ts
] as const
export type YearKey = (typeof YEAR_GROUPS)[number]['key']

// Persian (۰-۹) and Arabic-Indic (٠-٩) digits -> English digits, and back.
export const toEnglishDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
export const toPersianDigits = (value: string) => value.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

export type Facets = {
  brands: { slug: string; name: string; count: number }[]
  priceMin: number
  priceMax: number
  total: number
}

export type CarFilters = {
  q: string
  brands: string[] // brand slugs
  minPrice?: number
  maxPrice?: number
  years: YearKey[]
  body?: BodyValue
  topInspection: boolean
  warranty: boolean
  installment: boolean
  sort: SortKey
  page: number
}

export type RawParams = Record<string, string | string[] | undefined>
type Raw = string | string[] | undefined

const one = (v: Raw) => (Array.isArray(v) ? v[0] : v)
const list = (v: Raw) =>
  (one(v) ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
const int = (v: Raw) => {
  const s = one(v)
  if (!s) return undefined
  const n = Number(s)
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : undefined
}
const isYearKey = (v: string): v is YearKey => YEAR_GROUPS.some((g) => g.key === v)

// URL -> typed filters. Anything unknown or malformed is dropped, never trusted.
export function parseFilters(params: RawParams): CarFilters {
  const sort = one(params.sort)
  const body = one(params.body)

  return {
    q: (one(params.q) ?? '').trim().slice(0, 60),
    brands: list(params.brand)
      .filter((s) => /^[a-z0-9-]+$/.test(s))
      .slice(0, 20),
    minPrice: int(params.minPrice),
    maxPrice: int(params.maxPrice),
    years: list(params.year).filter(isYearKey),
    body: BODY_TYPES.find((b) => b.value === body)?.value,
    topInspection: one(params.inspection) === '1',
    warranty: one(params.warranty) === '1',
    installment: one(params.installment) === '1',
    sort: sort && (Object.keys(SORT_OPTIONS) as string[]).includes(sort) ? (sort as SortKey) : DEFAULT_SORT,
    page: Math.min(Math.max(int(params.page) ?? 1, 1), 1000),
  }
}

// Typed filters -> URL query string. Default values are left out to keep URLs short.
export function toQueryString(f: Partial<CarFilters>): string {
  const p = new URLSearchParams()
  if (f.q) p.set('q', f.q)
  if (f.brands?.length) p.set('brand', f.brands.join(','))
  if (f.minPrice !== undefined) p.set('minPrice', String(f.minPrice))
  if (f.maxPrice !== undefined) p.set('maxPrice', String(f.maxPrice))
  if (f.years?.length) p.set('year', f.years.join(','))
  if (f.body) p.set('body', f.body)
  if (f.topInspection) p.set('inspection', '1')
  if (f.warranty) p.set('warranty', '1')
  if (f.installment) p.set('installment', '1')
  if (f.sort && f.sort !== DEFAULT_SORT) p.set('sort', f.sort)
  if (f.page && f.page > 1) p.set('page', String(f.page))
  return p.toString()
}

export const carsUrl = (f: Partial<CarFilters>) => {
  const qs = toQueryString(f)
  return qs ? `${CARS_PATH}?${qs}` : CARS_PATH
}

// How many filter "groups" are active (used for the "۵ فیلتر فعال" badge).
export const activeFilterCount = (f: CarFilters) =>
  [
    f.q !== '',
    f.brands.length > 0,
    f.minPrice !== undefined || f.maxPrice !== undefined,
    f.years.length > 0,
    f.body !== undefined,
    f.topInspection,
    f.warranty,
    f.installment,
  ].filter(Boolean).length
