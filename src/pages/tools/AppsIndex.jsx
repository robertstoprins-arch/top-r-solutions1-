import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { C, T } from '../../tokens'
import ContactForm from '../../components/ContactForm'

// ─── SVG Placeholders ────────────────────────────────────────────────────────

function PlaceholderARSpotCheck() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', borderRadius: '8px', display: 'block' }}>
      <rect width="480" height="270" fill="#09090B" rx="8" />
      {/* Phone outline */}
      <rect x="170" y="20" width="140" height="230" rx="16" fill="none" stroke="#3F3F46" strokeWidth="2" />
      <rect x="178" y="34" width="124" height="190" rx="6" fill="#1A1A1A" />
      {/* Room wireframe inside phone */}
      <line x1="192" y1="210" x2="192" y2="60" stroke="#2563EB" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.6" />
      <line x1="290" y1="210" x2="290" y2="60" stroke="#2563EB" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.6" />
      <line x1="178" y1="60" x2="302" y2="60" stroke="#2563EB" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.6" />
      <line x1="178" y1="140" x2="302" y2="140" stroke="#2563EB" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.6" />
      {/* Alignment markers */}
      {[[195, 65], [295, 65], [240, 205]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="7" fill="none" stroke="#2563EB" strokeWidth="1.5" />
          <text x={x} y={y + 4} textAnchor="middle" fontSize="7" fill="#2563EB" fontWeight="bold">{String.fromCharCode(65 + i)}</text>
        </g>
      ))}
      {/* Snag bubble */}
      <rect x="300" y="88" width="120" height="50" rx="6" fill="#FEE2E2" />
      <text x="360" y="108" textAnchor="middle" fontSize="8" fill="#DC2626" fontWeight="bold" fontFamily="monospace">Issue #4</text>
      <text x="360" y="121" textAnchor="middle" fontSize="7" fill="#B91C1C" fontFamily="monospace">Ceiling void — review</text>
      <line x1="300" y1="113" x2="290" y2="113" stroke="#DC2626" strokeWidth="1" />
      {/* Label */}
      <text x="20" y="30" fontSize="9" fill="#71717A" fontFamily="monospace">AR SpotCheck  ·  Site Intelligence</text>
      <text x="20" y="250" fontSize="7.5" fill="#3F3F46" fontFamily="monospace">BIM overlay  ·  iOS LiDAR  ·  Real-time inspection</text>
    </svg>
  )
}

function PlaceholderFloorPlanner() {
  return (
    <svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', borderRadius: '8px', display: 'block' }}>
      <rect width="480" height="200" fill="#F4F4F5" rx="8" />
      {/* Room footprint */}
      <rect x="40" y="30" width="200" height="140" rx="4" fill="#E4E4E7" stroke="#D4D4D8" strokeWidth="1" />
      {/* Tile grid overlay — material preview */}
      {Array.from({ length: 7 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, col) => (
          <rect key={`${row}-${col}`}
            x={42 + col * 19} y={32 + row * 19}
            width="18" height="18" rx="1"
            fill={`hsl(${30 + (row + col) % 2 * 10}, 20%, ${88 + (row + col) % 2 * 5}%)`}
            stroke="#D4D4D8" strokeWidth="0.5"
          />
        ))
      )}
      {/* Material selector panel */}
      <rect x="265" y="30" width="195" height="140" rx="6" fill="#fff" stroke="#E4E4E7" strokeWidth="1" />
      <text x="277" y="52" fontSize="8.5" fill="#09090B" fontWeight="bold" fontFamily="monospace">Floor Material Planner</text>
      <rect x="277" y="62" width="170" height="20" rx="4" fill="#09090B" />
      <text x="285" y="76" fontSize="7.5" fill="#fff" fontFamily="monospace">▸ Herringbone Oak — selected</text>
      {['Polished Concrete', 'Large Format Tile', 'Parquet Strip'].map((m, i) => (
        <g key={i}>
          <rect x="277" y={88 + i * 24} width="170" height="18" rx="3" fill="#F4F4F5" />
          <text x="285" y={100 + i * 24} fontSize="7.5" fill="#71717A" fontFamily="monospace">{m}</text>
        </g>
      ))}
      <text x="277" y="166" fontSize="7" fill="#A1A1AA" fontFamily="monospace">Preview updates live in AR view</text>
    </svg>
  )
}

function PlaceholderSnagReport() {
  const items = [
    { n: 'SN-001', label: 'Ceiling void — Level 3', status: 'Assigned', sc: '#FEF3C7', st: '#B45309' },
    { n: 'SN-002', label: 'Door frame misalignment', status: 'Open', sc: '#FEE2E2', st: '#DC2626' },
    { n: 'SN-003', label: 'Skirting gap — Rm 204', status: 'Resolved', sc: '#DCFCE7', st: '#059669' },
    { n: 'SN-004', label: 'MEP penetration not sealed', status: 'Assigned', sc: '#FEF3C7', st: '#B45309' },
  ]
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', borderRadius: '8px', display: 'block' }}>
      <rect width="480" height="270" fill="#F4F4F5" rx="8" />
      {/* Phone outline */}
      <rect x="20" y="15" width="145" height="240" rx="14" fill="#09090B" />
      <rect x="28" y="26" width="129" height="218" rx="8" fill="#1A1A1A" />
      {/* Screen content */}
      <text x="92" y="50" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="bold" fontFamily="monospace">SnagReport Pro</text>
      {items.slice(0, 3).map((item, i) => (
        <g key={i}>
          <rect x="34" y={62 + i * 56} width="116" height="46" rx="5" fill="#2A2A2A" />
          <rect x="38" y={66 + i * 56} width="30" height="22" rx="3" fill="#3A3A3A" />
          <text x="53" y="— " fontSize="6" fill="#71717A" />
          <text x="53" y={80 + i * 56} textAnchor="middle" fontSize="6" fill="#71717A" fontFamily="monospace">📷</text>
          <text x="75" y={74 + i * 56} fontSize="6.5" fill="#D4D4D8" fontFamily="monospace">{item.n}</text>
          <text x="75" y={84 + i * 56} fontSize="6" fill="#71717A" fontFamily="monospace">{item.label.slice(0, 20)}</text>
          <rect x="75" y={89 + i * 56} width="42" height="12" rx="3" fill={item.sc} />
          <text x="96" y={98 + i * 56} textAnchor="middle" fontSize="5.5" fill={item.st} fontWeight="bold" fontFamily="monospace">{item.status}</text>
        </g>
      ))}
      {/* PDF export panel */}
      <rect x="185" y="15" width="275" height="240" rx="8" fill="#fff" stroke="#E4E4E7" strokeWidth="1" />
      <rect x="185" y="15" width="275" height="36" rx="8" fill="#09090B" />
      <rect x="185" y="36" width="275" height="15" fill="#09090B" />
      <text x="323" y="38" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="bold" fontFamily="monospace">SNAG REPORT — EXPORT PREVIEW</text>
      {/* Logo placeholder */}
      <rect x="198" y="62" width="60" height="20" rx="3" fill="#F4F4F5" stroke="#E4E4E7" strokeWidth="1" />
      <text x="228" y="75" textAnchor="middle" fontSize="7" fill="#A1A1AA" fontFamily="monospace">[Your Logo]</text>
      <text x="380" y="70" textAnchor="end" fontSize="7" fill="#A1A1AA" fontFamily="monospace">15 Apr 2026</text>
      <line x1="198" y1="90" x2="448" y2="90" stroke="#E4E4E7" strokeWidth="0.8" />
      {items.map((item, i) => (
        <g key={i}>
          <rect x="198" y={98 + i * 36} width="250" height="28" rx="3" fill={i % 2 === 0 ? '#FAFAFA' : '#fff'} />
          <text x="208" y={114 + i * 36} fontSize="7.5" fill="#3F3F46" fontFamily="monospace">{item.n}</text>
          <text x="255" y={114 + i * 36} fontSize="7.5" fill="#3F3F46" fontFamily="monospace">{item.label}</text>
          <rect x="390" y={102 + i * 36} width="48" height="16" rx="3" fill={item.sc} />
          <text x="414" y={113 + i * 36} textAnchor="middle" fontSize="6" fill={item.st} fontWeight="bold" fontFamily="monospace">{item.status}</text>
        </g>
      ))}
      <text x="323" y="250" textAnchor="middle" fontSize="7" fill="#A1A1AA" fontFamily="monospace">PDF · Company branded · Auto-generated</text>
    </svg>
  )
}

// ─── Inline contact nudge ─────────────────────────────────────────────────────
function ContactNudge({ text = 'Have a question?' }) {
  return (
    <p style={{ fontSize: '0.78rem', color: C.muted, marginTop: '1rem' }}>
      {text}{' '}
      <a href="#contact" style={{ color: C.text, fontWeight: 600, textDecoration: 'none', borderBottom: `1px solid ${C.text}` }}>
        Talk to us →
      </a>
    </p>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AppsIndex() {
  return (
    <div style={{ marginLeft: C.sidebarW, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Helmet>
        <title>App Development — AR SpotCheck & SnagReport Pro — ToP-R Solutions</title>
        <meta name="description" content="Purpose-built mobile and AR applications for construction and site environments. AR SpotCheck — intelligent site inspections with BIM overlay. SnagReport Pro — structured snag management with PDF export." />
      </Helmet>

      {/* ── SECTION 1: Hero ── */}
      <section style={{ padding: '4.5rem 2rem 3.5rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '1rem' }}>App Development · Site & Field Intelligence</div>
          <h1 style={{ ...T.h1, fontSize: '2rem', marginBottom: '1.4rem', lineHeight: 1.18 }}>
            Purpose-built apps for the people doing the work on site.
          </h1>
          <p style={{ fontSize: '0.92rem', color: C.muted, lineHeight: 1.88, marginBottom: '1rem' }}>
            Automations run in the background. Apps put intelligence directly in the hands of the person who needs it — on site, in the field, in the moment a decision is being made.
          </p>
          <p style={{ fontSize: '0.92rem', color: C.muted, lineHeight: 1.88, marginBottom: '1.75rem' }}>
            We build mobile and augmented reality applications for construction, fit-out, and project delivery environments. These are not generic tools adapted for construction. They are built from the ground up around the specific conditions, workflows, and decisions that happen on a live project.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#apps" style={{
              display: 'inline-block', background: C.text, color: '#fff',
              padding: '0.62rem 1.4rem', borderRadius: '7px',
              fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none',
            }}>See the apps</a>
            <a href="#contact" style={{
              fontSize: '0.78rem', fontWeight: 600, color: C.text,
              textDecoration: 'none', borderBottom: `1.5px solid ${C.text}`, paddingBottom: '1px',
            }}>Talk to us about your project →</a>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Apps ── */}
      <section id="apps" style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>

          {/* ── AR SpotCheck ── */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ ...T.label, marginBottom: '0.4rem' }}>AR SpotCheck</div>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden', marginBottom: '0' }}>
              <div style={{ padding: '1rem 1.5rem 0.5rem', background: '#09090B' }}>
                <PlaceholderARSpotCheck />
              </div>
              <div style={{ padding: '1.75rem' }}>
                <span style={{ display: 'inline-block', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#DCFCE7', color: '#059669', padding: '0.15rem 0.55rem', borderRadius: '3px', marginBottom: '0.75rem' }}>● Production</span>
                <h2 style={{ ...T.h2, fontSize: '1.2rem', marginBottom: '0.3rem' }}>AR SpotCheck</h2>
                <p style={{ fontSize: '0.82rem', color: C.muted, fontStyle: 'italic', marginBottom: '1rem' }}>
                  Site inspections that are faster, more consistent, and more intelligent — from the first walk to final sign-off.
                </p>
                <p style={{ fontSize: '0.83rem', color: C.muted, lineHeight: 1.8, marginBottom: '0.85rem' }}>
                  Site inspections are one of the most decision-intensive activities on any project. What's been built? Has it been built correctly? What needs to be reviewed, logged, or assigned? AR SpotCheck transforms that process by bringing your BIM model directly into the site environment — overlaid on the real structure through an iPhone or iPad.
                </p>
                <p style={{ fontSize: '0.83rem', color: C.muted, lineHeight: 1.8, marginBottom: '0.85rem' }}>
                  Instead of moving between the site and a drawing set, your team works with the model and the reality simultaneously. Inspection decisions are made faster. Issues are identified earlier. The record of what was found, when, and by whom writes itself.
                </p>

                {/* Floor Material Planner */}
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text, marginBottom: '0.75rem' }}>Floor Material Planner</div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <PlaceholderFloorPlanner />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: C.muted, lineHeight: 1.75, margin: 0 }}>
                    Scan a room. Select a finish from your project specification. Preview it in position — in the actual space, at actual scale — before a single order is placed. Reduce material waste and eliminate the approval delays that come from clients signing off on samples rather than outcomes.
                  </p>
                </div>

                {/* Snag capture */}
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text, marginBottom: '0.4rem' }}>Intelligent snag capture</div>
                  <p style={{ fontSize: '0.8rem', color: C.muted, lineHeight: 1.75, margin: 0 }}>
                    Snag items are logged in context — photographed, annotated, linked to the relevant location, and assigned to the responsible contractor — directly from the site walk. No notes to transfer later. No items missed because the walkthrough happened faster than the notepad. Items captured here pull directly into SnagReport Pro.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <a href="#contact" style={{
                    display: 'inline-block', background: C.text, color: '#fff',
                    padding: '0.55rem 1.25rem', borderRadius: '7px',
                    fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none',
                  }}>Contact us for early access</a>
                  <a href="#contact" style={{ fontSize: '0.78rem', color: C.muted, textDecoration: 'none', borderBottom: `1px solid ${C.border}`, paddingBottom: '1px' }}>Request a demo →</a>
                </div>
              </div>
            </div>
          </div>

          {/* ── SnagReport Pro ── */}
          <div>
            <div style={{ ...T.label, marginBottom: '0.4rem' }}>SnagReport Pro</div>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ padding: '0.5rem 1.5rem 0', background: C.bg }}>
                <PlaceholderSnagReport />
              </div>
              <div style={{ padding: '1.75rem' }}>
                <span style={{ display: 'inline-block', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#F4F4F5', color: '#71717A', padding: '0.15rem 0.55rem', borderRadius: '3px', marginBottom: '0.75rem' }}>○ In Development</span>
                <h2 style={{ ...T.h2, fontSize: '1.2rem', marginBottom: '0.3rem' }}>SnagReport Pro</h2>
                <p style={{ fontSize: '0.82rem', color: C.muted, fontStyle: 'italic', marginBottom: '1rem' }}>
                  Purpose-built snag management. Less admin. Better records. Cleaner handover.
                </p>
                <p style={{ fontSize: '0.83rem', color: C.muted, lineHeight: 1.8, marginBottom: '0.85rem' }}>
                  Snag management on most projects runs through a combination of spreadsheets, email, photos, and memory. Items get missed. Assignments get lost. The record of what was found and fixed is incomplete at the point it matters most — handover.
                </p>
                <p style={{ fontSize: '0.83rem', fontWeight: 600, color: C.text, marginBottom: '0.75rem' }}>SnagReport Pro gives site managers and project teams a structured, intelligent tool for the entire snag process:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {[
                    { title: 'Capture', body: 'Log snag items on site with photos, written notes, and markups directly on the image. Works offline — no signal required.' },
                    { title: 'Assign', body: 'Forms are generated and sent to the responsible contractor automatically. No manual email, no ambiguity about who owns what.' },
                    { title: 'Track', body: 'Every item has a status, an owner, and a complete record of when it was raised, assigned, and resolved.' },
                    { title: 'Report', body: 'PDF reports export in your company format, with your logo, containing a clean record of every item — ready for sign-off and handover.' },
                  ].map((f, i) => (
                    <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '7px', padding: '1rem' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, marginBottom: '0.35rem' }}>{f.title}</div>
                      <div style={{ fontSize: '0.75rem', color: C.muted, lineHeight: 1.7 }}>{f.body}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.83rem', color: C.muted, lineHeight: 1.8, marginBottom: '1.25rem' }}>
                  Items raised in AR SpotCheck pull directly into SnagReport Pro — no double entry, no transfer, no items that exist on one system but not the other.
                </p>
                <a href="#contact" style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, textDecoration: 'none', borderBottom: `1.5px solid ${C.text}`, paddingBottom: '1px' }}>Get notified at launch →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Why purpose-built ── */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.4rem' }}>Why purpose-built matters</div>
          <h2 style={{ ...T.h2, marginBottom: '1rem' }}>Generic tools fit no specific workflow particularly well.</h2>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.88, marginBottom: '1rem' }}>
            There are generic snag apps. There are general-purpose inspection tools. They share a common problem: built for the broadest possible market, they fit no specific workflow particularly well. Features that don't apply to your project still take up space. Workflows that matter to you require workarounds.
          </p>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.88 }}>
            We build for the specific conditions of construction and project delivery. Offline-capable because sites don't have reliable signal. Company-branded because handover documents represent your firm. Integrated because the data from one tool should not have to be manually moved to another.
          </p>
          <ContactNudge text="Building something specific for your team?" />
        </div>
      </section>

      {/* ── SECTION 4: Also see ── */}
      <section style={{ padding: '2.5rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text, marginBottom: '0.25rem' }}>Also from ToP-R</div>
            <div style={{ fontSize: '0.78rem', color: C.muted }}>Intelligent process automation — RFI Desk, Drawing Reviewer, MCP integrations.</div>
          </div>
          <Link to="/tools" style={{
            fontSize: '0.78rem', fontWeight: 600, color: C.text,
            textDecoration: 'none', borderBottom: `1.5px solid ${C.text}`, paddingBottom: '1px', flexShrink: 0,
          }}>See automation tools →</Link>
        </div>
      </section>

      {/* ── SECTION 5: Contact ── */}
      <section id="contact" style={{ padding: '3.5rem 2rem 4.5rem' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.4rem' }}>Get in touch</div>
          <h2 style={{ ...T.h2, marginBottom: '0.75rem' }}>Building something for your team?</h2>
          <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.75, maxWidth: '520px', marginBottom: '2rem' }}>
            If you have a site or field process that currently relies on a combination of apps, spreadsheets, and manual steps — it's a candidate for a purpose-built tool. Tell us what it involves and we'll come back with a clear view of what could be built and what it would take.
          </p>
          <ContactForm />
        </div>
      </section>

    </div>
  )
}
