import Link from 'next/link'
import { Suspense } from 'react'
import { ArrowLeftIcon, ShieldCheckIcon } from 'lucide-react'
import { getFacets } from '@/lib/car-filters/facets'
import type { Facets } from '@/lib/car-filters/schema'
import { getHeroCars } from '@/lib/hero/get-hero-cars'
import { toSlide } from '@/lib/hero/to-slide'
import HeroSearch from './HeroSearch'
import HeroSlider from './HeroSlider'

// ---- Edit your texts and numbers here ---------------------------------------
const COPY = {
  badgeMain: 'نمایشگاه مرکزی دمو خودرو • زعفرانیه',
  badgeSub: 'بزرگ‌ترین کالکشن سوپراسپرت و خودروهای روز',
  titleStart: 'مرجع تخصصی خرید و فروش خودروهای',
  titleHighlight: 'سوپرلوکس و اقتصادی',
  titleEnd: 'در ایران',
  text: 'تضمین اصالت کارشناسی ۱۰۰٪ با گواهی مکتوب ۲۱۰ نقطه‌ای، تحویل فوری در سالن اختصاصی تحویل، و عقد رسمی قرارداد با پشتوانه ۱۲ سال اعتماد در بازار خودرو کشور.',
  primaryCta: 'مشاهده موجودی ویژه و رزرو',
  secondaryCta: 'درخواست کارشناسی و تست درایو',
}
const PRIMARY_HREF = '/cars'
const SECONDARY_HREF = '#test-drive' // give your test drive section id="test-drive"

const STATS = [
  { value: '۴,۸۰۰+', label: 'معاملات موفق دمو خودرو' },
  { value: '۱۰۰٪', label: 'تضمین سلامت شاسی و رنگ' },
  { value: '۲۴ ساعته', label: 'تحویل آنی سند و پلاک' },
]
// -----------------------------------------------------------------------------

// The search bar needs the brand list. It waits for that on its own, so the rest of the hero never waits.
async function SearchLoader({ facets }: { facets: Promise<Facets> }) {
  const { brands, total } = await facets
  return <HeroSearch brands={brands.map(({ slug, name }) => ({ slug, name }))} total={total} />
}

export default async function HeroSection() {
  const facets = getFacets() // start now, don't wait yet
  const cars = await getHeroCars(3)
  const slides = cars.map(toSlide)

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden border-b border-[#4e453b]/30 bg-[#0a0e14] pb-14 pt-8 lg:pt-8"
    >
      {/* Soft golden glows. Plain gradients look the same as huge blurred circles but cost far less to paint. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_75%_0%,rgba(247,206,151,0.10),transparent_70%),radial-gradient(500px_circle_at_10%_40%,rgba(222,178,120,0.08),transparent_70%)]"
      />

      <div className="relative z-20 mx-auto max-w-[1440px] px-5 lg:px-12">
        {/* Heading */}
        <div className="mx-auto mb-4 flex max-w-4xl flex-col items-center text-center">
          {/* <div className="mb-4 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-[#f7ce97]/30 bg-[#262a31]/90 px-4 py-1.5 text-[#f7ce97] shadow-[0_4px_20px_rgba(217,179,126,0.15)]">
            <span aria-hidden className="h-2 w-2 animate-pulse rounded-full bg-[#f7ce97]" />
            <span className="text-[11px] font-bold tracking-wider">{COPY.badgeMain}</span>
            <span aria-hidden className="text-[#4e453b]">
              |
            </span>
            <span className="text-[10px] font-medium text-[#d2c4b6]">{COPY.badgeSub}</span>
          </div> */}

          <h1 className="mb-4 text-[34px] font-bold leading-tight tracking-tight text-[#dfe2eb] sm:text-[46px] lg:text-[58px]">
            {COPY.titleStart}{' '}
            <span className="bg-gradient-to-l from-[#f7ce97] via-[#fccd91] to-[#ffddb1] bg-clip-text text-transparent">
              {COPY.titleHighlight}
            </span>{' '}
            {COPY.titleEnd}
          </h1>

          {/* <p className="max-w-2xl text-[15px] leading-relaxed text-[#d2c4b6] sm:text-lg">
            {COPY.text}
          </p> */}
        </div>

        {/* The slider with the top cars */}
        {slides.length > 0 && <HeroSlider slides={slides} />}

        {/* Buttons and numbers */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 pb-4 lg:flex-row">
          <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
            <Link
              href={PRIMARY_HREF}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#f7ce97] px-8 py-4 font-bold text-[#432c03] shadow-[0_4px_24px_rgba(217,179,126,0.35)] transition-colors hover:bg-[#deb278] sm:flex-initial"
            >
              {COPY.primaryCta} <ArrowLeftIcon size={20} aria-hidden />
            </Link>
            <a
              href={SECONDARY_HREF}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#4e453b]/40 bg-[#262a31]/80 px-6 py-4 font-medium text-[#dfe2eb] transition-colors hover:bg-[#31353c] sm:flex-initial"
            >
              <ShieldCheckIcon size={20} className="text-[#f7ce97]" aria-hidden />{' '}
              {COPY.secondaryCta}
            </a>
          </div>

          <dl className="flex items-center gap-6 text-right">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-6">
                {i > 0 && <span aria-hidden className="h-8 w-px bg-[#4e453b]/30" />}
                <div className="flex flex-col">
                  <dd className="text-lg font-bold text-[#f7ce97]">{stat.value}</dd>
                  <dt className="text-xs text-[#d2c4b6]">{stat.label}</dt>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* Quick search */}
        <Suspense
          fallback={
            <div
              aria-hidden
              className="mt-6 h-80 animate-pulse rounded-2xl bg-[#262a31]/60 sm:h-64 lg:h-32"
            />
          }
        >
          <SearchLoader facets={facets} />
        </Suspense>
      </div>
    </section>
  )
}
