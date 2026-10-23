import type { CollectionConfig } from 'payload'
import { notifyTelegram } from './notifyTelegram'

const isStaff = ({ req: { user } }: { req: { user?: { roles?: string[] | null } | null } }) =>
  Boolean(user?.roles?.includes('admin') || user?.roles?.includes('editor'))

export const TestDrives: CollectionConfig = {
  slug: 'test-drives',
  labels: { singular: 'درخواست تست درایو', plural: 'درخواست‌های تست درایو' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'car', 'status', 'createdAt'],
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'نام و نام خانوادگی' },
    { name: 'phone', type: 'text', required: true, label: 'شماره تماس' },
    { name: 'car', type: 'relationship', relationTo: 'cars', required: true, label: 'خودروی مورد نظر' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      label: 'وضعیت',
      options: [
        { label: 'جدید', value: 'new' },
        { label: 'تماس گرفته شد', value: 'contacted' },
        { label: 'انجام شد', value: 'completed' },
        { label: 'لغو شد', value: 'cancelled' },
      ],
    },
    {
      name: 'preferredDate',
      type: 'date',
      label: 'روز پیشنهادی بازدید',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'preferredTime', type: 'text', label: 'ساعت پیشنهادی' },
    { name: 'wantsCall', type: 'checkbox', defaultValue: false, label: 'تماس کارشناس پیش از بازدید' },
    { name: 'internalNote', type: 'textarea', label: 'یادداشت داخلی' },
  ],
  hooks: {
    afterChange: [notifyTelegram],
  },
  access: {
    // The public form submits through a server action (Local API), so the public
    // REST/GraphQL endpoints stay closed. This blocks spam posted straight to /api.
    create: isStaff,
    read: isStaff,
    update: isStaff,
    delete: isStaff,
  },
}
