import Image from 'next/image'
import { MessageCircleIcon, SendIcon } from 'lucide-react'

// Edit these to your advisor's real details
const ADVISOR = {
  name: 'نام مشاور',
  role: 'مشاور اختصاصی نمایشگاه',
  phone: '09123456789',
  phoneDisplay: '۰۹۱۲۳۴۵۶۷۸۹',
  whatsapp: 'https://wa.me/989123456789',
  telegram: 'https://t.me/your_channel',
  photo: '/advisor.jpg', // a file in /public
}

export default function AdvisorCard({ brandName }: { brandName?: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-[#181c22] p-6 shadow-lg print:hidden">
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0">
          <Image src={ADVISOR.photo} alt={ADVISOR.name} width={56} height={56} className="h-14 w-14 rounded-full border border-[#f7ce97]/40 object-cover" />
          <span aria-hidden className="absolute bottom-0 end-0 h-3 w-3 rounded-full border-2 border-[#181c22] bg-green-500" />
        </div>
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#f7ce97]">SENIOR CLIENT ADVISOR</span>
          <h3 className="font-bold text-[#dfe2eb]">{ADVISOR.name}</h3>
          <p className="text-xs text-[#d2c4b6]">{ADVISOR.role}{brandName ? ` ${brandName}` : ''}</p>
        </div>
      </div>

      <a href={`tel:${ADVISOR.phone}`} className="flex items-center justify-between rounded-lg bg-[#1c2026] px-4 py-3 text-sm transition-colors hover:bg-[#262a31]">
        <span className="text-[#d2c4b6]">خط مستقیم مشاور اختصاصی</span>
        <span dir="ltr" className="font-bold text-[#f7ce97]">{ADVISOR.phoneDisplay}</span>
      </a>

      <div className="grid grid-cols-2 gap-2">
        <a href={ADVISOR.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-[#262a31] py-2.5 text-xs font-semibold text-[#dfe2eb] transition-colors hover:bg-[#31353c]">
          <MessageCircleIcon size={16} aria-hidden /> چت واتساپ VIP
        </a>
        <a href={ADVISOR.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-[#262a31] py-2.5 text-xs font-semibold text-[#dfe2eb] transition-colors hover:bg-[#31353c]">
          <SendIcon size={16} aria-hidden className="rtl:-scale-x-100" /> کانال تلگرام
        </a>
      </div>
    </div>
  )
}
