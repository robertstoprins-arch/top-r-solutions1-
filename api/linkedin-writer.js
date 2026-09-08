import { buildAuthorSystem, buildRewriteSystem, CRITIC_SYSTEM, SCORE_SYSTEM } from './_voice.js'

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

async function gemini(system, user, temperature = 0.8, maxTokens = 1200) {
  const key = process.env.GEMINI_API_KEY
  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: { temperature, maxOutputTokens: maxTokens },
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || `Gemini ${res.status}`)
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
}

function geminiJson(system, user) {
  return gemini(system, user, 0.3, 800)
}

// AUTHOR_SYSTEM/CRITIC_SYSTEM/REWRITE_SYSTEM/SCORE_SYSTEM now live in ./_voice.js,
// shared with api/telegram-webhook.js so the web UI and the bot never drift into
// two different voices again. `voiceSamples` pasted in the web UI is passed
// through as `recentPosts` (one string per line-separated block is treated as
// a single example) — same mechanism the bot uses for real published posts.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { topic, bullets, tone = 'direct', language, pov, directive = '', voiceSamples = '', variant = 'long' } = req.body || {}

  if (!topic?.trim()) return res.status(400).json({ error: 'topic is required' })

  // Pasted voice samples (web UI, from localStorage) split into individual
  // examples on "---" separators, same shape the bot's real post log produces.
  const recentPosts = voiceSamples?.trim()
    ? voiceSamples.split(/\n?---\n?/).map((s) => s.trim()).filter(Boolean)
    : undefined

  const userPrompt = `
Topic: ${topic.trim()}
${bullets?.trim() ? `Key points:\n${bullets.trim()}` : ''}
`.trim()

  const authorOpts = (v) => buildAuthorSystem({ topic, tone, language, pov, directive, recentPosts, variant: v })

  try {
    // Pass 1 — Write all 3 variants in parallel
    const [shortDraft, longDraft, caseDraft] = await Promise.all([
      gemini(authorOpts('short'), userPrompt),
      gemini(authorOpts('long'), userPrompt),
      gemini(authorOpts('caseStudy'), userPrompt),
    ])

    // Pass 2 — Critic reviews the long variant
    const critique = await geminiJson(
      CRITIC_SYSTEM,
      `Review this LinkedIn post written by a BIM/construction CEO:

${longDraft}

Score each dimension 1–10 and give one specific improvement per dimension.
Return JSON: { "hook": { "score": 7, "why": "...", "fix": "..." }, "readability": {...}, "industryRelevance": {...}, "cta": {...} }`
    )

    let critiqueData = {}
    try { critiqueData = JSON.parse(critique) } catch { critiqueData = {} }

    const critiqueText = Object.entries(critiqueData)
      .map(([k, v]) => `${k}: ${v.why} Fix: ${v.fix}`)
      .join('\n')

    // Pass 3 — Rewrite long variant with critique applied
    const rewritten = await gemini(
      buildRewriteSystem({ topic, tone, language, pov, directive, recentPosts }),
      `Original post:\n${longDraft}\n\nCritique to apply:\n${critiqueText}\n\nRewrite the post applying every critique point.`
    )

    // Pass 4 — Final score + hashtags on rewritten post
    const scoreRaw = await geminiJson(
      SCORE_SYSTEM,
      `Score this LinkedIn post and generate hashtags:

${rewritten}

Return this exact JSON structure:
{
  "scores": {
    "hook": 8,
    "readability": 9,
    "industryRelevance": 9,
    "cta": 7,
    "overall": 8.3
  },
  "reasoning": {
    "hook": "one sentence explaining the score",
    "readability": "one sentence explaining the score",
    "industryRelevance": "one sentence explaining the score",
    "cta": "one sentence explaining the score"
  },
  "improvement": "The single most impactful change remaining",
  "hashtags": {
    "niche": ["#RFIAutomation", "#VoidClosure", "#BIMIntelligence", "#DocumentIntelligence"],
    "industry": ["#BIM", "#AEC", "#ConstructionTech", "#UKConstruction", "#AgenticAI", "#ModelContextProtocol"],
    "marketLeaders": ["#Autodesk", "#Procore", "#Trimble", "#Bentley", "#Nemetschek", "#Graphisoft", "#Aconex", "#Hexagon"]
  }
}`
    )

    let scoreData = {}
    try { scoreData = JSON.parse(scoreRaw) } catch { scoreData = {} }

    res.status(200).json({
      variants: { long: rewritten, short: shortDraft, caseStudy: caseDraft },
      scores: scoreData.scores || {},
      reasoning: scoreData.reasoning || {},
      improvement: scoreData.improvement || '',
      hashtags: scoreData.hashtags || { niche: [], industry: [], marketLeaders: [] },
    })
  } catch (err) {
    console.error('linkedin-writer error:', err)
    res.status(500).json({ error: err.message || 'Writer engine failed' })
  }
}
