import type { Where } from 'payload'

export type CarFilter = {
  key: string // what appears in the URL: ?category=suv
  label: string // what the button says
  where: Where[] // conditions added to the Payload query
}

// To add, remove or change a filter, edit only this list.
export const carFilters: CarFilter[] = [
  { key: 'all', label: 'همه خودروها', where: [] },
  {
    key: 'luxury',
    label: 'سوپرلوکس وارداتی',
    where: [{ origin: { equals: 'imported' } }, { isLuxury: { equals: true } }],
  },
  { key: 'suv', label: 'شاسی بلند', where: [{ bodyType: { equals: 'suv' } }] },
  { key: 'sedan', label: 'سدان تشریفاتی', where: [{ bodyType: { equals: 'sedan' } }] },
  { key: 'domestic', label: 'تولید داخلی', where: [{ origin: { equals: 'domestic' } }] },
]

// Unknown or missing values (like ?category=hacked) safely fall back to "all".
export const getFilter = (key?: string): CarFilter =>
  carFilters.find((filter) => filter.key === key) ?? carFilters[0]
