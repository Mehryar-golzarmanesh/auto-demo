import { WalletIcon } from 'lucide-react'
import type { Car } from '@/payload-types'
import { toPersianPrice } from '@/lib/utils'
import { priceInWords } from '@/lib/car-detail/price-words'

// Edit these two texts to match your real payment terms
const CASH_TEXT = 'امکان پرداخت نقدی با تحویل ۲ ساعته.'
const INSTALLMENT_TEXT = 'یا پرداخت اقساطی ۶ الی ۲۴ ماهه با پیش‌پرداخت ۵۰٪ و ثبت سند قطعی به نام متقاضی.'

export default function PriceCard({ car }: { car: Car }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-[#181c22] p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#d2c4b6]">قیمت کارشناسی شده</span>
        <span className="rounded bg-[#f7ce97]/10 px-2 py-0.5 text-[10px] font-bold text-[#f7ce97]">قیمت قطعی و تضمین‌شده</span>
      </div>

      <div>
        <p className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-[#f7ce97]">{toPersianPrice(car.price)}</span>
          <span className="text-sm text-[#d2c4b6]">تومان</span>
        </p>
        <p className="mt-1 text-xs text-[#d2c4b6]">معادل {priceInWords(car.price)} تومان</p>
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-[#1c2026]/60 p-3">
        <p className="flex items-center gap-2 text-xs font-bold text-[#dfe2eb]">
          <WalletIcon size={16} className="text-[#f7ce97]" aria-hidden /> تسهیلات خرید منعطف
        </p>
        <p className="text-xs leading-6 text-[#d2c4b6]">
          {CASH_TEXT} {car.installmentAvailable && INSTALLMENT_TEXT}
        </p>
      </div>
    </div>
  )
}
