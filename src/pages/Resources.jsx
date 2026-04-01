import { Link } from 'react-router-dom'
import { C, T } from '../tokens'

const ARTICLES = [
  {
    path: '/resources/iso-19650',
    category: 'BIM Standards',
    categoryColor: C.accent,
    title: 'ISO 19650 in Practice: What It Actually Means for Your Project',
    excerpt: 'ISO 19650 is widely referenced but rarely explained in terms of what it changes on a live project. This guide covers EIR, BEP, information management roles, and the decisions that actually matter.',
    readTime: '7 min read',
  },
  {
    path: '/resources/pre-appointment-value',
    category: 'Pre-Appointment BIM',
    categoryColor: C.accent,
    title: 'Why Pre-Appointment BIM Saves More Than It Costs',
    excerpt: 'The commercial case for investing in BIM strategy before appointment is rarely made clearly. Here is why pre-appointment decisions have a disproportionate effect on fees, variations, and coordination quality.',
    readTime: '6 min read',
  },
  {
    path: '/resources/scan-to-bim-guide',
    category: 'Survey Services',
    categoryColor: '#7C3AED',
    title: 'Scan to BIM: What to Know Before Hiring a Surveyor',
    excerpt: 'Point cloud surveys are increasingly standard on refurbishment and fit-out projects. Understanding LOD, deliverable formats, and what the registration process involves will help you commission the right scope.',
    readTime: '8 min read',
  },
]

export default function Resources() {
  return (
    <div style={{ marginLeft: C.sidebarW, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Hero */}
      <section style={{ padding: '4.5rem 3.5rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '1rem' }}>Resources & Guides</div>
          <h1 style={{ ...T.h1, fontSize: '2rem', marginBottom: '1rem', maxWidth: '580px' }}>
            Practical BIM knowledge for project teams.
          </h1>
          <p style={{ fontSize: '0.9rem', color: C.muted, lineHeight: 1.85, maxWidth: '600px' }}>
            Guides, technical overviews, and practical articles written by the ToP-R Solutions team. No filler — each piece addresses a real question we hear from clients.
          </p>
        </div>
      </section>

      {/* Article grid */}
      <section style={{ padding: '3rem 3.5rem 4rem', background: C.surface }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {ARTICLES.map((a, i) => (
              <Link key={i} to={a.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: C.bg, border: `1px solid ${C.border}`,
                  borderRadius: '10px', padding: '1.75rem',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  display: 'grid', gridTemplateColumns: '1fr auto',
                  gap: '1.5rem', alignItems: 'center',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.boxShadow = '0 2px 12px rgba(37,99,235,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                      <span style={{
                        display: 'inline-block', ...T.label, fontSize: '0.58rem',
                        background: a.categoryColor === C.accent ? C.accentBg : '#F5F3FF',
                        color: a.categoryColor,
                        padding: '0.15rem 0.5rem', borderRadius: '4px',
                        border: `1px solid ${a.categoryColor === C.accent ? 'rgba(37,99,235,0.2)' : 'rgba(124,58,237,0.2)'}`,
                      }}>{a.category}</span>
                      <span style={{ fontSize: '0.65rem', color: C.subtle }}>{a.readTime}</span>
                    </div>
                    <h2 style={{ ...T.h3, fontSize: '0.92rem', marginBottom: '0.5rem', color: C.text }}>{a.title}</h2>
                    <p style={{ ...T.body, fontSize: '0.78rem', lineHeight: 1.7 }}>{a.excerpt}</p>
                  </div>
                  <div style={{ color: C.muted, fontSize: '1.1rem', flexShrink: 0 }}>→</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
