import { toPersianPrice } from '@/lib/utils'
import type { getHeroCars } from './get-hero-cars'

export type HeroCar = Awaited<ReturnType<typeof getHeroCars>>[number]

// A plain, small object. This is all the browser receives for each slide.
export type HeroSlide = {
  id: number
  slug: string
  title: string
  subtitle: string
  description: string | null
  imageUrl: string | null
  imageAlt: string
  priceText: string
  tourUrl: string | null
  badge: string
  chips: string[]
  metrics: { icon: 'speed' | 'power' | 'mileage' | 'verified'; label: string; value: string }[]
}

const fa = new Intl.NumberFormat('fa-IR')

// Cars from the database -> slides. Runs on the server, so the browser gets only what it needs.
export function toSlide(car: HeroCar): HeroSlide {
  const brand = typeof car.brand === 'object' ? car.brand : null
  const firstImage = car.images?.[0]?.image
  const image = typeof firstImage === 'object' ? firstImage : null
  const title = `${brand?.name ?? ''} ${car.model} ${car.year}`.trim()
  const mileage = car.mileage ?? 0

  // Development help: if a slide has no picture, the terminal tells you why.
  if (!image?.url && process.env.NODE_ENV !== 'production') {
    const why =
      typeof firstImage === 'number'
        ? 'the photo came back as an ID only (it was not populated)'
        : firstImage
          ? 'the photo has no url'
          : 'the car has no photos'
    console.warn(`[hero] "${title}" has no usable image: ${why}. images =`, JSON.stringify(car.images))
  }
  const score = car.inspection?.score
  const guaranteeDays = car.inspection?.returnGuaranteeDays

  // Each metric only appears if there is real data behind it
  const metrics: HeroSlide['metrics'] = []
  if (car.specs?.acceleration) {
    metrics.push({ icon: 'speed', label: 'شتاب صفر تا ۱۰۰', value: `${fa.format(car.specs.acceleration)} ثانیه` })
  }
  if (car.specs?.horsepower) {
    metrics.push({ icon: 'power', label: 'حداکثر توان خروجی', value: `${fa.format(car.specs.horsepower)} اسب بخار` })
  }
  metrics.push({
    icon: 'mileage',
    label: 'کارکرد',
    value: mileage === 0 ? 'صفر کیلومتر' : `${fa.format(mileage)} کیلومتر`,
  })
  metrics.push({
    icon: 'verified',
    label: 'برگه کارشناسی رسمی',
    value: car.inspectionGrade === 'a-plus' ? 'تاییدیه سلامت کامل' : score != null ? `${fa.format(score)} از ۱۰۰` : 'تایید شده شوروم',
  })

  return {
    id: car.id,
    slug: car.slug,
    title,
    subtitle: `${brand?.name ?? ''} • ${car.year}`.replace(/^ • /, ''),
    description: car.description ? car.description.slice(0, 140) : null,
    imageUrl: image?.url ?? null,
    imageAlt: image?.alt || title,
    priceText: toPersianPrice(car.price),
    tourUrl: car.tour360Url ?? null,
    badge: car.isFeatured ? 'خودروی ویژه هفته' : 'پیشنهاد ویژه شوروم',
    chips: ['تحویل فوری شوروم', ...(guaranteeDays ? [`ضمانت بازگشت ${fa.format(guaranteeDays)} روزه`] : [])],
    metrics,
  }
}
