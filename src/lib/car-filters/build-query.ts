import type { Where } from 'payload'
import {
  YEAR_GROUPS,
  toEnglishDigits,
  toPersianDigits,
  type CarFilters,
  type YearKey,
} from './schema'

const yearGroupWhere = (key: YearKey): Where => {
  // "Before 1400 / 2022": Jalali years are ~1000-1400, Gregorian ~1900-2021.
  if (key === 'older') {
    return {
      or: [
        { and: [{ year: { greater_than_equal: 1000 } }, { year: { less_than_equal: 1400 } }] },
        { and: [{ year: { greater_than_equal: 1900 } }, { year: { less_than_equal: 2021 } }] },
      ],
    }
  }
  const group = YEAR_GROUPS.find((g) => g.key === key)
  return { year: { in: [...(group?.years ?? [])] } }
}

// One search word -> "matches the model, OR the color, OR the brand name, OR the year".
// Digits are tried in English AND Persian form, because model names may use either.
const searchTokenWhere = (token: string): Where => {
  const english = toEnglishDigits(token)
  const variants = [...new Set([token, english, toPersianDigits(english)])]

  const or: Where[] = []
  for (const variant of variants) {
    or.push(
      { model: { like: variant } },
      { color: { like: variant } },
      { 'brand.name': { like: variant } }, // dot notation searches inside the related brand
    )
  }

  // `year` is a number field, so `like` can't search it. A 4-digit word is matched as a year instead.
  // 2023 also matches 1402 (the same year in the other calendar), exactly like the sidebar's year groups.
  if (/^\d{4}$/.test(english)) {
    const n = Number(english)
    const group = YEAR_GROUPS.find((g) => (g.years as readonly number[]).includes(n))
    or.push({ year: group ? { in: [...group.years] } : { equals: n } })
  }

  return { or }
}

// Typed filters -> Payload `where` query. Every active filter adds one condition, all joined with AND.
export function buildWhere(f: CarFilters): Where {
  const and: Where[] = [{ isAvailable: { equals: true } }]

  if (f.q) {
    // Every word must match something, so "porsche 2023" finds 2023 Porsches.
    const tokens = f.q.split(/\s+/).filter(Boolean).slice(0, 5)
    for (const token of tokens) and.push(searchTokenWhere(token))
  }
  if (f.brands.length) and.push({ 'brand.slug': { in: f.brands } })
  if (f.minPrice !== undefined) and.push({ price: { greater_than_equal: f.minPrice } })
  if (f.maxPrice !== undefined) and.push({ price: { less_than_equal: f.maxPrice } })
  if (f.years.length) and.push({ or: f.years.map(yearGroupWhere) })
  if (f.body) and.push({ bodyType: { equals: f.body } })
  if (f.topInspection) and.push({ inspectionGrade: { equals: 'a-plus' } })
  if (f.warranty) and.push({ hasWarranty: { equals: true } })
  if (f.installment) and.push({ installmentAvailable: { equals: true } })

  return { and }
}
