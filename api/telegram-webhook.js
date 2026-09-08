import {
  buildAuthorSystem,
  buildRewriteSystem,
  buildCommentSystem,
  CRITIC_SYSTEM,
  SCORE_SYSTEM,
  TONE_PRESETS,
  LANGUAGE_PRESETS,
} from './_voice.js'

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

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

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

// ── Redis-backed state: draft session, standing prefs, permanent post log ────

function sessionKey(chatId) { return `linkedin:session:${chatId}` }
function prefsKey(chatId) { return `linkedin:prefs:${chatId}` }
function commentSessionKey(chatId) { return `linkedin:comment-session:${chatId}` }
const POST_LOG_KEY = 'linkedin:post-log'
const POST_LOG_MAX = 200
const COMMENT_LOG_KEY = 'linkedin:comment-log'
const COMMENT_LOG_MAX = 200

async function withRedis(fn) {
  const url = process.env.REDIS_URL
  if (!url) return null
  const { createClient } = await import('redis')
  const client = createClient({ url })
  try {
    await client.connect()
    return await fn(client)
  } catch { return null }
  finally { client.disconnect() }
}

async function getSession(chatId) {
  return withRedis(async (client) => {
    const val = await client.get(sessionKey(chatId))
    return val ? JSON.parse(val) : null
  })
}

async function setSession(chatId, value) {
  await withRedis(async (client) => {
    await client.set(sessionKey(chatId), JSON.stringify(value), { EX: 86400 })
  })
}

// Standing preferences (tone/language/pov) — no expiry, they should stick
// until the user changes them.
async function getPrefs(chatId) {
  const prefs = await withRedis(async (client) => {
    const val = await client.get(prefsKey(chatId))
    return val ? JSON.parse(val) : null
  })
  return prefs || {}
}

async function setPrefs(chatId, patch) {
  const current = await getPrefs(chatId)
  const next = { ...current, ...patch }
  await withRedis(async (client) => {
    await client.set(prefsKey(chatId), JSON.stringify(next))
  })
  return next
}

// Permanent post log — every post actually published, oldest to newest.
// Doubles as (a) an audit trail / "log sheet" and (b) the source of real
// voice examples fed back into future drafts instead of fixed fake ones.
async function logPost(entry) {
  await withRedis(async (client) => {
    await client.rPush(POST_LOG_KEY, JSON.stringify(entry))
    await client.lTrim(POST_LOG_KEY, -POST_LOG_MAX, -1)
  })
}

async function getLogEntries(n) {
  const entries = await withRedis(async (client) => {
    const raw = await client.lRange(POST_LOG_KEY, -n, -1)
    return raw.map((r) => { try { return JSON.parse(r) } catch { return null } }).filter(Boolean)
  })
  return entries || []
}

async function getRecentPostTexts(n = 3) {
  const entries = await getLogEntries(n)
  return entries.reverse().map((e) => e.text).filter(Boolean)
}

// Comment-drafting session — separate key from the post-draft session so
// starting a /comment flow never clobbers an in-progress post draft (or
// vice versa). Short-lived, same 24h TTL pattern.
async function getCommentSession(chatId) {
  return withRedis(async (client) => {
    const val = await client.get(commentSessionKey(chatId))
    return val ? JSON.parse(val) : null
  })
}

async function setCommentSession(chatId, value) {
  await withRedis(async (client) => {
    await client.set(commentSessionKey(chatId), JSON.stringify(value), { EX: 86400 })
  })
}

async function clearCommentSession(chatId) {
  await withRedis(async (client) => { await client.del(commentSessionKey(chatId)) })
}

// Permanent comment log — every comment text the user actually finalised
// and (presumably) pasted into LinkedIn. There is no auto-post step here:
// LinkedIn's comment-creation endpoint (Comments API under Community
// Management API) requires w_member_social_feed scope, which is gated
// behind a Partner Program application limited to verified registered
// businesses — not available to this app. See workflows/linkedin_writer.md.
async function logComment(entry) {
  await withRedis(async (client) => {
    await client.rPush(COMMENT_LOG_KEY, JSON.stringify(entry))
    await client.lTrim(COMMENT_LOG_KEY, -COMMENT_LOG_MAX, -1)
  })
}

async function getCommentLogEntries(n) {
  const entries = await withRedis(async (client) => {
    const raw = await client.lRange(COMMENT_LOG_KEY, -n, -1)
    return raw.map((r) => { try { return JSON.parse(r) } catch { return null } }).filter(Boolean)
  })
  return entries || []
}

// ── Writer engine ─────────────────────────────────────────────────────────────

/**
 * Generates three genuinely distinct variants (short / long / caseStudy),
 * critiques and rewrites the long one, then scores the rewritten version and
 * generates hashtags. `opts` carries tone/language/pov/directive plus the
 * real recent posts to ground voice on.
 */
async function runWriter(topic, opts = {}) {
  const { bullets = '', tone, language, pov, directive } = opts
  const recentPosts = await getRecentPostTexts(3)
  const userPrompt = `Topic: ${topic.trim()}${bullets?.trim() ? `\n\nKey points:\n${bullets.trim()}` : ''}`

  const [shortDraft, longDraft, caseDraft] = await Promise.all([
    gemini(buildAuthorSystem({ topic, tone, language, pov, directive, recentPosts, variant: 'short' }), userPrompt, 0.85, 500),
    gemini(buildAuthorSystem({ topic, tone, language, pov, directive, recentPosts, variant: 'long' }), userPrompt, 0.85, 800),
    gemini(buildAuthorSystem({ topic, tone, language, pov, directive, recentPosts, variant: 'caseStudy' }), userPrompt, 0.85, 700),
  ])

  const critique = await gemini(
    CRITIC_SYSTEM,
    `Review this LinkedIn post written by a BIM/construction CEO:\n\n${longDraft}\n\nScore each dimension 1–10 and give one specific improvement per dimension.\nReturn JSON: { "hook": { "score": 7, "why": "...", "fix": "..." }, "readability": {...}, "industryRelevance": {...}, "cta": {...} }`,
    0.3, 800
  )
  let critiqueData = {}
  try { critiqueData = JSON.parse(stripJson(critique)) } catch { critiqueData = {} }
  const critiqueText = Object.entries(critiqueData)
    .map(([k, v]) => `${k}: ${v.why} Fix: ${v.fix}`)
    .join('\n')

  const rewritten = critiqueText
    ? await gemini(
        buildRewriteSystem({ topic, tone, language, pov, directive, recentPosts }),
        `Original post:\n${longDraft}\n\nCritique to apply:\n${critiqueText}\n\nRewrite the post applying every critique point.`,
        0.7, 800
      )
    : longDraft

  const scoreRaw = await gemini(
    SCORE_SYSTEM,
    `Topic: "${topic.trim()}"\n\nPost:\n${rewritten}\n\nReturn this exact JSON structure:\n{\n  "scores": { "hook": 8, "readability": 9, "industryRelevance": 9, "cta": 7, "overall": 8.3 },\n  "reasoning": { "hook": "...", "readability": "...", "industryRelevance": "...", "cta": "..." },\n  "improvement": "...",\n  "hashtags": { "niche": ["#RFIAutomation","#VoidClosure","#BIMIntelligence"], "industry": ["#BIM","#AEC","#ConstructionTech","#UKConstruction","#AgenticAI","#ModelContextProtocol"], "marketLeaders": ["#Autodesk","#Procore","#Trimble","#Bentley","#Anthropic"] }\n}`,
    0.3, 800
  )
  let scoreData = {}
  try { scoreData = JSON.parse(stripJson(scoreRaw)) } catch { scoreData = {} }

  return {
    variants: { long: rewritten, short: shortDraft, caseStudy: caseDraft },
    scores: scoreData.scores || {},
    reasoning: scoreData.reasoning || {},
    improvement: scoreData.improvement || '',
    hashtags: scoreData.hashtags || { niche: [], industry: [], marketLeaders: [] },
  }
}

// ── LinkedIn posting ──────────────────────────────────────────────────────────

async function uploadImageToLinkedIn(token, personUrn, imageBuffer) {
  const registerRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        owner: personUrn,
        serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }],
      },
    }),
  })
  const registerData = await registerRes.json()
  const uploadUrl = registerData.value?.uploadMechanism?.['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']?.uploadUrl
  const assetUrn = registerData.value?.asset
  if (!uploadUrl || !assetUrn) throw new Error(`LinkedIn image registration failed: ${JSON.stringify(registerData)}`)
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/png' },
    body: imageBuffer,
  })
  return assetUrn
}

async function postToLinkedIn(postText, hashtags, imageBuffer = null) {
  const token = process.env.LINKEDIN_ACCESS_TOKEN
  const personUrn = process.env.LINKEDIN_PERSON_URN
  if (!token) throw new Error('LINKEDIN_ACCESS_TOKEN not set in Vercel env vars')
  if (!personUrn) throw new Error('LINKEDIN_PERSON_URN not set in Vercel env vars')

  const allHashtags = [
    ...(hashtags?.niche || []),
    ...(hashtags?.industry || []),
    ...(hashtags?.marketLeaders || []).slice(0, 5),
  ].join(' ')
  const fullText = `${postText}\n\n${allHashtags}`.trim()

  let assetUrn = null
  if (imageBuffer) {
    try {
      assetUrn = await uploadImageToLinkedIn(token, personUrn, imageBuffer)
    } catch (err) {
      console.warn('Image upload failed, posting text only:', err.message)
    }
  }

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      author: personUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: fullText },
          shareMediaCategory: assetUrn ? 'IMAGE' : 'NONE',
          ...(assetUrn && { media: [{ status: 'READY', media: assetUrn }] }),
        },
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
    }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || `LinkedIn API ${res.status}: ${JSON.stringify(data)}`)
  const postUrn = res.headers.get('x-restli-id') || data.id
  const postUrl = postUrn ? `https://www.linkedin.com/feed/update/${postUrn}/` : null
  return { ...data, postUrl }
}

// ── Message formatting ────────────────────────────────────────────────────────

function formatDraftMessage(result, opts = {}) {
  const { variants, scores, improvement } = result
  const s = scores || {}
  const overall = s.overall || '—'
  const hook = s.hook || '—'
  const read = s.readability || '—'
  const ind = s.industryRelevance || '—'
  const cta = s.cta || '—'
  const settingsLine = `_tone: ${opts.tone || 'direct'} · lang: ${opts.language || 'en'} · pov: ${opts.pov || 'first'}_`

  return `✍️ *Your LinkedIn post is ready*
${settingsLine}

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

function toneMenuText(current) {
  const lines = Object.entries(TONE_PRESETS).map(([key, v]) => `\`${key}\` — ${v.label}: ${v.instruction}`)
  return `*Tone options* (current: \`${current || 'direct'}\`)\n\n${lines.join('\n\n')}\n\nSet with: /tone <name>`
}

function langMenuText(current) {
  const lines = Object.entries(LANGUAGE_PRESETS).map(([key, v]) => `\`${key}\` — ${v.label}`)
  return `*Language options* (current: \`${current || 'en'}\`)\n\n${lines.join('\n')}\n\nAlso accepts any language name, e.g. \`/lang German\`.\n\nSet with: /lang <name>`
}

function povMenuText(current) {
  return `*Point of view* (current: \`${current || 'first'}\`)\n\n\`first\` — "I built...", "we shipped..."\n\`third\` — "Roberts built...", "the team shipped..."\n\nSet with: /pov first|third`
}

function formatHistory(entries) {
  if (!entries.length) return 'No posts logged yet — approve one and it will show up here.'
  const lines = entries.reverse().map((e) => {
    const date = e.timestamp ? new Date(e.timestamp).toISOString().slice(0, 10) : '—'
    const link = e.postUrl ? `\n${e.postUrl}` : ''
    return `*${date}* [${e.variant || 'long'}/${e.tone || 'direct'}/${e.language || 'en'}] — ${e.topic}${link}`
  })
  return `🗂️ *Last ${entries.length} posts:*\n\n${lines.join('\n\n')}`
}

function formatCommentHistory(entries) {
  if (!entries.length) return 'No comments drafted yet — use /comment <url> to start.'
  const lines = entries.reverse().map((e) => {
    const date = e.timestamp ? new Date(e.timestamp).toISOString().slice(0, 10) : '—'
    return `${date} — ${e.url || '(no link)'}\n${e.text}`
  })
  return `🗂️ Last ${entries.length} comments drafted:\n\n${lines.join('\n\n')}`
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
        `👋 *LinkedIn Intelligence Writer*\n\nSend me:\n• A topic or insight as a text message\n• A photo (with or without caption) from site\n• \`/write <instructions>\` to direct tone, POV, language, or angle in one go\n• \`/comment <url>\` to draft a comment on someone else's post\n• /help for all commands`
      )
      return res.status(200).json({ ok: true })
    }

    // ── /help ────────────────────────────────────────────────────────────────
    if (text === '/help') {
      await sendTelegram(chatId,
        `*Writing your own posts:*\nJust send your topic as a message, or send a photo from site.\n\`/write <instructions>\` — e.g. "/write the digital twin control system, third person, professional, promising tone" — free-form, overrides your saved defaults for this post only.\n\n*Standing preferences (stick until changed):*\n/tone [name] — set or view default tone\n/lang [name] — set or view default language\n/pov [first|third] — set or view default point of view\n\n*After a draft:*\n/approve long|short|case — post that version\n/variants — see all 3 draft versions\n/regenerate — rewrite from scratch\n\n*Commenting on other people's posts:*\n\`/comment <url>\` — start a comment draft, then paste the post's text when asked\nReply 1/2/3 to pick a drafted option, or type your own — either way you paste the result into LinkedIn yourself (LinkedIn's comment-posting API is restricted to approved business partners, not solo apps, so this step stays manual)\n/chistory — last 5 comments drafted\n/cancel — abandon an in-progress comment draft\n\n*Other:*\n/history — last 5 published posts\n/image — generate AI image`
      )
      return res.status(200).json({ ok: true })
    }

    // ── /tone, /lang, /pov ───────────────────────────────────────────────────
    if (text === '/tone' || text.startsWith('/tone ')) {
      const prefs = await getPrefs(chatId)
      const arg = text.slice('/tone'.length).trim().toLowerCase()
      if (!arg) {
        await sendTelegram(chatId, toneMenuText(prefs.tone))
        return res.status(200).json({ ok: true })
      }
      if (!TONE_PRESETS[arg]) {
        await sendTelegram(chatId, `Unknown tone \`${arg}\`.\n\n${toneMenuText(prefs.tone)}`)
        return res.status(200).json({ ok: true })
      }
      await setPrefs(chatId, { tone: arg })
      await sendTelegram(chatId, `✅ Default tone set to \`${arg}\`.`)
      return res.status(200).json({ ok: true })
    }

    if (text === '/lang' || text.startsWith('/lang ')) {
      const prefs = await getPrefs(chatId)
      const arg = text.slice('/lang'.length).trim()
      if (!arg) {
        await sendTelegram(chatId, langMenuText(prefs.language))
        return res.status(200).json({ ok: true })
      }
      const key = LANGUAGE_PRESETS[arg.toLowerCase()] ? arg.toLowerCase() : arg
      await setPrefs(chatId, { language: key })
      await sendTelegram(chatId, `✅ Default language set to \`${key}\`.`)
      return res.status(200).json({ ok: true })
    }

    if (text === '/pov' || text.startsWith('/pov ')) {
      const prefs = await getPrefs(chatId)
      const arg = text.slice('/pov'.length).trim().toLowerCase()
      if (!arg) {
        await sendTelegram(chatId, povMenuText(prefs.pov))
        return res.status(200).json({ ok: true })
      }
      if (arg !== 'first' && arg !== 'third') {
        await sendTelegram(chatId, `Unknown POV \`${arg}\`.\n\n${povMenuText(prefs.pov)}`)
        return res.status(200).json({ ok: true })
      }
      await setPrefs(chatId, { pov: arg })
      await sendTelegram(chatId, `✅ Default point of view set to \`${arg}\`.`)
      return res.status(200).json({ ok: true })
    }

    // ── /history ─────────────────────────────────────────────────────────────
    if (text === '/history') {
      const entries = await getLogEntries(5)
      await sendTelegram(chatId, formatHistory(entries))
      return res.status(200).json({ ok: true })
    }

    // ── /comment <url> ───────────────────────────────────────────────────────
    if (text === '/comment' || text.startsWith('/comment ')) {
      const arg = text.slice('/comment'.length).trim()
      if (!arg) {
        await sendTelegram(chatId,
          `Usage: \`/comment <linkedin post url>\`\n\nI'll ask you to paste the post's text next, then draft 3 comment options. You pick one (or write your own) and paste it into LinkedIn yourself — I can't post comments via the API. LinkedIn gates that endpoint behind Partner Program approval for verified registered businesses; it's not available to solo apps like this one.`
        )
        return res.status(200).json({ ok: true })
      }
      if (!/linkedin\.com/i.test(arg)) {
        await sendTelegram(chatId, `⚠️ That doesn't look like a linkedin.com URL — continuing anyway.`)
      }
      const prefs = await getPrefs(chatId)
      await setCommentSession(chatId, { mode: 'awaiting_source', url: arg, tone: prefs.tone, language: prefs.language })
      await sendTelegram(chatId, `🔗 Got the link. Now paste the post's text (copy it straight from LinkedIn) so I can draft a relevant comment.`)
      return res.status(200).json({ ok: true })
    }

    // ── /chistory ────────────────────────────────────────────────────────────
    if (text === '/chistory') {
      const entries = await getCommentLogEntries(5)
      await sendTelegram(chatId, formatCommentHistory(entries), null)
      return res.status(200).json({ ok: true })
    }

    // ── /cancel ──────────────────────────────────────────────────────────────
    if (text === '/cancel') {
      const hadSession = await getCommentSession(chatId)
      await clearCommentSession(chatId)
      await sendTelegram(chatId, hadSession ? 'Comment draft cancelled.' : 'Nothing in progress to cancel.')
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
      await sendTelegram(chatId, `📌 *LONG VERSION:*\n\n${long}`)
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
      const opts = { tone: session.tone, language: session.language, pov: session.pov, directive: session.directive, bullets: session.bullets }
      const [result, wireMapData] = await Promise.all([
        runWriter(session.topic, opts),
        generateWireMapData(session.topic),
      ])
      await setSession(chatId, { ...session, ...result })
      await sendTelegram(chatId, formatDraftMessage(result, opts))
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
        // Resolve image — wire map for text posts, user photo for photo posts
        let imageBuffer = null
        if (session.photoUrl) {
          try {
            const r = await fetch(session.photoUrl)
            imageBuffer = Buffer.from(await r.arrayBuffer())
          } catch (e) { console.warn('Photo fetch failed:', e.message) }
        } else if (session.wireMapData) {
          try {
            imageBuffer = await svgToPng(buildWireMapSvg(session.wireMapData))
          } catch (e) { console.warn('Wire map regen failed:', e.message) }
        }
        const postedText = session.variants[variantKey]
        const { postUrl } = await postToLinkedIn(postedText, session.hashtags, imageBuffer)
        await logPost({
          timestamp: Date.now(),
          topic: session.topic,
          tone: session.tone || 'direct',
          language: session.language || 'en',
          pov: session.pov || 'first',
          variant: variantKey,
          text: postedText,
          hashtags: session.hashtags,
          postUrl,
        })
        const withImage = imageBuffer ? ' with image' : ''
        const linkLine = postUrl ? `\n${postUrl}` : ''
        await sendTelegram(chatId, `✅ Posted to LinkedIn${withImage}!${linkLine}\n\nCheck your profile — it should appear within a minute.`)
      } catch (err) {
        await sendTelegram(chatId, `❌ Post failed: ${err.message}`, null)
      }
      return res.status(200).json({ ok: true })
    }

    // ── /write <directive> ───────────────────────────────────────────────────
    if (text.startsWith('/write')) {
      const directive = text.slice('/write'.length).trim()
      if (!directive) {
        await sendTelegram(chatId, 'Usage: `/write <what to write about, plus any instructions on tone, POV, language, angle>`\n\nExample: `/write the digital twin control rollout, third person, professional, promising tone`')
        return res.status(200).json({ ok: true })
      }
      const prefs = await getPrefs(chatId)
      const opts = { tone: prefs.tone, language: prefs.language, pov: prefs.pov, directive }
      await sendTelegram(chatId, `📝 Got it. Writing to your instructions...\n\n_This takes about 20–25 seconds_`)
      const result = await runWriter(directive, opts)
      await setSession(chatId, { topic: directive, ...opts, variants: result.variants, hashtags: result.hashtags })
      await sendTelegram(chatId, formatDraftMessage(result, opts))
      await sendTelegram(chatId, formatFullPost(result.variants), null)
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
      const prefs = await getPrefs(chatId)
      const opts = { tone: prefs.tone, language: prefs.language, pov: prefs.pov }
      await sendTelegram(chatId, `📸 Detected: ${topic}\n\nWriting your post...`)
      const result = await runWriter(topic, opts)
      await setSession(chatId, { topic, ...opts, variants: result.variants, hashtags: result.hashtags, photoUrl })
      await sendTelegram(chatId, formatDraftMessage(result, opts))
      await sendTelegram(chatId, formatFullPost(result.variants), null)
      return res.status(200).json({ ok: true })
    }

    // ── Comment flow: paste source text, then pick/edit a drafted option ──────
    if (text && !text.startsWith('/')) {
      const commentSession = await getCommentSession(chatId)

      if (commentSession?.mode === 'awaiting_source') {
        await sendTelegram(chatId, '💬 Drafting comment options...')
        const opts = { tone: commentSession.tone, language: commentSession.language, directive: commentSession.directive }
        const raw = await gemini(buildCommentSystem(opts), `The LinkedIn post you're commenting on:\n\n${text}`, 0.85, 400)
        let parsed = {}
        try { parsed = JSON.parse(stripJson(raw)) } catch { parsed = {} }
        const comments = Array.isArray(parsed.comments) && parsed.comments.length ? parsed.comments : [raw]
        await setCommentSession(chatId, { ...commentSession, mode: 'awaiting_pick', comments })
        const list = comments.map((c, i) => `${i + 1}) ${c}`).join('\n\n')
        await sendTelegram(chatId, `💬 Comment options:\n\n${list}\n\nReply 1, 2, or 3 to pick — or type your own version instead. /cancel to abandon.`, null)
        return res.status(200).json({ ok: true })
      }

      if (commentSession?.mode === 'awaiting_pick') {
        const pick = /^[1-3]$/.test(text) ? commentSession.comments[Number(text) - 1] : text
        await logComment({ timestamp: Date.now(), url: commentSession.url, text: pick })
        await clearCommentSession(chatId)
        await sendTelegram(chatId, `✅ Ready — copy this into the comment box on LinkedIn:\n${commentSession.url}`, null)
        await sendTelegram(chatId, pick, null)
        return res.status(200).json({ ok: true })
      }
    }

    // ── Text message → treat as topic ─────────────────────────────────────────
    if (text && !text.startsWith('/')) {
      const prefs = await getPrefs(chatId)
      const opts = { tone: prefs.tone, language: prefs.language, pov: prefs.pov }
      await sendTelegram(chatId, `📝 Got it. Writing your post + wire map...\n\n_This takes about 20–25 seconds_`)
      const [result, wireMapData] = await Promise.all([
        runWriter(text, opts),
        generateWireMapData(text),
      ])
      await setSession(chatId, { topic: text, ...opts, variants: result.variants, hashtags: result.hashtags, wireMapData: wireMapData || null })
      await sendTelegram(chatId, formatDraftMessage(result, opts))
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
