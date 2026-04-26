const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`

async function sendTelegram(chatId, text, parseMode = 'Markdown') {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode }),
  })
}

async function getPhotoUrl(fileId) {
  const res = await fetch(`${TELEGRAM_API}/getFile?file_id=${fileId}`)
  const data = await res.json()
  const filePath = data.result?.file_path
  return filePath ? `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}` : null
}

async function inferTopicFromPhoto(photoUrl) {
  const key = process.env.GEMINI_API_KEY
  const imageRes = await fetch(photoUrl)
  const imageBuffer = await imageRes.arrayBuffer()
  const base64 = Buffer.from(imageBuffer).toString('base64')
  const mimeType = 'image/jpeg'

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: mimeType, data: base64 } },
            { text: 'This is a construction site or BIM/architecture photo. Describe what is shown in ONE sentence as a LinkedIn post topic. Be specific about the construction element, technology, or workflow visible. Return only the topic sentence.' },
          ],
        }],
        generationConfig: { maxOutputTokens: 100 },
      }),
    }
  )
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Construction site progress update'
}

async function runWriter(topic, bullets = '') {
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.FRONTEND_URL
  const res = await fetch(`${base}/api/linkedin-writer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, bullets, tone: 'excited', variant: 'long' }),
  })
  if (!res.ok) throw new Error(`Writer failed: ${res.status}`)
  return res.json()
}

function sessionKey(chatId) { return `linkedin:session:${chatId}` }

async function getSession(chatId) {
  const kv = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!kv || !token) return null
  try {
    const res = await fetch(`${kv}/get/${sessionKey(chatId)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    return data.result ? JSON.parse(data.result) : null
  } catch { return null }
}

async function setSession(chatId, value) {
  const kv = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!kv || !token) return
  await fetch(`${kv}/set/${sessionKey(chatId)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ value: JSON.stringify(value), ex: 86400 }),
  })
}

async function postToLinkedIn(postText, hashtags) {
  const allHashtags = [
    ...(hashtags?.niche || []),
    ...(hashtags?.industry || []),
    ...(hashtags?.marketLeaders || []).slice(0, 5),
  ].join(' ')
  const fullText = `${postText}\n\n${allHashtags}`

  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.FRONTEND_URL
  const res = await fetch(`${base}/api/post-to-linkedin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: fullText }),
  })
  if (!res.ok) throw new Error(`LinkedIn post failed: ${res.status}`)
  return res.json()
}

function formatDraftMessage(result) {
  const { variants, scores, improvement } = result
  const s = scores || {}
  const overall = s.overall || '—'
  const hook = s.hook || '—'
  const read = s.readability || '—'
  const ind = s.industryRelevance || '—'
  const cta = s.cta || '—'

  const longPreview = (variants?.long || '').slice(0, 600)

  return `✍️ *Your LinkedIn post is ready*

${longPreview}${variants?.long?.length > 600 ? '...' : ''}

─────────────────────
📊 *Score: ${overall}/10*
Hook: ${hook}/10 · Readability: ${read}/10
Industry: ${ind}/10 · CTA: ${cta}/10

💡 *${improvement || 'Looks strong — approve when ready.'}*
─────────────────────
*Reply with:*
/approve long — post this version
/approve short — post short version (120–160w)
/approve case — post case study version
/variants — see all 3 versions
/regenerate — rewrite from scratch
/image — generate AI image for this post`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).end()

  const update = req.body
  const msg = update?.message
  if (!msg) return res.status(200).json({ ok: true })

  const chatId = msg.chat?.id
  const text = msg.text?.trim() || ''
  const photo = msg.photo

  if (!chatId) return res.status(200).json({ ok: true })

  try {
    // ── /start ───────────────────────────────────────────────────────────────
    if (text === '/start') {
      await sendTelegram(chatId,
        `👋 *LinkedIn Intelligence Writer*\n\nSend me:\n• A topic or insight as a text message\n• A photo (with or without caption) from site\n• /help for all commands`
      )
      return res.status(200).json({ ok: true })
    }

    // ── /help ────────────────────────────────────────────────────────────────
    if (text === '/help') {
      await sendTelegram(chatId,
        `*Commands:*\n/approve long — post long version\n/approve short — post short version\n/approve case — post case study version\n/variants — see all 3 draft versions\n/regenerate — rewrite from scratch\n/image — generate AI image\n\n*To write a post:* Just send your topic as a message, or send a photo from site.`
      )
      return res.status(200).json({ ok: true })
    }

    // ── /variants ────────────────────────────────────────────────────────────
    if (text === '/variants') {
      const session = await getSession(chatId)
      if (!session?.variants) {
        await sendTelegram(chatId, '⚠️ No draft in session. Send a topic first.')
        return res.status(200).json({ ok: true })
      }
      const { short, long, caseStudy } = session.variants
      await sendTelegram(chatId, `📌 *SHORT VERSION (120–160w):*\n\n${short}`)
      await sendTelegram(chatId, `📌 *LONG VERSION (320–380w):*\n\n${long}`)
      await sendTelegram(chatId, `📌 *CASE STUDY VERSION:*\n\n${caseStudy}`)
      return res.status(200).json({ ok: true })
    }

    // ── /regenerate ──────────────────────────────────────────────────────────
    if (text === '/regenerate') {
      const session = await getSession(chatId)
      if (!session?.topic) {
        await sendTelegram(chatId, '⚠️ No topic in session. Send a topic first.')
        return res.status(200).json({ ok: true })
      }
      await sendTelegram(chatId, '🔄 Rewriting...')
      const result = await runWriter(session.topic, session.bullets || '')
      await setSession(chatId, { ...session, ...result })
      await sendTelegram(chatId, formatDraftMessage(result))
      return res.status(200).json({ ok: true })
    }

    // ── /approve [variant] ───────────────────────────────────────────────────
    if (text.startsWith('/approve')) {
      const variantKey = text.includes('short') ? 'short' : text.includes('case') ? 'caseStudy' : 'long'
      const session = await getSession(chatId)
      if (!session?.variants?.[variantKey]) {
        await sendTelegram(chatId, '⚠️ No draft found. Send a topic first.')
        return res.status(200).json({ ok: true })
      }
      await sendTelegram(chatId, '🚀 Posting to LinkedIn...')
      try {
        await postToLinkedIn(session.variants[variantKey], session.hashtags)
        await sendTelegram(chatId, '✅ *Posted to LinkedIn!*\n\nCheck your profile — it should appear within a minute.')
      } catch (err) {
        await sendTelegram(chatId, `❌ Post failed: ${err.message}\n\nCheck LINKEDIN_ACCESS_TOKEN in .env`)
      }
      return res.status(200).json({ ok: true })
    }

    // ── Photo message ─────────────────────────────────────────────────────────
    if (photo?.length) {
      const largest = photo[photo.length - 1]
      const caption = msg.caption?.trim() || ''
      await sendTelegram(chatId, '🧠 Analysing your photo...')
      const photoUrl = await getPhotoUrl(largest.file_id)
      const topic = caption || (photoUrl ? await inferTopicFromPhoto(photoUrl) : 'Construction site update')
      await sendTelegram(chatId, `📝 Topic detected: _${topic}_\n\nWriting your post...`)
      const result = await runWriter(topic)
      await setSession(chatId, { topic, variants: result.variants, hashtags: result.hashtags, photoUrl })
      await sendTelegram(chatId, formatDraftMessage(result))
      return res.status(200).json({ ok: true })
    }

    // ── Text message → treat as topic ─────────────────────────────────────────
    if (text && !text.startsWith('/')) {
      await sendTelegram(chatId, `📝 Got it. Writing your post...\n\n_This takes about 15–20 seconds (4 AI passes)_`)
      const result = await runWriter(text)
      await setSession(chatId, { topic: text, variants: result.variants, hashtags: result.hashtags })
      await sendTelegram(chatId, formatDraftMessage(result))
      return res.status(200).json({ ok: true })
    }

  } catch (err) {
    console.error('telegram-webhook error:', err)
    await sendTelegram(chatId, `❌ Something went wrong: ${err.message}`)
  }

  return res.status(200).json({ ok: true })
}
