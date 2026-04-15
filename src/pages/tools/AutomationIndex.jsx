import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { C, T } from '../../tokens'
import ContactForm from '../../components/ContactForm'

// ─── SVG Placeholders ────────────────────────────────────────────────────────

function PlaceholderRFIDesk() {
  const nodes = [
    { label: 'RFI-041 Issued', status: 'open', color: '#E4E4E7', text: '#71717A' },
    { label: 'Reminder sent — 48h', status: 'pending', color: '#FEF3C7', text: '#B45309' },
    { label: 'Overdue — escalated', status: 'overdue', color: '#FEE2E2', text: '#DC2626' },
    { label: 'Response received — closed', status: 'closed', color: '#DCFCE7', text: '#059669' },
  ]
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', borderRadius: '8px', display: 'block' }}>
      <rect width="480" height="270" fill="#F4F4F5" rx="8" />
      <line x1="80" y1="40" x2="80" y2="240" stroke="#E4E4E7" strokeWidth="2" strokeDasharray="4 3" />
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx="80" cy={50 + i * 58} r="10" fill={n.color} stroke={n.text} strokeWidth="1.5" />
          <text x="80" cy={54 + i * 58} textAnchor="middle" fontSize="8" fill={n.text} fontWeight="bold" y={54 + i * 58}>{i + 1}</text>
          <rect x="102" y={38 + i * 58} width="220" height="24" rx="4" fill={n.color} />
          <text x="114" y={53 + i * 58} fontSize="8.5" fill={n.text} fontFamily="monospace">{n.label}</text>
          {n.status === 'overdue' && (
            <g>
              <line x1="322" y1={50 + i * 58} x2="370" y2={50 + i * 58} stroke="#DC2626" strokeWidth="1.5" markerEnd="url(#arrow)" />
              <rect x="372" y={38 + i * 58} width="88" height="24" rx="4" fill="#FEE2E2" />
              <text x="382" y={53 + i * 58} fontSize="7.5" fill="#DC2626" fontFamily="monospace">→ PM Alerted</text>
            </g>
          )}
        </g>
      ))}
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#DC2626" />
        </marker>
      </defs>
    </svg>
  )
}

function PlaceholderDrawingReviewer() {
  return (
    <svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', borderRadius: '8px', display: 'block' }}>
      <rect width="480" height="270" fill="#F4F4F5" rx="8" />
      {/* Document */}
      <rect x="30" y="60" width="100" height="130" rx="6" fill="#fff" stroke="#E4E4E7" strokeWidth="1.5" />
      <rect x="42" y="76" width="76" height="6" rx="2" fill="#E4E4E7" />
      <rect x="42" y="88" width="60" height="4" rx="2" fill="#E4E4E7" />
      <rect x="42" y="98" width="70" height="4" rx="2" fill="#E4E4E7" />
      <rect x="42" y="108" width="50" height="4" rx="2" fill="#E4E4E7" />
      <text x="80" y="168" textAnchor="middle" fontSize="8" fill="#A1A1AA" fontFamily="monospace">DWG-042.pdf</text>
      {/* Arrows + outputs */}
      {[
        { y: 90, label: 'BS Check', sub: '✓ 14 items passed', color: '#DCFCE7', tc: '#059669' },
        { y: 130, label: 'Issue Schedule', sub: '3 items flagged', color: '#FEF3C7', tc: '#B45309' },
        { y: 165, label: 'Unclear Elements', sub: '⚠ 2 for review', color: '#FEE2E2', tc: '#DC2626' },
      ].map((o, i) => (
        <g key={i}>
          <line x1="132" y1={o.y} x2="188" y2={o.y} stroke="#A1A1AA" strokeWidth="1.2" />
          <polygon points={`188,${o.y - 4} 196,${o.y} 188,${o.y + 4}`} fill="#A1A1AA" />
          <rect x="198" y={o.y - 16} width="148" height="32" rx="5" fill={o.color} />
          <text x="210" y={o.y - 3} fontSize="8.5" fill={o.tc} fontFamily="monospace" fontWeight="bold">{o.label}</text>
          <text x="210" y={o.y + 10} fontSize="7.5" fill={o.tc} fontFamily="monospace">{o.sub}</text>
        </g>
      ))}
      <text x="350" y="240" textAnchor="middle" fontSize="7.5" fill="#A1A1AA" fontFamily="monospace">Agentic Review Pipeline</text>
    </svg>
  )
}

function PlaceholderMCP() {
  const boxes = [
    { x: 20, label: 'Your Systems', sub: 'CDE · PM · BIM · Finance', icon: '⬡' },
    { x: 175, label: 'MCP Server', sub: 'Built by ToP-R', icon: '⟳' },
    { x: 330, label: 'AI Intelligence', sub: 'Claude · Agents', icon: '◈' },
  ]
  return (
    <svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', borderRadius: '8px', display: 'block' }}>
      <rect width="480" height="200" fill="#F4F4F5" rx="8" />
      {boxes.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y="55" width="130" height="80" rx="8" fill="#fff" stroke="#E4E4E7" strokeWidth="1.5" />
          <text x={b.x + 65} y="85" textAnchor="middle" fontSize="18" fill="#09090B">{b.icon}</text>
          <text x={b.x + 65} y="104" textAnchor="middle" fontSize="8.5" fill="#09090B" fontWeight="bold" fontFamily="monospace">{b.label}</text>
          <text x={b.x + 65} y="118" textAnchor="middle" fontSize="7" fill="#71717A" fontFamily="monospace">{b.sub}</text>
          {i < 2 && (
            <g>
              <line x1={b.x + 132} y1="95" x2={b.x + 170} y2="95" stroke="#09090B" strokeWidth="1.5" />
              <polygon points={`${b.x + 170},90 ${b.x + 178},95 ${b.x + 170},100`} fill="#09090B" />
            </g>
          )}
        </g>
      ))}
    </svg>
  )
}

// ─── Inline contact nudge ─────────────────────────────────────────────────────
function ContactNudge({ text = 'Not sure where to start?' }) {
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
export default function AutomationIndex() {
  return (
    <div style={{ marginLeft: C.sidebarW, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Helmet>
        <title>Process Automation & Intelligence — ToP-R Solutions</title>
        <meta name="description" content="Intelligent process automation for construction, manufacturing, and project management. Atomic method, agentic workflows, MCP server integration. RFI Desk, Drawing Reviewer, MCP Server Build." />
      </Helmet>

      {/* ── SECTION 1: Hero ── */}
      <section style={{ padding: '4.5rem 2rem 3.5rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '1rem' }}>Process Intelligence · Automation</div>
          <h1 style={{ ...T.h1, fontSize: '2rem', marginBottom: '1.4rem', lineHeight: 1.18 }}>
            Most processes aren't too complex to automate.<br />They just haven't been broken down far enough.
          </h1>
          <p style={{ fontSize: '0.92rem', color: C.muted, lineHeight: 1.88, marginBottom: '1rem' }}>
            We analyse any workflow — in construction, manufacturing, project management, or any process-driven discipline — and decompose it into its smallest possible tasks. Then we decompose those tasks further. At the atomic level, the logic becomes visible. And logic can be automated.
          </p>
          <p style={{ fontSize: '0.92rem', color: C.muted, lineHeight: 1.88, marginBottom: '1rem' }}>
            We then build intelligent tools that execute each step without manual intervention — and chain them into complete automation pipelines that your team controls. The result isn't a platform. It's targeted process intelligence that eliminates the work your people shouldn't be doing.
          </p>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.88, marginBottom: '1.75rem', borderLeft: `3px solid ${C.border}`, paddingLeft: '1rem' }}>
            Every week, teams across every industry spend hours on tasks that exist only because an intelligent system hasn't been built yet. Chasing information. Cross-referencing data. Manually rebuilding outputs that should generate themselves. These aren't management activities — they are gaps. And every gap has a measurable cost.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#automations" style={{
              display: 'inline-block', background: C.text, color: '#fff',
              padding: '0.62rem 1.4rem', borderRadius: '7px',
              fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none',
            }}>See what we've built</a>
            <a href="#contact" style={{
              fontSize: '0.78rem', fontWeight: 600, color: C.text,
              textDecoration: 'none', borderBottom: `1.5px solid ${C.text}`, paddingBottom: '1px',
            }}>Talk to us about your process →</a>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Atomic Method ── */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.4rem' }}>Our approach</div>
          <h2 style={{ ...T.h2, marginBottom: '0.75rem' }}>The atomic method</h2>
          <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.75, marginBottom: '2rem', maxWidth: '580px' }}>
            Every automation we build follows the same process — regardless of industry, workflow complexity, or the systems involved.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { n: '01', title: 'Map the process', body: 'Document every step in full — triggers, decisions, handoffs, stall points. Nothing assumed.' },
              { n: '02', title: 'Decompose to atoms', body: 'Break each step into the smallest possible unit of logic. At atomic level nothing is ambiguous — every input, output, and decision rule can be defined precisely.' },
              { n: '03', title: 'Automate each atom', body: 'Build intelligent tools that execute each atomic task without human intervention — faster, more accurately, without the variability of manual processes.' },
              { n: '04', title: 'Chain and control', body: 'Connect individual automations into a pipeline — an agentic workflow — that runs autonomously while your team retains full control: pause, override, or redirect at any point.' },
            ].map((s, i) => (
              <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: '9px', padding: '1.4rem', background: C.bg }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: C.border, marginBottom: '0.6rem', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: '0.83rem', fontWeight: 600, color: C.text, marginBottom: '0.5rem' }}>{s.title}</div>
                <div style={{ fontSize: '0.78rem', color: C.muted, lineHeight: 1.7 }}>{s.body}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.83rem', fontWeight: 600, color: C.text, marginTop: '1.5rem' }}>
            If a process can be described precisely, it can be automated. In our experience, most can.
          </p>
          <p style={{ fontSize: '0.75rem', color: C.subtle, fontStyle: 'italic', marginTop: '0.4rem' }}>
            A chain of connected automations operating autonomously is called an <strong style={{ fontStyle: 'normal', color: C.muted }}>agentic workflow</strong> — a sequence of intelligent agents, each handling one task, coordinated into a single end-to-end process.
          </p>
          <ContactNudge text="Not sure if your process is automatable?" />
        </div>
      </section>

      {/* ── SECTION 3: Industries ── */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.4rem' }}>Where this applies</div>
          <h2 style={{ ...T.h2, marginBottom: '0.75rem' }}>This is not a construction-only capability</h2>
          <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.75, marginBottom: '1.75rem', maxWidth: '580px' }}>
            The atomic method applies wherever a process exists. Any discipline. Any workflow. Any scale.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              {
                title: 'Construction & Project Management',
                examples: 'RFI tracking · Drawing reviews · Information delivery monitoring · Procurement comparison · Programme reporting',
                replaces: 'Spreadsheet maintenance · Manual chasing · Reactive programme management · Paper-based approvals',
              },
              {
                title: 'Manufacturing & Production',
                examples: 'Material procurement · Quality control checks · Compliance reporting · Supplier coordination · Production scheduling',
                replaces: 'Manual cross-referencing · Email-based approvals · Paper inspection records · Disconnected system updates',
              },
              {
                title: 'Professional Services & Operations',
                examples: 'Document routing · Compliance checking · Report generation · Multi-system data reconciliation · Client communications',
                replaces: 'Copy-paste between systems · Manual report compilation · Calendar-driven chasing · Duplicate data entry',
              },
            ].map((ind, i) => (
              <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: '9px', padding: '1.4rem', background: C.bg }}>
                <h3 style={{ fontSize: '0.83rem', fontWeight: 600, color: C.text, marginBottom: '0.75rem' }}>{ind.title}</h3>
                <div style={{ fontSize: '0.72rem', color: C.muted, lineHeight: 1.7, marginBottom: '0.75rem' }}><strong style={{ color: C.text }}>Examples:</strong> {ind.examples}</div>
                <div style={{ fontSize: '0.72rem', color: C.subtle, lineHeight: 1.7 }}><strong style={{ color: C.muted }}>Replaces:</strong> {ind.replaces}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: C.text, marginTop: '1.5rem' }}>
            If your team is maintaining a process that a system could run — we can build that system.
          </p>
          <ContactNudge text="Have a process in mind?" />
        </div>
      </section>

      {/* ── SECTION 4: Automation Tools ── */}
      <section id="automations" style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.4rem' }}>Automation Tools</div>
          <h2 style={{ ...T.h2, marginBottom: '0.5rem' }}>Targeted tools. One job each.</h2>
          <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.75, marginBottom: '2rem', maxWidth: '580px' }}>
            Each tool was built because a specific, costly process was being handled manually. No implementation programme required. Most are running on an active project within a day.
          </p>

          {/* Card A — RFI Desk */}
          <div style={{ border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.5rem 1.5rem 0', background: C.bg }}>
              <PlaceholderRFIDesk />
            </div>
            <div style={{ padding: '1.75rem' }}>
              <span style={{ display: 'inline-block', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#FEF3C7', color: '#B45309', padding: '0.15rem 0.55rem', borderRadius: '3px', marginBottom: '0.75rem' }}>◐ Beta</span>
              <h3 style={{ ...T.h2, marginBottom: '0.25rem' }}>RFI Desk</h3>
              <p style={{ fontSize: '0.82rem', color: C.muted, fontStyle: 'italic', marginBottom: '0.9rem' }}>Stop chasing RFI responses. Build an intelligent tracking system that does it for you.</p>
              <p style={{ fontSize: '0.83rem', color: C.muted, lineHeight: 1.8, marginBottom: '0.75rem' }}>
                Every RFI is logged on issue. Responsible parties receive automatic reminders as deadlines approach. Overdue items escalate directly to the project manager — before the delay reaches the programme.
              </p>
              <p style={{ fontSize: '0.83rem', color: C.muted, lineHeight: 1.8, marginBottom: '1.1rem' }}>
                Responses are linked to the relevant model element. The audit trail is maintained automatically. No spreadsheet. No chasing. No retrospective reconstruction of what happened and when.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <Link to="/tools/rfi-desk" style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, textDecoration: 'none', borderBottom: `1.5px solid ${C.text}`, paddingBottom: '1px' }}>Read more →</Link>
                <a href="#contact" style={{ fontSize: '0.78rem', color: C.muted, textDecoration: 'none', borderBottom: `1px solid ${C.border}`, paddingBottom: '1px' }}>Request early access →</a>
              </div>
            </div>
          </div>

          {/* Card C — Drawing Reviewer */}
          <div style={{ border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.5rem 1.5rem 0', background: C.bg }}>
              <PlaceholderDrawingReviewer />
            </div>
            <div style={{ padding: '1.75rem' }}>
              <span style={{ display: 'inline-block', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#F4F4F5', color: '#71717A', padding: '0.15rem 0.55rem', borderRadius: '3px', marginBottom: '0.75rem' }}>◐ In Development</span>
              <h3 style={{ ...T.h2, marginBottom: '0.25rem' }}>Drawing Reviewer</h3>
              <p style={{ fontSize: '0.82rem', color: C.muted, fontStyle: 'italic', marginBottom: '0.9rem' }}>Every project has drawing details that get missed. Rework is the result. This prevents it.</p>
              <p style={{ fontSize: '0.83rem', color: C.muted, lineHeight: 1.8, marginBottom: '0.75rem' }}>
                A single missed notation, an ambiguous detail, or a dimension that conflicts with a British Standard — on paper it looks minor. On site it becomes a delay, a variation, and a cost that is always a multiple of what it would have taken to catch it at review stage.
              </p>
              <p style={{ fontSize: '0.83rem', fontWeight: 600, color: C.text, marginBottom: '0.6rem' }}>Drawing Reviewer is an agentic workflow that analyses your drawings automatically:</p>
              <ul style={{ margin: '0 0 1rem 0', padding: '0 0 0 1.1rem' }}>
                {[
                  'Extracts mandatory information required by your project standards',
                  'Spot-checks drawing content against British Standards (BS, Eurocodes) or any specified standard',
                  'Identifies unclear or incomplete elements that require engineer or architect review',
                  'Produces a structured schedule of flagged items — prioritised by risk, ready to act on',
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: '0.82rem', color: C.muted, lineHeight: 1.75, marginBottom: '0.25rem' }}>{item}</li>
                ))}
              </ul>
              <p style={{ fontSize: '0.83rem', color: C.muted, lineHeight: 1.8, marginBottom: '1.1rem' }}>
                The output is not a comment list. It is an intelligent, structured review that reduces the gap between drawing issue and problem identification from weeks to minutes.
              </p>
              <a href="#contact" style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, textDecoration: 'none', borderBottom: `1.5px solid ${C.text}`, paddingBottom: '1px' }}>Get notified at launch →</a>
            </div>
          </div>

          {/* Coming next */}
          <div style={{ border: `1px dashed ${C.border}`, borderRadius: '10px', padding: '1.25rem 1.75rem', background: C.surface, display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.72rem', color: C.subtle, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', alignSelf: 'center', flexShrink: 0 }}>On the roadmap</div>
            {['Information delivery monitoring', 'Compliance report automation', 'Document validation pipeline'].map((item, i) => (
              <span key={i} style={{ fontSize: '0.75rem', color: C.subtle, background: C.bg, border: `1px solid ${C.border}`, borderRadius: '4px', padding: '0.2rem 0.65rem' }}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: MCP Server Build ── */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.4rem' }}>New Service · AI System Integration</div>
          <h2 style={{ ...T.h2, marginBottom: '0.75rem' }}>Connect your existing systems to AI intelligence — without rebuilding them.</h2>

          <div style={{ marginBottom: '1.75rem' }}>
            <PlaceholderMCP />
          </div>

          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.88, marginBottom: '1rem' }}>
            <strong style={{ color: C.text }}>MCP — Model Context Protocol</strong> is an open standard developed by Anthropic that allows AI systems to connect directly to your existing software, databases, and workflows. Instead of extracting data manually and feeding it to an AI tool, the AI reads your systems directly, acts within them, and returns structured outputs — in real time, in context, without a human in the loop.
          </p>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.88, marginBottom: '1.75rem' }}>
            Most firms have data spread across multiple disconnected tools — project management software, spreadsheets, CDEs, procurement platforms, email. The intelligence to make better decisions from that data already exists. What's missing is the connection. MCP is how you build it.
          </p>

          <h3 style={{ ...T.h3, marginBottom: '1rem' }}>Where MCP creates value</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
            {[
              { title: 'Live project intelligence', body: 'Connect your CDE, PM platform, or cost database — ask plain-language questions and receive answers drawn directly from live data. No export, no formatting, no manual search.' },
              { title: 'Intelligent document handling', body: 'An MCP-connected AI reads incoming documents — RFIs, submittals, specifications — extracts key data, routes it, and logs it automatically. No person required in the loop.' },
              { title: 'Cross-system coordination', body: 'A single intelligent agent connected to your BIM tool, issue tracker, and communication platform — creating, updating, and linking records across all three from a single instruction.' },
              { title: 'Custom AI for your workflow', body: 'A Claude-powered assistant trained on your project, your standards, and your naming conventions. Not a generic chatbot — a tool that understands your specific operational context.' },
            ].map((uc, i) => (
              <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '9px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.83rem', fontWeight: 600, color: C.text, marginBottom: '0.4rem' }}>{uc.title}</div>
                <div style={{ fontSize: '0.78rem', color: C.muted, lineHeight: 1.75 }}>{uc.body}</div>
              </div>
            ))}
          </div>

          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '9px', padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text, marginBottom: '0.4rem' }}>Who benefits</div>
            <p style={{ fontSize: '0.8rem', color: C.muted, lineHeight: 1.75, margin: 0 }}>
              Any organisation running multiple disconnected systems where the cost of that disconnection is measured in time, errors, or missed information. Architecture practices. Main contractors. Cost consultants. Manufacturing operations. Project management offices. Legal and professional services firms.
            </p>
          </div>

          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '9px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text, marginBottom: '0.4rem' }}>What ToP-R delivers</div>
            <p style={{ fontSize: '0.8rem', color: C.muted, lineHeight: 1.75, margin: 0 }}>
              We scope, build, and deploy MCP servers tailored to your firm's systems and workflows. We handle the architecture, the integrations, the security model, and the testing. You receive a working connection between your tools and AI intelligence — without needing an internal development team.
            </p>
          </div>

          <a href="#contact" style={{
            display: 'inline-block', background: C.text, color: '#fff',
            padding: '0.62rem 1.4rem', borderRadius: '7px',
            fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none',
          }}>Talk to us about MCP integration →</a>
        </div>
      </section>

      {/* ── SECTION 6: Who it's for ── */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.4rem' }}>Who it's for</div>
          <h2 style={{ ...T.h2, marginBottom: '1.5rem' }}>The problem is the same across every industry. The tools are specific.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { audience: 'Construction & Project Management', pain: 'RFI delays embedded in the programme. Drawing issues caught too late. Procurement done without supplier comparison.', tools: 'RFI Desk · Drawing Reviewer · Custom automation pipelines' },
              { audience: 'Manufacturing & Operations', pain: 'Compliance checks done manually. Procurement inconsistency. Quality control relying on individual judgement rather than a defined standard.', tools: 'Drawing Reviewer · Custom automation pipelines' },
              { audience: 'Consulting & Professional Services', pain: 'Disconnected systems. Manual document handling. Time lost reconstructing information that already exists somewhere.', tools: 'MCP Server Build · Custom agentic workflows' },
            ].map((row, i) => (
              <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: '9px', padding: '1.4rem', background: C.bg }}>
                <h3 style={{ fontSize: '0.83rem', fontWeight: 600, color: C.text, marginBottom: '0.5rem' }}>{row.audience}</h3>
                <p style={{ fontSize: '0.78rem', color: C.muted, lineHeight: 1.7, marginBottom: '0.75rem' }}>{row.pain}</p>
                <div style={{ fontSize: '0.7rem', color: C.subtle, marginBottom: '0.6rem' }}>{row.tools}</div>
                <a href="#contact" style={{ fontSize: '0.73rem', fontWeight: 600, color: C.text, textDecoration: 'none', borderBottom: `1px solid ${C.text}`, paddingBottom: '1px' }}>Get in touch →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: Approach ── */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.4rem' }}>How we work</div>
          <h2 style={{ ...T.h2, marginBottom: '1rem' }}>Built from real problems. Not product workshops.</h2>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.88, marginBottom: '1rem' }}>
            These tools came from real projects — real cost overruns, real programme delays, real processes that relied on spreadsheets and manual effort because no intelligent system had been built to replace them yet.
          </p>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.88 }}>
            We build each automation to do one job precisely. We do not add features it does not need. The atomic method means each component is tested in isolation before it connects to the next — so the complete pipeline is reliable from day one.
          </p>
        </div>
      </section>

      {/* ── SECTION 8: Contact ── */}
      <section id="contact" style={{ padding: '3.5rem 2rem 4.5rem' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.4rem' }}>Get in touch</div>
          <h2 style={{ ...T.h2, marginBottom: '0.75rem' }}>Bring us your process. We'll tell you what's automatable.</h2>
          <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.75, maxWidth: '520px', marginBottom: '2rem' }}>
            If it involves manual cross-referencing, chasing responses, extracting information that already exists somewhere, or rebuilding outputs from scratch — it is almost certainly automatable. We'll map it, decompose it, and come back within one working day with a clear view of what's possible.
          </p>
          <ContactForm />
        </div>
      </section>

    </div>
  )
}
