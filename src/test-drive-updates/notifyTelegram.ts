import type { CollectionAfterChangeHook } from 'payload'
import type { TestDrive } from '@/payload-types'

// Telegram's HTML parse mode breaks on these characters, so escape user input.
const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const notifyTelegram: CollectionAfterChangeHook<TestDrive> = async ({
  doc,
  operation,
  req,
}) => {
  // Only notify for new requests, not when staff change the status later.
  if (operation !== 'create') return doc

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    req.payload.logger.warn('Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing.')
    return doc
  }

  try {
    // Look up the car so the message shows its name instead of an ID.
    const carId = typeof doc.car === 'object' ? doc.car.id : doc.car
    const car = await req.payload.findByID({ collection: 'cars', id: carId, depth: 1, req })
    const brandName = typeof car.brand === 'object' ? car.brand.name : ''
    const carLabel = `${brandName} ${car.model} ${car.year}`.trim()

    const createdAt = new Intl.DateTimeFormat('fa-IR', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Tehran',
    }).format(new Date(doc.createdAt))

    const adminUrl = process.env.NEXT_PUBLIC_SERVER_URL
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/test-drives/${doc.id}`
      : null

    const lines = [
      '🚗 <b>درخواست جدید تست درایو</b>',
      '',
      `👤 نام: ${escapeHtml(doc.name)}`,
      `📞 تلفن: <code>${escapeHtml(doc.phone)}</code>`,
      `🚘 خودرو: ${escapeHtml(carLabel)}`,
      `🕒 زمان ثبت: ${createdAt}`,
    ]
    if (doc.preferredDate) {
      const day = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full', timeZone: 'Asia/Tehran' }).format(
        new Date(doc.preferredDate),
      )
      lines.push(`📅 روز پیشنهادی: ${day}`)
    }
    if (doc.preferredTime) lines.push(`⏰ ساعت پیشنهادی: ${escapeHtml(doc.preferredTime)}`)
    if (doc.wantsCall) lines.push('☎️ مایل به تماس کارشناس پیش از بازدید')
    if (adminUrl) lines.push('', `<a href="${adminUrl}">مشاهده در پنل مدیریت</a>`)

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join('\n'),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(5000), // never let Telegram slow down the submission
    })

    if (!response.ok) {
      req.payload.logger.error(`Telegram responded with ${response.status}: ${await response.text()}`)
    }
  } catch (error) {
    // A failed notification must never make the visitor's submission fail.
    req.payload.logger.error({ err: error }, 'Telegram notification failed')
  }

  return doc
}
