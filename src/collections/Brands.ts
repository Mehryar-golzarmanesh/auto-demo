import { CollectionConfig } from 'payload'

export const Brands: CollectionConfig = {
  slug: 'brands',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'نام برند' },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'آدرس' },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'لوگو' },
    { name: 'country', type: 'text', label: 'کشور' },
    { name: 'description', type: 'textarea', label: 'توضیحات' },
    { name: 'isActive', type: 'checkbox', defaultValue: true, label: 'فعال' },
  ],
}
