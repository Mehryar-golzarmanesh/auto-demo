'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
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

  const { name, phone, carId } = parsed.data

  try {
    const payload = await getPayload({ config })

    await payload.create({
      collection: 'test-drives',
      data: { name, phone, car: Number(carId), status: 'new' },
    })

    return { success: true }
  } catch (error) {
    console.error('submitTestDrive failed:', error)
    return { success: false, error: 'ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید.' }
  }
}
