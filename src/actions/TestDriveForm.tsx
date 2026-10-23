'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BadgeCheckIcon, CheckCircle2Icon, ChevronDownIcon, SendIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { submitTestDrive } from './test-drive.action'
import { testDriveSchema, toEnglishDigits, type TestDriveValues } from './test-drive.schema'

interface Props {
  cars: { id: number; label: string }[]
  defaultCarId?: number
}

const fieldClass =
  'h-12 rounded-xl border-0 bg-[#0b0d12] px-4 text-sm text-[#dfe2eb] placeholder:text-gray-500'

const TestDriveForm = ({ cars, defaultCarId }: Props) => {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    watch,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TestDriveValues>({
    resolver: zodResolver(testDriveSchema),
    defaultValues: { name: '', phone: '', carId: defaultCarId ? String(defaultCarId) : '' },
  })

  const carId = watch('carId')

  const onSubmit = async (values: TestDriveValues) => {
    const result = await submitTestDrive(values)

    if (!result.success) {
      setError('root', { message: result.error })
      return
    }

    reset()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="flex items-center gap-3 rounded-xl bg-[#0b0d12] p-5 text-[#dfe2eb]"
      >
        <CheckCircle2Icon className="text-gold" />
        <p>درخواست شما ثبت شد. کارشناس ما به‌زودی با شما تماس می‌گیرد.</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
      id="main-page-form"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="test-drive-name" className="sr-only">
            نام و نام خانوادگی
          </label>
          <Input
            id="test-drive-name"
            {...register('name')}
            placeholder="نام و نام خانوادگی شما"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'test-drive-name-error' : undefined}
            className={fieldClass}
          />
          {errors.name && (
            <p id="test-drive-name-error" className="text-xs text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Phone: setValueAs converts Persian digits before validation */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="test-drive-phone" className="sr-only">
            شماره تماس
          </label>
          <Input
            id="test-drive-phone"
            {...register('phone', { setValueAs: (v: string) => toEnglishDigits(v ?? '') })}
            placeholder="شماره تماس (مثال: 09123456789)"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'test-drive-phone-error' : undefined}
            className={fieldClass}
          />
          {errors.phone && (
            <p id="test-drive-phone-error" className="text-xs text-red-400">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Car: a native <select> avoids the sizing and popup bugs of the custom Select */}
        <div className="flex flex-col gap-1.5">
          <div className="relative">
            <select
              {...register('carId')}
              id="test-drive-car"
              aria-invalid={!!errors.carId}
              aria-describedby={errors.carId ? 'test-drive-car-error' : undefined}
              className={`${fieldClass} w-full appearance-none pe-11 scheme-dark ${
                carId ? 'text-[#dfe2eb]' : 'text-gray-500'
              }`}
            >
              <option value="">خودروی مورد نظر</option>
              {cars.map((car) => (
                <option key={car.id} value={String(car.id)} className="bg-[#1c2026] text-[#dfe2eb]">
                  {car.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              size={16}
              className="pointer-events-none absolute  inset-e-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          {errors.carId && (
            <p id="test-drive-car-error" className="text-xs text-red-400">
              {errors.carId.message}
            </p>
          )}
        </div>
      </div>

      {errors.root && (
        <p role="alert" className="text-sm text-red-400">
          {errors.root.message}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 rounded-xl bg-[#f5c48a] px-6 font-semibold text-[#2a1b05] hover:bg-[#f0b878]"
        >
          {isSubmitting ? 'در حال ثبت...' : 'ثبت و هماهنگی نوبت'}
          <SendIcon size={16} className="rtl:-scale-x-100" />
        </Button>

        <p className="flex items-center gap-2 text-xs text-[#d2c4b6]">
          <BadgeCheckIcon size={16} className="text-gold" />
          اطلاعات شما با نهایت محرمانگی نگهداری می‌شود.
        </p>
      </div>
    </form>
  )
}

export default TestDriveForm
