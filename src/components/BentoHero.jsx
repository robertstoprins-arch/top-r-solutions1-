import { useEffect, useRef, useState, useCallback } from 'react'

// ─── useWaterRipple hook ──────────────────────────────────────────────────────
function useWaterRipple() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    resize()

    let ripples = []
    const MAX_LIFETIME = 1200
    const MAX_RADIUS   = 60
    let lastSpawn = 0

    const onMove = (e) => {
      const now = performance.now()
      if (now - lastSpawn > 30) {
        ripples.push({ x: e.clientX, y: e.clientY, birth: now })
        lastSpawn = now
      }
    }
    document.addEventListener('mousemove', onMove)

    let rafId
    const render = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ripples = ripples.filter(r => {
        const age      = timestamp - r.birth
        if (age > MAX_LIFETIME) return false

        const progress = age / MAX_LIFETIME
        const easeOut  = 1 - Math.pow(1 - progress, 3)
        const radius   = Math.max(0, easeOut * MAX_RADIUS)
        const opacity  = 0.4 * (1 - progress)

        ctx.beginPath()
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(79, 70, 229, ${opacity})`
        ctx.lineWidth   = 1.5
        ctx.stroke()

        return true
      })

      rafId = requestAnimationFrame(render)
    }
    rafId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return canvasRef
}

// ─── useCounterAnimation hook ─────────────────────────────────────────────────
function useCounterAnimation(target, duration = 1600) {
  const [value, setValue] = useState(0)
  const [triggered, setTriggered] = useState(false)

  const trigger = useCallback(() => {
    if (triggered) return
    setTriggered(true)
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setValue(+(ease * target).toFixed(0))
      if (progress < 1) requestAnimationFrame(step)
      else setValue(target)
    }
    requestAnimationFrame(step)
  }, [triggered, target, duration])

  return { value, trigger, triggered }
}

// ─── BentoCard ────────────────────────────────────────────────────────────────
function BentoCard({ span, children, accent = false }) {
  const spanClass = {
    large:  { gridColumn: 'span 2', gridRow: 'span 2' },
    wide:   { gridColumn: 'span 2', gridRow: 'span 1' },
    tall:   { gridColumn: 'span 1', gridRow: 'span 2' },
    square: { gridColumn: 'span 1', gridRow: 'span 1' },
  }[span] || {}

  return (
    <div
      style={{
        ...spanClass,
        background: accent ? '#4F46E5' : '#FFFFFF',
        borderRadius: '28px',
        padding: '36px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        color: accent ? '#fff' : '#111111',
        transition: 'transform 0.4s cubic-bezier(0.25,1,0.5,1), box-shadow 0.4s cubic-bezier(0.25,1,0.5,1)',
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.07)'
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.03)'
      }}
    >
      {children}
    </div>
  )
}

// ─── CardAction ───────────────────────────────────────────────────────────────
function CardAction({ label, light = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      fontWeight: 600, fontSize: '0.82rem',
      color: light ? 'rgba(255,255,255,0.8)' : '#4F46E5',
      opacity: 0,
      transform: 'translateX(-12px)',
      transition: 'all 0.4s cubic-bezier(0.25,1,0.5,1)',
      // Revealed by parent :hover — handled via group hover with inline JS above
    }}
      className="card-action"
    >
      {label} →
    </div>
  )
}

// ─── BentoHero ────────────────────────────────────────────────────────────────
export default function BentoHero() {
  const canvasRef = useWaterRipple()
  const { value, trigger } = useCounterAnimation(70)
  const darkRef = useRef(null)
  const graphPathRef = useRef(null)

  // Intersection observer for the dark section
  useEffect(() => {
    const el = darkRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trigger()
          el.classList.add('bento-graph-visible')
        }
      },
      { threshold: 0.35 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [trigger])

  return (
    <>
      {/* ── Global styles ── */}
      <style>{`
        .card-action {
          opacity: 0 !important;
          transform: translateX(-12px) !important;
          transition: all 0.4s cubic-bezier(0.25,1,0.5,1) !important;
        }
        .bento-card-wrap:hover .card-action {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }

        .graph-path {
          fill: none;
          stroke: #F9F9F8;
          stroke-width: 3;
          stroke-dasharray: 2200;
          stroke-dashoffset: 2200;
          transition: none;
        }
        .bento-graph-visible .graph-path {
          animation: drawLine 2s cubic-bezier(0.25,1,0.5,1) forwards;
        }
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }

        .bento-root { }
      `}</style>

      {/* ── Water ripple canvas ── */}
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9998 }} />

      <div className="bento-root">

        {/* ── Bento grid section ── */}
        <section style={{
          padding: '80px 48px 0',
          background: '#F9F9F8',
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

            {/* ── BIM label ── */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px',
            }}>
              <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4F46E5' }}>
                BIM Services
              </div>
              <div style={{ flex: 1, height: '1px', background: '#E4E4E7' }} />
              <div style={{ fontSize: '0.58rem', color: '#aaa', letterSpacing: '0.06em' }}>ISO 19650 · UK BIM Framework</div>
            </div>

            {/* ── BIM cards ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridAutoRows: '200px',
              gap: '16px',
              marginBottom: '40px',
            }}>
              {/* BIM — Large: Standards */}
              <div className="bento-card-wrap" style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
                <BentoCard span="large">
                  <div>
                    <div style={{
                      display: 'inline-block', fontSize: '0.6rem', fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      background: '#EFF6FF', color: '#4F46E5',
                      padding: '0.2rem 0.55rem', borderRadius: '4px', marginBottom: '1rem',
                    }}>Pre-appointment to handover</div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '0.75rem', lineHeight: 1.1 }}>
                      BIM standards<br />built for your project.
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.65, maxWidth: '320px' }}>
                      Pre-appointment BEP, post-contract execution plan, coordination, and project-specific naming conventions — written for the contract, not copied from a template.
                    </p>
                  </div>
                  <CardAction label="View BIM Services" />
                </BentoCard>
              </div>

              {/* BIM — Wide: BIM Integration */}
              <div className="bento-card-wrap" style={{ gridColumn: 'span 2' }}>
                <BentoCard span="wide">
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                      BIM Integration &amp; Coordination
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.6 }}>
                      Revit workflows, model federation, and clash detection configured across the full design team. We step in at any stage.
                    </p>
                  </div>
                  <CardAction label="How We Work" />
                </BentoCard>
              </div>

              {/* BIM — Square: CDE (accent) */}
              <div className="bento-card-wrap">
                <BentoCard span="square" accent>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem', color: '#fff' }}>
                      CDE Setup
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>
                      ACC, BIM 360, or Aconex — structured from day one.
                    </p>
                  </div>
                </BentoCard>
              </div>

              {/* BIM — Square: Pre-appointment BEP */}
              <div className="bento-card-wrap">
                <BentoCard span="square">
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                      Pre-Appointment BEP
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.6 }}>
                      EIR review and pre-contract BEP — before appointment is issued.
                    </p>
                  </div>
                </BentoCard>
              </div>
            </div>

            {/* ── Survey label ── */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px',
            }}>
              <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7C3AED' }}>
                Survey Services
              </div>
              <div style={{ flex: 1, height: '1px', background: '#E4E4E7' }} />
              <div style={{ fontSize: '0.58rem', color: '#aaa', letterSpacing: '0.06em' }}>Leica RTC360 · Trimble X7</div>
            </div>

            {/* ── Survey cards ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridAutoRows: '200px',
              gap: '16px',
              paddingBottom: '80px',
            }}>
              {/* Survey — Tall: Scan to BIM */}
              <div className="bento-card-wrap" style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
                <BentoCard span="large">
                  <div>
                    <div style={{
                      display: 'inline-block', fontSize: '0.6rem', fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      background: '#F5F3FF', color: '#7C3AED',
                      padding: '0.2rem 0.55rem', borderRadius: '4px', marginBottom: '1rem',
                    }}>Point Cloud · LOD 300–400</div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '0.75rem', lineHeight: 1.1 }}>
                      Scan to BIM.<br />Full site in hours.
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.65, maxWidth: '320px' }}>
                      Leica RTC360 &amp; Trimble X7 — registered point cloud delivered direct to your model environment. LOD 300–400 verified output.
                    </p>
                  </div>
                  <CardAction label="View Survey Services" />
                </BentoCard>
              </div>

              {/* Survey — Wide: As-Built */}
              <div className="bento-card-wrap" style={{ gridColumn: 'span 2' }}>
                <BentoCard span="wide">
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                      As-Built Survey
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.6 }}>
                      Post-construction verification and handover data capture — structured for FM and future works. Delivered the same week.
                    </p>
                  </div>
                  <CardAction label="Learn More" />
                </BentoCard>
              </div>

              {/* Survey — Square: Heritage */}
              <div className="bento-card-wrap">
                <BentoCard span="square">
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                      Heritage Scan
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.6 }}>
                      ±1mm accuracy. Permanent digital archive.
                    </p>
                  </div>
                </BentoCard>
              </div>

              {/* Survey — Square: Future-proofing */}
              <div className="bento-card-wrap">
                <BentoCard span="square">
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                      Future-Proofing
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.6 }}>
                      Every survey structured for digital twin and FM integration from day one.
                    </p>
                  </div>
                </BentoCard>
              </div>
            </div>

          </div>
        </section>

        {/* ── Dark stats section ── */}
        <section
          ref={darkRef}
          style={{
            minHeight: '100vh',
            background: '#111111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            padding: '100px 24px',
          }}
        >
          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 2,
              textAlign: 'center',
            }}
          >
            <div style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: '#4F46E5', marginBottom: '1.5rem',
            }}>
              Project Outcomes
            </div>
            <div style={{
              fontSize: 'clamp(5rem, 12vw, 9rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: '#F9F9F8',
              marginBottom: '1rem',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {value}%
            </div>
            <div style={{
              fontSize: '1.1rem', fontWeight: 300,
              color: '#555', letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Missing pre-appointment BIM — our statistics
            </div>

            {/* Secondary stats */}
            <div style={{
              display: 'flex', gap: '4rem', marginTop: '4rem',
              borderTop: '1px solid #222', paddingTop: '3rem',
            }}>
              {[
                { v: '73%', l: 'Projects missing EIR at pre-appointment' },
                { v: '4 hrs', l: 'Average full-site scan capture' },
                { v: '98%', l: 'COBie-compliant deliverables' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#F9F9F8', letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>{s.v}</div>
                  <div style={{ fontSize: '0.72rem', color: '#444', maxWidth: '130px', lineHeight: 1.5 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SVG graph line */}
          <svg
            style={{
              position: 'absolute', bottom: 0, left: 0,
              width: '100%', height: '180px',
              opacity: 0.15, pointerEvents: 'none',
            }}
            preserveAspectRatio="none"
            viewBox="0 0 1000 180"
          >
            <path
              ref={graphPathRef}
              className="graph-path"
              d="M0,180 C100,180 200,60 350,90 C500,120 650,20 800,50 C900,70 950,40 1000,30"
            />
          </svg>
        </section>

      </div>
    </>
  )
}
