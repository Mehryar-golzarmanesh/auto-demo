'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { isBookableDay } from '@/lib/car-detail/booking-days'
import { testDriveSchema, toEnglishDigits, type TestDriveValues } from './test-drive.schema'

type Result = { success: true } | { success: false; error: string }

export async function submitTestDrive(values: TestDriveValues): Promise<Result> {
  // Never trust the client: validate again on the server.
  const parsed = testDriveSchema.safeParse({
    ...values,
    phone: toEnglishDigits(values.phone ?? ''),
  })

  if (!parsed.success) {
    return { success: false, error: 'اطلاعات واردشده معتبر نیست.' }
  }

  const { name, phone, carId, preferredDate, preferredTime, wantsCall } = parsed.data

  // Same rule the dropdown uses: tomorrow or later, within two weeks, not on a closed day.
  if (preferredDate && !isBookableDay(preferredDate)) {
    return { success: false, error: 'روز انتخاب‌شده قابل رزرو نیست. لطفاً یکی از روزهای پیشنهادی را انتخاب کنید.' }
  }

  try {
    const payload = await getPayload({ config })

    await payload.create({
      collection: 'test-drives',
      data: {
        name,
        phone,
        car: Number(carId),
        status: 'new',
        // Noon UTC keeps the same calendar day in the admin panel in any time zone
        preferredDate: preferredDate ? new Date(`${preferredDate}T12:00:00Z`).toISOString() : undefined,
        preferredTime: preferredTime || undefined,
        wantsCall: wantsCall ?? false,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('submitTestDrive failed:', error)
    return { success: false, error: 'ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید.' }
  }
}
