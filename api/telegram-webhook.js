const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`

async function sendTelegram(chatId, text, parseMode = 'Markdown') {
  const body = { chat_id: chatId, text }
  if (parseMode) body.parse_mode = parseMode
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
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

  const res = await fetch(
    `${GEMINI_URL}?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: 'image/jpeg', data: base64 } },
            { text: `Analyse this image carefully and identify exactly what it shows.

Possible image types (pick the best match):
- Certificate / completion award / qualification / course badge
- BIM model / 3D model / Revit view / IFC model / Navisworks clash view
- Construction site photo / progress photo / structural work
- Software screenshot / dashboard / tool interface
- Diagram / workflow / process chart
- Team photo / event / office
- Other professional content

Return a JSON object with two fields:
{
  "type": "certificate",
  "topic": "Completion of the Anthropic MCP AI Practitioner certification course"
}

The topic should be a specific, accurate LinkedIn post subject based on what you actually see. Do NOT guess construction if you see something else. Return ONLY the JSON, no other text.` },
          ],
        }],
        generationConfig: {
          maxOutputTokens: 150,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    }
  )
  const data = await res.json()
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
  try {
    const parsed = JSON.parse(stripJson(raw))
    return { topic: parsed.topic || 'Professional update', type: parsed.type || 'unknown' }
  } catch {
    return { topic: raw || 'Professional update', type: 'unknown' }
  }
}

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

async function gemini(system, user, temperature = 0.8, maxTokens = 1200) {
  const key = process.env.GEMINI_API_KEY
  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || `Gemini ${res.status}`)
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
}

function stripJson(raw) {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
}

// ── Wire Map ─────────────────────────────────────────────────────────────────

const WIREMAP_SYSTEM = `You are a strategic business analyst. Given a topic, produce a problem analysis wire map with 3 paths relevant to THAT topic.
Return ONLY valid JSON — no markdown fences, no extra text.
Schema:
{
  "problem": "Bold problem statement max 55 chars",
  "problemSub": "One line pain description max 75 chars",
  "pathA": { "name": "2-3 word path name", "sub": "max 38 chars", "consequence": "3-5 word outcome", "consequenceSub": "max 38 chars", "deadEnd": "3-5 word final bad result", "deadEndSub": "max 38 chars" },
  "pathB": { "name": "2-3 word path name", "sub": "max 38 chars", "consequence": "3-5 word outcome", "consequenceSub": "max 38 chars", "deadEnd": "3-5 word final bad result", "deadEndSub": "max 38 chars" },
  "pathC": { "name": "2-3 word best approach", "sub": "max 38 chars", "result": "3-5 word positive result", "resultSub": "max 38 chars", "bestSolution": "3-5 word best outcome", "bestSolutionSub": "max 40 chars" }
}
pathA and pathB must be wrong/failed approaches specific to this topic. pathC must be the recommended solution for this topic.
Do NOT default to BIM or construction framing — match the wire map to the actual topic (AI, certification, leadership, tech, etc.).`

async function generateWireMapData(topic) {
  const raw = await gemini(WIREMAP_SYSTEM, `Topic: ${topic}`, 0.3, 600)
  try { return JSON.parse(stripJson(raw)) } catch { return null }
}

function xmlEsc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function buildWireMapSvg(d) {
  const t = (str, max) => xmlEsc(str ? String(str).slice(0, max) : '')
  return `<svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
<defs>
  <marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto"><path d="M0,0.5 L0,6.5 L7,3.5 z" fill="#1a1a1a"/></marker>
  <marker id="arrR" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto"><path d="M0,0.5 L0,6.5 L7,3.5 z" fill="#c04040"/></marker>
  <marker id="arrG" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto"><path d="M0,0.5 L0,6.5 L7,3.5 z" fill="#888"/></marker>
</defs>
<rect width="1200" height="675" fill="#ffffff"/>
<rect x="0" y="0" width="1200" height="3" fill="#1a1a1a"/>
<text x="40" y="27" font-family="sans-serif" font-size="9" font-weight="700" letter-spacing="3" fill="#aaaaaa">PROBLEM INTELLIGENCE FRAMEWORK</text>
<text x="1160" y="27" font-family="sans-serif" font-size="9" font-weight="400" letter-spacing="2" fill="#aaaaaa" text-anchor="end">BIM . AEC . UK CONSTRUCTION</text>
<line x1="40" y1="36" x2="1160" y2="36" stroke="#e0e0e0" stroke-width="1"/>
<rect x="330" y="52" width="540" height="76" rx="4" fill="#ffffff" stroke="#1a1a1a" stroke-width="2"/>
<text x="600" y="74" font-family="sans-serif" font-size="9" font-weight="700" letter-spacing="3" fill="#999" text-anchor="middle">THE CHALLENGE</text>
<text x="600" y="96" font-family="sans-serif" font-size="19" font-weight="700" fill="#1a1a1a" text-anchor="middle">${t(d.problem, 58)}</text>
<text x="600" y="116" font-family="sans-serif" font-size="11" font-weight="400" fill="#888" text-anchor="middle">${t(d.problemSub, 80)}</text>
<line x1="600" y1="128" x2="600" y2="162" stroke="#1a1a1a" stroke-width="1.5"/>
<line x1="197" y1="162" x2="1003" y2="162" stroke="#1a1a1a" stroke-width="1.5"/>
<circle cx="197" cy="162" r="4" fill="#1a1a1a"/><circle cx="600" cy="162" r="4" fill="#1a1a1a"/><circle cx="1003" cy="162" r="4" fill="#1a1a1a"/>
<line x1="197" y1="162" x2="197" y2="196" stroke="#aaa" stroke-width="1.5" marker-end="url(#arrG)"/>
<line x1="600" y1="162" x2="600" y2="196" stroke="#aaa" stroke-width="1.5" marker-end="url(#arrG)"/>
<line x1="1003" y1="162" x2="1003" y2="196" stroke="#1a1a1a" stroke-width="2" marker-end="url(#arr)"/>
<rect x="77" y="196" width="240" height="64" rx="3" fill="#fafafa" stroke="#cccccc" stroke-width="1.5"/>
<text x="197" y="216" font-family="sans-serif" font-size="8.5" font-weight="700" letter-spacing="2.5" fill="#bbb" text-anchor="middle">PATH A</text>
<text x="197" y="237" font-family="sans-serif" font-size="14" font-weight="700" fill="#555" text-anchor="middle">${t(d.pathA?.name, 22)}</text>
<text x="197" y="253" font-family="sans-serif" font-size="10" font-weight="400" fill="#aaa" text-anchor="middle">${t(d.pathA?.sub, 40)}</text>
<rect x="480" y="196" width="240" height="64" rx="3" fill="#fafafa" stroke="#cccccc" stroke-width="1.5"/>
<text x="600" y="216" font-family="sans-serif" font-size="8.5" font-weight="700" letter-spacing="2.5" fill="#bbb" text-anchor="middle">PATH B</text>
<text x="600" y="237" font-family="sans-serif" font-size="14" font-weight="700" fill="#555" text-anchor="middle">${t(d.pathB?.name, 22)}</text>
<text x="600" y="253" font-family="sans-serif" font-size="10" font-weight="400" fill="#aaa" text-anchor="middle">${t(d.pathB?.sub, 40)}</text>
<rect x="875" y="193" width="256" height="70" rx="3" fill="#ffffff" stroke="#1a1a1a" stroke-width="2"/>
<text x="1003" y="213" font-family="sans-serif" font-size="8.5" font-weight="700" letter-spacing="2.5" fill="#555" text-anchor="middle">PATH C - RECOMMENDED</text>
<text x="1003" y="234" font-family="sans-serif" font-size="14" font-weight="700" fill="#1a1a1a" text-anchor="middle">${t(d.pathC?.name, 22)}</text>
<text x="1003" y="251" font-family="sans-serif" font-size="10" font-weight="400" fill="#666" text-anchor="middle">${t(d.pathC?.sub, 40)}</text>
<line x1="197" y1="260" x2="197" y2="314" stroke="#ccc" stroke-width="1.5" stroke-dasharray="5,4" marker-end="url(#arrG)"/>
<line x1="600" y1="260" x2="600" y2="314" stroke="#ccc" stroke-width="1.5" stroke-dasharray="5,4" marker-end="url(#arrG)"/>
<line x1="1003" y1="263" x2="1003" y2="314" stroke="#1a1a1a" stroke-width="2" marker-end="url(#arr)"/>
<rect x="77" y="314" width="240" height="64" rx="3" fill="#fafafa" stroke="#cccccc" stroke-width="1.5"/>
<text x="197" y="334" font-family="sans-serif" font-size="8.5" font-weight="700" letter-spacing="2" fill="#bbb" text-anchor="middle">CONSEQUENCE</text>
<text x="197" y="354" font-family="sans-serif" font-size="13" font-weight="600" fill="#777" text-anchor="middle">${t(d.pathA?.consequence, 28)}</text>
<text x="197" y="370" font-family="sans-serif" font-size="10" font-weight="400" fill="#aaa" text-anchor="middle">${t(d.pathA?.consequenceSub, 40)}</text>
<rect x="480" y="314" width="240" height="64" rx="3" fill="#fafafa" stroke="#cccccc" stroke-width="1.5"/>
<text x="600" y="334" font-family="sans-serif" font-size="8.5" font-weight="700" letter-spacing="2" fill="#bbb" text-anchor="middle">CONSEQUENCE</text>
<text x="600" y="354" font-family="sans-serif" font-size="13" font-weight="600" fill="#777" text-anchor="middle">${t(d.pathB?.consequence, 28)}</text>
<text x="600" y="370" font-family="sans-serif" font-size="10" font-weight="400" fill="#aaa" text-anchor="middle">${t(d.pathB?.consequenceSub, 40)}</text>
<rect x="875" y="314" width="256" height="64" rx="3" fill="#ffffff" stroke="#1a1a1a" stroke-width="2"/>
<text x="1003" y="334" font-family="sans-serif" font-size="8.5" font-weight="700" letter-spacing="2" fill="#555" text-anchor="middle">RESULT</text>
<text x="1003" y="354" font-family="sans-serif" font-size="13" font-weight="700" fill="#1a1a1a" text-anchor="middle">${t(d.pathC?.result, 28)}</text>
<text x="1003" y="370" font-family="sans-serif" font-size="10" font-weight="400" fill="#666" text-anchor="middle">${t(d.pathC?.resultSub, 40)}</text>
<line x1="197" y1="378" x2="197" y2="432" stroke="#ddd" stroke-width="1.5" stroke-dasharray="4,4" marker-end="url(#arrR)"/>
<line x1="600" y1="378" x2="600" y2="432" stroke="#ddd" stroke-width="1.5" stroke-dasharray="4,4" marker-end="url(#arrR)"/>
<line x1="1003" y1="378" x2="1003" y2="432" stroke="#1a1a1a" stroke-width="2" marker-end="url(#arr)"/>
<rect x="77" y="432" width="240" height="70" rx="3" fill="#fff8f8" stroke="#e0a0a0" stroke-width="1.5"/>
<text x="197" y="452" font-family="sans-serif" font-size="8.5" font-weight="700" letter-spacing="2" fill="#c07070" text-anchor="middle">DEAD END</text>
<text x="197" y="471" font-family="sans-serif" font-size="13" font-weight="700" fill="#c04040" text-anchor="middle">${t(d.pathA?.deadEnd, 28)}</text>
<text x="197" y="488" font-family="sans-serif" font-size="10" font-weight="400" fill="#c07070" text-anchor="middle">${t(d.pathA?.deadEndSub, 40)}</text>
<rect x="480" y="432" width="240" height="70" rx="3" fill="#fff8f8" stroke="#e0a0a0" stroke-width="1.5"/>
<text x="600" y="452" font-family="sans-serif" font-size="8.5" font-weight="700" letter-spacing="2" fill="#c07070" text-anchor="middle">DEAD END</text>
<text x="600" y="471" font-family="sans-serif" font-size="13" font-weight="700" fill="#c04040" text-anchor="middle">${t(d.pathB?.deadEnd, 28)}</text>
<text x="600" y="488" font-family="sans-serif" font-size="10" font-weight="400" fill="#c07070" text-anchor="middle">${t(d.pathB?.deadEndSub, 40)}</text>
<rect x="869" y="426" width="268" height="82" rx="4" fill="#1a1a1a"/>
<text x="1003" y="451" font-family="sans-serif" font-size="8.5" font-weight="700" letter-spacing="2.5" fill="#888" text-anchor="middle">* BEST SOLUTION</text>
<text x="1003" y="473" font-family="sans-serif" font-size="15" font-weight="700" fill="#ffffff" text-anchor="middle">${t(d.pathC?.bestSolution, 28)}</text>
<text x="1003" y="491" font-family="sans-serif" font-size="10" font-weight="300" fill="#aaa" text-anchor="middle">${t(d.pathC?.bestSolutionSub, 42)}</text>
<line x1="197" y1="502" x2="197" y2="516" stroke="#e0a0a0" stroke-width="1.5"/>
<line x1="600" y1="502" x2="600" y2="516" stroke="#e0a0a0" stroke-width="1.5"/>
<line x1="1003" y1="508" x2="1003" y2="518" stroke="#555" stroke-width="1.5"/>
<circle cx="197" cy="530" r="16" fill="#fff0f0" stroke="#e0a0a0" stroke-width="1.5"/>
<text x="197" y="536" font-family="sans-serif" font-size="15" font-weight="700" fill="#c04040" text-anchor="middle">X</text>
<circle cx="600" cy="530" r="16" fill="#fff0f0" stroke="#e0a0a0" stroke-width="1.5"/>
<text x="600" y="536" font-family="sans-serif" font-size="15" font-weight="700" fill="#c04040" text-anchor="middle">X</text>
<circle cx="1003" cy="530" r="16" fill="#1a1a1a" stroke="#1a1a1a" stroke-width="2"/>
<text x="1003" y="536" font-family="sans-serif" font-size="15" font-weight="700" fill="#ffffff" text-anchor="middle">v</text>
<rect x="862" y="555" width="282" height="22" rx="3" fill="#f5f5f5" stroke="#ddd" stroke-width="1"/>
<text x="870" y="570" font-family="sans-serif" font-size="9.5" font-weight="400" fill="#999">Roberts Toprins - TOPR Solutions - top-rsolutions.co.uk</text>
<line x1="40" y1="608" x2="1160" y2="608" stroke="#eee" stroke-width="1"/>
<text x="40" y="630" font-family="sans-serif" font-size="9.5" font-weight="400" letter-spacing="1" fill="#aaa">TOP-R Solutions - Problem Intelligence Framework - BIM &amp; AEC Automation</text>
<text x="1160" y="626" font-family="sans-serif" font-size="11" font-weight="700" letter-spacing="1.5" fill="#1a1a1a" text-anchor="end">TOP-R</text>
<text x="1160" y="640" font-family="sans-serif" font-size="8" font-weight="400" letter-spacing="1" fill="#888" text-anchor="end">Solutions</text>
</svg>`
}

async function svgToPng(svgString) {
  const { Resvg } = await import('@resvg/resvg-js')
  const resvg = new Resvg(svgString, { fitTo: { mode: 'width', value: 1200 } })
  return Buffer.from(resvg.render().asPng())
}

async function sendTelegramPhoto(chatId, pngBuffer) {
  const formData = new FormData()
  formData.append('chat_id', String(chatId))
  formData.append('photo', new Blob([pngBuffer], { type: 'image/png' }), 'wiremap.png')
  const r = await fetch(`${TELEGRAM_API}/sendPhoto`, { method: 'POST', body: formData })
  const d = await r.json()
  if (!d.ok) throw new Error(`Telegram sendPhoto: ${d.description || r.status}`)
}

const AUTHOR_SYSTEM = `You are Roberts Toprins. Write LinkedIn posts exactly as shown in the examples below — that tone, that rhythm, that level of honesty.

EXAMPLES OF THE EXACT VOICE TO MATCH:

---
Got my MCP certification last week.

Took longer than expected. Mostly because I kept stopping to actually build things.

That's the weird part about learning AI infrastructure — the theory makes sense in 10 minutes. The real understanding comes when something breaks at 11pm and you fix it by midnight.

The certificate is just a receipt. The actual thing is knowing why your agent failed and exactly how to fix it.

If you're thinking about MCP — don't just watch the tutorials. Build something broken first. That's where it clicks.

What did you build recently that taught you more than any course?
---

---
300 RFIs open at handover.

Not because the team was bad. Because nobody agreed on what counted as an RFI.

We built a triage agent for it. Took a weekend. 200 cleared in 30 seconds.

The tech wasn't the hard part. Getting one person to say "yes, try it" — that took three months.

What's something your team knows needs fixing but nobody's officially allowed to fix yet?
---

---
Built an automation last week that saved 4 hours.

Spent 5 hours building it.

Still worth it. Not because of the maths — because now I understand the pattern. The next one took 45 minutes.

That's the real value of building with AI. Not the first tool. The second one.

What are you still doing manually that you know you shouldn't be?
---

RULES — non-negotiable:
- NEVER start with the word "I"
- Write about ONLY the topic given — do not drift
- 1-2 short sentences per paragraph, then a line break
- No hashtags in the body
- End with a genuine question
- BANNED words: leverage, innovative, revolutionize, game-changer, cutting-edge, unlock, harness, delve, transformative, impactful, utilize
- 180-220 words. No padding. No showing off.`

const SCORE_SYSTEM = `You are a LinkedIn analyst. Score this post and return hashtags.
Return ONLY valid JSON — no markdown fences, nothing outside the JSON.
The "improvement" field: ONE sentence, max 12 words, plain language only.`

async function runWriter(topic, bullets = '') {
  const userPrompt = `Topic: ${topic.trim()}${bullets?.trim() ? `\n\n${bullets.trim()}` : ''}`

  const draft = await gemini(AUTHOR_SYSTEM, userPrompt, 0.85, 800)

  const scoreRaw = await gemini(
    SCORE_SYSTEM,
    `Topic: "${topic.trim()}"\n\nPost:\n${draft}\n\nReturn JSON: { "scores": { "hook": 8, "readability": 9, "industryRelevance": 9, "cta": 7, "overall": 8.3 }, "reasoning": { "hook": "...", "readability": "...", "industryRelevance": "...", "cta": "..." }, "improvement": "...", "hashtags": { "niche": ["#MCPCertified","#AgenticAI","#BIMIntelligence"], "industry": ["#AI","#AEC","#ConstructionTech","#UKConstruction","#ModelContextProtocol"], "marketLeaders": ["#Autodesk","#Procore","#Anthropic","#Trimble","#Bentley"] } }`,
    0.3, 800
  )
  let scoreData = {}
  try { scoreData = JSON.parse(stripJson(scoreRaw)) } catch { scoreData = {} }

  return {
    variants: { long: draft, short: draft, caseStudy: draft },
    scores: scoreData.scores || {},
    reasoning: scoreData.reasoning || {},
    improvement: scoreData.improvement || '',
    hashtags: scoreData.hashtags || { niche: [], industry: [], marketLeaders: [] },
  }
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

  return `✍️ *Your LinkedIn post is ready*

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
/regenerate — rewrite from scratch`
}

function formatFullPost(variants) {
  const long = variants?.long || ''
  return `📄 Full post (long version):\n\n${long}`
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
      const [result, wireMapData] = await Promise.all([
        runWriter(session.topic, session.bullets || ''),
        generateWireMapData(session.topic),
      ])
      await setSession(chatId, { ...session, ...result })
      await sendTelegram(chatId, formatDraftMessage(result))
      await sendTelegram(chatId, formatFullPost(result.variants), null)
      try {
        if (!wireMapData) throw new Error('Wire map data was null — Gemini JSON parse failed')
        const png = await svgToPng(buildWireMapSvg(wireMapData))
        await sendTelegramPhoto(chatId, png)
      } catch (err) {
        console.error('Wire map failed:', err.message)
        await sendTelegram(chatId, `Wire map error: ${err.message}`, null)
      }
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
      await sendTelegram(chatId, '🔍 Reading your image...')
      const photoUrl = await getPhotoUrl(largest.file_id)
      let topic, detectedType
      if (caption) {
        topic = caption
        detectedType = null
      } else if (photoUrl) {
        const detected = await inferTopicFromPhoto(photoUrl)
        topic = detected.topic
        detectedType = detected.type
      } else {
        topic = 'Professional update'
        detectedType = null
      }
      await sendTelegram(chatId, `📸 Detected: ${topic}\n\nWriting your post...`)
      const result = await runWriter(topic)
      await setSession(chatId, { topic, variants: result.variants, hashtags: result.hashtags, photoUrl })
      await sendTelegram(chatId, formatDraftMessage(result))
      await sendTelegram(chatId, formatFullPost(result.variants), null)
      return res.status(200).json({ ok: true })
    }

    // ── Text message → treat as topic ─────────────────────────────────────────
    if (text && !text.startsWith('/')) {
      await sendTelegram(chatId, `📝 Got it. Writing your post + wire map...\n\n_This takes about 20–25 seconds_`)
      const [result, wireMapData] = await Promise.all([
        runWriter(text),
        generateWireMapData(text),
      ])
      await setSession(chatId, { topic: text, variants: result.variants, hashtags: result.hashtags })
      await sendTelegram(chatId, formatDraftMessage(result))
      await sendTelegram(chatId, formatFullPost(result.variants), null)
      if (wireMapData) {
        try {
          const png = await svgToPng(buildWireMapSvg(wireMapData))
          await sendTelegramPhoto(chatId, png)
        } catch (err) {
          console.error('Wire map (text) failed:', err.message)
          await sendTelegram(chatId, `Wire map error: ${err.message}`, null)
        }
      }
      return res.status(200).json({ ok: true })
    }

  } catch (err) {
    console.error('telegram-webhook error:', err)
    await sendTelegram(chatId, `❌ Something went wrong: ${err.message}`)
  }

  return res.status(200).json({ ok: true })
}
