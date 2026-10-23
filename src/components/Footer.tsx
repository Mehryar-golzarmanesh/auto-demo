import Link from 'next/link'
import { ClockIcon, MapPinIcon, PhoneIcon } from 'lucide-react'

// ---- Edit your content here -------------------------------------------------
const BRAND = {
  nameFa: 'دمو خودرو',
  nameEn: 'Demo Khodro',
  group: 'DEMO AUTOMOTIVE GROUP',
  description:
    'تجربه خریدی مطمئن، از خودروهای روز دنیا تا تولیدات ملی با ضمانت‌های رسمی و خدمات VIP دمو خودرو در لوکس‌ترین شوروم خاورمیانه.',
  badges: ['عضو رسمی اتحادیه صنف', 'ضمانت اصالت و سلامت شاسی'],
}

const categories = [
  { label: 'خودروهای لوکس و سوپراسپرت وارداتی', href: '/cars?category=luxury' },
  { label: 'محصولات بی‌ام‌و، پورشه، مرسدس بنز', href: '/cars?category=german' },
  { label: 'خودروهای روز مونتاژی و اقتصادی', href: '/cars?category=economy' },
  { label: 'تحویل فوری و موجود در شوروم مرکزی', href: '/cars?available=true' },
]

const services = [
  { label: 'شرایط فروش اقساطی منعطف', href: '/services/installments' },
  { label: 'کارشناسی تخصصی رنگ و فنی ۳۶۰', href: '/services/inspection' },
  { label: 'گارانتی طلایی تعویض قطعات', href: '/services/warranty' },
  { label: 'رزرو بازدید اختصاصی VIP', href: '/#test-drive' },
]

const contact = {
  address: 'شیراز، قصرالدشت، دمو خودرو',
  phone: '09123456789', // used for the tel: link
  hours: 'شنبه تا پنجشنبه: ۹:۰۰ صبح الی ۲۲:۰۰',
}
// -----------------------------------------------------------------------------

const toPersianDigits = (value: string) => value.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

const linkClass =
  'text-sm text-[#d2c4b6] transition-colors hover:text-gold focus-visible:text-gold focus-visible:outline-none'

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-5 text-base font-bold text-white">{children}</h3>
)

const LinkList = ({ items }: { items: { label: string; href: string }[] }) => (
  <ul className="flex flex-col gap-4">
    {items.map((item) => (
      <li key={item.href}>
        <Link href={item.href} className={linkClass}>
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
)

const Footer = () => {
  // Current Persian (Jalali) year, e.g. ۱۴۰۴. fa-IR uses the Persian calendar by default.
  const year = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(new Date())

  return (
    <footer className="border-t border-[#1c2026] bg-[#0a0c10]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* In RTL the first column in the code appears on the right. */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <div className="flex flex-col gap-2">
              <span className="self-start text-2xl font-bold text-gold">{BRAND.nameFa}</span>
              <p
                dir="ltr"
                className="self-start text-[11px] font-semibold tracking-widest text-[#d2c4b6]"
              >
                {BRAND.group}
              </p>
            </div>

            <p className="max-w-md text-sm leading-7 text-[#d2c4b6]">{BRAND.description}</p>

            <div className="flex flex-wrap gap-3">
              {BRAND.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-lg border border-[#2c323a] bg-[#14171c] px-4 py-2 text-xs font-semibold text-gold"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Categories */}
          <nav aria-label="دسته‌بندی خودروها">
            <Heading>دسته‌بندی خودروها</Heading>
            <LinkList items={categories} />
          </nav>

          {/* Services */}
          <nav aria-label="خدمات">
            <Heading>خدمات {BRAND.nameFa}</Heading>
            <LinkList items={services} />
          </nav>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Heading>شوروم مرکزی و ارتباط</Heading>
            <address className="flex flex-col gap-4 not-italic">
              <div className="flex items-start gap-3">
                <MapPinIcon size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden />
                <p className="text-sm leading-6 text-[#d2c4b6]">{contact.address}</p>
              </div>

              <div className="flex items-center gap-3">
                <PhoneIcon size={18} className="shrink-0 text-gold" aria-hidden />
                <a href={`tel:${contact.phone}`} dir="ltr" className={linkClass}>
                  {toPersianDigits(contact.phone)}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <ClockIcon size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden />
                <p className="text-sm leading-6 text-[#d2c4b6]">{contact.hours}</p>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-[#1c2026] pt-6 text-xs text-gray-400 md:flex-row md:items-center md:justify-between">
          <p>
            تمامی حقوق مادی و معنوی برای {BRAND.nameFa} ({BRAND.nameEn}) محفوظ است © {year}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="font-semibold text-gold">مجوز رسمی صنف نمایشگاه‌داران خودرو</span>
            <span>طراحی ساختار لاکچری و اختصاصی</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
