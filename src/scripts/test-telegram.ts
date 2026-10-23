import { sendTelegramMessage } from '@/lib/telegram'

// Run:  npx payload run src/scripts/test-telegram.ts
// Sends one test message using the same code as the real notification, and tells you plainly what went wrong.

const result = await sendTelegramMessage('✅ پیام آزمایشی: اتصال تلگرام برقرار است.')

if (result.ok) {
  console.log('SENT. Check your Telegram chat.')
} else {
  console.error(`FAILED: ${result.error}`)
}

process.exit(result.ok ? 0 : 1)
