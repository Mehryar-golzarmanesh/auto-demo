'use client'

import { useEffect, useState } from 'react'
import { BookmarkIcon, PrinterIcon, Share2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'saved-cars'

const readSaved = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

const buttonClass =
  'flex items-center gap-1.5 rounded-lg bg-[#181c22] px-3 py-1.5 text-xs text-[#d2c4b6] transition-colors hover:bg-[#1c2026] hover:text-[#f7ce97]'

export default function ActionBar({ slug, title }: { slug: string; title: string }) {
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  // localStorage only exists in the browser, so we read it after the page has loaded
  useEffect(() => setSaved(readSaved().includes(slug)), [slug])

  const toggleSaved = () => {
    const list = readSaved()
    const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* storage can be blocked (private mode): then the button simply does nothing */
    }
    setSaved(next.includes(slug))
  }

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        /* the visitor closed the share sheet */
      }
      return
    }
    await navigator.clipboard?.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 print:hidden">
      <button type="button" onClick={share} className={buttonClass}>
        <Share2Icon size={16} aria-hidden />
        <span role="status">{copied ? 'لینک کپی شد' : 'اشتراک‌گذاری'}</span>
      </button>
      <button type="button" onClick={toggleSaved} aria-pressed={saved} className={cn(buttonClass, saved && 'text-[#f7ce97]')}>
        <BookmarkIcon size={16} aria-hidden className={cn(saved && 'fill-current')} />
        {saved ? 'نشان شده' : 'نشان کردن'}
      </button>
      <button type="button" onClick={() => window.print()} className={buttonClass}>
        <PrinterIcon size={16} aria-hidden />
        چاپ شناسنامه
      </button>
    </div>
  )
}
