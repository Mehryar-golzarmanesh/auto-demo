import { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'car', type: 'relationship', relationTo: 'cars', label: 'خودرو' },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'تست درایو', value: 'test_drive' },
        { label: 'تماس', value: 'contact' },
      ],
      required: true,
      label: 'نوع',
    },
    { name: 'name', type: 'text', required: true, label: 'نام' },
    { name: 'phone', type: 'text', required: true, label: 'تلفن' },
    { name: 'email', type: 'email', label: 'ایمیل' },
    { name: 'preferredDate', type: 'text', label: 'تاریخ پیشنهادی' },
    { name: 'message', type: 'textarea', label: 'پیام' },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'جدید', value: 'new' },
        { label: 'تماس گرفته شده', value: 'contacted' },
        { label: 'بسته شده', value: 'closed' },
      ],
      defaultValue: 'new',
      label: 'وضعیت',
    },
  ],
}
