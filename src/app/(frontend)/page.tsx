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

const images = [
  '/cars/bmw/bmw-series-3/bmw-series-3-blue.jpg',
  '/cars/bmw/bmw-series-3/bmw-series-3-controls.jpg',
  '/cars/bmw/bmw-series-3/bmw-series-3-inside.jpg',
]

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
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
              <Button variant={'secondary'}>
                <ShieldCheckIcon className="text-primary" size={60} /> درخواست کارشناسی و تست درایو
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:justify-between mt-5 bg-[#13171d] p-5 rounded-xl w-full lg:w-fit gap-40">
            <div className="flex flex-col gap-1">
              <p className="text-gold text-sm font-bold">{toPersianNumbers('4,800')}</p>
              <p className="text-xs">معامله موفق VIP</p>
            </div>
            <div className="flex flex-col gap-1">
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
      <div className="flex flex-col gap-5 bg-[#10141a] p-10 w-full">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gold">ویترین کمپانی</p>
              <h2 className="font-semibold text-xl">انتخاب هوشمند بر اساس برند</h2>
            </div>
            <Link href={`/cars`} className="text-gold text-xs flex gap-2 items-center">
              مشاهده تمامی برند ها <ArrowLeftIcon size={15} />
            </Link>
          </div>
          <BrandRectangle />
        </div>
      </div>
      <HeroThree category={category} />
      <HeroFour />
      <TestDriveSection />
    </div>
  )
}
