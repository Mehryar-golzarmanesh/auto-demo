import { z } from 'zod'

// Converts Persian (۰-۹) and Arabic-Indic (٠-٩) digits to English digits,
// so "۰۹۱۲۳۴۵۶۷۸۹" passes the same validation as "09123456789".
export const toEnglishDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))

export const testDriveSchema = z.object({
  name: z.string().trim().min(3, 'نام و نام خانوادگی را وارد کنید.'),
  phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل معتبر نیست (مثال: 09123456789).'),
  carId: z.string().min(1, 'یک خودرو انتخاب کنید.'),
})

export type TestDriveValues = z.infer<typeof testDriveSchema>
