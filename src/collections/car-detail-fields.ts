import type { Field } from 'payload'

// Used by Cars.ts. These fields feed the car detail page.
// Every field is optional: the page simply hides rows that are empty.
export const carDetailFields: Field[] = [
  {
    name: 'specs',
    type: 'group',
    label: 'مشخصات فنی',
    fields: [
      { name: 'engine', type: 'text', label: 'پیشرانه و حجم موتور' },
      { name: 'horsepower', type: 'number', label: 'قدرت (اسب بخار)' },
      { name: 'torque', type: 'text', label: 'گشتاور' },
      { name: 'gearbox', type: 'text', label: 'جعبه دنده (توضیح کامل)' },
      { name: 'drivetrain', type: 'text', label: 'انتقال قدرت' },
      { name: 'acceleration', type: 'number', label: 'شتاب ۰ تا ۱۰۰ (ثانیه)' },
      { name: 'topSpeed', type: 'number', label: 'حداکثر سرعت (کیلومتر بر ساعت)' },
      { name: 'interiorColor', type: 'text', label: 'رنگ تودوزی داخلی' },
      { name: 'vin', type: 'text', label: 'شماره VIN (بخشی را با ستاره بپوشانید)' },
    ],
  },
  {
    name: 'options',
    type: 'array',
    label: 'آپشن‌های نصب‌شده',
    fields: [{ name: 'name', type: 'text', required: true, label: 'آپشن' }],
  },
  {
    name: 'inspection',
    type: 'group',
    label: 'گزارش کارشناسی',
    fields: [
      { name: 'score', type: 'number', min: 0, max: 100, label: 'شاخص سلامت (۰ تا ۱۰۰)' },
      {
        name: 'findings',
        type: 'array',
        maxRows: 3,
        label: 'یافته‌های کارشناسی (حداکثر ۳)',
        fields: [
          { name: 'title', type: 'text', required: true, label: 'عنوان (مثلاً: سلامت شاسی)' },
          { name: 'result', type: 'text', required: true, label: 'نتیجه (مثلاً: ۱۰۰٪ سالم و پلمپ)' },
          { name: 'note', type: 'textarea', label: 'توضیح' },
        ],
      },
      { name: 'inspector', type: 'text', label: 'نام کارشناس' },
      { name: 'returnGuaranteeDays', type: 'number', defaultValue: 7, label: 'روزهای ضمانت بازگشت وجه' },
      { name: 'pdf', type: 'upload', relationTo: 'media', label: 'فایل PDF گزارش' },
    ],
  },
  { name: 'tour360Url', type: 'text', label: 'لینک نمای ۳۶۰ درجه (اختیاری)' },
]
