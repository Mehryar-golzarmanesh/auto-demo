import type { CollectionAfterChangeHook } from 'payload'
import type { TestDrive } from '@/payload-types'
import { escapeHtml, sendTelegramMessage } from '@/lib/telegram'

export const notifyTelegram: CollectionAfterChangeHook<TestDrive> = async ({ doc, operation, req }) => {
  // Only notify for new requests, not when staff change the status later.
  if (operation !== 'create') return doc

  const log = req.payload.logger
  log.info(`[telegram] new test drive request #${doc.id}: sending notification...`)

  // The car's name is nice to have, but a failed lookup must NOT stop the notification.
  const carId = typeof doc.car === 'object' ? doc.car.id : doc.car
  let carLabel = `خودرو شماره ${carId}`
  try {
    const car = await req.payload.findByID({ collection: 'cars', id: carId, depth: 1, req })
    const brandName = typeof car.brand === 'object' ? car.brand.name : ''
    carLabel = `${brandName} ${car.model} ${car.year}`.trim()
  } catch (error) {
    log.warn({ err: error }, '[telegram] could not load the car name, using its number instead')
  }

  const createdAt = new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Tehran',
  }).format(new Date(doc.createdAt))

  const lines = [
    '🚗 <b>درخواست جدید تست درایو</b>',
    '',
    `👤 نام: ${escapeHtml(doc.name)}`,
    `📞 تلفن: <code>${escapeHtml(doc.phone)}</code>`,
    `🚘 خودرو: ${escapeHtml(carLabel)}`,
  ]

  if (doc.preferredDate) {
    // fa-IR uses the Persian (Jalali) calendar, so this reads like "شنبه ۲۹ مهر ۱۴۰۵"
    const day = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full', timeZone: 'Asia/Tehran' }).format(
      new Date(doc.preferredDate),
    )
    lines.push(`📅 روز پیشنهادی: ${day}`)
  }
  if (doc.preferredTime) lines.push(`⏰ ساعت پیشنهادی: ${escapeHtml(doc.preferredTime)}`)
  if (doc.wantsCall) lines.push('☎️ مایل به تماس کارشناس پیش از بازدید')

  lines.push(`🕒 زمان ثبت: ${createdAt}`)

  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    lines.push('', `<a href="${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/test-drives/${doc.id}">مشاهده در پنل مدیریت</a>`)
  }

  // A failed notification must never make the visitor's submission fail, so we only log the result.
  const result = await sendTelegramMessage(lines.join('\n'))
  if (result.ok) log.info('[telegram] notification sent')
  else log.error(`[telegram] notification FAILED: ${result.error}`)

  return doc
}
