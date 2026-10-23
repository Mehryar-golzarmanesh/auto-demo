import type { Field } from 'payload'

// Used by Cars.ts. These fields power the filters on the /cars page.
// Every field the filters use has `index: true`, so the database can search it quickly.
export const carFilterFields: Field[] = [
  {
    name: 'bodyType',
    type: 'select',
    label: 'نوع بدنه',
    index: true,
    options: [
      { label: 'سدان', value: 'sedan' },
      { label: 'شاسی‌بلند', value: 'suv' },
      { label: 'هاچ‌بک', value: 'hatchback' },
      { label: 'کوپه', value: 'coupe' },
    ],
  },
  {
    name: 'origin',
    type: 'select',
    label: 'منشأ',
    defaultValue: 'imported',
    index: true,
    options: [
      { label: 'وارداتی', value: 'imported' },
      { label: 'تولید داخل', value: 'domestic' },
    ],
  },
  { name: 'isLuxury', type: 'checkbox', defaultValue: false, label: 'لوکس' },
  {
    name: 'inspectionGrade',
    type: 'select',
    label: 'گرید کارشناسی',
    index: true,
    options: [
      { label: 'A+', value: 'a-plus' },
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ],
  },
  { name: 'hasWarranty', type: 'checkbox', defaultValue: false, label: 'گارانتی فعال شرکتی', index: true },
  { name: 'installmentAvailable', type: 'checkbox', defaultValue: false, label: 'امکان پرداخت اقساطی', index: true },
]
