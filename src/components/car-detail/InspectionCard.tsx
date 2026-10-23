import Link from 'next/link'
import { BadgeCheckIcon, CheckCircle2Icon, DownloadIcon, ShieldCheckIcon } from 'lucide-react'
import type { Car } from '@/payload-types'

const fa = new Intl.NumberFormat('fa-IR')
const CIRCUMFERENCE = 2 * Math.PI * 22 // length of the score ring's outline

export default function InspectionCard({ car }: { car: Car }) {
  const inspection = car.inspection
  const findings = inspection?.findings ?? []
  const score = inspection?.score
  const pdf = typeof inspection?.pdf === 'object' ? inspection.pdf : null

  // Nothing to show until the car has at least one piece of inspection data
  if (!inspection || (score == null && findings.length === 0 && !pdf)) return null

  return (
    <section className="flex flex-col gap-5 rounded-xl bg-[#181c22] p-6 shadow-lg" aria-labelledby="inspection-title">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7ce97]/10 text-[#f7ce97]">
            <BadgeCheckIcon size={26} aria-hidden />
          </div>
          <div>
            <h2 id="inspection-title" className="font-bold text-[#dfe2eb]">گزارش کارشناسی تخصصی ۳۶۰ درجه</h2>
            <p className="text-xs text-[#d2c4b6]">بررسی فنی، رنگ و الکترونیک خودرو توسط کارشناس رسمی</p>
          </div>
        </div>

        {pdf?.url && (
          <Link
            href={pdf.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#262a31] px-3 py-2 text-xs font-semibold text-[#dfe2eb] transition-colors hover:bg-[#f7ce97] hover:text-[#432c03]"
          >
            <DownloadIcon size={18} aria-hidden /> دانلود PDF کارشناسی
          </Link>
        )}
      </div>

      {findings.length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {findings.map((finding) => (
            <div key={finding.id ?? finding.title} className="flex flex-col gap-2 rounded-xl bg-[#1c2026]/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#dfe2eb]">{finding.title}</span>
                <CheckCircle2Icon size={20} className="text-[#f7ce97]" aria-hidden />
              </div>
              <p className="text-lg font-bold text-[#f7ce97]">{finding.result}</p>
              {finding.note && <p className="text-xs leading-6 text-[#d2c4b6]">{finding.note}</p>}
            </div>
          ))}
        </div>
      )}

      {(score != null || inspection.inspector) && (
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-[#0a0e14] p-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            {score != null && (
              <svg viewBox="0 0 48 48" className="h-12 w-12 shrink-0 text-[#f7ce97]" role="img" aria-label={`امتیاز سلامت ${fa.format(score)} از ۱۰۰`}>
                <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2" />
                <circle
                  cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE * (1 - score / 100)}
                  transform="rotate(-90 24 24)"
                />
                <text x="24" y="27" textAnchor="middle" className="fill-current text-[11px] font-bold">{fa.format(score)}٪</text>
              </svg>
            )}
            <div>
              {score != null && <p className="font-bold text-[#dfe2eb]">شاخص اصالت قطعات و سلامت کلی خودرو: {fa.format(score)} از ۱۰۰</p>}
              {inspection.inspector && <p className="text-xs text-[#d2c4b6]">امضا شده توسط {inspection.inspector}</p>}
            </div>
          </div>

          {inspection.returnGuaranteeDays ? (
            <p className="flex items-center gap-2 text-sm text-[#f7ce97]">
              <ShieldCheckIcon size={18} aria-hidden />
              دارای گارانتی {fa.format(inspection.returnGuaranteeDays)} روزه بازگشت وجه در صورت مغایرت کارشناسی
            </p>
          ) : null}
        </div>
      )}
    </section>
  )
}
