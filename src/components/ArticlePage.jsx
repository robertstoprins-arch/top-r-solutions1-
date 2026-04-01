import { Link } from 'react-router-dom'
import { C, T } from '../tokens'
import ContactForm from './ContactForm'

export default function ArticlePage({ category, categoryColor = C.accent, title, readTime, intro, sections, relatedServices = [] }) {
  return (
    <div style={{ marginLeft: C.sidebarW, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Hero */}
      <section style={{ padding: '4rem 3.5rem 3rem', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Link to="/" style={{ ...T.small, color: C.subtle, textDecoration: 'none' }}>Home</Link>
            <span style={{ color: C.border }}>›</span>
            <Link to="/resources" style={{ ...T.small, color: C.subtle, textDecoration: 'none' }}>Resources</Link>
            <span style={{ color: C.border }}>›</span>
            <span style={{ ...T.small, color: C.muted }}>{title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{
              display: 'inline-block', ...T.label,
              background: categoryColor === C.accent ? C.accentBg : '#F5F3FF',
              color: categoryColor,
              padding: '0.2rem 0.6rem', borderRadius: '4px',
              border: `1px solid ${categoryColor === C.accent ? 'rgba(37,99,235,0.2)' : 'rgba(124,58,237,0.2)'}`,
            }}>{category}</span>
            <span style={{ fontSize: '0.68rem', color: C.subtle }}>{readTime}</span>
          </div>
          <h1 style={{ ...T.h1, fontSize: '1.85rem', marginBottom: '1.25rem', maxWidth: '680px' }}>{title}</h1>
          <p style={{ fontSize: '0.92rem', color: C.muted, lineHeight: 1.85, maxWidth: '660px' }}>{intro}</p>
        </div>
      </section>

      {/* Article body */}
      <section style={{ padding: '3rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '3rem', alignItems: 'start' }}>

            {/* Main content */}
            <div>
              {sections.map((s, i) => (
                <div key={i} style={{ marginBottom: '2.25rem' }}>
                  <h2 style={{ ...T.h2, fontSize: '1.05rem', marginBottom: '0.75rem' }}>{s.heading}</h2>
                  {Array.isArray(s.body) ? s.body.map((para, j) => (
                    <p key={j} style={{ ...T.body, fontSize: '0.85rem', lineHeight: 1.85, marginBottom: '0.75rem' }}>{para}</p>
                  )) : (
                    <p style={{ ...T.body, fontSize: '0.85rem', lineHeight: 1.85 }}>{s.body}</p>
                  )}
                  {s.bullets && (
                    <ul style={{ margin: '0.75rem 0 0 0', padding: '0 0 0 1.25rem' }}>
                      {s.bullets.map((b, j) => (
                        <li key={j} style={{ ...T.body, fontSize: '0.83rem', lineHeight: 1.75, marginBottom: '0.35rem' }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar sticky */}
            <div style={{ position: 'sticky', top: '2rem' }}>
              {relatedServices.length > 0 && (
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '9px', padding: '1.25rem', marginBottom: '1rem' }}>
                  <div style={{ ...T.label, marginBottom: '0.75rem' }}>Related Services</div>
                  {relatedServices.map((r, i) => (
                    <Link key={i} to={r.path} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.55rem 0',
                      borderTop: i > 0 ? `1px solid ${C.borderLight}` : 'none',
                      textDecoration: 'none',
                      fontSize: '0.75rem', fontWeight: 500, color: C.text,
                      transition: 'color 0.12s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = C.accent}
                      onMouseLeave={e => e.currentTarget.style.color = C.text}
                    >
                      {r.label}
                      <span style={{ color: C.border, fontSize: '0.7rem' }}>→</span>
                    </Link>
                  ))}
                </div>
              )}
              <div style={{ background: C.accentBg, border: `1px solid rgba(37,99,235,0.2)`, borderRadius: '9px', padding: '1.25rem' }}>
                <div style={{ ...T.label, color: C.accent, marginBottom: '0.5rem' }}>Get expert advice</div>
                <p style={{ fontSize: '0.73rem', color: C.muted, lineHeight: 1.6, marginBottom: '0.85rem' }}>
                  Talk to ToP-R Solutions about applying this on your project.
                </p>
                <a href="#contact-form" style={{
                  display: 'block', textAlign: 'center',
                  background: '#111', color: '#fff',
                  padding: '0.55rem', borderRadius: '6px',
                  fontSize: '0.73rem', fontWeight: 600, textDecoration: 'none',
                }}>Request an Estimate</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section id="contact-form" style={{ padding: '3.5rem 3.5rem 4rem', background: C.bg }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ ...T.label, marginBottom: '0.4rem' }}>Get started</div>
            <h2 style={{ ...T.h2, marginBottom: '0.4rem' }}>Ready to discuss your project?</h2>
            <p style={{ ...T.body, fontSize: '0.78rem' }}>
              Submit your project details below. We respond within one working day.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

    </div>
  )
}
