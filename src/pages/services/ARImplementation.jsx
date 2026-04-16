import { useState } from 'react'
import ServicePage from '../../components/ServicePage'
import { C, T } from '../../tokens'

const PHOTOS = [
  '/ar/gamma-ar-1.jpg',
  '/ar/gamma-ar-2.jpg',
  '/ar/gamma-ar-3.jpg',
  '/ar/gamma-ar-4.jpg',
  '/ar/gamma-ar-5.jpg',
  '/ar/gamma-ar-6.jpg',
]

function GammaARPartner() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <section style={{ padding: '3rem 3.5rem', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>

        {/* Partner label + badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ ...T.label, color: C.subtle }}>Our Partner</div>
          <span style={{
            display: 'inline-block', fontSize: '0.58rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            background: C.accentBg, color: C.accent,
            border: `1px solid rgba(37,99,235,0.2)`,
            padding: '0.18rem 0.55rem', borderRadius: '4px',
          }}>Gamma AR</span>
        </div>

        <h2 style={{ ...T.h2, marginBottom: '1rem' }}>Implemented with Gamma AR</h2>

        {/* Testimonial / intro */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderLeft: `3px solid ${C.accent}`,
          borderRadius: '8px', padding: '1.5rem 1.75rem',
          marginBottom: '2rem',
        }}>
          <p style={{ ...T.body, fontSize: '0.85rem', lineHeight: 1.8, marginBottom: '1rem' }}>
            Gamma AR is a solid, practical augmented reality product that we have implemented on projects and continue to recommend to our clients. It brings BIM models directly onto the construction site in a way that teams can actually use — without complex setup or specialist hardware requirements.
          </p>
          <p style={{ ...T.body, fontSize: '0.85rem', lineHeight: 1.8, marginBottom: '1rem' }}>
            We have seen first-hand how Gamma AR supports on-site decision-making, improves coordination between trades, and reduces the time teams spend interpreting 2D drawings in the field. What sets them apart is how consistently they develop the platform — new features are delivered regularly, and the team is genuinely responsive to real project feedback.
          </p>
          <p style={{ ...T.body, fontSize: '0.85rem', lineHeight: 1.8 }}>
            The customer service is exceptional. Gamma AR is a partner we trust and a product we are proud to offer as part of our AR implementation service.
          </p>
          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: C.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, color: C.accent }}>TR</span>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: C.text }}>Roberts Toprins</div>
              <div style={{ fontSize: '0.65rem', color: C.muted }}>Director, ToP-R Solutions</div>
            </div>
          </div>
        </div>

        {/* Photo grid */}
        <div style={{ ...T.label, marginBottom: '0.75rem', color: C.subtle }}>On-site implementation</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}>
          {PHOTOS.map((src, i) => (
            <button
              key={i}
              onClick={() => setLightbox(i)}
              style={{
                border: 'none', padding: 0, cursor: 'pointer',
                borderRadius: '8px', overflow: 'hidden',
                aspectRatio: '4/3', background: C.border,
                display: 'block', width: '100%',
              }}
            >
              <img
                src={src}
                alt={`Gamma AR on-site implementation — photo ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </button>
          ))}
        </div>

        <p style={{ ...T.small, marginTop: '0.75rem', color: C.subtle }}>
          Photos from a live Gamma AR implementation carried out by ToP-R Solutions.
        </p>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '88vh' }} onClick={e => e.stopPropagation()}>
            <img
              src={PHOTOS[lightbox]}
              alt={`Gamma AR photo ${lightbox + 1}`}
              style={{ maxWidth: '90vw', maxHeight: '84vh', borderRadius: '10px', display: 'block', objectFit: 'contain' }}
            />
            {/* Prev / Next */}
            {lightbox > 0 && (
              <button onClick={() => setLightbox(lightbox - 1)} style={{
                position: 'absolute', left: '-3rem', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%',
                width: '40px', height: '40px', cursor: 'pointer', color: '#fff', fontSize: '1rem',
              }}>‹</button>
            )}
            {lightbox < PHOTOS.length - 1 && (
              <button onClick={() => setLightbox(lightbox + 1)} style={{
                position: 'absolute', right: '-3rem', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%',
                width: '40px', height: '40px', cursor: 'pointer', color: '#fff', fontSize: '1rem',
              }}>›</button>
            )}
            {/* Close */}
            <button onClick={() => setLightbox(null)} style={{
              position: 'absolute', top: '-1.5rem', right: '-1.5rem',
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
              width: '32px', height: '32px', cursor: 'pointer', color: '#fff', fontSize: '0.9rem',
            }}>×</button>
          </div>
        </div>
      )}
    </section>
  )
}

export default function ARImplementation() {
  return (
    <ServicePage
      label="BIM Services · Augmented Reality"
      title="BIM Augmented Reality Implementation"
      tagline="Turn BIM into action on site with Augmented Reality. We help clients integrate AR across the project lifecycle — from technology selection and contractor agreement support to on-site deployment, training, and operational documentation. The result is faster decisions, less rework, and better coordination where it matters most: on site."
      serviceName="BIM AR Implementation"
      overview="BIM Augmented Reality Implementation is our specialist service for companies at any BIM maturity level that want to bring digital models into the field in a practical, usable way. We support the full process from product selection and pre-appointment contractor alignment through to field integration management, training, and site setup documentation, ensuring the AR solution is tailored to the client's workflow, project demands, and delivery environment. We believe heavily coordinated BIM projects should take full advantage of augmented reality, because it helps teams visualise design intent on site, reduce rework, improve accuracy, and streamline decision-making during construction. In larger and more complex projects, this creates a clear commercial benefit by improving coordination, reducing delays, and supporting smoother project delivery. For this reason, we strongly recommend AR implementation on highly coordinated projects where site clarity, sequencing, and fast decision-making are essential."
      deliveryPoints={[
        { title: 'Visualise design intent on site', body: 'AR overlays the coordinated BIM model onto the physical site environment, giving site teams a live view of design intent against actual conditions — before trades commit to position.' },
        { title: 'Reduce rework and delays', body: 'Issues identified on site in AR can be resolved before installation rather than after. On complex coordinated projects this directly reduces rework costs and programme delays.' },
        { title: 'Works at any BIM maturity level', body: 'Our implementation approach is calibrated to the client\'s current BIM maturity. We do not require a perfect model environment — we configure AR around what exists and build from there.' },
      ]}
      expectStages={[
        { stage: 'Technology selection and brief', desc: 'We review available AR platforms — Trimble XR10, HoloLens 2, GAMMA AR, Fologram, and others — against the project type, site environment, model quality, and team capability. A technology recommendation and implementation brief is produced.' },
        { stage: 'Pre-appointment contractor alignment', desc: 'AR expectations are embedded into the contractor appointment documentation and BEP — covering model delivery requirements, format standards, and on-site workflow responsibilities. Contractors understand what is expected before they mobilise.' },
        { stage: 'Model preparation and optimisation', desc: 'The BIM model is reviewed and optimised for AR deployment — file size, level of detail, coordinate system, and zone structure are configured for the chosen AR platform. A model that works in Revit does not automatically work in the field without preparation.' },
        { stage: 'Site setup and integration', desc: 'The AR system is configured, calibrated, and set up on site. Control points, coordinate alignment, and device configuration are established so the model overlays accurately with physical conditions from day one.' },
        { stage: 'Training and onboarding', desc: 'Site teams, foremen, and project managers receive hands-on training specific to the project environment and AR platform. We do not deliver generic AR training — sessions are built around the actual model, site, and workflow.' },
        { stage: 'Field integration management', desc: 'We remain available through the construction phase to support model updates, resolve alignment issues, assist with clash resolution in the field, and manage AR workflow as design changes are issued.' },
      ]}
      deliverables={[
        'Technology selection report', 'AR implementation brief', 'Pre-appointment AR requirements schedule', 'Model preparation and optimisation', 'Site control and coordinate setup', 'AR platform configuration', 'Team training sessions', 'Site setup documentation', 'Field integration management', 'Post-deployment review report',
      ]}
    >
      <GammaARPartner />
    </ServicePage>
  )
}
