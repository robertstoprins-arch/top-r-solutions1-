import { Link } from 'react-router-dom'
import { C, T } from '../tokens'

const services = [
  { path: '/services/pre-appointment', title: 'Pre-Appointment BIM', desc: 'EIR review, scope definition, and pre-contract BEP — before a single appointment is issued.', tag: 'Most commercially leveraged' },
  { path: '/services/post-appointment', title: 'Post-Appointment BIM', desc: 'Post-contract BEP, MIDP, TIDP, and full supply chain alignment across every discipline.', tag: '' },
  { path: '/services/onboarding', title: 'BIM Onboarding', desc: 'Structured introduction to the project CDE, standards, and delivery requirements for every discipline.', tag: '' },
  { path: '/services/contractor-phase', title: 'Contractor Phase BIM', desc: 'Coordination, clash detection, information delivery, and progressive as-built through construction.', tag: '' },
  { path: '/services/cobie-handover', title: 'COBie & Handover', desc: 'Structured FM-ready asset data at handover — attributed progressively through design and construction.', tag: '' },
  { path: '/services/digital-twin', title: 'Digital Twin Readiness', desc: 'BIM deliverables structured for live operational data integration from handover.', tag: '' },
  { path: '/services/remote-modelling',  title: 'Remote Modelling', desc: 'Dedicated Revit modelling capacity integrated directly into your project workflow.', tag: '' },
  { path: '/services/ar-implementation', title: 'BIM AR Implementation', desc: 'AR technology selection, contractor alignment, model optimisation, site setup, and field integration management.', tag: 'Recommended on coordinated projects' },
]

export default function ServicesIndex() {
  return (
    <div style={{ marginLeft: C.sidebarW, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      <section style={{ padding: '4rem 3.5rem 3rem', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '1rem' }}>BIM Services</div>
          <h1 style={{ ...T.h1, marginBottom: '0.85rem' }}>Standards-driven BIM,<br />appointment to handover.</h1>
          <p style={{ fontSize: '0.95rem', color: C.muted, lineHeight: 1.75, maxWidth: '580px' }}>
            Every service is configured to your project's information requirements, contract type, and supply chain capability. Select a service below to see what it involves and how it supports project delivery.
          </p>
        </div>
      </section>

      <section style={{ padding: '3rem 3.5rem', background: C.surface }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {services.map((s, i) => (
            <Link key={i} to={s.path} style={{ textDecoration: 'none' }}>
              <div style={{
                background: C.bg, border: `1px solid ${C.border}`, borderRadius: '9px',
                padding: '1.5rem', cursor: 'pointer',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
              >
                {s.tag && (
                  <div style={{
                    display: 'inline-block', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase', background: '#EFF6FF', color: '#2563EB',
                    padding: '0.15rem 0.5rem', borderRadius: '3px', marginBottom: '0.6rem',
                  }}>{s.tag}</div>
                )}
                <h3 style={{ ...T.h3, marginBottom: '0.4rem', color: C.text }}>{s.title}</h3>
                <p style={{ ...T.body, fontSize: '0.77rem', marginBottom: '0.75rem' }}>{s.desc}</p>
                <span style={{ fontSize: '0.73rem', color: '#2563EB', fontWeight: 500 }}>View service →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
