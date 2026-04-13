import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { C, T } from '../tokens'
import ContactForm from './ContactForm'

const DEFAULT_FAQS = [
  {
    q: 'Do you work alongside existing project consultants?',
    a: 'Yes. We integrate with your existing design team and BIM managers rather than replacing them. Our role is typically to provide specialist BIM strategy, information management, or technical coordination support that sits alongside the team already in place.',
  },
  {
    q: 'What file formats and platforms do you deliver in?',
    a: 'We work natively in Revit and deliver to the Autodesk Construction Cloud (ACC), BIM 360, Aconex, or any CDE your project requires. Deliverable formats follow the project information standard defined in the EIR — IFC, NWD, RVT, and COBie are all standard outputs.',
  },
  {
    q: 'How is ISO 19650 compliance handled on your engagements?',
    a: 'All our BIM deliverables follow the ISO 19650-2 framework. Where a project EIR exists, we work to it. Where it does not, we either draft one as part of the engagement or apply a proportionate project-specific information management process aligned to the UK BIM Framework.',
  },
]

function FAQ({ faqs = DEFAULT_FAQS }) {
  const [open, setOpen] = useState(null)
  return (
    <section style={{ padding: '3rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ ...T.label, marginBottom: '0.5rem' }}>FAQ</div>
        <h2 style={{ ...T.h2, marginBottom: '1.5rem' }}>Common questions</h2>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: '9px', overflow: 'hidden' }}>
          {faqs.map((item, i) => (
            <div key={i} style={{ borderTop: i > 0 ? `1px solid ${C.border}` : 'none' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', textAlign: 'left', background: 'none', border: 'none',
                  padding: '1.1rem 1.5rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: C.text, lineHeight: 1.4 }}>{item.q}</span>
                <span style={{
                  fontSize: '0.75rem', color: C.muted, flexShrink: 0,
                  transform: open === i ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}>▾</span>
              </button>
              {open === i && (
                <div style={{ padding: '0 1.5rem 1.25rem' }}>
                  <p style={{ ...T.body, fontSize: '0.8rem', lineHeight: 1.75 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ServicePage({ label, title, tagline, overview, deliveryPoints, expectStages, deliverables, serviceName, faqs }) {
  const metaDesc = tagline ? tagline.slice(0, 155) : `${title} — specialist BIM consultancy service from ToP-R Solutions. ISO 19650 aligned, project-specific, London and worldwide.`
  return (
    <div style={{ marginLeft: C.sidebarW, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Helmet>
        <title>{title} — ToP-R Solutions</title>
        <meta name="description" content={metaDesc} />
      </Helmet>

      {/* Hero */}
      <section style={{
        padding: '4rem 3.5rem 3rem',
        borderBottom: `1px solid ${C.border}`,
        background: C.bg,
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Link to="/" style={{ ...T.small, color: C.subtle, textDecoration: 'none' }}>Home</Link>
            <span style={{ color: C.border }}>›</span>
            <Link to="/services" style={{ ...T.small, color: C.subtle, textDecoration: 'none' }}>BIM Services</Link>
            <span style={{ color: C.border }}>›</span>
            <span style={{ ...T.small, color: C.muted }}>{title}</span>
          </div>
          <div style={{
            display: 'inline-block', ...T.label,
            background: C.accentBg, padding: '0.2rem 0.6rem',
            borderRadius: '4px', border: `1px solid rgba(37,99,235,0.2)`,
            marginBottom: '1rem',
          }}>{label}</div>
          <h1 style={{ ...T.h1, marginBottom: '0.85rem' }}>{title}</h1>
          <p style={{ fontSize: '1rem', color: C.muted, lineHeight: 1.7, maxWidth: '600px', marginBottom: '2rem' }}>{tagline}</p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a href="#contact-form" style={{
              background: '#111111', color: '#fff',
              padding: '0.6rem 1.4rem', borderRadius: '7px',
              fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none',
            }}>Request an Estimate</a>
            <a href="#learn-more" style={{
              color: C.muted, border: `1px solid ${C.border}`,
              padding: '0.6rem 1.4rem', borderRadius: '7px',
              fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none',
            }}>Learn More ↓</a>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section style={{ padding: '3rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.5rem' }}>Overview</div>
          <h2 style={{ ...T.h2, marginBottom: '1rem' }}>What this service involves</h2>
          <p style={{ ...T.body, fontSize: '0.85rem', lineHeight: 1.8 }}>{overview}</p>
        </div>
      </section>

      {/* How it supports delivery */}
      <section style={{ padding: '3rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.5rem' }}>Project delivery</div>
          <h2 style={{ ...T.h2, marginBottom: '1.5rem' }}>How it supports your project</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {deliveryPoints.map((p, i) => (
              <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '1.25rem' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: C.accentBg, border: `1px solid rgba(37,99,235,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: C.accent }}>{i + 1}</span>
                </div>
                <h3 style={{ ...T.h3, marginBottom: '0.4rem' }}>{p.title}</h3>
                <p style={{ ...T.body, fontSize: '0.75rem' }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section style={{ padding: '3rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.5rem' }}>Process</div>
          <h2 style={{ ...T.h2, marginBottom: '1.5rem' }}>What to expect</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {expectStages.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.5rem', paddingBottom: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  {i < expectStages.length - 1 && <div style={{ flex: 1, width: '1px', background: C.border, minHeight: '24px', marginTop: '4px' }} />}
                </div>
                <div style={{ paddingTop: '5px', paddingBottom: i < expectStages.length - 1 ? '0.5rem' : 0 }}>
                  <h3 style={{ ...T.h3, marginBottom: '0.3rem' }}>{s.stage}</h3>
                  <p style={{ ...T.body, fontSize: '0.76rem' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section style={{ padding: '2.5rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.5rem' }}>Deliverables</div>
          <h2 style={{ ...T.h2, marginBottom: '1rem' }}>What you receive</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {deliverables.map((d, i) => (
              <span key={i} style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: '5px', padding: '0.35rem 0.8rem',
                fontSize: '0.73rem', color: C.muted, fontWeight: 500,
              }}>{d}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ faqs={faqs} />

      {/* Learn more */}
      <section id="learn-more" style={{ padding: '3rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ ...T.label, marginBottom: '0.4rem' }}>Technical guidance</div>
            <h2 style={{ ...T.h2, marginBottom: '0.4rem' }}>Go deeper</h2>
            <p style={{ ...T.body, fontSize: '0.78rem' }}>Detailed technical standards, workflows, and case studies — coming soon.</p>
          </div>
          <a href="#" style={{
            display: 'inline-block', padding: '0.6rem 1.5rem',
            border: `1px solid ${C.border}`, borderRadius: '7px',
            fontSize: '0.78rem', fontWeight: 500, color: C.muted,
            textDecoration: 'none', whiteSpace: 'nowrap',
          }}>Learn More →</a>
        </div>
      </section>

      {/* Contact form */}
      <section style={{ padding: '3.5rem 3.5rem 4rem', background: C.bg }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ ...T.label, marginBottom: '0.4rem' }}>Get started</div>
            <h2 style={{ ...T.h2, marginBottom: '0.4rem' }}>Ready to discuss your project?</h2>
            <p style={{ ...T.body, fontSize: '0.78rem' }}>
              Submit your project details below. We'll review them and come back with a realistic fee proposal — usually within one working day.
            </p>
          </div>
          <ContactForm preSelected={serviceName} />
        </div>
      </section>

    </div>
  )
}
