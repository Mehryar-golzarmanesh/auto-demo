import { CollectionConfig } from 'payload'

export const Cars: CollectionConfig = {
  slug: 'cars',
  admin: {
    useAsTitle: 'model',
  },
  fields: [
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true, label: 'برند' },
    { name: 'model', type: 'text', required: true, label: 'مدل' },
    { name: 'year', type: 'number', required: true, label: 'سال' },
    { name: 'price', type: 'number', required: true, label: 'قیمت (تومان)' },
    { name: 'mileage', type: 'number', defaultValue: 0, label: 'کارکرد' },
    {
      name: 'transmission',
      type: 'select',
      options: [
        { label: 'دنده‌ای', value: 'manual' },
        { label: 'اتوماتیک', value: 'automatic' },
      ],
      label: 'گیربکس',
    },
    {
      name: 'fuelType',
      type: 'select',
      options: [
        { label: 'بنزین', value: 'petrol' },
        { label: 'دیزل', value: 'diesel' },
        { label: 'هیبرید', value: 'hybrid' },
        { label: 'برقی', value: 'electric' },
      ],
      label: 'سوخت',
    },
    { name: 'color', type: 'text', label: 'رنگ' },
    { name: 'description', type: 'textarea', label: 'توضیحات' },
    {
      name: 'images',
      type: 'array',
      label: 'تصاویر',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false, label: 'ویژه' },
    { name: 'isAvailable', type: 'checkbox', defaultValue: true, label: 'موجود' },
  ],
  access: {
    create: ({ req: { user } }) =>
      Boolean(user?.roles?.includes('admin') || user?.roles?.includes('editor')),
    update: ({ req: { user } }) =>
      Boolean(user?.roles?.includes('admin') || user?.roles?.includes('editor')),
    delete: ({ req: { user } }) =>
      Boolean(user?.roles?.includes('admin') || user?.roles?.includes('editor')),
    read: () => true,
  },
}
