import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

const ACCENT = '#2563EB'
const DARK = '#111111'
const SURFACE = '#F8F8F8'
const BORDER = '#E5E5E5'
const MUTED = '#6B7280'

const SESSION_KEY = 'topr_chat_proactive_shown'
const PROACTIVE_DELAY_MS = 18000

// ─── Quick-reply fork definitions ────────────────────────────────────────────
const FORK_L1 = [
  { label: 'BIM Services',                value: "I'm interested in BIM services",               next: 'L2-bim' },
  { label: 'Survey + Scan to BIM',        value: "I'm interested in survey or scan to BIM",       next: 'L2-survey' },
  { label: 'Automation & App Deployment', value: "I'm interested in automation or app deployment", next: 'L2-auto' },
]

const FORK_L2 = {
  'L2-bim': [
    { label: 'Pre-Appointment', value: 'Pre-appointment stage' },
    { label: 'Planning',        value: 'Planning stage' },
    { label: 'Construction',    value: 'Construction stage' },
    { label: 'Other',           value: 'Something else' },
  ],
  'L2-survey': [
    { label: 'Scan to BIM',      value: 'Scan to BIM' },
    { label: 'As-Built Survey',  value: 'As-built survey' },
    { label: 'Heritage',         value: 'Heritage survey' },
    { label: 'Other',            value: 'Something else' },
  ],
  'L2-auto': [
    { label: 'Automation',      value: 'Automation' },
    { label: 'App Deployment',  value: 'App deployment' },
    { label: 'Other',           value: 'Something else' },
  ],
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 14px' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: MUTED, opacity: 0.6,
            animation: `topr-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function QuickReplies({ options, onSelect }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '2px 14px 12px' }}>
      {options.map(opt => (
        <button
          key={opt.label}
          onClick={() => onSelect(opt)}
          style={{
            background: '#fff', border: `1px solid ${BORDER}`,
            borderRadius: '16px', padding: '5px 13px',
            fontSize: '0.73rem', color: '#111', cursor: 'pointer',
            fontFamily: 'inherit', transition: 'border-color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.background = '#EFF6FF' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = '#fff' }}
        >{opt.label}</button>
      ))}
    </div>
  )
}

function Message({ role, content }) {
  const isUser = role === 'user'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '10px',
    }}>
      {!isUser && (
        <div style={{
          width: '26px', height: '26px', borderRadius: '50%',
          background: DARK, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.55rem', fontWeight: 700, flexShrink: 0,
          marginRight: '8px', marginTop: '2px',
        }}>AT</div>
      )}
      <div style={{
        maxWidth: '78%',
        background: isUser ? ACCENT : SURFACE,
        color: isUser ? '#fff' : '#111',
        border: isUser ? 'none' : `1px solid ${BORDER}`,
        borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        padding: '9px 13px',
        fontSize: '0.78rem',
        lineHeight: 1.55,
        whiteSpace: 'pre-wrap',
      }}>{content}</div>
    </div>
  )
}

export default function ChatWidget() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const [forkLevel, setForkLevel] = useState(null) // null | 'L1' | 'L2-bim' | 'L2-survey' | 'L2-auto' | 'done'
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const proactiveFired = useRef(false)

  // Inject keyframe animation once
  useEffect(() => {
    if (document.getElementById('topr-chat-styles')) return
    const style = document.createElement('style')
    style.id = 'topr-chat-styles'
    style.textContent = `
      @keyframes topr-bounce {
        0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
        40% { transform: translateY(-5px); opacity: 1; }
      }
      @keyframes topr-fadein {
        from { opacity: 0; transform: translateY(12px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
    `
    document.head.appendChild(style)
  }, [])

  // Proactive trigger — fires once per session after 18s or 50% scroll
  const fireProactive = useCallback(() => {
    if (proactiveFired.current) return
    if (sessionStorage.getItem(SESSION_KEY)) return
    if (messages.length > 0) return   // user already chatting — don't reset
    if (open) return                   // chat already open — don't interrupt
    proactiveFired.current = true
    sessionStorage.setItem(SESSION_KEY, '1')

    const page = location.pathname
    setMessages([{ role: 'assistant', content: getProactiveOpener(page) }])
    setForkLevel('L1')
    setOpen(true)
  }, [location.pathname, messages.length, open])

  useEffect(() => {
    const timer = setTimeout(fireProactive, PROACTIVE_DELAY_MS)
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      if (scrolled >= 0.5) fireProactive()
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [fireProactive])

  // Scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when opened; show L1 forks if opening fresh with no messages
  useEffect(() => {
    if (open) {
      setUnread(0)
      if (messages.length === 0 && forkLevel === null) setForkLevel('L1')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const sendQuickReply = async (opt) => {
    // Advance fork level
    if (forkLevel === 'L1') {
      setForkLevel(opt.next)
    } else {
      setForkLevel('done')
    }
    await sendMessageText(opt.value)
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return
    setForkLevel('done') // user typed — dismiss forks
    setInput('')
    await sendMessageText(text)
  }

  const sendMessageText = async (text) => {
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: newMessages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
          page: location.pathname,
          session_id: sessionStorage.getItem(SESSION_KEY) || '',
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Something went wrong — please try again.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection issue — please refresh and try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '84px', right: '24px', zIndex: 9999,
          width: '360px', height: '480px',
          background: '#fff', border: `1px solid ${BORDER}`,
          borderRadius: '14px', boxShadow: '0 8px 40px rgba(0,0,0,0.14)',
          display: 'flex', flexDirection: 'column',
          fontFamily: "'Inter', -apple-system, sans-serif",
          animation: 'topr-fadein 0.2s ease',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '13px 16px', borderBottom: `1px solid ${BORDER}`,
            background: '#fff', flexShrink: 0,
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: DARK, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem', fontWeight: 700, flexShrink: 0,
            }}>AT</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#111', lineHeight: 1.2 }}>Alex</div>
              <div style={{ fontSize: '0.7rem', color: MUTED, lineHeight: 1.3 }}>ToP-R Solutions</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E' }} />
              <span style={{ fontSize: '0.65rem', color: MUTED }}>Online</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: MUTED, fontSize: '1rem', padding: '2px 4px',
                lineHeight: 1, marginLeft: '4px',
              }}
              aria-label="Close chat"
            >×</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '14px 14px 6px',
            display: 'flex', flexDirection: 'column',
          }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: MUTED, fontSize: '0.75rem', marginTop: '40px', lineHeight: 1.6 }}>
                Hi — I'm Alex, the ToP-R assistant.<br />Ask me anything about our services.
              </div>
            )}
            {messages.map((m, i) => (
              <Message key={i} role={m.role} content={m.content} />
            ))}
            {/* Quick-reply fork buttons — shown after last assistant message, while not loading */}
            {!loading && forkLevel === 'L1' && (
              <QuickReplies options={FORK_L1} onSelect={sendQuickReply} />
            )}
            {!loading && forkLevel && forkLevel.startsWith('L2-') && FORK_L2[forkLevel] && (
              <QuickReplies options={FORK_L2[forkLevel]} onSelect={sendQuickReply} />
            )}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%',
                  background: DARK, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.55rem', fontWeight: 700, flexShrink: 0,
                  marginRight: '8px', marginTop: '2px',
                }}>AT</div>
                <div style={{
                  background: SURFACE, border: `1px solid ${BORDER}`,
                  borderRadius: '14px 14px 14px 4px',
                }}>
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 12px', borderTop: `1px solid ${BORDER}`,
            display: 'flex', gap: '8px', alignItems: 'flex-end', flexShrink: 0,
            background: '#fff',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about services, pricing, timelines…"
              rows={1}
              style={{
                flex: 1, resize: 'none', border: `1px solid ${BORDER}`,
                borderRadius: '8px', padding: '8px 11px',
                fontSize: '0.78rem', fontFamily: 'inherit',
                lineHeight: 1.5, outline: 'none', color: '#111',
                background: SURFACE, maxHeight: '80px', overflowY: 'auto',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                width: '34px', height: '34px', borderRadius: '8px',
                background: input.trim() && !loading ? DARK : BORDER,
                border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.15s',
              }}
              aria-label="Send"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          width: '52px', height: '52px', borderRadius: '50%',
          background: DARK, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.22)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="Open chat"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {!open && unread > 0 && (
          <div style={{
            position: 'absolute', top: '2px', right: '2px',
            width: '16px', height: '16px', borderRadius: '50%',
            background: '#EF4444', border: '2px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.5rem', fontWeight: 700, color: '#fff',
          }}>{unread}</div>
        )}
      </button>
    </>
  )
}

function getProactiveOpener(page) {
  const openers = {
    '/': 'Hi — are you exploring BIM support for an upcoming project?',
    '/services': 'Hi — are you looking for BIM consultancy support, or trying to understand which service fits your project stage?',
    '/services/pre-appointment': 'Hi — are you at pre-appointment stage, or has the team already been appointed?',
    '/services/post-appointment': 'Hi — are you currently managing BIM on an active project, or setting up for one about to start?',
    '/services/onboarding': 'Hi — is this about getting a team set up on ISO 19650, or do you need ongoing management support as well?',
    '/services/contractor-bim': 'Hi — are you a main contractor managing coordination, or acting on behalf of a client?',
    '/services/cobie-handover': 'Hi — is the project approaching handover, or are you setting up the data structure earlier in the programme?',
    '/services/digital-twin': 'Hi — is digital twin readiness something you\'re planning for a new project, or retrofitting to an existing one?',
    '/services/remote-modelling': 'Hi — are you looking for Revit production support on a specific stage, or ongoing capacity?',
    '/services/bim-ar': 'Hi — are you looking at AR for site coordination, design communication, or something else?',
    '/surveys': 'Hi — are you commissioning a survey, or do you have scan data that needs processing into a model?',
    '/surveys/scan-to-bim': 'Hi — commissioning a new survey, or do you have existing point cloud data and need the Revit model?',
    '/surveys/heritage': 'Hi — is this for a listed building or conservation area project?',
    '/surveys/post-processing': 'Hi — do you have existing point cloud data that needs registering or processing?',
    '/surveys/as-built': 'Hi — is this for a handover record or to capture changes made during construction?',
    '/resources': 'Hi — is there a live project behind this research, or are you building up your knowledge on BIM requirements?',
    '/case-studies': 'Hi — are any of these project types similar to what you\'re working on?',
    '/about': 'Hi — any questions about how ToP-R works, or what a typical engagement looks like?',
  }
  // Partial match for dynamic sub-paths
  for (const [prefix, msg] of Object.entries(openers)) {
    if (prefix !== '/' && page.startsWith(prefix)) return msg
  }
  return openers[page] || 'Hi — can I help you find the right service for your project?'
}
