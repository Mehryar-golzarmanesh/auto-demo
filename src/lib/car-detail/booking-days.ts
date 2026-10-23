// Which days a visitor may book a showroom visit. Used by the booking form AND the server action,
// so the form can't offer a day that the server then refuses.

export const MAX_DAYS_AHEAD = 14 // how far into the future a visit can be booked
export const MAX_OPTIONS = 10 // how many days the dropdown shows
const CLOSED_WEEKDAYS = [5] // 0 = Sunday ... 5 = Friday ... 6 = Saturday. Your showroom is open Saturday to Thursday.

const TEHRAN = 'Asia/Tehran'
const DAY_MS = 86_400_000

export type BookingDay = { value: string; label: string }

// Today's date in Tehran as "2026-10-24", whatever time zone the visitor or the server is in.
// (The 'en-CA' locale happens to format dates as YYYY-MM-DD.)
const isoInTehran = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TEHRAN, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)

// "2026-10-23" is a plain calendar date, so reading its weekday at noon UTC can't be off by one.
const isClosedDay = (iso: string) => CLOSED_WEEKDAYS.includes(new Date(`${iso}T12:00:00Z`).getUTCDay())

// The dropdown options, e.g. { value: '2026-10-24', label: 'فردا، شنبه ۲ آبان' }.
// `fa-IR` uses the Persian (Jalali) calendar, so the labels are Jalali automatically.
export function getBookingDays(now = new Date()): BookingDay[] {
  const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: TEHRAN,
  })

  const days: BookingDay[] = []
  for (let i = 1; i <= MAX_DAYS_AHEAD && days.length < MAX_OPTIONS; i++) {
    const date = new Date(now.getTime() + i * DAY_MS)
    const value = isoInTehran(date)
    if (isClosedDay(value)) continue
    days.push({ value, label: `${i === 1 ? 'فردا، ' : ''}${formatter.format(date)}` })
  }
  return days
}

// Server-side check: tomorrow or later, not beyond the limit, and not a closed day.
export function isBookableDay(iso: string, now = new Date()) {
  const today = isoInTehran(now)
  const last = isoInTehran(new Date(now.getTime() + MAX_DAYS_AHEAD * DAY_MS))
  return iso > today && iso <= last && !isClosedDay(iso)
}
