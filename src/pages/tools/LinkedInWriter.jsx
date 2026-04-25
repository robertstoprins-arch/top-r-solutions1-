import { useState, useEffect } from 'react'

const C = {
  bg: '#0a0f1e',
  surface: '#111827',
  border: '#1f2937',
  accent: '#2563EB',
  accentGlow: 'rgba(37,99,235,0.15)',
  text: '#f9fafb',
  muted: '#9ca3af',
  subtle: '#6b7280',
  green: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
}

const PASSES = ['Writing...', 'Critiquing...', 'Rewriting...', 'Scoring...']

function ScoreBar({ label, value }) {
  const color = value >= 8 ? C.green : value >= 6 ? C.amber : C.red
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.7rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color }}>{value}/10</span>
      </div>
      <div style={{ height: '4px', background: C.border, borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(value / 10) * 100}%`, background: color, borderRadius: '2px', transition: 'width 0.8s ease' }} />
      </div>
    </div>
  )
}

function HashtagRow({ label, tags, onCopy }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ fontSize: '0.6rem', color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
        {tags.map(tag => (
          <span key={tag} style={{
            fontSize: '0.65rem', padding: '0.2rem 0.5rem',
            background: C.accentGlow, color: '#93c5fd',
            borderRadius: '4px', border: `1px solid rgba(37,99,235,0.3)`,
            cursor: 'pointer',
          }} onClick={() => navigator.clipboard.writeText(tag)}>{tag}</span>
        ))}
      </div>
    </div>
  )
}

export default function LinkedInWriter() {
  const [topic, setTopic] = useState('')
  const [bullets, setBullets] = useState('')
  const [tone, setTone] = useState('excited')
  const [voiceSamples, setVoiceSamples] = useState('')
  const [voiceOpen, setVoiceOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passIndex, setPassIndex] = useState(0)
  const [result, setResult] = useState(null)
  const [activeVariant, setActiveVariant] = useState('long')
  const [editedPost, setEditedPost] = useState('')
  const [copied, setCopied] = useState(false)
  const [posted, setPosted] = useState(false)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')
  const [reasoningOpen, setReasoningOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('li_voice_samples')
    if (saved) setVoiceSamples(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('li_voice_samples', voiceSamples)
  }, [voiceSamples])

  useEffect(() => {
    if (result?.variants?.[activeVariant]) {
      setEditedPost(result.variants[activeVariant])
    }
  }, [activeVariant, result])

  async function generate() {
    if (!topic.trim()) return
    setLoading(true)
    setResult(null)
    setError('')
    setPosted(false)
    setPassIndex(0)

    const interval = setInterval(() => {
      setPassIndex(i => Math.min(i + 1, PASSES.length - 1))
    }, 4500)

    try {
      const res = await fetch('/api/linkedin-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, bullets, tone, voiceSamples, variant: 'long' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setResult(data)
      setActiveVariant('long')
      setEditedPost(data.variants?.long || '')
    } catch (err) {
      setError(err.message)
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  async function postToLinkedIn() {
    setPosting(true)
    setPosted(false)
    try {
      const allHashtags = [
        ...(result?.hashtags?.niche || []),
        ...(result?.hashtags?.industry || []),
        ...(result?.hashtags?.marketLeaders || []).slice(0, 5),
      ].join(' ')
      const fullText = `${editedPost}\n\n${allHashtags}`
      const res = await fetch('/api/post-to-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Post failed')
      setPosted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setPosting(false)
    }
  }

  function copyPost() {
    navigator.clipboard.writeText(editedPost)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function copyAllHashtags() {
    const all = [
      ...(result?.hashtags?.niche || []),
      ...(result?.hashtags?.industry || []),
      ...(result?.hashtags?.marketLeaders || []),
    ].join(' ')
    navigator.clipboard.writeText(all)
  }

  const scores = result?.scores || {}
  const reasoning = result?.reasoning || {}

  return (
    <div style={{ minHeight: '100vh', background: C.bg, padding: '2rem', color: C.text, fontFamily: 'inherit' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem', maxWidth: 1100 }}>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, marginBottom: '0.5rem', fontWeight: 700 }}>Intelligence Suite</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: C.text, margin: 0, letterSpacing: '-0.03em' }}>LinkedIn Post Writer</h1>
        <p style={{ color: C.muted, fontSize: '0.8rem', marginTop: '0.4rem' }}>4-pass AI engine — writes, critiques, rewrites, scores. Sounds like you, not a bot.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1.4fr' : '1fr', gap: '1.5rem', maxWidth: 1100 }}>

        {/* ── Left: Input panel ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, marginBottom: '0.5rem', fontWeight: 600 }}>
              Topic / Insight
            </label>
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. I automated RFI sorting — 300 project emails classified in 30 seconds"
              rows={3}
              style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '0.75rem', color: C.text, fontSize: '0.8rem', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, marginBottom: '0.5rem', fontWeight: 600 }}>
              Key Points <span style={{ color: C.subtle, fontWeight: 400 }}>(optional — one per line)</span>
            </label>
            <textarea
              value={bullets}
              onChange={e => setBullets(e.target.value)}
              placeholder={"300 emails across 2 live projects\nAI classifies by trade in 30 seconds\nPM reviews and issues — no manual sorting"}
              rows={4}
              style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '0.75rem', color: C.text, fontSize: '0.8rem', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Tone */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, marginBottom: '0.75rem', fontWeight: 600 }}>Tone</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['excited', 'professional', 'thought-leader'].map(t => (
                <button key={t} onClick={() => setTone(t)} style={{
                  padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
                  background: tone === t ? C.accent : C.bg,
                  color: tone === t ? '#fff' : C.muted,
                  border: `1px solid ${tone === t ? C.accent : C.border}`,
                  textTransform: 'capitalize',
                }}>
                  {t.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Voice fingerprint */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
            <button onClick={() => setVoiceOpen(o => !o)} style={{
              width: '100%', padding: '1rem 1.25rem', background: 'transparent', border: 'none',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
            }}>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, fontWeight: 600 }}>
                Your Voice Fingerprint {voiceSamples ? '✓' : ''}
              </span>
              <span style={{ color: C.subtle, fontSize: '0.65rem', transform: voiceOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▾</span>
            </button>
            {voiceOpen && (
              <div style={{ padding: '0 1.25rem 1.25rem' }}>
                <p style={{ fontSize: '0.7rem', color: C.muted, marginBottom: '0.5rem' }}>Paste 2–3 of your best past LinkedIn posts. AI will match your rhythm, vocabulary, and style. Saved automatically.</p>
                <textarea
                  value={voiceSamples}
                  onChange={e => setVoiceSamples(e.target.value)}
                  placeholder="Paste your past LinkedIn posts here..."
                  rows={6}
                  style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '0.75rem', color: C.text, fontSize: '0.75rem', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            )}
          </div>

          <button
            onClick={generate}
            disabled={loading || !topic.trim()}
            style={{
              padding: '0.9rem 1.5rem', background: loading ? C.border : C.accent,
              color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.85rem',
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              transition: 'background 0.2s',
            }}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#fff', animation: 'pulse 1s infinite' }} />
                {PASSES[passIndex]}
              </>
            ) : '→ Generate Post'}
          </button>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#fca5a5' }}>
              ❌ {error}
            </div>
          )}
        </div>

        {/* ── Right: Output panel ───────────────────────────────────────────── */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Variant tabs */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[['long', 'Long (350w)'], ['short', 'Short (150w)'], ['caseStudy', 'Case Study']].map(([key, label]) => (
                <button key={key} onClick={() => setActiveVariant(key)} style={{
                  padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
                  background: activeVariant === key ? C.accent : C.surface,
                  color: activeVariant === key ? '#fff' : C.muted,
                  border: `1px solid ${activeVariant === key ? C.accent : C.border}`,
                }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Post textarea */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
              <textarea
                value={editedPost}
                onChange={e => setEditedPost(e.target.value)}
                rows={12}
                style={{ width: '100%', background: 'transparent', border: 'none', padding: '1.25rem', color: C.text, fontSize: '0.8rem', lineHeight: 1.75, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1rem', borderTop: `1px solid ${C.border}` }}>
                <button onClick={copyPost} style={{
                  padding: '0.4rem 0.9rem', background: copied ? C.green : C.bg, color: copied ? '#fff' : C.muted,
                  border: `1px solid ${copied ? C.green : C.border}`, borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
                }}>
                  {copied ? '✓ Copied' : 'Copy Post'}
                </button>
                <button onClick={generate} style={{
                  padding: '0.4rem 0.9rem', background: C.bg, color: C.muted,
                  border: `1px solid ${C.border}`, borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
                }}>
                  ↺ Regenerate
                </button>
                <button onClick={postToLinkedIn} disabled={posting || posted} style={{
                  padding: '0.4rem 1.2rem', marginLeft: 'auto',
                  background: posted ? C.green : C.accent, color: '#fff',
                  border: 'none', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: posting ? 'wait' : 'pointer',
                }}>
                  {posted ? '✅ Posted!' : posting ? 'Posting...' : '→ Post to LinkedIn'}
                </button>
              </div>
            </div>

            {/* Scores */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, fontWeight: 600 }}>Post Score</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: scores.overall >= 8 ? C.green : scores.overall >= 6 ? C.amber : C.red }}>
                  {scores.overall}/10
                </span>
              </div>
              <ScoreBar label="Hook" value={scores.hook} />
              <ScoreBar label="Readability" value={scores.readability} />
              <ScoreBar label="Industry Relevance" value={scores.industryRelevance} />
              <ScoreBar label="CTA Strength" value={scores.cta} />

              {/* Reasoning toggle */}
              <button onClick={() => setReasoningOpen(o => !o)} style={{
                marginTop: '0.75rem', background: 'transparent', border: 'none', color: C.subtle,
                fontSize: '0.65rem', cursor: 'pointer', textDecoration: 'underline', padding: 0,
              }}>
                {reasoningOpen ? 'Hide' : 'Show'} reasoning
              </button>
              {reasoningOpen && (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {Object.entries(reasoning).map(([k, v]) => (
                    <div key={k} style={{ fontSize: '0.68rem', color: C.muted }}>
                      <span style={{ color: C.subtle, textTransform: 'capitalize', fontWeight: 600 }}>{k}:</span> {v}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Improvement */}
            {result.improvement && (
              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '10px', padding: '0.9rem 1.1rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: C.amber, textTransform: 'uppercase', letterSpacing: '0.08em' }}>💡 One more thing — </span>
                <span style={{ fontSize: '0.75rem', color: '#fcd34d' }}>{result.improvement}</span>
              </div>
            )}

            {/* Hashtags */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, fontWeight: 600 }}>Hashtags</span>
                <button onClick={copyAllHashtags} style={{
                  padding: '0.25rem 0.6rem', background: C.bg, color: C.muted,
                  border: `1px solid ${C.border}`, borderRadius: '5px', fontSize: '0.6rem', fontWeight: 600, cursor: 'pointer',
                }}>Copy All</button>
              </div>
              <HashtagRow label="Niche" tags={result.hashtags?.niche || []} />
              <HashtagRow label="Industry" tags={result.hashtags?.industry || []} />
              <HashtagRow label="Market Leaders" tags={result.hashtags?.marketLeaders || []} />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        textarea::placeholder { color: #4b5563; }
      `}</style>
    </div>
  )
}
