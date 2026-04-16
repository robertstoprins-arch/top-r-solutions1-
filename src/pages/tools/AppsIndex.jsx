import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { C, T } from '../../tokens'
import ContactForm from '../../components/ContactForm'

// ─── AR Dev Photo Gallery ─────────────────────────────────────────────────────
const AR_DEV_PHOTOS = Array.from({ length: 11 }, (_, i) => `/ar-dev/ar-dev-${i + 1}.jpg`)

function ARDevGallery() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <section style={{ padding: '3rem 2rem', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ ...T.label, marginBottom: '0.75rem', color: C.subtle }}>AR in the field</div>
        <h2 style={{ ...T.h2, marginBottom: '1rem' }}>Augmented reality, live on site.</h2>
        <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.8, marginBottom: '1.75rem', maxWidth: '600px' }}>
          These are shots from live AR implementations carried out by ToP-R Solutions — BIM models overlaid directly onto live construction environments. This is what the technology looks like in practice, not in a product demo.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {AR_DEV_PHOTOS.map((src, i) => (
            <button key={i} onClick={() => setLightbox(i)} style={{
              border: 'none', padding: 0, cursor: 'pointer',
              borderRadius: '8px', overflow: 'hidden',
              aspectRatio: '4/3', background: C.border, display: 'block', width: '100%',
            }}>
              <img src={src} alt={`AR on site — photo ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </button>
          ))}
        </div>
        <p style={{ ...T.small, marginTop: '0.75rem', color: C.subtle }}>
          Live AR implementations — ToP-R Solutions projects.
        </p>
      </div>

      {lightbox !== null && (
        <div onClick={() => setLightbox(null)} style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.88)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
        }}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '88vh' }} onClick={e => e.stopPropagation()}>
            <img src={AR_DEV_PHOTOS[lightbox]} alt={`AR development photo ${lightbox + 1}`}
              style={{ maxWidth: '90vw', maxHeight: '84vh', borderRadius: '10px', display: 'block', objectFit: 'contain' }}
            />
            {lightbox > 0 && (
              <button onClick={() => setLightbox(lightbox - 1)} style={{
                position: 'absolute', left: '-3rem', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%',
                width: '40px', height: '40px', cursor: 'pointer', color: '#fff', fontSize: '1rem',
              }}>‹</button>
            )}
            {lightbox < AR_DEV_PHOTOS.length - 1 && (
              <button onClick={() => setLightbox(lightbox + 1)} style={{
                position: 'absolute', right: '-3rem', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%',
                width: '40px', height: '40px', cursor: 'pointer', color: '#fff', fontSize: '1rem',
              }}>›</button>
            )}
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AppsIndex() {
  return (
    <div style={{ marginLeft: C.sidebarW, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Helmet>
        <title>AR SpotCheck — BIM Augmented Reality App — ToP-R Solutions</title>
        <meta name="description" content="AR SpotCheck — purpose-built iPhone app overlaying BIM models at 1:1 scale on live construction sites. Final testing stage. 10–20mm detection sensitivity using iPhone LiDAR." />
      </Helmet>

      {/* ── Hero ── */}
      <section style={{ padding: '4.5rem 2rem 3.5rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ ...T.label }}>App Development · Site & Field Intelligence</div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              background: '#FEF3C7', color: '#92400E',
              border: '1px solid #FCD34D',
              padding: '0.2rem 0.6rem', borderRadius: '4px',
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
              Final Testing
            </span>
          </div>
          <h1 style={{ ...T.h1, fontSize: '2.2rem', marginBottom: '1.25rem', lineHeight: 1.15 }}>
            BIM models on your phone.<br />On site. At 1:1 scale.
          </h1>
          <p style={{ fontSize: '0.92rem', color: C.muted, lineHeight: 1.88, marginBottom: '1rem' }}>
            AR SpotCheck is a purpose-built iPhone application that overlays pre-loaded BIM models onto live construction sites using iPhone LiDAR hardware. Site engineers and quality inspectors see design intent aligned to the physical structure — in the field, offline, without setup complexity.
          </p>
          <p style={{ fontSize: '0.92rem', color: C.muted, lineHeight: 1.88, marginBottom: '1.75rem' }}>
            We are currently in final testing. The application has completed internal development and is being validated on live construction sites before wider distribution.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#contact" style={{
              display: 'inline-block', background: C.text, color: '#fff',
              padding: '0.62rem 1.4rem', borderRadius: '7px',
              fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none',
            }}>Request early access</a>
            <a href="#specs" style={{
              fontSize: '0.78rem', fontWeight: 600, color: C.text,
              textDecoration: 'none', borderBottom: `1.5px solid ${C.text}`, paddingBottom: '1px',
            }}>View specifications ↓</a>
          </div>
        </div>
      </section>

      {/* ── Photo Gallery ── */}
      <ARDevGallery />

      {/* ── AR SpotCheck Spec ── */}
      <section id="specs" style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ ...T.label, marginBottom: '0.4rem' }}>AR SpotCheck</div>
              <h2 style={{ ...T.h2, fontSize: '1.5rem', marginBottom: '0.4rem' }}>Application Specification</h2>
              <p style={{ fontSize: '0.82rem', color: C.muted, fontStyle: 'italic' }}>
                Version 2.2 — Final testing stage — iOS / iPhone LiDAR
              </p>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', flexShrink: 0,
              fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D',
              padding: '0.35rem 0.85rem', borderRadius: '5px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
              Final Testing — TestFlight
            </span>
          </div>

          {/* Key specs grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '2.5rem' }}>
            {[
              { label: 'Platform', value: 'iOS 16+', sub: 'iPhone 12 Pro or later (LiDAR required)' },
              { label: 'Detection target', value: '10 – 20 mm', sub: 'Sensitivity at 1–3 m range' },
              { label: 'Operation', value: 'Fully offline', sub: 'No cloud, no accounts, no connectivity' },
              { label: 'Alignment method', value: '3-point wizard', sub: 'Grid intersections, column bases, slab corners' },
              { label: 'Accuracy', value: '~10 mm at 1 m', sub: 'Manual alignment ceiling — LiDAR device' },
              { label: 'Distribution', value: 'TestFlight / MDM', sub: 'Internal — no App Store submission required' },
            ].map((s, i) => (
              <div key={i} style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: '8px', padding: '1.1rem 1.25rem',
              }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.subtle, marginBottom: '0.35rem' }}>{s.label}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: C.text, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{s.value}</div>
                <div style={{ fontSize: '0.7rem', color: C.muted, lineHeight: 1.5 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ ...T.label, marginBottom: '0.75rem', color: C.subtle }}>How it works</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                {
                  n: '01',
                  title: 'Load & select',
                  body: 'Project packages are transferred to the device via AirDrop or MDM. The engineer selects the project and building level. The BIM model loads locally — no internet required at any stage.',
                },
                {
                  n: '02',
                  title: 'Align',
                  body: 'The 3-point alignment wizard guides the engineer to known physical reference points — grid intersections, column bases, slab corners. The app solves a 2D yaw transform and locks the model to the site. Typical alignment takes under two minutes.',
                },
                {
                  n: '03',
                  title: 'Inspect',
                  body: 'The BIM model is rendered as a semi-transparent ghost overlay directly in the camera view at 1:1 scale. Engineers visually compare design intent against built conditions and apply the deviation classification standard.',
                },
              ].map((s, i) => (
                <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 800, color: C.accent, letterSpacing: '0.08em', marginBottom: '0.6rem' }}>Step {s.n}</div>
                  <h3 style={{ ...T.h3, marginBottom: '0.4rem' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.76rem', color: C.muted, lineHeight: 1.75, margin: 0 }}>{s.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Deviation classification */}
          <div style={{ background: '#111111', borderRadius: '10px', padding: '1.75rem 2rem', marginBottom: '2.5rem', color: '#fff' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.6rem' }}>Deviation classification standard</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>A consistent language for site deviations.</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { range: '< 10 mm', label: 'Acceptable', color: '#22C55E', desc: 'Within construction tolerance for most elements. No action required.' },
                { range: '10 – 20 mm', label: 'Monitor', color: '#F59E0B', desc: 'Document and re-check. May be within spec depending on element type and contract.' },
                { range: '> 20 mm', label: 'Non-conformance', color: '#EF4444', desc: 'Formal issue to be raised with contractor. Requires resolution before sign-off.' },
              ].map((d, i) => (
                <div key={i} style={{ borderTop: `2px solid ${d.color}`, paddingTop: '0.85rem' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: d.color, letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>{d.range}</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>{d.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#888', lineHeight: 1.65 }}>{d.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities list */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ ...T.label, marginBottom: '0.75rem', color: C.subtle }}>Key capabilities</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { title: 'Offline-first', body: 'All models, alignments, and data stored locally. No network required at any point — including on site with no signal.' },
                { title: 'LiDAR alignment', body: 'iPhone LiDAR enables mesh-based raycasting for tap accuracy. ARWorldMap saved per level — alignment auto-restores on app re-open.' },
                { title: 'Ghost model rendering', body: 'Semi-transparent BIM overlay (adjustable 10–100% opacity) lets engineers see design and physical simultaneously in the same view.' },
                { title: 'Drift monitoring', body: 'Active tracking quality monitor alerts the engineer when ARKit drift exceeds 15 mm — before accuracy is lost, not after.' },
                { title: 'Alignment nudge panel', body: '±1 mm / ±5 mm translation and ±0.1° / ±0.5° yaw adjustment for fine-tuning after the main alignment wizard.' },
                { title: 'Auto-contrast', body: 'Ghost model colour adapts to ambient light conditions automatically — from bright direct sun (dark saturated blue) to dark interior (bright near-white).' },
                { title: 'Scale validation', body: 'Pre-solve check catches IFC unit mismatches (mm exported as m) before the engineer commits to an incorrect alignment.' },
                { title: '4-point fallback', body: 'When one reference point is inaccessible (scaffold, exclusion zone), the app selects the best 3-of-4 point combination automatically.' },
              ].map((f, i) => (
                <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '1rem 1.1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: C.text, marginBottom: '0.3rem' }}>{f.title}</div>
                  <div style={{ fontSize: '0.73rem', color: C.muted, lineHeight: 1.7 }}>{f.body}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Testing status */}
          <div style={{
            background: C.accentBg, border: `1px solid rgba(37,99,235,0.2)`,
            borderRadius: '8px', padding: '1.25rem 1.5rem',
          }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: C.accent, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Current status — Final Testing</div>
            <p style={{ fontSize: '0.82rem', color: C.text, lineHeight: 1.75, margin: 0 }}>
              AR SpotCheck has completed internal development (Spec v2.2). The application is currently in final testing on live construction sites, validating alignment accuracy, drift behaviour, and site usability across a range of building types and conditions. TestFlight distribution is active for internal testers. If you would like to discuss early access or a pilot on your project, contact us below.
            </p>
          </div>
        </div>
      </section>

      {/* ── Why purpose-built ── */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.4rem' }}>Why purpose-built matters</div>
          <h2 style={{ ...T.h2, marginBottom: '1rem' }}>Generic tools fit no specific workflow particularly well.</h2>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.88, marginBottom: '1rem' }}>
            There are general-purpose AR viewers. There are BIM viewers with mobile clients. They share a common problem: built for the broadest possible use case, they require configuration work that exceeds what a site team has time for, and they depend on connectivity that construction sites rarely provide reliably.
          </p>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.88 }}>
            AR SpotCheck is built for one job: accurate, offline BIM overlay on a live construction site. Every design decision — the 2D-only alignment solver, the LiDAR raycast filter, the auto-contrast ghost model, the offline storage model — exists because of a specific failure mode we encountered and eliminated during real site use.
          </p>
        </div>
      </section>

      {/* ── Also see ── */}
      <section style={{ padding: '2.5rem 2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text, marginBottom: '0.25rem' }}>Also from ToP-R</div>
            <div style={{ fontSize: '0.78rem', color: C.muted }}>BIM AR Implementation — we implement Gamma AR and other AR platforms for clients on live projects.</div>
          </div>
          <Link to="/services/ar-implementation" style={{
            fontSize: '0.78rem', fontWeight: 600, color: C.text,
            textDecoration: 'none', borderBottom: `1.5px solid ${C.text}`, paddingBottom: '1px', flexShrink: 0,
          }}>See AR Implementation →</Link>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" style={{ padding: '3.5rem 2rem 4.5rem' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ ...T.label, marginBottom: '0.4rem' }}>Get in touch</div>
          <h2 style={{ ...T.h2, marginBottom: '0.75rem' }}>Request early access or a pilot.</h2>
          <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.75, maxWidth: '520px', marginBottom: '2rem' }}>
            If you have an upcoming project where accurate on-site BIM overlay would be valuable — particularly coordinated schemes where site clarity and fast decision-making matter — tell us about it and we'll discuss whether AR SpotCheck is the right fit.
          </p>
          <ContactForm />
        </div>
      </section>

    </div>
  )
}
