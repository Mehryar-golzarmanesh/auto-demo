/**
 * Seed script: luxury & high-end cars.
 *
 * Put this file at src/seed.ts and run:  npm run db:seed
 *
 * - Safe to re-run: brands/cars that already exist (matched by slug) are skipped.
 * - Creates placeholder photos with sharp (no internet needed). If BLOB_READ_WRITE_TOKEN
 *   is set, they upload to Vercel Blob; otherwise they go to the local media folder.
 *   Replace them with real photos in /admin whenever you like.
 * - Prices are placeholders (Toman) and specs are approximate. Edit them to match your stock.
 * - Does NOT seed Inquiries or Test Drives: creating a test drive fires the Telegram hook.
 */
import sharp from 'sharp'
import { getPayload } from 'payload'
import config from './payload.config'
import type { Car } from './payload-types'

// Photos are skipped by default. Set to true once your Blob store is public
// (or you use local storage) to generate placeholder photos for each car.
const WITH_PHOTOS = false

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------
type BrandSeed = { name: string; slug: string; country: string; description: string }

const BRANDS: BrandSeed[] = [
  {
    name: 'پورشه',
    slug: 'porsche',
    country: 'آلمان',
    description: 'سازنده خودروهای اسپرت و شاسی‌بلند با میراثی بیش از هفت دهه در مسابقات و مهندسی دقیق.',
  },
  {
    name: 'مرسدس‌بنز',
    slug: 'mercedes-benz',
    country: 'آلمان',
    description: 'نماد لوکس‌سازی آلمانی؛ از سدان‌های فاخر کلاس S تا مدل‌های پرقدرت AMG.',
  },
  {
    name: 'بی‌ام‌و',
    slug: 'bmw',
    country: 'آلمان',
    description: 'برند لذت رانندگی؛ ترکیب عملکرد ورزشی و فناوری روز در مدل‌های سری M و شاسی‌بلندهای لوکس.',
  },
  {
    name: 'آئودی',
    slug: 'audi',
    country: 'آلمان',
    description: 'برند فناوری و کواترو؛ مدل‌های RS با طراحی مدرن و عملکرد استثنایی.',
  },
  {
    name: 'لامبورگینی',
    slug: 'lamborghini',
    country: 'ایتالیا',
    description: 'سوپراسپرت‌ها و سوپر شاسی‌بلندهای ایتالیایی با طراحی تهاجمی و موتورهای پرقدرت.',
  },
  {
    name: 'فراری',
    slug: 'ferrari',
    country: 'ایتالیا',
    description: 'افسانه‌ای‌ترین برند اسپرت جهان، با ریشه در مسابقات فرمول یک.',
  },
  {
    name: 'بنتلی',
    slug: 'bentley',
    country: 'بریتانیا',
    description: 'ترکیب دست‌ساز بودن، چرم و چوب اصل و قدرت موتورهای ۱۲ سیلندر.',
  },
  {
    name: 'رولز-رویس',
    slug: 'rolls-royce',
    country: 'بریتانیا',
    description: 'اوج لوکس‌سازی دست‌ساز؛ سکوت کابین و راحتی بی‌نظیر.',
  },
  {
    name: 'لندرور',
    slug: 'land-rover',
    country: 'بریتانیا',
    description: 'شاسی‌بلندهای لوکس با توان آفرود و طراحی اشرافی بریتانیایی.',
  },
]

// ---------------------------------------------------------------------------
// Cars
// ---------------------------------------------------------------------------
type CarSeed = Omit<
  Car,
  'id' | 'createdAt' | 'updatedAt' | 'brand' | 'images' | 'inspection' | 'inspectionGrade' | 'options'
> & {
  brandSlug: string
  /** English title, only used to draw the placeholder photos. */
  label: string
  /** Inspection health score (0-100). Also decides the A+/A/B grade. */
  score: number
  optionNames: string[]
}

const BASE_OPTIONS = [
  'سقف شیشه‌ای پانوراما',
  'صندلی‌های برقی گرمکن و خنک‌کن',
  'دوربین ۳۶۰ درجه',
  'کروز کنترل تطبیقی',
  'چراغ‌های ماتریسی LED',
  'ورود و استارت بدون کلید',
]

const CARS: CarSeed[] = [
  {
    brandSlug: 'porsche',
    label: 'Porsche 911 Carrera S',
    slug: 'porsche-911-carrera-s-2023',
    model: '911 کررا اس',
    year: 2023,
    price: 36_500_000_000,
    mileage: 8_500,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'سفید',
    description: 'پورشه ۹۱۱ کررا اس؛ ترکیبی کم‌نظیر از دینامیک رانندگی اسپرت و راحتی روزمره، با کارکرد کم و سرویس‌های کامل.',
    isFeatured: true,
    isAvailable: true,
    bodyType: 'coupe',
    origin: 'imported',
    isLuxury: true,
    hasWarranty: true,
    installmentAvailable: true,
    specs: {
      engine: '۳.۰ لیتری فلت‌سیکس توین‌توربو',
      horsepower: 443,
      torque: '۵۳۰ نیوتن‌متر',
      gearbox: 'PDK هشت‌سرعته دوکلاچه',
      drivetrain: 'عقب‌محور (RWD)',
      acceleration: 3.7,
      topSpeed: 308,
      interiorColor: 'مشکی',
    },
    optionNames: [...BASE_OPTIONS, 'پکیج اسپرت کرونو', 'اگزوز اسپرت', 'صندلی‌های اسپرت ۱۸ حالته'],
    score: 98,
  },
  {
    brandSlug: 'porsche',
    label: 'Porsche Cayenne Turbo GT',
    slug: 'porsche-cayenne-turbo-gt-2023',
    model: 'کاین توربو جی‌تی',
    year: 2023,
    price: 42_000_000_000,
    mileage: 12_000,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'آبی',
    description: 'سریع‌ترین کاین تاریخ؛ شاسی‌بلندی با عملکرد پیست و ظاهری فاخر.',
    isFeatured: true,
    isAvailable: true,
    bodyType: 'suv',
    origin: 'imported',
    isLuxury: true,
    hasWarranty: true,
    installmentAvailable: false,
    specs: {
      engine: '۴.۰ لیتری V8 توین‌توربو',
      horsepower: 631,
      torque: '۸۵۰ نیوتن‌متر',
      gearbox: 'تیپ‌ترونیک اس هشت‌سرعته',
      drivetrain: 'چهارچرخ‌محرک (AWD)',
      acceleration: 3.3,
      topSpeed: 300,
      interiorColor: 'مشکی و کربن',
    },
    optionNames: [...BASE_OPTIONS, 'ترمز سرامیکی PCCB', 'سیستم صوتی بوز', 'اگزوز تیتانیومی'],
    score: 97,
  },
  {
    brandSlug: 'mercedes-benz',
    label: 'Mercedes-Benz S 580 4MATIC',
    slug: 'mercedes-benz-s580-4matic-2023',
    model: 'S 580 فورماتیک',
    year: 2023,
    price: 33_000_000_000,
    mileage: 15_000,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'مشکی',
    description: 'پرچمدار مرسدس‌بنز؛ سدانی با فناوری‌های پیشرفته و کابینی در سطح سالن پذیرایی.',
    isFeatured: true,
    isAvailable: true,
    bodyType: 'sedan',
    origin: 'imported',
    isLuxury: true,
    hasWarranty: true,
    installmentAvailable: true,
    specs: {
      engine: '۴.۰ لیتری V8 بای‌توربو با EQ Boost',
      horsepower: 496,
      torque: '۷۰۰ نیوتن‌متر',
      gearbox: '۹G-TRONIC نه‌سرعته',
      drivetrain: 'چهارچرخ‌محرک (4MATIC)',
      acceleration: 4.4,
      topSpeed: 250,
      interiorColor: 'کرم',
    },
    optionNames: [...BASE_OPTIONS, 'صندلی‌های ماساژور', 'سیستم صوتی بورمستر ۴D', 'فرمان چهارچرخ', 'نمایشگر عقب برای سرنشینان'],
    score: 96,
  },
  {
    brandSlug: 'mercedes-benz',
    label: 'Mercedes-AMG G 63',
    slug: 'mercedes-amg-g63-2024',
    model: 'AMG G 63',
    year: 2024,
    price: 48_500_000_000,
    mileage: 4_000,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'مشکی مات',
    description: 'گران‌ترین و پرطرفدارترین کلاس G؛ ترکیب ظاهر نمادین و موتور V8 غران.',
    isFeatured: true,
    isAvailable: true,
    bodyType: 'suv',
    origin: 'imported',
    isLuxury: true,
    hasWarranty: true,
    installmentAvailable: false,
    specs: {
      engine: '۴.۰ لیتری V8 بای‌توربو',
      horsepower: 577,
      torque: '۸۵۰ نیوتن‌متر',
      gearbox: 'AMG Speedshift نه‌سرعته',
      drivetrain: 'چهارچرخ‌محرک (4MATIC)',
      acceleration: 4.5,
      topSpeed: 220,
      interiorColor: 'قرمز و مشکی',
    },
    optionNames: [...BASE_OPTIONS, 'پکیج نایت', 'اگزوز AMG اسپرت', 'سیستم صوتی بورمستر'],
    score: 98,
  },
  {
    brandSlug: 'bmw',
    label: 'BMW M5 Competition',
    slug: 'bmw-m5-competition-2022',
    model: 'M5 کامپتیشن',
    year: 2022,
    price: 27_800_000_000,
    mileage: 18_000,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'خاکستری',
    description: 'سدان چهاردرِ سوپراسپرت؛ شتاب خیره‌کننده در قالب یک خودروی راحت و روزمره.',
    isFeatured: false,
    isAvailable: true,
    bodyType: 'sedan',
    origin: 'imported',
    isLuxury: true,
    hasWarranty: false,
    installmentAvailable: true,
    specs: {
      engine: '۴.۴ لیتری V8 توین‌توربو',
      horsepower: 617,
      torque: '۷۵۰ نیوتن‌متر',
      gearbox: 'M Steptronic هشت‌سرعته',
      drivetrain: 'چهارچرخ‌محرک (M xDrive)',
      acceleration: 3.3,
      topSpeed: 250,
      interiorColor: 'مشکی',
    },
    optionNames: [...BASE_OPTIONS, 'صندلی‌های M کربن', 'نمایشگر هد‌آپ', 'سیستم صوتی هارمن کاردن'],
    score: 95,
  },
  {
    brandSlug: 'bmw',
    label: 'BMW X7 M60i',
    slug: 'bmw-x7-m60i-2023',
    model: 'X7 M60i',
    year: 2023,
    price: 31_500_000_000,
    mileage: 10_000,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'سفید',
    description: 'شاسی‌بلند هفت‌نفره لوکس با موتور V8 و فضای داخلی بسیار وسیع.',
    isFeatured: false,
    isAvailable: true,
    bodyType: 'suv',
    origin: 'imported',
    isLuxury: true,
    hasWarranty: true,
    installmentAvailable: true,
    specs: {
      engine: '۴.۴ لیتری V8 توین‌توربو',
      horsepower: 523,
      torque: '۷۵۰ نیوتن‌متر',
      gearbox: 'Steptronic Sport هشت‌سرعته',
      drivetrain: 'چهارچرخ‌محرک (xDrive)',
      acceleration: 4.7,
      topSpeed: 250,
      interiorColor: 'قهوه‌ای',
    },
    optionNames: [...BASE_OPTIONS, 'سقف Sky Lounge', 'سیستم صوتی بوئرز و ویلکینز', 'تعلیق ایرباگ'],
    score: 96,
  },
  {
    brandSlug: 'audi',
    label: 'Audi RS7 Sportback',
    slug: 'audi-rs7-sportback-2022',
    model: 'RS7 اسپورت‌بک',
    year: 2022,
    price: 26_900_000_000,
    mileage: 22_000,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'خاکستری ناردو',
    description: 'ظاهر کوپه‌مانند و موتور ۶۰۰ اسب‌بخاری؛ انتخاب کسانی که طراحی و قدرت را با هم می‌خواهند.',
    isFeatured: false,
    isAvailable: true,
    bodyType: 'sedan',
    origin: 'imported',
    isLuxury: true,
    hasWarranty: false,
    installmentAvailable: true,
    specs: {
      engine: '۴.۰ لیتری V8 بای‌توربو',
      horsepower: 591,
      torque: '۸۰۰ نیوتن‌متر',
      gearbox: 'تیپ‌ترونیک هشت‌سرعته',
      drivetrain: 'چهارچرخ‌محرک (کواترو)',
      acceleration: 3.6,
      topSpeed: 250,
      interiorColor: 'مشکی و قرمز',
    },
    optionNames: [...BASE_OPTIONS, 'سیستم صوتی بنگ‌اند‌اولوفسن', 'ترمز سرامیکی', 'نمایشگر هد‌آپ'],
    score: 94,
  },
  {
    brandSlug: 'lamborghini',
    label: 'Lamborghini Urus S',
    slug: 'lamborghini-urus-s-2023',
    model: 'اوروس اس',
    year: 2023,
    price: 62_000_000_000,
    mileage: 6_000,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'زرد',
    description: 'سوپر شاسی‌بلند لامبورگینی؛ عملکرد سوپراسپرت با کاربری روزمره.',
    isFeatured: true,
    isAvailable: true,
    bodyType: 'suv',
    origin: 'imported',
    isLuxury: true,
    hasWarranty: true,
    installmentAvailable: false,
    specs: {
      engine: '۴.۰ لیتری V8 بای‌توربو',
      horsepower: 657,
      torque: '۸۵۰ نیوتن‌متر',
      gearbox: 'اتوماتیک هشت‌سرعته',
      drivetrain: 'چهارچرخ‌محرک (AWD)',
      acceleration: 3.5,
      topSpeed: 305,
      interiorColor: 'مشکی و زرد',
    },
    optionNames: [...BASE_OPTIONS, 'سیستم صوتی بنگ‌اند‌اولوفسن', 'پکیج کربن', 'ترمز سرامیکی'],
    score: 97,
  },
  {
    brandSlug: 'lamborghini',
    label: 'Lamborghini Huracan EVO',
    slug: 'lamborghini-huracan-evo-2021',
    model: 'هوراکان اِوو',
    year: 2021,
    price: 58_000_000_000,
    mileage: 14_000,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'سبز',
    description: 'سوپراسپرت با موتور V10 بدون توربو و صدایی فراموش‌نشدنی.',
    isFeatured: false,
    isAvailable: false, // shows how a sold car looks on the site
    bodyType: 'coupe',
    origin: 'imported',
    isLuxury: true,
    hasWarranty: false,
    installmentAvailable: false,
    specs: {
      engine: '۵.۲ لیتری V10 بدون توربو',
      horsepower: 631,
      torque: '۶۰۰ نیوتن‌متر',
      gearbox: 'LDF هفت‌سرعته دوکلاچه',
      drivetrain: 'چهارچرخ‌محرک (AWD)',
      acceleration: 2.9,
      topSpeed: 325,
      interiorColor: 'مشکی',
    },
    optionNames: ['سیستم لیفت جلو', 'اگزوز اسپرت', 'دوربین دنده‌عقب', 'صندلی‌های اسپرت'],
    score: 92,
  },
  {
    brandSlug: 'ferrari',
    label: 'Ferrari Roma',
    slug: 'ferrari-roma-2022',
    model: 'روما',
    year: 2022,
    price: 66_000_000_000,
    mileage: 5_000,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'قرمز',
    description: 'کوپه‌ی گرند توریسمو؛ ظاهری ظریف و ایتالیایی همراه با موتور V8 توین‌توربو.',
    isFeatured: true,
    isAvailable: true,
    bodyType: 'coupe',
    origin: 'imported',
    isLuxury: true,
    hasWarranty: true,
    installmentAvailable: false,
    specs: {
      engine: '۳.۹ لیتری V8 توین‌توربو',
      horsepower: 612,
      torque: '۷۶۰ نیوتن‌متر',
      gearbox: 'دوکلاچه هشت‌سرعته',
      drivetrain: 'عقب‌محور (RWD)',
      acceleration: 3.4,
      topSpeed: 320,
      interiorColor: 'قهوه‌ای',
    },
    optionNames: [...BASE_OPTIONS, 'نمایشگر مخصوص سرنشین جلو', 'سیستم صوتی ممتاز', 'اگزوز اسپرت'],
    score: 98,
  },
  {
    brandSlug: 'bentley',
    label: 'Bentley Continental GT Speed',
    slug: 'bentley-continental-gt-speed-2022',
    model: 'کانتیننتال جی‌تی اسپید',
    year: 2022,
    price: 55_000_000_000,
    mileage: 9_000,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'آبی',
    description: 'کوپه‌ی گرند توریسمو با موتور W12 و کابینی از چرم و چوب اصل.',
    isFeatured: false,
    isAvailable: true,
    bodyType: 'coupe',
    origin: 'imported',
    isLuxury: true,
    hasWarranty: true,
    installmentAvailable: true,
    specs: {
      engine: '۶.۰ لیتری W12 توین‌توربو',
      horsepower: 650,
      torque: '۹۰۰ نیوتن‌متر',
      gearbox: 'دوکلاچه هشت‌سرعته',
      drivetrain: 'چهارچرخ‌محرک (AWD)',
      acceleration: 3.6,
      topSpeed: 335,
      interiorColor: 'کرم و آبی',
    },
    optionNames: [...BASE_OPTIONS, 'سیستم صوتی نایم', 'صندلی‌های ماساژور', 'ساعت آنالوگ داشبورد'],
    score: 96,
  },
  {
    brandSlug: 'rolls-royce',
    label: 'Rolls-Royce Ghost',
    slug: 'rolls-royce-ghost-2022',
    model: 'گوست',
    year: 2022,
    price: 92_000_000_000,
    mileage: 7_000,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'سفید',
    description: 'سکوت و آرامش در مطلق‌ترین شکل؛ سدان فاخر رولز-رویس با موتور V12.',
    isFeatured: true,
    isAvailable: true,
    bodyType: 'sedan',
    origin: 'imported',
    isLuxury: true,
    hasWarranty: true,
    installmentAvailable: false,
    specs: {
      engine: '۶.۷۵ لیتری V12 توین‌توربو',
      horsepower: 563,
      torque: '۸۵۰ نیوتن‌متر',
      gearbox: 'اتوماتیک هشت‌سرعته',
      drivetrain: 'چهارچرخ‌محرک (AWD)',
      acceleration: 4.8,
      topSpeed: 250,
      interiorColor: 'کرم و مشکی',
    },
    optionNames: [...BASE_OPTIONS, 'سقف ستاره‌ای', 'درهای خودکار', 'سیستم صوتی ممتاز', 'یخچال و جام شراب'],
    score: 99,
  },
  {
    brandSlug: 'land-rover',
    label: 'Range Rover Autobiography',
    slug: 'land-rover-range-rover-autobiography-2023',
    model: 'رنج‌رور آتوبیوگرافی',
    year: 2023,
    price: 45_000_000_000,
    mileage: 11_000,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'مشکی',
    description: 'شاسی‌بلند اشرافی بریتانیایی؛ ترکیب راحتی کابین، توان آفرود و موتور V8.',
    isFeatured: false,
    isAvailable: true,
    bodyType: 'suv',
    origin: 'imported',
    isLuxury: true,
    hasWarranty: true,
    installmentAvailable: true,
    specs: {
      engine: '۴.۴ لیتری V8 توین‌توربو',
      horsepower: 523,
      torque: '۷۵۰ نیوتن‌متر',
      gearbox: 'اتوماتیک هشت‌سرعته',
      drivetrain: 'چهارچرخ‌محرک (AWD)',
      acceleration: 4.6,
      topSpeed: 250,
      interiorColor: 'کرم',
    },
    optionNames: [...BASE_OPTIONS, 'تعلیق ایرباگ', 'سیستم صوتی میریدین', 'صندلی‌های عقب ماساژور'],
    score: 95,
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const VIEWS: { caption: string; english: string }[] = [
  { caption: 'روبرو', english: 'Front' },
  { caption: 'نیم‌رخ', english: 'Side' },
  { caption: 'داخل کابین', english: 'Interior' },
]

const PALETTE: [string, string][] = [
  ['#0f172a', '#334155'],
  ['#111827', '#4b5563'],
  ['#1c1917', '#78716c'],
  ['#0c1a2b', '#1d4e89'],
  ['#1a1a2e', '#533483'],
  ['#14201a', '#3f6b52'],
  ['#2b1111', '#7a2e2e'],
  ['#1f1b0f', '#8a6d1f'],
]

const INSPECTOR = 'مهندس رضایی'

const escapeXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function placeholderSvg(title: string, year: number, view: string, [from, to]: [string, string]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#g)"/>
  <rect x="0" y="720" width="1600" height="280" fill="#000000" fill-opacity="0.25"/>
  <text x="100" y="800" font-family="Arial, Helvetica, sans-serif" font-size="88" font-weight="700" fill="#ffffff">${escapeXml(title)}</text>
  <text x="100" y="880" font-family="Arial, Helvetica, sans-serif" font-size="48" fill="#e5e7eb" fill-opacity="0.85">${year}  |  ${escapeXml(view)}</text>
</svg>`
}

function gradeFor(score: number): NonNullable<Car['inspectionGrade']> {
  if (score >= 97) return 'a-plus'
  if (score >= 93) return 'a'
  return 'b'
}

function buildInspection(score: number): NonNullable<Car['inspection']> {
  const cleanPaint = score >= 95
  return {
    score,
    inspector: INSPECTOR,
    returnGuaranteeDays: 7,
    findings: [
      { title: 'سلامت شاسی', result: '۱۰۰٪ سالم و پلمپ', note: 'شاسی و ستون‌ها بدون ضربه، تعمیر یا جوشکاری.' },
      {
        title: 'بدنه و رنگ',
        result: cleanPaint ? 'بدون رنگ‌شدگی' : 'رنگ‌شدگی جزئی',
        note: cleanPaint ? 'ضخامت رنگ در تمام قطعات یکنواخت است.' : 'رنگ‌شدگی جزئی در سپر؛ سایر قطعات اصلی.',
      },
      { title: 'موتور و گیربکس', result: 'سالم و بدون نشتی', note: 'تست کامپیوتری و تست جاده انجام شده است.' },
    ],
  }
}

function dbHost() {
  try {
    return new URL(process.env.DATABASE_URL || '').host
  } catch {
    return 'unknown'
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`\nSeeding the database on host: ${dbHost()}`)
  console.log('Press Ctrl+C within 5 seconds if this is NOT the database you want.\n')
  await new Promise((resolve) => setTimeout(resolve, 5000))

  const payload = await getPayload({ config })

  // 1) Brands
  const brandIds = new Map<string, number>()
  for (const brand of BRANDS) {
    const existing = await payload.find({
      collection: 'brands',
      where: { slug: { equals: brand.slug } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs[0]) {
      brandIds.set(brand.slug, existing.docs[0].id)
      console.log(`- brand exists, skipped: ${brand.slug}`)
      continue
    }
    const created = await payload.create({
      collection: 'brands',
      data: { ...brand, isActive: true },
    })
    brandIds.set(brand.slug, created.id)
    console.log(`+ brand created: ${brand.slug}`)
  }

  // 2) Cars (with placeholder photos)
  for (let index = 0; index < CARS.length; index++) {
    const { brandSlug, label, score, optionNames, ...data } = CARS[index]

    const existing = await payload.find({
      collection: 'cars',
      where: { slug: { equals: data.slug } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs[0]) {
      console.log(`- car exists, skipped: ${data.slug}`)
      continue
    }

    const brandId = brandIds.get(brandSlug)
    if (!brandId) throw new Error(`Unknown brand slug: ${brandSlug}`)

    const images: NonNullable<Car['images']> = []
    for (let v = 0; WITH_PHOTOS && v < VIEWS.length; v++) {
      const view = VIEWS[v]
      const svg = placeholderSvg(label, data.year, view.english, PALETTE[index % PALETTE.length])
      const buffer = await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer()

      const media = await payload.create({
        collection: 'media',
        data: { alt: `${label} ${data.year} - ${view.english}` },
        file: {
          data: buffer,
          mimetype: 'image/jpeg',
          name: `${data.slug}-${v + 1}.jpg`,
          size: buffer.length,
        },
      })
      images.push({ image: media.id, caption: view.caption })
    }

    await payload.create({
      collection: 'cars',
      data: {
        ...data,
        brand: brandId,
        images,
        options: optionNames.map((name) => ({ name })),
        inspectionGrade: gradeFor(score),
        inspection: buildInspection(score),
      },
    })
    console.log(`+ car created: ${data.slug}`)
  }

  console.log('\nDone.')
}

// Top-level await: `payload run` only waits for the script if it finishes loading
// after the work is done. Without this it exits right after the first log lines.
try {
  await main()
  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}
