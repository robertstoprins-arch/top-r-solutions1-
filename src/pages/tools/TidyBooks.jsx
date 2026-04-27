import { Helmet } from 'react-helmet-async'
import { C, T } from '../../tokens'
import ContactForm from '../../components/ContactForm'

function TidyBooksSVG() {
  const categories = [
    { label: 'Materials & Tools', color: '#DCFCE7', tc: '#15803D' },
    { label: 'Travel & Fuel',     color: '#FEF3C7', tc: '#B45309' },
    { label: 'Subcontractors',    color: '#E0E7FF', tc: '#4338CA' },
    { label: '⚠ Review needed',  color: '#FEE2E2', tc: '#DC2626' },
  ]
  return (
    <svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', borderRadius: '8px', display: 'block' }}>
      <rect width="480" height="240" fill="#F4F4F5" rx="8" />

      {/* CSV box */}
      <rect x="18" y="80" width="88" height="80" rx="6" fill="#fff" stroke="#E4E4E7" strokeWidth="1.5" />
      <text x="62" y="108" textAnchor="middle" fontSize="9" fill="#71717A" fontFamily="monospace" fontWeight="bold">BANK CSV</text>
      {[0,1,2].map(i => (
        <rect key={i} x="30" y={118 + i * 10} width="64" height="5" rx="2" fill="#E4E4E7" />
      ))}
      <text x="62" y="170" textAnchor="middle" fontSize="7" fill="#A1A1AA" fontFamily="monospace">tide-apr-2025.csv</text>

      {/* Arrow to AI */}
      <line x1="108" y1="120" x2="155" y2="120" stroke="#A1A1AA" strokeWidth="1.5" />
      <polygon points="155,116 163,120 155,124" fill="#A1A1AA" />

      {/* AI engine box */}
      <rect x="165" y="70" width="110" height="100" rx="8" fill="#09090B" />
      <text x="220" y="104" textAnchor="middle" fontSize="8.5" fill="#fff" fontFamily="monospace" fontWeight="bold">AI ENGINE</text>
      {['Memory', 'Companies House', 'HMRC Rules', 'Gemini AI'].map((l, i) => (
        <text key={i} x="220" y={116 + i * 11} textAnchor="middle" fontSize="7" fill="#A1A1AA" fontFamily="monospace">{l}</text>
      ))}

      {/* Arrow to categories */}
      <line x1="277" y1="120" x2="316" y2="120" stroke="#A1A1AA" strokeWidth="1.5" />
      <polygon points="316,116 324,120 316,124" fill="#A1A1AA" />

      {/* Category output rows */}
      {categories.map((c, i) => (
        <g key={i}>
          <rect x="326" y={68 + i * 27} width="136" height="22" rx="4" fill={c.color} />
          <text x="338" y={82 + i * 27} fontSize="7.5" fill={c.tc} fontFamily="monospace" fontWeight="600">{c.label}</text>
        </g>
      ))}

      {/* CT box bottom */}
      <rect x="165" y="186" width="110" height="34" rx="5" fill="#fff" stroke="#E4E4E7" strokeWidth="1.5" />
      <text x="220" y="200" textAnchor="middle" fontSize="7.5" fill="#71717A" fontFamily="monospace">Corporation Tax</text>
      <text x="220" y="213" textAnchor="middle" fontSize="9" fill="#09090B" fontFamily="monospace" fontWeight="bold">£4,218 estimated</text>
      <line x1="220" y1="172" x2="220" y2="185" stroke="#E4E4E7" strokeWidth="1.5" strokeDasharray="3 2" />

      {/* Excel badge */}
      <rect x="326" y="186" width="136" height="34" rx="5" fill="#DCFCE7" stroke="#BBF7D0" strokeWidth="1" />
      <text x="394" y="200" textAnchor="middle" fontSize="7.5" fill="#15803D" fontFamily="monospace">Excel export</text>
      <text x="394" y="213" textAnchor="middle" fontSize="7" fill="#16A34A" fontFamily="monospace">2 sheets · HMRC-ready</text>
    </svg>
  )
}

const BUILT = [
  'CSV upload and automatic bank statement parsing (Tide format)',
  '4-layer AI classification: merchant memory → Companies House company lookup → HMRC rule engine → Gemini AI',
  'Cash withdrawal section — dedicated review panel with claimable/personal split',
  'Full HMRC category mapping with CT600 box references and allowability flags',
  'Additional allowances panel: mileage at HMRC 45p/25p rate, working from home at £6/week, custom entries',
  'Known payroll input for wages paid outside the CSV bank statement',
  'UK Corporation Tax calculation with full marginal relief (19 – 25% band)',
  'CIS deduction handling — manual entry or auto-estimated at 20% of income',
  'Excel export with two formatted sheets: full transaction ledger + tax summary',
  'HMRC risk flagging: dual-use items, large cash payments, personal vs business split',
  'Merchant memory — learns from every manual correction, gets more accurate with use',
]

const COMING = [
  'CT600 PDF auto-fill — download a completed form ready for HMRC submission',
  'Companies House active/dissolved status check on counterparties',
  'CardRefund transaction detection and automatic offsetting',
  'Prior year backdating module — up to 6 years of unclaimed expenses',
  'Live HMRC rate scraper — pulls current gov.uk allowances before each classification run',
  'TidyBooks public launch, self-serve onboarding, and subscription pricing',
]

export default function TidyBooks() {
  return (
    <div style={{ marginLeft: C.sidebarW, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Helmet>
        <title>TidyBooks — AI Tax Classifier for UK Companies · ToP-R Solutions</title>
        <meta name="description" content="TidyBooks classifies every bank transaction against HMRC categories, calculates your Corporation Tax position with marginal relief, and exports an accountant-ready Excel file. Built for UK limited companies and CIS subcontractors." />
      </Helmet>

      {/* Hero */}
      <section style={{ padding: '4.5rem 2rem 3.5rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.6rem' }}>Automation Tool · Accounting & Tax</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <h1 style={{ ...T.h1, fontSize: '2.1rem', margin: 0, lineHeight: 1.16 }}>TidyBooks</h1>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#DCFCE7', color: '#15803D', padding: '0.2rem 0.65rem', borderRadius: '3px' }}>Live — Early Access</span>
          </div>
          <p style={{ fontSize: '1rem', color: C.muted, fontStyle: 'italic', marginBottom: '1.25rem', lineHeight: 1.65 }}>
            Upload your bank statement. Get every transaction classified, your tax position calculated, and an accountant-ready Excel file — in minutes, not hours.
          </p>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.9, marginBottom: '1.5rem' }}>
            TidyBooks is an AI-powered accounting tool built for UK limited companies and CIS subcontractors. It runs a four-layer classification engine — merchant memory, Companies House company lookup, HMRC rule matching, and Gemini AI — to categorise every transaction automatically. It detects cash withdrawals, flags dual-use expenses, identifies HMRC risk items, applies mileage and working-from-home allowances, calculates your estimated Corporation Tax with marginal relief, handles CIS deductions, and produces a formatted Excel export ready for your accountant. Built for sole directors, tradespeople, and small business owners who shouldn't need to know tax codes to file correctly.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block', background: C.text, color: '#fff',
                padding: '0.65rem 1.5rem', borderRadius: '7px',
                fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none',
              }}
            >
              Launch TidyBooks →
            </a>
            <a href="#contact" style={{
              fontSize: '0.8rem', fontWeight: 600, color: C.text,
              textDecoration: 'none', borderBottom: `1.5px solid ${C.text}`, paddingBottom: '1px',
              alignSelf: 'center',
            }}>Request access or demo →</a>
          </div>
        </div>
      </section>

      {/* Illustration */}
      <section style={{ padding: '2.5rem 2rem', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <TidyBooksSVG />
        </div>
      </section>

      {/* What's built */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>

          <div>
            <div style={{ ...T.label, marginBottom: '0.5rem' }}>What's built</div>
            <h2 style={{ ...T.h2, marginBottom: '1.25rem' }}>Already implemented</h2>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {BUILT.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#16A34A', fontWeight: 700, flexShrink: 0, marginTop: '0.05rem' }}>✓</span>
                  <span style={{ fontSize: '0.8rem', color: C.muted, lineHeight: 1.7 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{ ...T.label, marginBottom: '0.5rem' }}>What's next</div>
            <h2 style={{ ...T.h2, marginBottom: '1.25rem' }}>On the roadmap</h2>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {COMING.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#A1A1AA', fontWeight: 700, flexShrink: 0, marginTop: '0.05rem' }}>○</span>
                  <span style={{ fontSize: '0.8rem', color: C.subtle, lineHeight: 1.7 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* Who it's for */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.4rem' }}>Who it's for</div>
          <h2 style={{ ...T.h2, marginBottom: '1.25rem' }}>Built for the people who do the work, not the accounts</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { title: 'CIS Subcontractors', body: 'Sole director limited companies in construction. Auto-estimates CIS deductions at 20%, classifies materials and tools correctly, handles cash market purchases.' },
              { title: 'Freelancers & Consultants', body: 'Self-employed professionals. Classifies software, subscriptions, professional fees, and home office costs without manual category lookup.' },
              { title: 'Small Business Owners', body: 'Any UK limited company with a Tide, Starling, or Monzo account. Exports a file your accountant can use directly — reducing preparation time and accountancy fees.' },
            ].map((card, i) => (
              <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '9px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.83rem', fontWeight: 600, color: C.text, marginBottom: '0.5rem' }}>{card.title}</div>
                <div style={{ fontSize: '0.78rem', color: C.muted, lineHeight: 1.75 }}>{card.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ background: '#09090B', borderRadius: '12px', padding: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>Try TidyBooks now</div>
              <div style={{ fontSize: '0.8rem', color: '#A1A1AA', lineHeight: 1.7 }}>
                Upload a bank statement CSV. See your tax position in under 60 seconds.
              </div>
            </div>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block', background: '#fff', color: '#09090B',
                padding: '0.7rem 1.6rem', borderRadius: '7px',
                fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              Launch TidyBooks →
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: '3.5rem 2rem' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.4rem' }}>Get in touch</div>
          <h2 style={{ ...T.h2, marginBottom: '0.5rem' }}>Request early access or a walkthrough</h2>
          <p style={{ fontSize: '0.83rem', color: C.muted, lineHeight: 1.75, marginBottom: '2rem', maxWidth: '520px' }}>
            TidyBooks is in early access. If you run a limited company or work under CIS and want to try it, get in touch.
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
