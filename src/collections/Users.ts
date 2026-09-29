import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    { name: 'name', type: 'text', label: 'نام' },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      options: [
        { label: 'مدیر کل', value: 'admin' },
        { label: 'ویرایشگر', value: 'editor' },
        { label: 'مشاهده‌گر', value: 'viewer' },
      ],
      label: 'نقش‌ها',
    },
  ],
  access: {
    create: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
    delete: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
    update: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
    read: ({ req: { user } }) => Boolean(user),
  },
}
