/**
 * ToP-R Solutions — Daily Summary Report (Vercel)
 * Called by GitHub Actions at 18:00 BST every day.
 * Reads today's events from Upstash Redis, formats a Telegram message, sends it, then clears.
 */

const TELEGRAM_CHAT_ID = '-5042545155'

async function upstashGet(url, token, key) {
  const res = await fetch(`${url}/lrange/${key}/0/-1`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  return (data.result || []).map(s => { try { return JSON.parse(s) } catch { return null } }).filter(Boolean)
}

async function upstashDel(url, token, key) {
  await fetch(`${url}/del/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
}

async function sendTelegram(token, text) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text.slice(0, 4096) }),
  })
  return res.json()
}

function formatDate(isoDate) {
  const d = new Date(isoDate + 'T12:00:00Z')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function buildReport(today, forms, chats) {
  const lines = [`📋 ToP-R Daily Summary — ${formatDate(today)}`, '']

  if (forms.length === 0 && chats.length === 0) {
    lines.push('No enquiries or chat conversations today.')
    return lines.join('\n')
  }

  if (forms.length > 0) {
    lines.push(`CONTACT FORM ENQUIRIES (${forms.length})`)
    forms.forEach((f, i) => {
      const who = [f.name, f.company].filter(Boolean).join(' — ')
      lines.push(`${i + 1}. ${who || 'Unknown'}`)
      if (f.services?.length) lines.push(`   Services: ${f.services.join(', ')}`)
      if (f.stage) lines.push(`   Stage: ${f.stage}`)
      if (f.location) lines.push(`   Location: ${f.location}`)
      if (f.notes) lines.push(`   Notes: ${f.notes}`)
    })
    lines.push('')
  }

  if (chats.length > 0) {
    lines.push(`CHAT CONVERSATIONS (${chats.length})`)
    chats.forEach((c, i) => {
      const contact = c.contactShared ? ' — contact shared' : ''
      lines.push(`${i + 1}. ${c.page || '/'} — ${c.msgs} message${c.msgs !== 1 ? 's' : ''}${contact}`)
    })
    lines.push('')
  }

  lines.push(`Total: ${forms.length} form enquier${forms.length !== 1 ? 'ies' : 'y'} · ${chats.length} chat${chats.length !== 1 ? 's' : ''}`)
  return lines.join('\n')
}

export default async function handler(req, res) {
  // Security — require CRON_SECRET header
  const secret = process.env.CRON_SECRET
  const authHeader = req.headers['authorization']
  if (!secret || authHeader !== `Bearer ${secret}`) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN

  const missingVars = [
    !upstashUrl && 'UPSTASH_REDIS_REST_URL',
    !upstashToken && 'UPSTASH_REDIS_REST_TOKEN',
    !telegramToken && 'TELEGRAM_BOT_TOKEN',
  ].filter(Boolean)

  if (missingVars.length > 0) {
    console.error('Missing env vars:', missingVars.join(', '))
    res.status(503).json({ error: 'Report service not configured', missing: missingVars })
    return
  }

  // Use UTC date — GitHub Actions runs at 17:00 UTC = 18:00 BST
  const today = new Date().toISOString().slice(0, 10)
  const formKey = `events:forms:${today}`
  const chatKey = `events:chats:${today}`

  try {
    const [forms, chats] = await Promise.all([
      upstashGet(upstashUrl, upstashToken, formKey),
      upstashGet(upstashUrl, upstashToken, chatKey),
    ])

    const report = buildReport(today, forms, chats)
    console.log('Sending report:', report)

    const tgResult = await sendTelegram(telegramToken, report)
    if (!tgResult.ok) {
      const tgError = tgResult.description || JSON.stringify(tgResult)
      console.error('Telegram error:', tgError)
      res.status(500).json({ error: 'Telegram send failed', telegramError: tgError, raw: tgResult })
      return
    }

    // Clear today's events after successful send
    await Promise.all([
      upstashDel(upstashUrl, upstashToken, formKey),
      upstashDel(upstashUrl, upstashToken, chatKey),
    ])

    console.log(`Report sent OK — ${forms.length} forms, ${chats.length} chats`)
    res.status(200).json({ ok: true, forms: forms.length, chats: chats.length })
  } catch (err) {
    console.error('Report error:', err.message)
    // Try to send failure notification to Telegram
    try {
      await sendTelegram(telegramToken, `⚠️ ToP-R Daily Report failed — ${err.message}`)
    } catch { /* best effort */ }
    res.status(500).json({ error: 'Report failed', detail: err.message })
  }
}
