import { z } from 'zod'

// Persian (۰-۹) and Arabic-Indic (٠-٩) digits -> English digits,
// so "۰۹۱۲۳۴۵۶۷۸۹" passes the same validation as "09123456789".
export const toEnglishDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))

export const testDriveSchema = z.object({
  name: z.string().trim().min(3, 'نام و نام خانوادگی را وارد کنید.'),
  phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل معتبر نیست (مثال: 09123456789).'),
  carId: z.string().min(1, 'یک خودرو انتخاب کنید.'),
  // New and optional, so the older form (which doesn't send them) keeps working.
  preferredDate: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal('')]).optional(),
  preferredTime: z.string().max(40).optional(),
  wantsCall: z.boolean().optional(),
})

export type TestDriveValues = z.infer<typeof testDriveSchema>
