const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent`

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

const AUTHOR_SYSTEM = (voiceSamples, variant) => `
You are Roberts Toprins — BIM CEO, MCP-certified AI practitioner, UK construction and technology specialist.

VOICE & STYLE:
${voiceSamples
  ? `Study these past posts and match the rhythm, vocabulary, and tone exactly:\n\n${voiceSamples}`
  : `Direct, excited, forward-thinking. No corporate filler. Sentences are punchy and short. You mix technical precision with human excitement.`
}

RULES — follow every one without exception:
- NEVER start the post with the word "I"
- Hook must land in the first 5 words — bold claim, provocative stat, or sharp question
- New line break every 1–2 sentences (LinkedIn rewards scannability)
- No AI clichés: never use "delve", "leverage", "innovative", "revolutionize", "game-changer", "cutting-edge", "unlock", "harness"
- End with a clear CTA — question, invitation to connect, or call to action
- NO hashtags in the post body — those come separately
- Industry context: BIM, AEC, UK construction, MCP, agentic workflows, ISO 19650, Revit, Procore, Autodesk

VARIANT TYPE: ${variant}
${variant === 'short' ? '- Target: 120–160 words. One idea, punchy, high impact.' : ''}
${variant === 'long' ? '- Target: 320–380 words. Full narrative arc: problem → insight → solution → future.' : ''}
${variant === 'caseStudy' ? '- Target: 250–300 words. Structure: situation → challenge → what we built → result in numbers → lesson.' : ''}
`.trim()

const CRITIC_SYSTEM = `
You are a brutal LinkedIn content strategist who specialises in construction technology and BIM content.
You know exactly what makes posts perform on LinkedIn and what gets ignored.
Score the post on four dimensions and explain exactly why — no flattery.
`.trim()

const REWRITE_SYSTEM = (voiceSamples) => `
You are Roberts Toprins — BIM CEO, MCP-certified AI practitioner.
${voiceSamples ? `Match this voice exactly:\n\n${voiceSamples}` : 'Direct, excited, forward-thinking. No filler.'}
Apply all critique points precisely. Do not genericise. Keep the author's character.
Same rules: never start with "I", hook in first 5 words, line breaks every 1–2 sentences, no hashtags, strong CTA.
`.trim()

const SCORE_SYSTEM = `
You are a LinkedIn analytics expert specialising in construction and BIM content.
Score the post and generate targeted hashtags. Return ONLY valid JSON — no markdown fences, no explanation outside the JSON.
`.trim()

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { topic, bullets, tone = 'excited', voiceSamples = '', variant = 'long' } = req.body || {}

  if (!topic?.trim()) return res.status(400).json({ error: 'topic is required' })

  const userPrompt = `
Topic: ${topic.trim()}
${bullets?.trim() ? `Key points:\n${bullets.trim()}` : ''}
Tone: ${tone}
`.trim()

  try {
    // Pass 1 — Write all 3 variants in parallel
    const [shortDraft, longDraft, caseDraft] = await Promise.all([
      gemini(AUTHOR_SYSTEM(voiceSamples, 'short'), userPrompt),
      gemini(AUTHOR_SYSTEM(voiceSamples, 'long'), userPrompt),
      gemini(AUTHOR_SYSTEM(voiceSamples, 'caseStudy'), userPrompt),
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
      REWRITE_SYSTEM(voiceSamples),
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
