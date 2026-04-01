import { useState } from 'react'
import { C, T } from '../tokens'

const allServices = [
  'Pre-appointment BIM',
  'Post-appointment BIM',
  'Onboarding',
  'Contractor Phase BIM',
  'COBie & Handover',
  'Digital Twin Readiness',
  'Remote Modelling',
  'Scan to BIM',
  'Heritage Survey',
  'Post-Processing',
  'As-Built Survey',
]

export default function ContactForm({ preSelected = '', isSurvey = false }) {
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '',
    projectType: '', size: '', stage: '', location: '',
    services: preSelected ? [preSelected] : [],
    timeline: '', standards: '', notes: '',
  })
  const [files, setFiles] = useState([])
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = e => {
    const picked = Array.from(e.target.files)
    setFiles(f => [...f, ...picked])
  }
  const removeFile = name => setFiles(f => f.filter(x => x.name !== name))

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleService = s => set('services',
    form.services.includes(s) ? form.services.filter(x => x !== s) : [...form.services, s]
  )

  const inputStyle = {
    width: '100%', padding: '0.55rem 0.75rem',
    border: `1px solid ${C.border}`, borderRadius: '6px',
    fontSize: '0.8rem', color: C.text, background: C.bg,
    outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle = { ...T.small, display: 'block', marginBottom: '0.3rem', color: C.muted, fontWeight: 600 }

  if (sent) return (
    <div style={{
      background: C.accentBg, border: `1px solid rgba(37,99,235,0.2)`,
      borderRadius: '10px', padding: '2.5rem', textAlign: 'center',
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✓</div>
      <div style={{ ...T.h3, marginBottom: '0.4rem' }}>Request received</div>
      <p style={{ ...T.body, fontSize: '0.78rem' }}>We'll review your project details and come back to you within one working day.</p>
    </div>
  )

  return (
    <div id="contact-form" style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '2rem' }}>
      <div style={{ ...T.label, marginBottom: '0.4rem' }}>Request an Estimate</div>
      <h3 style={{ ...T.h2, marginBottom: '0.25rem' }}>Tell us about your project</h3>
      <p style={{ ...T.body, marginBottom: '1.75rem', fontSize: '0.78rem' }}>
        Provide the details below and we'll prepare a realistic fee proposal, usually within one working day.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={labelStyle}>Your name *</label>
          <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" />
        </div>
        <div>
          <label style={labelStyle}>Company *</label>
          <input style={inputStyle} value={form.company} onChange={e => set('company', e.target.value)} placeholder="ABC Contractors Ltd" />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input style={inputStyle} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@company.com" />
        </div>
        <div>
          <label style={labelStyle}>Phone</label>
          <input style={inputStyle} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+44 7700 000000" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={labelStyle}>Project type *</label>
          <select style={inputStyle} value={form.projectType} onChange={e => set('projectType', e.target.value)}>
            <option value="">Select…</option>
            {['New build', 'Refurbishment', 'Infrastructure', 'Heritage', 'Mixed-use', 'Commercial', 'Residential', 'Industrial'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Approx. size (GIA / m²)</label>
          <input style={inputStyle} value={form.size} onChange={e => set('size', e.target.value)} placeholder="e.g. 3,500 m²" />
        </div>
        <div>
          <label style={labelStyle}>Current stage *</label>
          <select style={inputStyle} value={form.stage} onChange={e => set('stage', e.target.value)}>
            <option value="">Select…</option>
            {['Pre-appointment', 'RIBA 0–1', 'RIBA 2', 'RIBA 3', 'RIBA 4', 'RIBA 5 – Construction', 'RIBA 6 – Handover', 'Post-completion'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={labelStyle}>Project location</label>
          <input style={inputStyle} value={form.location} onChange={e => set('location', e.target.value)} placeholder="London / UK-wide / other" />
        </div>
        <div>
          <label style={labelStyle}>Required by (timeline)</label>
          <input style={inputStyle} value={form.timeline} onChange={e => set('timeline', e.target.value)} placeholder="e.g. Start April 2026" />
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Services required (select all that apply)</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.3rem' }}>
          {allServices.map(s => {
            const active = form.services.includes(s)
            return (
              <button key={s} onClick={() => toggleService(s)} style={{
                padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 500,
                border: `1px solid ${active ? C.accent : C.border}`,
                background: active ? C.accentBg : C.bg,
                color: active ? C.accent : C.muted,
                cursor: 'pointer', transition: 'all 0.12s',
              }}>{s}</button>
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Known standards or client BIM requirements</label>
        <input style={inputStyle} value={form.standards} onChange={e => set('standards', e.target.value)} placeholder="e.g. ISO 19650-2, EIR issued, BIM Level 2 required" />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Additional notes</label>
        <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical', fontFamily: 'inherit' }}
          value={form.notes} onChange={e => set('notes', e.target.value)}
          placeholder="Any other context that would help us scope the work…" />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={labelStyle}>Upload files (drawings, point cloud, plans — optional)</label>
        <label style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          border: `1px dashed ${C.border}`, borderRadius: '6px',
          padding: '0.75rem 1rem', cursor: 'pointer',
          background: C.surface, marginTop: '0.3rem',
        }}>
          <span style={{ fontSize: '0.75rem', color: C.muted }}>Click to browse or drag files here</span>
          <input type="file" multiple accept=".pdf,.dwg,.rvt,.ifc,.e57,.las,.laz,.zip,.png,.jpg"
            onChange={handleFiles} style={{ display: 'none' }} />
        </label>
        {files.length > 0 && (
          <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {files.map(f => (
              <span key={f.name} style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                background: C.accentBg, border: `1px solid rgba(37,99,235,0.2)`,
                borderRadius: '4px', padding: '0.2rem 0.5rem',
                fontSize: '0.68rem', color: C.accent,
              }}>
                {f.name}
                <button onClick={() => removeFile(f.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.accent, padding: 0, fontSize: '0.7rem', lineHeight: 1 }}>×</button>
              </span>
            ))}
          </div>
        )}
        <p style={{ ...T.small, marginTop: '0.35rem' }}>Accepted: PDF, DWG, RVT, IFC, E57, LAS, LAZ, ZIP, images. Max 50 MB per file.</p>
      </div>

      {error && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px',
          padding: '0.75rem 1rem', marginBottom: '1rem',
          fontSize: '0.78rem', color: '#DC2626',
        }}>{error}</div>
      )}
      <button
        onClick={async () => {
          if (!form.name || !form.email) {
            setError('Please provide your name and email address.')
            return
          }
          setError('')
          setSubmitting(true)
          try {
            const res = await fetch('/api/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(form),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.detail || 'Submission failed')
            setSent(true)
          } catch (e) {
            setError(e.message || 'Something went wrong. Please email us directly at info@top-rsolutions.co.uk')
          } finally {
            setSubmitting(false)
          }
        }}
        disabled={submitting}
        style={{
          background: submitting ? '#555' : '#111111', color: '#fff',
          border: 'none', borderRadius: '7px',
          padding: '0.7rem 2rem', fontSize: '0.8rem', fontWeight: 600,
          cursor: submitting ? 'not-allowed' : 'pointer', transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => { if (!submitting) e.currentTarget.style.opacity = '0.8' }}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        {submitting ? 'Sending…' : 'Submit project details'}
      </button>
      <p style={{ ...T.small, marginTop: '0.6rem' }}>We respond within one working day. No commitment required.</p>
    </div>
  )
}
