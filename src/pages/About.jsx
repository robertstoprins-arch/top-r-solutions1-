import { C, T } from '../tokens'
import ContactForm from '../components/ContactForm'

const STATS = [
  { value: '40+', label: 'Projects Delivered' },
  { value: '3', label: 'Markets — UK, Europe, UAE' },
  { value: 'ISO 19650', label: 'Compliant Delivery' },
  { value: '1 Day', label: 'Response Turnaround' },
]

const TESTIMONIALS = [
  {
    quote: 'ToP-R brought clarity to a project that had significant BIM coordination gaps at pre-appointment stage. Their EIR review and pre-contract BEP meant we went into appointment with aligned expectations across the whole supply chain.',
    name: 'Project Director',
    role: 'Senior Project Manager',
    company: 'Commercial Developer, London',
    tag: 'Pre-Appointment BIM',
  },
  {
    quote: 'The scan-to-BIM deliverables were accurate, well-structured, and issued on time. The point cloud registration quality was exceptional — the team clearly understood what we needed and delivered accordingly.',
    name: 'Lead Architect',
    role: 'Associate Director',
    company: 'Architecture Practice, UK',
    tag: 'Scan to BIM',
  },
  {
    quote: 'Remote modelling support allowed us to keep our programme on track during a critical phase. ToP-R integrated seamlessly with our existing team and delivered to the standards we required without any additional onboarding overhead.',
    name: 'BIM Manager',
    role: 'Information Manager',
    company: 'Main Contractor, South East England',
    tag: 'Remote Modelling',
  },
]

const ACCREDITATIONS = [
  { label: 'ISO 19650-2', sub: 'Information Management · Design & Construction' },
  { label: 'ISO 19650-3', sub: 'Information Management · Operational Phase' },
  { label: 'UK BIM Framework', sub: 'Aligned Delivery & Documentation' },
  { label: 'Membership', sub: 'Industry Affiliations — Coming Soon' },
]

export default function About() {
  return (
    <div style={{ marginLeft: C.sidebarW, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Hero */}
      <section style={{ padding: '4.5rem 3.5rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '1rem' }}>About ToP-R Solutions</div>
          <h1 style={{ ...T.h1, fontSize: '2rem', marginBottom: '1.5rem', maxWidth: '580px' }}>
            BIM consultancy built on real project delivery experience.
          </h1>
          <p style={{ fontSize: '0.9rem', color: C.muted, lineHeight: 1.85, maxWidth: '660px', marginBottom: '1rem' }}>
            We support clients through the full build cycle — from consultant pre-appointment and pre-construction through to handover. Our approach is practical rather than theoretical: we work across different BIM maturity levels, understand where projects often go wrong, and know how early decisions affect time, coordination, and cost later in the process.
          </p>
          <p style={{ fontSize: '0.9rem', color: C.muted, lineHeight: 1.85, maxWidth: '660px' }}>
            We believe the best BIM strategy is not the most complicated one — it is the one that is correctly defined for the project. If standards, responsibilities, or information requirements are not set clearly at the right time, consultant and contractor fees can rise quickly because teams are forced to interpret unclear boundaries and fill gaps later. Our role is to find the fine line between too little and too much, and to specify only what is required to keep the project moving smoothly.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ padding: '2rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                background: C.bg, border: `1px solid ${C.border}`,
                borderRadius: '8px', padding: '1.25rem 1.25rem 1rem',
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: C.text, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.68rem', color: C.muted, marginTop: '0.4rem', lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Managing Director */}
      <section style={{ padding: '3.5rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '3rem', alignItems: 'start' }}>
            <div>
              <div style={{
                width: '100%', aspectRatio: '1', borderRadius: '10px',
                background: `linear-gradient(135deg, ${C.surface} 0%, ${C.border} 100%)`,
                border: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '0.75rem', overflow: 'hidden',
              }}>
                <img src="/Linked in photo.jpg" alt="Roberts Toprins"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.innerHTML = '<span style="font-size:2rem;color:#E4E4E7">RT</span>' }}
                />
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: C.text }}>Roberts Toprins</div>
              <div style={{ ...T.small, color: C.muted, marginTop: '0.15rem' }}>Managing Director</div>
              <a
                href="https://www.linkedin.com/in/roberts-toprins"
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  background: '#0A66C2', color: '#fff',
                  borderRadius: '5px', padding: '0.28rem 0.65rem',
                  fontSize: '0.65rem', fontWeight: 600,
                  textDecoration: 'none', transition: 'opacity 0.15s',
                  marginTop: '0.6rem',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
            <div>
              <h2 style={{ ...T.h2, marginBottom: '1rem' }}>Roberts Toprins</h2>
              <p style={{ ...T.body, fontSize: '0.85rem', lineHeight: 1.85, marginBottom: '1rem' }}>
                Roberts Toprins, Managing Director, brings experience across super prime residential and commercial BIM, VDC, and digital transformation management, as well as BIM coordination and multi-trade technical design coordination.
              </p>
              <p style={{ ...T.body, fontSize: '0.85rem', lineHeight: 1.85 }}>
                His background is centred on practicality, coordination, and standards that support smooth delivery, with a strong focus on helping clients avoid unnecessary complexity and keep project outcomes efficient and controlled.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
                {['Super Prime Residential', 'Commercial BIM', 'VDC', 'Digital Transformation', 'BIM Coordination', 'Multi-trade Technical Design'].map((t, i) => (
                  <span key={i} style={{
                    background: C.surface, border: `1px solid ${C.border}`,
                    borderRadius: '5px', padding: '0.3rem 0.7rem',
                    fontSize: '0.68rem', color: C.muted, fontWeight: 500,
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video placeholder */}
      <section style={{ padding: '3.5rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.5rem' }}>How We Work</div>
          <div style={{
            background: '#1C1917',
            borderRadius: '12px',
            aspectRatio: '16/9',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '1.25rem',
            border: `1px solid #292524`,
            position: 'relative', overflow: 'hidden',
          }}>
            {/* subtle grid texture */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
            {/* play button */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              border: '1.5px solid #A8A29E',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', zIndex: 1,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#A8A29E">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E7E5E4', marginBottom: '0.3rem' }}>
                A walkthrough of our delivery process
              </div>
              <div style={{ fontSize: '0.72rem', color: '#78716C' }}>
                Video coming soon
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our approach */}
      <section style={{ padding: '3.5rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '1.25rem' }}>Our Approach</div>
          <h2 style={{ ...T.h2, marginBottom: '2rem' }}>Project-specific, strategic, and grounded in what actually helps a project succeed.</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', border: `1px solid ${C.border}`, borderRadius: '9px', overflow: 'hidden' }}>
            {[
              { n: '01', t: 'Only suggest what is required for the project', b: 'Every standard, deliverable, and process we recommend is tied to a specific project need. If it does not add value for this project, we do not include it.' },
              { n: '02', t: 'No generic standards that add cost without adding value', b: 'Generic BIM templates applied without context create unnecessary overhead. We develop project-specific standards that are proportionate to the project scope, team, and contract.' },
              { n: '03', t: 'Project-specific BIM strategies that support delivery', b: 'Our focus is always on delivery outcomes: reduced risk, more efficient coordination between consultants and contractors, and clearer responsibilities at every stage.' },
            ].map((p, i) => (
              <div key={i} style={{
                display: 'flex', gap: '1.5rem', padding: '1.5rem',
                background: C.bg, borderTop: i > 0 ? `1px solid ${C.border}` : 'none',
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: C.borderLight, letterSpacing: '-0.04em', flexShrink: 0, lineHeight: 1 }}>{p.n}</div>
                <div>
                  <h3 style={{ ...T.h3, marginBottom: '0.4rem' }}>{p.t}</h3>
                  <p style={{ ...T.body, fontSize: '0.78rem' }}>{p.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '3.5rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.5rem' }}>Client Feedback</div>
          <h2 style={{ ...T.h2, marginBottom: '2rem' }}>What clients say</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: C.bg, border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${C.accent}`,
                borderRadius: '0 8px 8px 0', padding: '1.5rem 1.75rem',
              }}>
                <div style={{ fontSize: '1.25rem', color: C.border, lineHeight: 1, marginBottom: '0.6rem', fontFamily: 'Georgia, serif' }}>"</div>
                <p style={{ fontSize: '0.84rem', color: C.text, lineHeight: 1.8, marginBottom: '1rem', fontStyle: 'italic' }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: C.text }}>{t.name}</div>
                    <div style={{ fontSize: '0.7rem', color: C.muted }}>{t.role} · {t.company}</div>
                  </div>
                  <span style={{
                    background: C.accentBg, border: `1px solid rgba(37,99,235,0.2)`,
                    borderRadius: '4px', padding: '0.2rem 0.6rem',
                    fontSize: '0.62rem', fontWeight: 600, color: C.accent,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>{t.tag}</span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ ...T.small, marginTop: '1.25rem', color: C.subtle }}>
            Testimonials are representative of client feedback. Detailed case studies in progress.
          </p>
        </div>
      </section>

      {/* Accreditations */}
      <section style={{ padding: '2.5rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '1.25rem' }}>Standards & Affiliations</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
            {ACCREDITATIONS.map((a, i) => (
              <div key={i} style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: '8px', padding: '1rem 1.1rem',
                opacity: i === 3 ? 0.5 : 1,
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: C.text, marginBottom: '0.3rem' }}>{a.label}</div>
                <div style={{ fontSize: '0.65rem', color: C.muted, lineHeight: 1.5 }}>{a.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section style={{ padding: '3.5rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.5rem' }}>Contact</div>
          <h2 style={{ ...T.h2, marginBottom: '0.75rem' }}>UK and Europe</h2>
          <p style={{ ...T.body, fontSize: '0.85rem', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '600px' }}>
            Our teams are based in the UK and Europe, allowing us to support clients across both regions with flexible remote BIM consulting and practical project delivery support.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {[
              { label: 'UK Office', name: 'Eastbourne Terrace', lines: ['2 Eastbourne Terrace', 'London, England, W2 6LG'] },
              { label: 'Riga Office', name: 'Marszalkowska Centre', lines: ['Dzirnavu iela 57A, Centra rajons', 'Rīga, LV-1010, Latvija'] },
            ].map((office, i) => (
              <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '1.75rem' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.subtle, marginBottom: '1.1rem' }}>{office.label}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: C.text, marginBottom: '0.4rem' }}>{office.name}</div>
                {office.lines.map((l, j) => (
                  <div key={j} style={{ fontSize: '0.82rem', color: C.muted, lineHeight: 1.7 }}>{l}</div>
                ))}
                <div style={{ width: '100%', height: '1px', background: C.border, margin: '1.25rem 0' }} />
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.subtle, marginBottom: '0.75rem' }}>Contact</div>
                <a href="mailto:info@top-rsolutions.co.uk" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, color: C.text, textDecoration: 'none', lineHeight: 1.7, transition: 'color 0.12s' }}
                  onMouseEnter={e => e.currentTarget.style.color = C.accent}
                  onMouseLeave={e => e.currentTarget.style.color = C.text}
                >info@top-rsolutions.co.uk</a>
                {['+44 7565 260 827', '+01984 662 2247'].map((n, j) => (
                  <a key={j} href={`tel:${n.replace(/\s/g, '')}`} style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, color: C.text, textDecoration: 'none', lineHeight: 1.7, transition: 'color 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.color = C.accent}
                    onMouseLeave={e => e.currentTarget.style.color = C.text}
                  >{n}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section style={{ padding: '3.5rem 3.5rem 4rem', background: C.bg }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ ...T.label, marginBottom: '0.4rem' }}>Get in touch</div>
            <h2 style={{ ...T.h2, marginBottom: '0.4rem' }}>Start a conversation</h2>
            <p style={{ ...T.body, fontSize: '0.82rem' }}>
              Submit your project details below and we'll come back with a realistic assessment of what BIM support your project needs — and at what cost.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

    </div>
  )
}
