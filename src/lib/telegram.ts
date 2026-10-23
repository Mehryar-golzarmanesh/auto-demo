// Everything that talks to Telegram lives here, so the hook and the test script share ONE implementation.

// Telegram's HTML parse mode breaks on these characters, so escape anything a visitor typed.
export const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export type TelegramResult = { ok: true } | { ok: false; error: string }

// Never throws: it always returns a result that says what went wrong, in plain words.
export async function sendTelegramMessage(text: string): Promise<TelegramResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    const missing = [!token && 'TELEGRAM_BOT_TOKEN', !chatId && 'TELEGRAM_CHAT_ID'].filter(Boolean).join(' and ')
    return {
      ok: false,
      error: `${missing} is missing. Add it to .env and restart the dev server (env files are only read at startup).`,
    }
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8000), // never let Telegram slow the visitor's submission down for long
    })

    const data = (await response.json().catch(() => null)) as { ok?: boolean; description?: string } | null

    if (!response.ok || !data?.ok) {
      // Typical descriptions: "Unauthorized" (wrong token), "Bad Request: chat not found" (wrong chat ID)
      return { ok: false, error: `Telegram answered ${response.status}: ${data?.description ?? 'no details'}` }
    }
    return { ok: true }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    return { ok: false, error: `Could not reach Telegram (${reason}). Network, firewall or VPN problem?` }
  }
}
