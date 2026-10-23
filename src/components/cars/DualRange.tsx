'use client'

import styles from './DualRange.module.css'

interface Props {
  min: number
  max: number
  step: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  minLabel: string
  maxLabel: string
}

export default function DualRange({ min, max, step, value, onChange, minLabel, maxLabel }: Props) {
  const span = Math.max(max - min, 1)
  const start = ((value[0] - min) / span) * 100
  const end = ((value[1] - min) / span) * 100

  return (
    <div className="relative h-6">
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#31353c]" />
      {/* inset-inline-start/end flip automatically in RTL, so the gold bar always matches the thumbs */}
      <div
        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#f7ce97]"
        style={{ insetInlineStart: `${start}%`, insetInlineEnd: `${100 - end}%` }}
      />
      <input
        type="range"
        aria-label={minLabel}
        className={styles.range}
        min={min}
        max={max}
        step={step}
        value={value[0]}
        style={{ zIndex: start > 50 ? 5 : 3 }} // keeps the top thumb grabbable when both meet at the end
        onChange={(e) => onChange([Math.min(Number(e.target.value), value[1] - step), value[1]])}
      />
      <input
        type="range"
        aria-label={maxLabel}
        className={styles.range}
        min={min}
        max={max}
        step={step}
        value={value[1]}
        style={{ zIndex: 4 }}
        onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0] + step)])}
      />
    </div>
  )
}
