import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCar } from '@/lib/car-detail/get-car'
import ActionBar from '@/components/car-detail/ActionBar'
import AdvisorCard from '@/components/car-detail/AdvisorCard'
import BookingCard from '@/components/car-detail/BookingCard'
import Gallery, { type Photo } from '@/components/car-detail/Gallery'
import InspectionCard from '@/components/car-detail/InspectionCard'
import PriceCard from '@/components/car-detail/PriceCard'
import RelatedCars from '@/components/car-detail/RelatedCars'
import SpecsCard from '@/components/car-detail/SpecsCard'

// The page is built once, saved, and rebuilt at most once a minute: very fast for visitors.
// Edits in the admin panel appear within about 60 seconds.
export const revalidate = 60

// Pre-build the pages of cars that are for sale. Others are built on their first visit.
export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'cars',
      where: { isAvailable: { equals: true } },
      limit: 50,
      depth: 0,
      select: { slug: true },
    })
    return docs.map((car) => ({ slug: car.slug }))
  } catch {
    return [] // e.g. no database during the build: pages are then built on demand
  }
}

type Props = { params: Promise<{ slug: string }> }

const fa = new Intl.NumberFormat('fa-IR')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const car = await getCar(slug)
  if (!car) return { title: 'خودرو پیدا نشد' }

  const brandName = typeof car.brand === 'object' ? car.brand.name : ''
  const title = `${brandName} ${car.model} ${car.year}`.trim()
  const firstImage = car.images?.[0]?.image
  const image = typeof firstImage === 'object' ? firstImage?.url : undefined

  return {
    title: `${title} | دمو خودرو`,
    description:
      car.description?.slice(0, 160) ||
      `خرید ${title} با گزارش کارشناسی و ضمانت رسمی و امکان رزرو تست درایو.`,
    openGraph: { title, images: image ? [image] : undefined },
  }
}

export default async function CarPage({ params }: Props) {
  const { slug } = await params
  const car = await getCar(slug)
  if (!car) notFound()

  const brand = typeof car.brand === 'object' ? car.brand : null
  const title = `${brand?.name ?? ''} ${car.model} ${car.year}`.trim()
  const mileage = car.mileage ?? 0

  // Turn the Payload images array into a plain list the (client) gallery can use
  const photos: Photo[] = (car.images ?? []).flatMap((item) => {
    const media = typeof item.image === 'object' ? item.image : null
    if (!media?.url) return []
    return [
      {
        url: media.url,
        alt: media.alt || title,
        caption: (item as { caption?: string | null }).caption ?? '',
      },
    ]
  })

  const badges = [
    car.isAvailable ? 'تحویل آنی در محل' : 'فروخته شده',
    car.inspectionGrade === 'a-plus' ? 'تاییدیه کارشناسی A+' : null,
    mileage === 0 ? 'صفر کیلومتر' : null,
  ].filter((b): b is string => Boolean(b))

  const metrics = [
    { label: 'کارکرد واقعی', value: mileage === 0 ? '۰' : fa.format(mileage), unit: 'کیلومتر' },
    car.specs?.acceleration
      ? { label: 'شتاب ۰-۱۰۰', value: fa.format(car.specs.acceleration), unit: 'ثانیه' }
      : null,
    car.specs?.horsepower
      ? { label: 'قدرت موتور', value: fa.format(car.specs.horsepower), unit: 'اسب بخار' }
      : null,
  ].filter((m): m is { label: string; value: string; unit: string } => m !== null)

  // Structured data: helps Google show price and availability in search results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: title,
    brand: brand ? { '@type': 'Brand', name: brand.name } : undefined,
    vehicleModelDate: String(car.year),
    color: car.color ?? undefined,
    mileageFromOdometer: { '@type': 'QuantitativeValue', value: mileage, unitCode: 'KMT' },
    image: photos.map((p) => p.url),
    offers: {
      '@type': 'Offer',
      price: car.price * 10, // schema.org has no Toman, so the price is given in Rial
      priceCurrency: 'IRR',
      availability: car.isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
    },
  }

  return (
    <div className="pb-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Breadcrumbs + quick actions */}
      <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-3 px-5 py-3 md:flex-row md:items-center lg:px-12">
        <nav
          aria-label="راهنمای مسیر"
          className="flex flex-wrap items-center gap-2 text-xs text-[#d2c4b6]"
        >
          <Link href="/" className="hover:text-[#f7ce97]">
            صفحه اصلی
          </Link>
          <span className="text-[#4e453b]">/</span>
          <Link href="/cars" className="hover:text-[#f7ce97]">
            نمایشگاه خودروها
          </Link>
          {brand && (
            <>
              <span className="text-[#4e453b]">/</span>
              <Link href={`/cars?brand=${brand.slug}`} className="hover:text-[#f7ce97]">
                {brand.name}
              </Link>
            </>
          )}
          <span className="text-[#4e453b]">/</span>
          <span className="font-medium text-[#f7ce97]">
            {car.model} {car.year}
          </span>
        </nav>
        <ActionBar slug={car.slug} title={title} />
      </div>

      {/* Title + metrics */}
      <header className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 px-5 pb-4 pt-6 lg:flex-row lg:items-end lg:px-12">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-[#dfe2eb] lg:text-4xl">{title}</h1>
          {car.description && (
            <p className="max-w-4xl text-sm leading-7 text-[#d2c4b6]">{car.description}</p>
          )}
        </div>

        {metrics.length > 0 && (
          <dl className="flex shrink-0 items-center gap-5 rounded-xl bg-[#181c22]/70 px-5 py-3">
            {metrics.map((metric, i) => (
              <div key={metric.label} className="flex items-center gap-5">
                {i > 0 && <span aria-hidden className="h-8 w-px bg-[#31353c]" />}
                <div>
                  <dt className="text-[11px] text-[#d2c4b6]">{metric.label}</dt>
                  <dd>
                    <span className="text-xl font-bold text-[#f7ce97]">{metric.value}</span>
                    <span className="ms-1 text-xs text-[#d2c4b6]">{metric.unit}</span>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        )}
      </header>

      {/* Main grid: content on the right (first in RTL), sticky booking column on the left */}
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-8 px-5 py-4 lg:grid-cols-12 lg:px-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          <Gallery photos={photos} badges={badges} tourUrl={car.tour360Url} />
          <InspectionCard car={car} />
          <SpecsCard car={car} />
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:col-span-4">
          <PriceCard car={car} />
          {car.isAvailable ? (
            <BookingCard carId={car.id} />
          ) : (
            <div className="rounded-xl bg-[#181c22] p-6 text-sm leading-7 text-[#d2c4b6]">
              این خودرو فروخته شده است. برای دیدن خودروهای مشابه به لیست نمایشگاه سر بزنید.
            </div>
          )}
          <AdvisorCard brandName={brand?.name} />
        </aside>
      </div>

      {/* Similar cars stream in after the rest of the page is already visible */}
      <Suspense fallback={<div className="mt-12 h-96" aria-hidden />}>
        <RelatedCars car={car} />
      </Suspense>
    </div>
  )
}
