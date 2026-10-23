import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import TestDriveForm from './TestDriveForm'

interface Props {
  defaultCarId?: number
}

const TestDriveSection = async ({ defaultCarId }: Props) => {
  const payload = await getPayload({ config })

  // depth: 1 so `car.brand` is a populated object we can read `.name` from
  const { docs } = await payload.find({
    collection: 'cars',
    where: { isAvailable: { equals: true } },
    depth: 1,
    limit: 100,
    sort: 'model',
    select: { id: true, brand: true, model: true, year: true },
    populate: { brands: { name: true } },
  })

  const cars = docs.map((car) => {
    const brandName = typeof car.brand === 'object' ? car.brand.name : ''
    return { id: car.id, label: `${brandName} ${car.model} ${car.year}`.trim() }
  })

  return (
    <div className="px-10 2xl:px-0 pb-10">
      <section
        id="test-drive"
        aria-labelledby="test-drive-title"
        className="rounded-4xl bg-linear-to-br from-[#2a2e35] to-[#1c2026] p-6 md:p-10 max-w-7xl mx-auto mt-10"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[280px_1fr]">
          {/* Advisor: first in the DOM, so it sits on the right in RTL */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="relative">
              <Image
                src="/advisor.jpg" // put a photo in /public
                alt="مشاور اختصاصی"
                width={160}
                height={160}
                className="h-40 w-40 rounded-2xl border border-[#f5c48a]/40 object-cover"
              />
              <span className="absolute -bottom-2 inset-s-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#f5c48a] px-2 py-0.5 text-[10px] font-semibold text-[#2a1b05] rtl:translate-x-1/2">
                پاسخگوی آنلاین
              </span>
            </div>
            <p className="mt-2 font-semibold text-[#dfe2eb]">مهریار گلزارمنش</p>
            <p className="text-xs text-gold">مشاور اختصاصی نمایشگاه</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gold">نوبت اختصاصی بدون معطلی</p>
              <h2 id="test-drive-title" className="text-2xl font-bold text-[#dfe2eb] md:text-4xl">
                رزرو بازدید حضوری و تست درایو اختصاصی
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-[#d2c4b6]">
                جهت هماهنگی بازدید از نمایشگاه و تست درایو خودروی مورد نظرتان، فرم زیر را تکمیل کنید
                تا کارشناس ما حداکثر ۱۵ دقیقه‌ی دیگر با شما تماس بگیرد.
              </p>
            </div>

            <TestDriveForm cars={cars} defaultCarId={defaultCarId} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default TestDriveSection
