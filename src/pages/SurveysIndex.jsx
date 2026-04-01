import { Link } from 'react-router-dom'
import { C, T } from '../tokens'

const surveys = [
  { path: '/surveys/scan-to-bim', title: 'Scan to BIM', desc: 'Fast, accurate digital survey service covering heritage buildings, existing assets, and as-built environments.', tag: 'Full service overview' },
  { path: '/surveys/heritage', title: 'Heritage Surveys', desc: 'Careful capture of existing conditions where geometry is irregular, access is limited, or the building fabric is sensitive.', tag: '' },
  { path: '/surveys/post-processing', title: 'Post-Processing', desc: 'Point cloud registration, cleaning, alignment, and preparation for BIM modelling or as-built documentation.', tag: '' },
  { path: '/surveys/as-built', title: 'As-Built Surveys', desc: 'Accurate digital record of what is actually on site — essential for retrofit, existing buildings, and design verification.', tag: '' },
]

export default function SurveysIndex() {
  return (
    <div style={{ marginLeft: C.sidebarW, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      <section style={{ padding: '4rem 3.5rem 3rem', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '1rem', color: '#7C3AED' }}>Survey Services</div>
          <h1 style={{ ...T.h1, marginBottom: '0.85rem' }}>Scan to BIM &amp; Survey Services</h1>
          <p style={{ fontSize: '0.95rem', color: C.muted, lineHeight: 1.75, maxWidth: '600px', marginBottom: '1.5rem' }}>
            From rapid scan capture to clean BIM-ready outputs, our Scan to BIM service gives you accurate existing-condition information you can trust. Whether you need a heritage record, post-processed point cloud, or a full as-built survey, we deliver practical results quickly, competitively, and at global project scale.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { v: '1–2 mm', l: 'Scan accuracy (site dependent)' },
              { v: 'Global', l: 'Project coverage' },
              { v: 'Fast', l: 'Turnaround' },
            ].map((m, i) => (
              <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '1rem 1.5rem' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#7C3AED', letterSpacing: '-0.02em' }}>{m.v}</div>
                <div style={{ ...T.small, marginTop: '0.15rem' }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 3.5rem 4rem', background: C.surface }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '1rem', color: '#7C3AED' }}>Sub-services</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {surveys.map((s, i) => (
              <Link key={i} to={s.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: C.bg, border: `1px solid ${C.border}`, borderRadius: '9px',
                  padding: '1.5rem', cursor: 'pointer',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {s.tag && (
                    <div style={{
                      display: 'inline-block', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.08em',
                      textTransform: 'uppercase', background: '#F5F3FF', color: '#7C3AED',
                      padding: '0.15rem 0.5rem', borderRadius: '3px', marginBottom: '0.6rem',
                    }}>{s.tag}</div>
                  )}
                  <h3 style={{ ...T.h3, marginBottom: '0.4rem', color: C.text }}>{s.title}</h3>
                  <p style={{ ...T.body, fontSize: '0.77rem', marginBottom: '0.75rem' }}>{s.desc}</p>
                  <span style={{ fontSize: '0.73rem', color: '#7C3AED', fontWeight: 500 }}>View service →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
