import { getPayload } from 'payload'
import config from '@payload-config'
import type { Brand } from './payload-types'

/**
 * Seeds the `brands` and `cars` collections.
 *
 * Run:
 *   npx payload run src/seed-full.ts              # add missing records (safe to re-run)
 *   npx payload run src/seed-full.ts -- --reset   # delete all brands and cars first
 *
 * Notes:
 * - Uses the Local API, which bypasses access control by default.
 * - Logos and car images are skipped because they need `media` uploads.
 *   Add them later in the admin panel.
 * - Domestic cars use the Jalali year (1402/1403) and foreign cars the
 *   Gregorian year. Change this if you want a single calendar.
 */

type BrandSeed = {
  name: string
  slug: string
  country: string
  description: string
}

type CarSeed = {
  brand: string // brand slug
  slug: string
  model: string
  year: number
  price: number // Toman
  mileage?: number
  transmission: 'manual' | 'automatic'
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric'
  color: string
  description: string
  isFeatured?: boolean
  isAvailable?: boolean
}

const brands: BrandSeed[] = [
  { name: 'تویوتا', slug: 'toyota', country: 'ژاپن', description: 'سازنده‌ی ژاپنی شناخته‌شده برای دوام و مصرف سوخت کم.' },
  { name: 'هیوندای', slug: 'hyundai', country: 'کره جنوبی', description: 'خودروهای مدرن با تجهیزات کامل و قیمت منطقی.' },
  { name: 'کیا', slug: 'kia', country: 'کره جنوبی', description: 'طراحی جذاب و گارانتی قابل اتکا.' },
  { name: 'مرسدس‌بنز', slug: 'mercedes-benz', country: 'آلمان', description: 'نماد لوکس و فناوری در دنیای خودرو.' },
  { name: 'بی‌ام‌و', slug: 'bmw', country: 'آلمان', description: 'ترکیب لذت رانندگی و کیفیت ساخت بالا.' },
  { name: 'پژو', slug: 'peugeot', country: 'فرانسه', description: 'برند فرانسوی با سابقه‌ی طولانی در ایران.' },
  { name: 'ایران‌خودرو', slug: 'iran-khodro', country: 'ایران', description: 'بزرگ‌ترین خودروساز ایران با طیف گسترده‌ای از محصولات.' },
  { name: 'سایپا', slug: 'saipa', country: 'ایران', description: 'خودروساز ایرانی با محصولات اقتصادی و پرطرفدار.' },
]

const cars: CarSeed[] = [
  {
    brand: 'toyota', slug: 'toyota-corolla-2023', model: 'کرولا', year: 2023,
    price: 1_850_000_000, mileage: 12_000, transmission: 'automatic', fuelType: 'petrol',
    color: 'سفید', isFeatured: true,
    description: 'کرولا ۱٫۸ لیتری، اتوماتیک، بدون رنگ و دور از تصادف.',
  },
  {
    brand: 'toyota', slug: 'toyota-camry-hybrid-2024', model: 'کمری هیبرید', year: 2024,
    price: 3_900_000_000, mileage: 0, transmission: 'automatic', fuelType: 'hybrid',
    color: 'نقره‌ای',
    description: 'کمری هیبرید صفر کیلومتر با مصرف سوخت بسیار پایین.',
  },
  {
    brand: 'hyundai', slug: 'hyundai-tucson-2024', model: 'توسان', year: 2024,
    price: 2_600_000_000, mileage: 0, transmission: 'automatic', fuelType: 'petrol',
    color: 'خاکستری', isFeatured: true,
    description: 'شاسی‌بلند ۲٫۰ لیتری با سقف پانوراما و دوربین ۳۶۰ درجه.',
  },
  {
    brand: 'hyundai', slug: 'hyundai-ioniq-5-2024', model: 'آیونیک ۵', year: 2024,
    price: 4_200_000_000, mileage: 0, transmission: 'automatic', fuelType: 'electric',
    color: 'آبی',
    description: 'شاسی‌بلند برقی با شارژ سریع و فضای داخلی بسیار جادار.',
  },
  {
    brand: 'kia', slug: 'kia-sportage-2023', model: 'اسپورتیج', year: 2023,
    price: 2_400_000_000, mileage: 18_000, transmission: 'automatic', fuelType: 'petrol',
    color: 'مشکی',
    description: 'اسپورتیج ۲٫۰ لیتری، فول، سرویس‌های دوره‌ای در نمایندگی.',
  },
  {
    brand: 'kia', slug: 'kia-sorento-diesel-2022', model: 'سورنتو دیزل', year: 2022,
    price: 3_100_000_000, mileage: 35_000, transmission: 'automatic', fuelType: 'diesel',
    color: 'سفید', isAvailable: false,
    description: 'هفت‌نفره دیزلی مناسب سفر خانوادگی. فروخته شده.',
  },
  {
    brand: 'mercedes-benz', slug: 'mercedes-c200-2022', model: 'C200', year: 2022,
    price: 6_800_000_000, mileage: 22_000, transmission: 'automatic', fuelType: 'petrol',
    color: 'مشکی', isFeatured: true,
    description: 'کلاس C توربو ۲٫۰ لیتری با بسته‌ی داخلی چرم و سقف شیشه‌ای.',
  },
  {
    brand: 'bmw', slug: 'bmw-x3-2023', model: 'X3', year: 2023,
    price: 7_500_000_000, mileage: 9_000, transmission: 'automatic', fuelType: 'petrol',
    color: 'آبی تیره', isFeatured: true,
    description: 'X3 توربو ۲٫۰ لیتری، چهارچرخ محرک، کم‌کارکرد.',
  },
  {
    brand: 'bmw', slug: 'bmw-320i-2021', model: '320i', year: 2021,
    price: 5_200_000_000, mileage: 41_000, transmission: 'automatic', fuelType: 'petrol',
    color: 'نقره‌ای',
    description: 'سری ۳ با رانندگی اسپرت و وضعیت فنی عالی.',
  },
  {
    brand: 'peugeot', slug: 'peugeot-207-panorama-1403', model: '۲۰۷ پانوراما', year: 1403,
    price: 950_000_000, mileage: 0, transmission: 'manual', fuelType: 'petrol',
    color: 'قرمز',
    description: '۲۰۷ دنده‌ای پانوراما، صفر کیلومتر.',
  },
  {
    brand: 'peugeot', slug: 'peugeot-pars-1402', model: 'پارس', year: 1402,
    price: 780_000_000, mileage: 15_000, transmission: 'manual', fuelType: 'petrol',
    color: 'سفید',
    description: 'پژو پارس ELX تمیز با سرویس‌های منظم.',
  },
  {
    brand: 'iran-khodro', slug: 'iran-khodro-dena-plus-1403', model: 'دنا پلاس', year: 1403,
    price: 900_000_000, mileage: 0, transmission: 'manual', fuelType: 'petrol',
    color: 'سبز', isFeatured: true,
    description: 'دنا پلاس توربو ۱٫۷ لیتری، صفر کیلومتر.',
  },
  {
    brand: 'iran-khodro', slug: 'iran-khodro-samand-1401', model: 'سمند LX', year: 1401,
    price: 520_000_000, mileage: 48_000, transmission: 'manual', fuelType: 'petrol',
    color: 'نقره‌ای',
    description: 'سمند LX با موتور EF7، بدنه‌ی سالم.',
  },
  {
    brand: 'saipa', slug: 'saipa-shahin-1403', model: 'شاهین', year: 1403,
    price: 820_000_000, mileage: 0, transmission: 'automatic', fuelType: 'petrol',
    color: 'مشکی',
    description: 'شاهین اتوماتیک ۱٫۵ لیتری، صفر کیلومتر.',
  },
  {
    brand: 'saipa', slug: 'saipa-tiba-1402', model: 'تیبا ۲', year: 1402,
    price: 420_000_000, mileage: 22_000, transmission: 'manual', fuelType: 'petrol',
    color: 'سفید',
    description: 'تیبا ۲ اقتصادی و مناسب رفت‌وآمد شهری.',
  },
]

async function seed() {
  console.log('Seed started')
  // Keeps Node alive so a hanging promise shows up as a hang instead of a silent exit
  const keepAlive = setInterval(() => {}, 1000)
  process.on('exit', (code) => console.log(`Process exiting with code ${code}`))
  process.on('unhandledRejection', (err) => console.error('Unhandled rejection:', err))
  console.log('Initializing Payload (connecting to the database)...')
  const payload = await getPayload({ config })
  console.log('Payload initialized')
  const reset = process.argv.includes('--reset')

  if (reset) {
    console.log('Resetting cars and brands...')
    await payload.delete({ collection: 'cars', where: { id: { exists: true } } })
    await payload.delete({ collection: 'brands', where: { id: { exists: true } } })
  }

  // Brands
  const brandIds: Record<string, Brand['id']> = {}
  for (const brand of brands) {
    const existing = await payload.find({
      collection: 'brands',
      where: { slug: { equals: brand.slug } },
      limit: 1,
    })

    if (existing.docs[0]) {
      brandIds[brand.slug] = existing.docs[0].id
      console.log(`Brand exists, skipping: ${brand.slug}`)
      continue
    }

    const created = await payload.create({
      collection: 'brands',
      data: { ...brand, isActive: true },
    })
    brandIds[brand.slug] = created.id
    console.log(`Created brand: ${brand.slug}`)
  }

  // Cars
  for (const { brand, ...car } of cars) {
    const existing = await payload.find({
      collection: 'cars',
      where: { slug: { equals: car.slug } },
      limit: 1,
    })

    if (existing.docs[0]) {
      console.log(`Car exists, skipping: ${car.slug}`)
      continue
    }

    await payload.create({
      collection: 'cars',
      data: {
        ...car,
        brand: brandIds[brand],
        mileage: car.mileage ?? 0,
        isFeatured: car.isFeatured ?? false,
        isAvailable: car.isAvailable ?? true,
      },
    })
    console.log(`Created car: ${car.slug}`)
  }

  const brandCount = await payload.count({ collection: 'brands' })
  const carCount = await payload.count({ collection: 'cars' })
  console.log(`Seeding complete. DB now has ${brandCount.totalDocs} brands, ${carCount.totalDocs} cars.`)
  clearInterval(keepAlive)
  process.exit(0)
}

// `payload run` exits as soon as the file finishes loading, so this must be awaited
try {
  await seed()
} catch (err) {
  console.error(err)
  process.exit(1)
}
