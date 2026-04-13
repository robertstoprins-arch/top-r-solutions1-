import { Helmet } from 'react-helmet-async'
import { C, T } from '../../tokens'
import { Link } from 'react-router-dom'
import ContactForm from '../../components/ContactForm'

const FEATURES = [
  {
    n: '01',
    title: 'Centralised RFI log',
    body: 'Every RFI issued, responded to, and closed is tracked in one place. Status, responsible party, due date, and impact flag — visible to the whole team without chasing.',
  },
  {
    n: '02',
    title: 'Automated escalation',
    body: 'RFIs approaching their response deadline trigger automatic reminders to the responsible consultant. Overdue items are escalated to the project manager — no manual monitoring required.',
  },
  {
    n: '03',
    title: 'Programme impact tracking',
    body: 'Each RFI is tagged to a programme activity. When an RFI is delayed, its downstream impact is flagged immediately — before the programme slippage becomes visible on site.',
  },
  {
    n: '04',
    title: 'Coordination-linked closure',
    body: 'RFI responses are linked to the relevant model element and coordination record. When the RFI closes, the coordination log updates automatically — no double entry.',
  },
]

export default function RFIDesk() {
  return (
    <div style={{ marginLeft: C.sidebarW, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Helmet>
        <title>RFI Desk — Automated RFI Tracking — ToP-R Solutions</title>
        <meta name="description" content="RFI Desk automates RFI tracking and information delivery monitoring for construction projects. Reduce manual chasing, maintain programme, and keep records clean." />
      </Helmet>

      {/* Hero */}
      <section style={{ padding: '4.5rem 2rem 3.5rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '1rem' }}>Automation · RFI Desk</div>
          <h1 style={{ ...T.h1, fontSize: '2rem', marginBottom: '1.4rem', lineHeight: 1.18 }}>
            RFI management that runs itself — so your team can focus on resolving issues, not tracking them.
          </h1>

          <p style={{ fontSize: '0.92rem', color: C.muted, lineHeight: 1.88, marginBottom: '1.1rem' }}>
            On most construction projects, RFIs are managed through spreadsheets, email chains, and memory. Someone is always chasing a response. Someone else doesn't know the deadline passed. Programme impact gets noticed two weeks after it could have been avoided. The RFI process — which exists to resolve design and information gaps quickly — becomes its own source of delay.
          </p>

          <p style={{ fontSize: '0.92rem', color: C.muted, lineHeight: 1.88, marginBottom: '1.1rem' }}>
            RFI Desk automates the coordination overhead that surrounds every RFI: logging, chasing, escalating, and recording closure. The moment an RFI is raised, it enters a tracked workflow. Responsible parties receive automatic notifications. Deadlines are monitored without anyone having to remember them. When a response is overdue, the project manager is alerted — not informed retrospectively when the delay is already embedded in the programme.
          </p>

          <p style={{ fontSize: '0.92rem', color: C.muted, lineHeight: 1.88, marginBottom: '1.1rem' }}>
            Where RFI Desk integrates with the project coordination record, responses are linked directly to the model element or drawing they relate to. There is no parallel filing, no duplicate entry, and no ambiguity about which version of an answer applies to which revision. The RFI log becomes a searchable, reliable audit trail — not a spreadsheet that reflects whoever last updated it.
          </p>

          <p style={{ fontSize: '0.92rem', color: C.muted, lineHeight: 1.88, marginBottom: '1.75rem' }}>
            For contractors managing large consultant teams and live design queries, this is the difference between proactive coordination and reactive fire-fighting. For employers and project managers overseeing the process, it means visibility without effort — a live picture of open items, response rates, and programme risk, without reading through email threads to build it.
          </p>

          <p style={{ fontSize: '0.85rem', color: C.subtle, fontStyle: 'italic', lineHeight: 1.7, marginBottom: '1.75rem' }}>
            RFI Desk is part of ToP-R's practical automation suite — built for real project environments, not proof-of-concept demos. Each tool solves one specific problem, integrates with the way your team already works, and can be deployed without a long implementation programme.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#contact" style={{
              display: 'inline-block', background: C.text, color: '#fff',
              padding: '0.62rem 1.4rem', borderRadius: '7px',
              fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >Talk to us about RFI Desk</a>
            <Link to="/tools/material-checker" style={{
              fontSize: '0.78rem', fontWeight: 600, color: C.text,
              textDecoration: 'none', borderBottom: `1.5px solid ${C.text}`, paddingBottom: '1px',
            }}>See other tools →</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '1.25rem' }}>What it does</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: '10px', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.25rem' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: C.border, lineHeight: 1 }}>{f.n}</div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: C.text, marginBottom: '0.5rem' }}>{f.title}</div>
                  <div style={{ fontSize: '0.8rem', color: C.muted, lineHeight: 1.75 }}>{f.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: '3.5rem 2rem 4rem' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.4rem' }}>Get in touch</div>
          <h2 style={{ ...T.h2, marginBottom: '0.75rem' }}>Tell us about your project</h2>
          <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.75, maxWidth: '520px', marginBottom: '2rem' }}>
            We'll come back within one working day with a realistic view of how RFI Desk fits your project setup.
          </p>
          <ContactForm />
        </div>
      </section>

    </div>
  )
}
