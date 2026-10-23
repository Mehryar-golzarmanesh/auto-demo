'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GaugeIcon,
  PauseIcon,
  PlayIcon,
  RotateCwIcon,
  RouteIcon,
  StarIcon,
  ZapIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { HeroSlide } from '@/lib/hero/to-slide'
import styles from './HeroSlider.module.css'

const AUTOPLAY_MS = 6000
const ICONS = {
  speed: GaugeIcon,
  power: ZapIcon,
  mileage: RouteIcon,
  verified: BadgeCheckIcon,
} as const
const fa = new Intl.NumberFormat('fa-IR')

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const count = slides.length
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true) // the visitor's choice (or "reduce motion")
  const [hovered, setHovered] = useState(false) // a temporary pause while the mouse or keyboard is on the slider
  const [seen, setSeen] = useState<number[]>([0, 1 % count]) // slides whose image is already loaded
  const startX = useRef<number | null>(null)
  const swiped = useRef(false)

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])

  // Respect "reduce motion": no autoplay for people who asked for less animation
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false)
  }, [])

  // Load the NEXT slide's image ahead of time, so the crossfade never shows an empty frame.
  // Slides nobody has reached yet cost nothing.
  useEffect(() => {
    setSeen((s) => [...new Set([...s, index, (index + 1) % count])])
  }, [index, count])

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="خودروهای ویژه شوروم"
      aria-live={playing ? 'off' : 'polite'}
      className="relative touch-pan-y overflow-hidden rounded-3xl border border-[#4e453b]/30 bg-gradient-to-b from-[#262a31]/60 via-[#181c22]/40 to-[#0a0e14] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.8)] sm:p-6 lg:p-8"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      // In a right-to-left page the arrow on the LEFT means "next"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') next()
        if (e.key === 'ArrowRight') prev()
      }}
      // Swipe on touch screens: dragging to the right reveals the next slide in RTL
      onPointerDown={(e) => {
        startX.current = e.clientX
        swiped.current = false
      }}
      onPointerUp={(e) => {
        if (startX.current === null) return
        const dx = e.clientX - startX.current
        startX.current = null
        if (Math.abs(dx) > 50) {
          swiped.current = true
          if (dx > 0) next()
          else prev()
        }
      }}
      onClickCapture={(e) => {
        // A swipe that started on a link must not also open the link
        if (swiped.current) {
          e.preventDefault()
          swiped.current = false
        }
      }}
    >
      {/* All slides sit in the same grid cell and crossfade. The cell is as tall as the tallest slide, so nothing jumps. */}
      <div className="grid">
        {slides.map((slide, i) => {
          const active = i === index
          const href = `/cars/${slide.slug}`

          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${fa.format(i + 1)} از ${fa.format(count)}`}
              inert={!active}
              className={cn(
                'col-start-1 row-start-1 transition-opacity duration-700 motion-reduce:transition-none',
                active ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
            >
              {/* Top ribbon */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5 rounded-lg bg-[#f7ce97] px-3 py-1 text-xs font-bold text-[#432c03]">
                    <StarIcon size={14} aria-hidden /> {slide.badge}
                  </span>
                  {slide.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-lg border border-[#4e453b]/30 bg-[#0a0e14]/80 px-3 py-1 text-[11px] text-[#d2c4b6]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                {slide.tourUrl && (
                  <a
                    href={slide.tourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#f7ce97]/30 bg-[#0a0e14]/80 px-3 py-1 text-xs text-[#f7ce97] hover:bg-[#f7ce97] hover:text-[#432c03]"
                  >
                    <RotateCwIcon size={16} aria-hidden /> مشاهده نمای ۳۶۰ درجه
                  </a>
                )}
              </div>

              {/* Image with text on top */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#0a0e14] shadow-2xl sm:aspect-[21/9]">
                {slide.imageUrl && seen.includes(i) ? (
                  <Image
                    src={slide.imageUrl}
                    alt={slide.imageAlt}
                    fill
                    priority={i === 0} // the first slide is the biggest thing on the page: load it first
                    sizes="(min-width: 1440px) 1280px, 100vw"
                    className="object-cover"
                  />
                ) : (
                  !slide.imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-[#d2c4b6]/60">
                      تصویری ثبت نشده
                    </div>
                  )
                )}

                {/* The picture is clickable too. This empty link sits above it; keyboards and screen readers use the title link. */}
                <Link href={href} aria-hidden tabIndex={-1} className="absolute inset-0 z-10" />

                {/* Solid gradients keep the text readable. (No blur effects: they are costly on weaker phones.) */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-[#0a0e14]/30 to-transparent"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#0a0e14]/70 via-transparent to-[#0a0e14]/70 sm:block"
                />

                <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 flex flex-col justify-between gap-4 sm:inset-x-6 sm:bottom-6 md:flex-row md:items-end">
                  <div className="flex max-w-xl flex-col">
                    <span className="mb-1.5 text-xs font-bold tracking-widest text-[#f7ce97]">
                      {slide.subtitle}
                    </span>
                    <h2 className="text-[24px] font-bold text-[#dfe2eb] drop-shadow-md sm:text-[34px] lg:text-[40px]">
                      <Link
                        href={href}
                        className="pointer-events-auto hover:text-[#f7ce97] leading-10"
                      >
                        {slide.title}
                      </Link>
                    </h2>
                    {slide.description && (
                      <p className="mt-1 hidden text-sm leading-7 text-[#d2c4b6] drop-shadow sm:block sm:text-base">
                        {slide.description}
                      </p>
                    )}
                  </div>

                  <div className="pointer-events-auto flex shrink-0 flex-row items-center justify-between gap-4 rounded-2xl border border-[#4e453b]/30 bg-[#0a0e14]/85 p-3.5 shadow-2xl sm:p-4 md:flex-col md:items-start">
                    <div>
                      <span className="text-[11px] text-[#d2c4b6]">
                        قیمت کارشناسی و رسمی شوروم:
                      </span>
                      <p className="mt-0.5 flex items-baseline gap-1">
                        <span className="text-[22px] font-bold text-[#f7ce97] sm:text-[28px]">
                          {slide.priceText}
                        </span>
                        <span className="text-xs text-[#d2c4b6]">تومان</span>
                      </p>
                    </div>
                    <Link
                      href={href}
                      className="flex items-center gap-1.5 rounded-lg bg-[#f7ce97] px-3.5 py-2 text-xs font-bold text-[#432c03] transition-colors hover:bg-[#fccd91]"
                    >
                      مشاهده مشخصات <ArrowLeftIcon size={14} aria-hidden />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Key numbers */}
              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-[#4e453b]/20 pt-4 sm:grid-cols-4">
                {slide.metrics.map((metric) => {
                  const Icon = ICONS[metric.icon]
                  return (
                    <div
                      key={metric.label}
                      className="flex items-center gap-3 rounded-xl border border-[#4e453b]/20 bg-[#0a0e14]/60 p-3"
                    >
                      <Icon size={24} className="shrink-0 text-[#f7ce97]" aria-hidden />
                      <div className="flex flex-col">
                        <dt className="text-[11px] text-[#d2c4b6]">{metric.label}</dt>
                        <dd className="text-sm font-bold text-[#dfe2eb]">{metric.value}</dd>
                      </div>
                    </div>
                  )
                })}
              </dl>
            </div>
          )
        })}
      </div>

      {/* Controls: previous, dots with progress, next, play / pause */}
      {count > 1 && (
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="خودروی قبلی"
              className="rounded-full bg-[#262a31] p-2 text-[#dfe2eb] transition-colors hover:bg-[#f7ce97] hover:text-[#432c03]"
            >
              <ChevronRightIcon size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="خودروی بعدی"
              className="rounded-full bg-[#262a31] p-2 text-[#dfe2eb] transition-colors hover:bg-[#f7ce97] hover:text-[#432c03]"
            >
              <ChevronLeftIcon size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`نمایش ${slide.title}`}
                aria-current={i === index}
                className={cn(
                  'relative h-1.5 overflow-hidden rounded-full transition-all duration-300',
                  i === index ? 'w-14 bg-[#4e453b]' : 'w-6 bg-[#4e453b] hover:bg-[#d2c4b6]',
                )}
              >
                {i === index &&
                  (playing ? (
                    // When this bar finishes filling, move to the next car. Pausing = pausing the animation.
                    <span
                      key={index}
                      className={cn(styles.bar, 'absolute inset-0 bg-[#f7ce97]')}
                      style={{
                        ['--duration' as string]: `${AUTOPLAY_MS}ms`,
                        animationPlayState: hovered ? 'paused' : 'running',
                      }}
                      onAnimationEnd={next}
                    />
                  ) : (
                    <span className="absolute inset-0 bg-[#f7ce97]" />
                  ))}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'توقف نمایش خودکار' : 'شروع نمایش خودکار'}
            className="rounded-full bg-[#262a31] p-2 text-[#dfe2eb] transition-colors hover:bg-[#f7ce97] hover:text-[#432c03]"
          >
            {playing ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
          </button>
        </div>
      )}
    </div>
  )
}
