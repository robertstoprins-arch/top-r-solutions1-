import { C, T } from '../tokens'
import ContactForm from '../components/ContactForm'
import ImageAccordion from '../components/ImageAccordion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const TESTIMONIALS = [
  {
    quote: 'ToP-R brought clarity to a project that had significant BIM coordination gaps at pre-appointment stage. Their EIR review and pre-contract BEP meant we went into appointment with aligned expectations across the whole supply chain.',
    name: 'Project Director',
    company: 'Commercial Developer, London',
    tag: 'Pre-Appointment BIM',
  },
  {
    quote: 'The scan-to-BIM deliverables were accurate, well-structured, and issued on time. The point cloud registration quality was exceptional — the team clearly understood what we needed and delivered to a high standard.',
    name: 'Lead Architect',
    company: 'Architecture Practice, UK',
    tag: 'Scan to BIM',
  },
  {
    quote: 'Remote modelling support allowed us to keep our programme on track during a critical stage. ToP-R integrated seamlessly with our existing team and delivered to the standards we required without any onboarding overhead.',
    name: 'BIM Manager',
    company: 'Main Contractor, South East England',
    tag: 'Remote Modelling',
  },
  {
    quote: 'Working across a complex mixed-use scheme in Dubai, ToP-R managed the federated model and coordination process with a level of rigour we hadn\'t experienced from previous BIM consultants in the region.',
    name: 'Senior Project Manager',
    company: 'Developer, Dubai UAE',
    tag: 'Contractor Phase BIM',
  },
]

const WHO = [
  {
    type: 'Developers & Employers',
    body: 'Clients who need information requirements defined before appointment — and post-appointment management to keep the supply chain on track through delivery.',
    pills: ['EIR Drafting', 'Pre-Contract BEP', 'CDE Selection', 'Post-Appointment BIM'],
  },
  {
    type: 'Design Teams & Architects',
    body: 'Practices that need ISO 19650 compliance established, remote modelling capacity, or coordination support for complex or high-value stages.',
    pills: ['ISO 19650 Onboarding', 'Remote Modelling', 'BIM Coordination', 'Scan to BIM'],
  },
  {
    type: 'Main Contractors',
    body: 'Contractors at RIBA Stage 4–5 who need federated model management, clash detection, and structured handover data delivered to programme.',
    pills: ['Contractor Phase BIM', 'Clash Detection', 'COBie & Handover', 'As-Built Survey', 'RFI Desk'],
  },
]

const HOW = [
  {
    n: '01',
    t: 'Understand the brief',
    b: 'We start by reading the EIR, understanding the supply chain, and identifying what information is actually required at each stage — not what\'s standard, what\'s needed.',
  },
  {
    n: '02',
    t: 'Define the right scope',
    b: 'We don\'t over-specify. Every BIM strategy is written for the project — proportionate to the client\'s maturity level, programme, and handover requirements.',
  },
  {
    n: '03',
    t: 'Deliver and support',
    b: 'We stay involved through delivery — managing coordination, reviewing model submissions, and escalating issues before they affect programme or cost.',
  },
  {
    n: '04',
    t: 'Stay accountable',
    b: 'We produce written records of every coordination meeting, maintain the information delivery schedule, and flag issues early — not after the variation has been raised.',
  },
]

const SECTORS = ['Super Prime Residential', 'Commercial', 'Infrastructure', 'Heritage', 'Main Contractor', 'Developer']
const BADGES = ['ISO 19650-2', 'ISO 19650-3', 'UK BIM Framework', 'AEC (UK) BIM Protocol']

const learnMore = {
  display: 'inline-flex', alignItems: 'center', gap: '5px',
  fontSize: '0.78rem', fontWeight: 600, color: C.text,
  textDecoration: 'none', borderBottom: `1.5px solid ${C.text}`,
  paddingBottom: '1px',
}

const ctaAnchor = {
  fontSize: '0.92rem', fontWeight: 600, color: C.text,
  marginBottom: '0.85rem', lineHeight: 1.6, textAlign: 'center',
}

export default function About() {
  return (
    <div style={{ marginLeft: C.sidebarW, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Helmet>
        <title>About ToP-R Solutions — BIM Consultancy &amp; Automation, London</title>
        <meta name="description" content="ToP-R Solutions is a specialist BIM consultancy and survey firm based in London. Project-specific standards, ISO 19650, scan to BIM, and practical PM automation. Founded by Roberts Toprins." />
      </Helmet>

      {/* Hero */}
      <section style={{ padding: '4.5rem 2rem 3.5rem', borderBottom: `1px solid ${C.border}`, textAlign: 'center' }}>
        <div style={{ maxWidth: '660px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '1rem', letterSpacing: '0.14em' }}>
            BIM Consultancy &nbsp;·&nbsp; Automation &nbsp;·&nbsp; Worldwide
          </div>
          <h1 style={{ ...T.h1, fontSize: '2.1rem', marginBottom: '1.4rem', lineHeight: 1.18 }}>
            Project-specific BIM. Practical PM automation.<br />
            <span style={{ fontWeight: 500, color: C.muted }}>Delivered by a small, established team.</span>
          </h1>
          <p style={{ fontSize: '0.9rem', color: C.muted, lineHeight: 1.85, marginBottom: '1rem' }}>
            Every standard and process we put in place is written for the project — as minimal as it needs to be, and no more. Heavy, over-specified standards don't help every project; they add cost without adding control. We take a strategic support approach: proactive coordination with consultants' responsibilities defined from pre-appointment and built out through delivery — so gaps, risks, and missed information are caught before they become problems.
          </p>
          <p style={{ fontSize: '0.9rem', color: C.muted, lineHeight: 1.85 }}>
            Alongside the consultancy, we automate the repetitive tasks that slow project teams down — RFI tracking, information delivery monitoring, document validation. Specific tools for specific problems, not automation for its own sake.
          </p>
          <p style={{ fontSize: '0.82rem', color: C.subtle, lineHeight: 1.7, fontStyle: 'italic', marginTop: '1.25rem' }}>
            A small team. You work directly with the people doing the work — no account managers, no handoffs.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/services/bim" style={learnMore}>Explore BIM services →</Link>
            <span style={{ color: C.border, fontSize: '0.8rem' }}>·</span>
            <Link to="/tools" style={learnMore}>See automation tools →</Link>
          </div>
        </div>
      </section>

      {/* Services Accordion */}
      <section style={{ padding: '3rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.75rem' }}>What we do</div>
          <h2 style={{ ...T.h2, marginBottom: '1.75rem' }}>
            Five service areas. One integrated team.
          </h2>
          <ImageAccordion />
        </div>
      </section>

      {/* Credentials + Sectors */}
      <section style={{ padding: '2rem 2rem', borderBottom: `1px solid ${C.border}`, textAlign: 'center' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.9rem' }}>Standards &amp; Accreditations</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            {BADGES.map((b, i) => (
              <span key={i} style={{
                border: `1px solid ${C.border}`, borderRadius: '4px',
                padding: '0.3rem 0.75rem', fontSize: '0.68rem', fontWeight: 600,
                color: '#3F3F46', letterSpacing: '0.04em',
              }}>{b}</span>
            ))}
          </div>
          <div style={{ ...T.label, marginBottom: '0.6rem', marginTop: '0.5rem' }}>Sectors</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
            {SECTORS.map((s, i) => (
              <span key={i} style={{
                background: C.borderLight, borderRadius: '4px',
                padding: '0.25rem 0.65rem', fontSize: '0.65rem', color: C.muted, fontWeight: 500,
              }}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Who we work with */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '1.25rem' }}>Who we work with</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {WHO.map((w, i) => (
              <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: '10px', padding: '1.5rem 1.5rem 1.75rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>{w.type}</div>
                <div style={{ fontSize: '0.8rem', color: C.muted, lineHeight: 1.75 }}>{w.body}</div>
                <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {w.pills.map((p, j) => (
                    <span key={j} style={{ background: C.borderLight, borderRadius: '4px', padding: '0.2rem 0.55rem', fontSize: '0.62rem', color: '#555', fontWeight: 500 }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div style={ctaAnchor}>Not sure where to start? Most clients come to us before appointment — it's the most cost-effective point to engage.</div>
            <Link to="/contact" style={learnMore}>Talk to us about your project →</Link>
          </div>
        </div>
      </section>

      {/* Video placeholder */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.5rem' }}>How we deliver</div>
          <div style={{
            background: '#1C1917', borderRadius: '12px', aspectRatio: '16/9',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '1.25rem', border: '1px solid #292524', position: 'relative', overflow: 'hidden', marginTop: '1.5rem',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '1.5px solid #A8A29E', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#A8A29E"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#78716C', position: 'relative', zIndex: 1 }}>A walkthrough of our delivery process · Video coming soon</div>
          </div>
        </div>
      </section>

      {/* How We Work — 2×2 grid */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '1.25rem' }}>Our approach</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            {HOW.map((h, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.25rem' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: C.border, lineHeight: 1 }}>{h.n}</div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: C.text, marginBottom: '0.5rem' }}>{h.t}</div>
                  <div style={{ fontSize: '0.8rem', color: C.muted, lineHeight: 1.75 }}>{h.b}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div style={ctaAnchor}>Every engagement starts with a brief review — no charge, no commitment.</div>
            <Link to="/contact" style={learnMore}>Request a brief review →</Link>
          </div>
        </div>
      </section>

      {/* Testimonials — 2×2 grid */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '1.25rem' }}>What clients say</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: C.bg, border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${C.text}`,
                borderRadius: '0 8px 8px 0', padding: '1.5rem 1.75rem',
              }}>
                <div style={{ fontSize: '1.25rem', color: C.border, lineHeight: 1, marginBottom: '0.5rem', fontFamily: 'Georgia, serif' }}>"</div>
                <p style={{ fontSize: '0.84rem', color: C.muted, lineHeight: 1.8, marginBottom: '1rem', fontStyle: 'italic' }}>{t.quote}</p>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: C.text }}>{t.name}</div>
                <div style={{ fontSize: '0.7rem', color: C.muted }}>{t.company}</div>
                <span style={{
                  display: 'inline-block', marginTop: '0.75rem',
                  background: C.borderLight, color: C.text,
                  fontSize: '0.62rem', fontWeight: 600,
                  padding: '2px 8px', borderRadius: '4px',
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                }}>{t.tag}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div style={ctaAnchor}>See the services behind these results.</div>
            <Link to="/services/bim" style={learnMore}>View BIM services →</Link>
          </div>
        </div>
      </section>

      {/* From the field — blog/resources */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.5rem' }}>From the field</div>
          <h2 style={{ ...T.h2, marginBottom: '0.75rem' }}>What we've learned delivering projects</h2>
          <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.75, maxWidth: '580px', marginBottom: '2rem' }}>
            We've seen where fees escalate, where data gets lost at handover, and where early decisions save or cost clients real money. These are the patterns worth writing down.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {[
              {
                title: 'Why BIM fees escalate after appointment — and how to prevent it',
                desc: 'The scope ambiguities that drive cost overruns are almost always set at pre-appointment stage. Here\'s what to define before consultants are hired.',
                to: '/resources/pre-appointment-value',
              },
              {
                title: 'The repetitive tasks costing project teams hours every week — and how to eliminate them',
                desc: 'RFI chasing, information delivery tracking, document validation. These aren\'t complex problems — they\'re just manual. We built specific tools to remove them.',
                to: '/tools',
              },
              {
                title: 'Project-specific information standards: why templates cost more than they save',
                desc: 'Generic BIM templates applied without context create overhead with no return. Every project has a right-size — this is how to find it.',
                to: '/resources/iso-19650-guide',
              },
            ].map((a, i) => (
              <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: '10px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: C.text, lineHeight: 1.4 }}>{a.title}</div>
                <div style={{ fontSize: '0.78rem', color: C.muted, lineHeight: 1.7, flex: 1 }}>{a.desc}</div>
                <Link to={a.to} style={{ ...learnMore, alignSelf: 'flex-start' }}>Read →</Link>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div style={ctaAnchor}>We publish practical guides based on real project experience — not theory.</div>
            <Link to="/resources" style={learnMore}>View all resources →</Link>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.5rem' }}>Offices</div>
          <h2 style={{ ...T.h2, marginBottom: '0.75rem' }}>UK and Europe</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
            {[
              { name: 'London', lines: ['2 Eastbourne Terrace', 'London, W2 6LG'], emails: ['roberts@top-rsolutions.co.uk', 'info@top-rsolutions.co.uk', 'surveys@top-rsolutions.co.uk', 'automations@top-rsolutions.co.uk'], phone: 'Tel: [London office number]' },
              { name: 'Riga', lines: ['Dzirnavu iela 57A', 'Centra rajons, Rīga', 'LV-1010, Latvia'], emails: [], phone: 'Tel: [Riga office number]' },
            ].map((o, i) => (
              <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '1.75rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{o.name}</div>
                {o.lines.map((l, j) => <div key={j} style={{ fontSize: '0.8rem', color: C.muted, lineHeight: 1.7 }}>{l}</div>)}
                {o.emails.length > 0 && <div style={{ marginTop: '0.75rem' }}>
                  {o.emails.map((e, j) => (
                    <div key={j}><a href={`mailto:${e}`} style={{ fontSize: '0.78rem', color: C.text, lineHeight: 1.9, textDecoration: 'none' }}>{e}</a></div>
                  ))}
                </div>}
                <div style={{ fontSize: '0.78rem', color: C.muted, marginTop: '0.5rem', fontStyle: 'italic' }}>{o.phone}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div style={ctaAnchor}>We respond to all enquiries within one working day — with a realistic assessment, not a sales call.</div>
            <Link to="/contact" style={learnMore}>Get in touch →</Link>
          </div>
        </div>
      </section>

      {/* CEO — at bottom */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', display: 'grid', gridTemplateColumns: '160px 1fr', gap: '3rem', alignItems: 'start' }}>
          <div>
            <div style={{
              width: '160px', aspectRatio: '1', borderRadius: '10px',
              background: C.borderLight, border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '0.75rem', overflow: 'hidden',
            }}>
              <img src="/Linked in photo.jpg" alt="Roberts Toprins"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.innerHTML = '<span style="font-size:2rem;color:#E4E4E7">RT</span>' }}
              />
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: C.text }}>Roberts Toprins</div>
            <div style={{ fontSize: '0.7rem', color: C.muted, marginTop: '0.15rem' }}>CEO</div>
            <div style={{ fontSize: '0.65rem', color: C.subtle, marginTop: '0.25rem', marginBottom: '0.6rem' }}>500+ BIM professionals on LinkedIn</div>
            <a
              href="https://www.linkedin.com/in/roberts-toprins"
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#0A66C2', color: '#fff', borderRadius: '5px', padding: '0.28rem 0.65rem', fontSize: '0.65rem', fontWeight: 600, textDecoration: 'none' }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>
          <div>
            <h2 style={{ ...T.h2, marginBottom: '1rem' }}>Roberts Toprins</h2>
            <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.85, marginBottom: '1rem' }}>
              Roberts brings experience across super prime residential and commercial BIM, VDC, and digital transformation management, as well as BIM coordination and multi-trade technical design coordination.
            </p>
            <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.85 }}>
              His background is centred on practicality, coordination, and standards that support smooth delivery — with a strong focus on helping clients avoid unnecessary complexity and keep project outcomes efficient and controlled.
            </p>
            <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.85 }}>
              As a founder-led practice, every client engagement is overseen directly by Roberts — there are no junior handoffs on ToP-R projects.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
              {['Super Prime Residential', 'Commercial BIM', 'VDC', 'Digital Transformation', 'BIM Coordination', 'Multi-trade Technical Design'].map((t, i) => (
                <span key={i} style={{ background: C.borderLight, border: `1px solid ${C.border}`, borderRadius: '5px', padding: '0.3rem 0.7rem', fontSize: '0.68rem', color: C.muted, fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section style={{ padding: '3.5rem 2rem 4rem' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.4rem' }}>Get in touch</div>
          <h2 style={{ ...T.h2, marginBottom: '0.75rem' }}>Start a conversation</h2>
          <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.75, maxWidth: '520px', marginBottom: '2rem' }}>
            Submit your project details and we'll come back with a realistic assessment of how we can help — within one working day.
          </p>
          <ContactForm />
        </div>
      </section>

    </div>
  )
}
