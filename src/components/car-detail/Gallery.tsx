'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon, RotateCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import scroll from './scrollbar.module.css'

export type Photo = { url: string; alt: string; caption: string }

interface Props {
  photos: Photo[]
  badges: string[]
  tourUrl?: string | null
}

export default function Gallery({ photos, badges, tourUrl }: Props) {
  const [index, setIndex] = useState(0)
  const current = photos[index]

  // Wraps around: after the last photo comes the first
  const go = (step: number) => setIndex((i) => (i + step + photos.length) % photos.length)

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-[#0a0e14] p-2">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[#181c22]">
        {current ? (
          <Image
            key={current.url} // a new key makes the browser treat each photo as a fresh image
            src={current.url}
            alt={current.alt}
            fill
            priority={index === 0} // the first photo is the largest thing on the page: load it first
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#d2c4b6]">
            تصویری ثبت نشده
          </div>
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0e14]/70 via-transparent to-black/20"
        />

        <div className="absolute end-4 top-4 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-lg bg-[#0a0e14]/90 px-3 py-1 text-[11px] font-bold text-[#f7ce97]"
            >
              {badge}
            </span>
          ))}
        </div>

        {tourUrl && (
          <a
            href={tourUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 start-4 flex items-center gap-2 rounded-xl bg-[#1c2026]/95 px-4 py-2 text-sm font-semibold text-[#dfe2eb] transition-colors hover:bg-[#f7ce97] hover:text-[#432c03]"
          >
            <RotateCw size={18} aria-hidden /> مشاهده نمای ۳۶۰ درجه
          </a>
        )}

        {photos.length > 1 && (
          <>
            {/* In RTL "next" is on the left, so the left button moves forward */}
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="تصویر بعدی"
              className="absolute start-3 top-1/2 -translate-y-1/2 rounded-full bg-[#0a0e14]/80 p-2 text-[#dfe2eb] hover:bg-[#f7ce97] hover:text-[#432c03]"
            >
              <ChevronRightIcon size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="تصویر قبلی"
              className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full bg-[#0a0e14]/80 p-2 text-[#dfe2eb] hover:bg-[#f7ce97] hover:text-[#432c03]"
            >
              <ChevronLeftIcon size={20} />
            </button>
            <span className="absolute bottom-4 end-4 rounded-md bg-[#0a0e14]/80 px-2.5 py-1 text-[11px] text-[#d2c4b6]">
              {new Intl.NumberFormat('fa-IR').format(index + 1)} /{' '}
              {new Intl.NumberFormat('fa-IR').format(photos.length)}
            </span>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className={cn('flex gap-2 overflow-x-auto pb-1 pt-1', scroll.thin)}>
          {photos.map((photo, i) => (
            <button
              key={photo.url}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={photo.caption || `تصویر ${i + 1}`}
              aria-pressed={i === index}
              className={cn(
                'relative aspect-video w-[calc(20%-0.4rem)] min-w-[110px] shrink-0 overflow-hidden rounded-lg bg-[#1c2026] transition-opacity',
                i === index ? 'opacity-100 ring-2 ring-[#f7ce97]' : 'opacity-70 hover:opacity-100',
              )}
            >
              {/* Thumbnails are small and lazy-loaded; only the main photo is high priority */}
              <Image
                src={photo.url}
                alt=""
                fill
                sizes="160px"
                loading="lazy"
                className="object-cover"
              />
              {photo.caption && (
                <span className="absolute bottom-1 end-1 rounded bg-black/70 px-1 text-[9px] text-white">
                  {photo.caption}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
