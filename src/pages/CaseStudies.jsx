import { C, T } from '../tokens'
import ContactForm from '../components/ContactForm'

const PROJECTS = [
  {
    tag: 'Pre-Appointment BIM · London',
    title: 'Commercial office refurbishment, 14,500m² GIA',
    scope: 'EIR drafting, pre-contract BEP, responsibility matrix across 6 consultant disciplines',
    deliverables: 'Appointment-ready BIM package issued 3 weeks before tender close',
    outcome: 'All 6 consultants tendered with a completed pre-contract BEP — zero BIM-related scope queries at tender stage',
    services: ['Pre-Appointment BIM', 'Onboarding'],
  },
  {
    tag: 'Scan to BIM · South East England',
    title: 'Grade II listed office building, full measured survey',
    scope: 'Terrestrial laser scan of 4-storey listed building, LOD 300 Revit model, heritage point cloud',
    deliverables: 'Registered point cloud (.E57), Revit model, floor plans, sections, and elevations to planning standard',
    outcome: 'Model accepted by conservation officer at first submission — used as basis for planning drawings and heritage impact assessment',
    services: ['Scan to BIM', 'Heritage Surveys'],
  },
  {
    tag: 'Contractor Phase BIM · Midlands',
    title: 'New-build residential development, 180 units',
    scope: 'Contractor BIM management across structural, MEP, and architectural disciplines during RIBA Stage 4–5',
    deliverables: 'Federated model, clash detection reports, information delivery schedule, handover data set',
    outcome: 'Coordination resolved 340 clashes before construction start — no BIM-related delays recorded during the build phase',
    services: ['Contractor Phase BIM', 'COBie & Handover'],
  },
]

export default function CaseStudies() {
  return (
    <div style={{ marginLeft: C.sidebarW, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Hero */}
      <section style={{ padding: '4.5rem 3.5rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '1rem' }}>Case Studies</div>
          <h1 style={{ ...T.h1, fontSize: '2rem', marginBottom: '1rem', maxWidth: '580px' }}>
            Projects we've delivered.
          </h1>
          <p style={{ fontSize: '0.9rem', color: C.muted, lineHeight: 1.85, maxWidth: '600px' }}>
            A selection of completed engagements across BIM consultancy and survey services. Detailed write-ups are in progress — full case studies with project documentation, outcomes, and client feedback will be published here.
          </p>
        </div>
      </section>

      {/* Projects */}
      <section style={{ padding: '3rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {PROJECTS.map((p, i) => (
              <div key={i} style={{
                background: C.bg, border: `1px solid ${C.border}`,
                borderRadius: '10px', padding: '2rem',
              }}>
                {/* Tag + coming soon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{
                    ...T.label, fontSize: '0.6rem',
                    background: C.accentBg, color: C.accent,
                    padding: '0.2rem 0.6rem', borderRadius: '4px',
                    border: `1px solid rgba(37,99,235,0.2)`,
                  }}>{p.tag}</span>
                  <span style={{
                    fontSize: '0.62rem', fontWeight: 600,
                    background: '#F4F4F5', color: C.muted,
                    padding: '0.2rem 0.6rem', borderRadius: '4px',
                    border: `1px solid ${C.border}`,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>Full write-up coming soon</span>
                </div>

                <h2 style={{ ...T.h2, fontSize: '1rem', marginBottom: '1.25rem' }}>{p.title}</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                  {[
                    { label: 'Scope', value: p.scope },
                    { label: 'Deliverables', value: p.deliverables },
                    { label: 'Outcome', value: p.outcome },
                  ].map((item, j) => (
                    <div key={j} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '7px', padding: '1rem' }}>
                      <div style={{ ...T.label, fontSize: '0.58rem', marginBottom: '0.4rem' }}>{item.label}</div>
                      <p style={{ fontSize: '0.75rem', color: C.muted, lineHeight: 1.6 }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {p.services.map((s, j) => (
                    <span key={j} style={{
                      background: C.surface, border: `1px solid ${C.border}`,
                      borderRadius: '4px', padding: '0.2rem 0.6rem',
                      fontSize: '0.65rem', color: C.muted, fontWeight: 500,
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '3.5rem 3.5rem 4rem', background: C.bg }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ ...T.label, marginBottom: '0.4rem' }}>Work with us</div>
            <h2 style={{ ...T.h2, marginBottom: '0.4rem' }}>Tell us about your project</h2>
            <p style={{ ...T.body, fontSize: '0.82rem' }}>
              We respond within one working day with a realistic assessment of what your project needs.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

    </div>
  )
}
