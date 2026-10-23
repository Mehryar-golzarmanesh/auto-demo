import BrandRectangle from '@/components/BrandRectangle'
import ImageSlider from '@/components/ImageSlider'
import { Button } from '@/components/ui/button'
import { toPersianNumbers } from '@/lib/utils'
import { ArrowLeft, ArrowLeftIcon, Dot, ShieldCheckIcon } from 'lucide-react'
import Link from 'next/link'
import HeroThree from './components/hero-3'
import HeroFour from './components/hero-4'
import TestDriveSection from '@/actions/TestDriveSection'
import HeroSection from '@/components/hero/HeroSection'
import Image from 'next/image'
import { Suspense } from 'react'

const images = [
  '/cars/bmw/bmw-series-3/bmw-series-3-blue.jpg',
  '/cars/bmw/bmw-series-3/bmw-series-3-controls.jpg',
  '/cars/bmw/bmw-series-3/bmw-series-3-inside.jpg',
]

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; book?: string }>
}) {
  const { category, book } = await searchParams
  return (
    <div className="min-h-screen">
      {/* <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-10 p-10 max-w-7xl mx-auto">
        <div>
          <div className="flex items-center text-gold bg-[#21252b] rounded-full w-fit pl-4 text-sm mb-3">
            <Dot size={40} className="animate-pulse text-primary " />
            نمایشگاه مرکزی دمو خودرو | زعفرانیه
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="max-w-180 text-5xl font-bold leading-15">
              مرجع تخصصی خرید و فروش خودروهای{' '}
              <span className="text-primary">سوپرلوکس و اقتصادی</span> در ایران
            </h2>
            <p className="text-primary-muted max-w-150">
              تضمین اصالت کارشناسی ۱۰۰٪ با گواهی مکتوب ۲۱۰ نقطه‌ای، تحویل آنی خودرو در شوروم، و عقد
              رسمی قرارداد با پشتوانه ۱۲ سال اعتماد در بازار خودرو کشور.
            </p>
            <div className="flex gap-5 items-center">
              <Button>
                مشاهده موجودی روز <ArrowLeft />
              </Button>
      <div id="test-drive">
        <Suspense
          fallback={
            <div
              aria-hidden
              className="mx-10 mt-10 h-[520px] animate-pulse rounded-3xl bg-[#181c22]"
            />
          }
        >
          <TestDriveSection eagerBooking={book === '1'} />
        </Suspense>
      </div>
              <p className="text-gold text-sm font-bold">{toPersianNumbers(100)}%</p>
              <p className="text-xs">تضمین اصالت شاسی</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gold text-sm font-bold">{toPersianNumbers(24)} ساعته</p>
              <p className="text-xs">تحویل پلاک و سند</p>
            </div>
          </div>
        </div>
        <div>
          <ImageSlider imageUrls={images} />
        </div>
      </div> */}
      <HeroSection />
      {/* انتخاب هوشمند */}
      <div className="relative isolate flex w-full flex-col gap-5 overflow-hidden bg-[#10141a] p-10">
        <Image
          src="/car-bg.webp"
          fill
          sizes="100vw"
          alt=""
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#10141a]/45 shadow-inner" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gold">ویترین کمپانی</p>
              <h2 className="font-semibold text-xl">انتخاب هوشمند بر اساس برند</h2>
            </div>
            <Link href={`/cars`} className="text-gold text-xs flex gap-2 items-center">
              مشاهده تمامی برند ها <ArrowLeftIcon size={15} />
            </Link>
          </div>
          <Suspense
            fallback={
              <div aria-hidden className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
                {Array.from({ length: 8 }, (_, index) => (
                  <div key={index} className="h-28 animate-pulse rounded-xl bg-[#1c2026]" />
                ))}
              </div>
            }
          >
            <BrandRectangle />
          </Suspense>
        </div>
      </div>
      <Suspense
        fallback={
          <div aria-hidden className="mx-auto grid max-w-7xl grid-cols-1 gap-5 p-10 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="overflow-hidden rounded-xl bg-[#181c22]">
                <div className="aspect-[16/10] animate-pulse bg-[#31353c]" />
                <div className="h-40 animate-pulse p-5" />
              </div>
            ))}
          </div>
        }
      >
        <HeroThree category={category} />
      </Suspense>
      <HeroFour />
      <div id="test-drive" className="scroll-mt-24">
        <Suspense
          fallback={
            <div
              aria-hidden
              className="mx-10 mt-10 h-[520px] animate-pulse rounded-3xl bg-[#181c22]"
            />
          }
        >
          <TestDriveSection />
        </Suspense>
      </div>
    </div>
  )
}
