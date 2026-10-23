'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftIcon, CalendarDaysIcon, CheckCircle2Icon, SmartphoneIcon, UserIcon } from 'lucide-react'
import { getBookingDays, type BookingDay } from '@/lib/car-detail/booking-days'
import { submitTestDrive } from '@/test-drive/test-drive.action'
import { testDriveSchema, toEnglishDigits, type TestDriveValues } from '@/test-drive/test-drive.schema'

const TIME_SLOTS = ['۱۰:۰۰ تا ۱۳:۰۰ (صبح)', '۱۶:۰۰ تا ۱۸:۰۰ (عصر)', '۱۸:۰۰ تا ۲۱:۰۰ (شب)']

const fieldClass =
  'h-11 w-full rounded-lg border-0 bg-[#1c2026] px-3.5 text-sm text-[#dfe2eb] placeholder:text-[#d2c4b6]/50 focus:outline-none focus:ring-1 focus:ring-[#f7ce97] [color-scheme:dark]'
const labelClass = 'mb-1 block text-xs font-medium text-[#d2c4b6]'
const errorClass = 'mt-1 text-xs text-red-400'
const iconClass = 'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#d2c4b6]/60'

export default function BookingCard({ carId }: { carId: number }) {
  const [submitted, setSubmitted] = useState(false)
  const [days, setDays] = useState<BookingDay[]>([])

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TestDriveValues>({
    resolver: zodResolver(testDriveSchema),
    defaultValues: {
      name: '',
      phone: '',
      carId: String(carId), // fixed: this page is about one car
      preferredDate: '',
      preferredTime: TIME_SLOTS[0],
      wantsCall: true,
    },
  })

  // The list of days is made in the browser, because a cached page would otherwise show yesterday's dates
  useEffect(() => setDays(getBookingDays()), [])

  // Once the options exist, pre-select the first day (usually "tomorrow")
  useEffect(() => {
    if (days.length > 0) setValue('preferredDate', days[0].value)
  }, [days, setValue])

  const onSubmit = async (values: TestDriveValues) => {
    if (!values.preferredDate) {
      setError('preferredDate', { message: 'یک روز برای بازدید انتخاب کنید.' })
      return
    }

    const result = await submitTestDrive(values)
    if (!result.success) {
      setError('root', { message: result.error })
      return
    }
    setSubmitted(true)
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-[#181c22] p-6 shadow-2xl print:hidden" id="test-drive">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f7ce97]/10 text-[#f7ce97]">
          <CalendarDaysIcon size={20} aria-hidden />
        </div>
        <div>
          <h3 className="font-bold text-[#dfe2eb]">رزرو نوبت تست درایو و بازدید حضوری</h3>
          <p className="text-xs text-[#d2c4b6]">حضور اختصاصی در سالن VIP</p>
        </div>
      </div>

      {submitted ? (
        <div role="status" className="flex items-start gap-3 rounded-lg bg-[#f7ce97]/10 p-4 text-sm font-medium text-[#f7ce97]">
          <CheckCircle2Icon size={20} className="mt-0.5 shrink-0" aria-hidden />
          درخواست تست درایو شما با موفقیت ثبت شد. کارشناس مربوطه به زودی با شما تماس می‌گیرد.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
          <div>
            <label htmlFor="booking-name" className={labelClass}>نام و نام خانوادگی خریدار</label>
            <div className="relative">
              <UserIcon size={18} className={iconClass} aria-hidden />
              <input
                id="booking-name"
                {...register('name')}
                autoComplete="name"
                placeholder="مثال: نام و نام خانوادگی"
                aria-invalid={!!errors.name}
                className={`${fieldClass} pr-10`}
              />
            </div>
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="booking-phone" className={labelClass}>شماره تلفن همراه (جهت هماهنگی ورود به شوروم)</label>
            <div className="relative">
              <SmartphoneIcon size={18} className={iconClass} aria-hidden />
              {/* dir="ltr" keeps the digits in order. Because it flips "start" and "end", we use physical
                  left/right here (pr-10 / text-right) so the text never slides under the icon. */}
              <input
                id="booking-phone"
                {...register('phone', { setValueAs: (v: string) => toEnglishDigits(v ?? '') })}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                placeholder="09123456789"
                aria-invalid={!!errors.phone}
                className={`${fieldClass} pl-3.5 pr-10 text-right`}
              />
            </div>
            {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
          </div>

          <div>
            <label htmlFor="booking-date" className={labelClass}>روز بازدید</label>
            <select
              id="booking-date"
              {...register('preferredDate')}
              disabled={days.length === 0}
              aria-invalid={!!errors.preferredDate}
              className={`${fieldClass} cursor-pointer`}
            >
              {days.length === 0 && <option value="">در حال بارگذاری...</option>}
              {days.map((day) => (
                <option key={day.value} value={day.value}>{day.label}</option>
              ))}
            </select>
            {errors.preferredDate && <p className={errorClass}>{errors.preferredDate.message}</p>}
          </div>

          <div>
            <label htmlFor="booking-time" className={labelClass}>ساعت پیشنهادی</label>
            <select id="booking-time" {...register('preferredTime')} className={`${fieldClass} cursor-pointer`}>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <label className="flex cursor-pointer items-start gap-2 pt-1 text-xs leading-6 text-[#d2c4b6]">
            <input type="checkbox" {...register('wantsCall')} className="mt-1 h-4 w-4 cursor-pointer rounded accent-[#d9b37e]" />
            مایلم کارشناس ارشد پیش از جلسه بازدید جهت آماده‌سازی خودرو با من تماس بگیرد.
          </label>

          {errors.root && <p role="alert" className="text-sm text-red-400">{errors.root.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#f7ce97] font-bold text-[#432c03] shadow-[0_4px_20px_rgba(247,206,151,0.25)] transition-colors hover:bg-[#fccd91] disabled:opacity-60"
          >
            {isSubmitting ? 'در حال ثبت...' : 'تایید و ثبت نوبت تست درایو'}
            <ArrowLeftIcon size={20} aria-hidden />
          </button>
        </form>
      )}
    </div>
  )
}
