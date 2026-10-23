export { cn } from 'cn'

// src/lib/utils/persian-numbers.ts

/**
 * Maps English digits to Persian digits
 */
const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'] as const

/**
 * Checks if a string already contains Persian digits
 */
function hasPersianDigits(str: string): boolean {
  return /[۰-۹]/.test(str)
}

/**
 * Converts English digits (0-9) to Persian digits (۰-۹)
 *
 * @example
 * toPersianNumbers(1402)           // "۱۴۰۲"
 * toPersianNumbers("4,500")        // "۴,۵۰۰"
 * toPersianNumbers("۲۲,۰۰۰")       // "۲۲,۰۰۰" (already Persian — unchanged)
 * toPersianNumbers(null)           // ""
 */
export function toPersianNumbers(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''

  const str = String(value)

  // Don't double-convert if it's already Persian
  if (hasPersianDigits(str)) return str

  return str.replace(/\d/g, (digit) => persianDigits[Number(digit)])
}

/**
 * Formats a number as a Persian price with thousands separators.
 * Adds "تومان" suffix by default — set `withCurrency: false` to omit.
 *
 * @example
 * toPersianPrice(22900000000)                        // "۲۲,۹۰۰,۰۰۰,۰۰۰ تومان"
 * toPersianPrice("1085000000")                       // "۱,۰۸۵,۰۰۰,۰۰۰ تومان"
 * toPersianPrice(22900000000, { withCurrency: false }) // "۲۲,۹۰۰,۰۰۰,۰۰۰"
 * toPersianPrice(500000000, { compact: true })       // "۵۰۰ میلیون تومان"
 * toPersianPrice(null)                               // "—"
 */
export function toPersianPrice(
  value: string | number | null | undefined,
  options: {
    withCurrency?: boolean // default: true
    compact?: boolean // default: false — shows "میلیون"/"میلیارد"
    currency?: string // default: "تومان"
  } = {},
): string {
  const { withCurrency = true, compact = false, currency = 'تومان' } = options

  if (value === null || value === undefined || value === '') return '—'

  const num = typeof value === 'string' ? Number(value) : value

  if (isNaN(num)) return '—'

  // Compact mode — "۵۰۰ میلیون" / "۲۲.۹ میلیارد"
  if (compact) {
    const { amount, unit } = toCompact(num)
    const formatted = toPersianNumbers(amount)
    const suffix = withCurrency ? ` ${unit} ${currency}` : ` ${unit}`
    return `${formatted}${suffix}`
  }

  // Full mode — "۲۲,۹۰۰,۰۰۰,۰۰۰ تومان"
  const formatted = toPersianNumbers(num.toLocaleString('en-US'))
  return withCurrency ? `${formatted} ${currency}` : formatted
}

/**
 * Returns the Persian "compact" representation of a large number.
 */
function toCompact(num: number): { amount: string; unit: string } {
  const abs = Math.abs(num)

  if (abs >= 1_000_000_000) {
    const amount = (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '')
    return { amount, unit: 'میلیارد' }
  }
  if (abs >= 1_000_000) {
    const amount = (num / 1_000_000).toFixed(1).replace(/\.0$/, '')
    return { amount, unit: 'میلیون' }
  }
  if (abs >= 1_000) {
    const amount = (num / 1_000).toFixed(1).replace(/\.0$/, '')
    return { amount, unit: 'هزار' }
  }
  return { amount: String(num), unit: '' }
}

/**
 * Formats a date as a Persian (Jalali) date string.
 *
 * @example
 * toPersianDate(new Date())    // "۵ مهر ۱۴۰۳"
 * toPersianDate("2024-09-26")  // "۵ مهر ۱۴۰۳"
 */
export function toPersianDate(
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('fa-IR', options).format(d)
}
