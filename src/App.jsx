import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import BentoHero from './components/BentoHero'
import ServicesIndex from './pages/ServicesIndex'
import PreAppointment from './pages/services/PreAppointment'
import PostAppointment from './pages/services/PostAppointment'
import Onboarding from './pages/services/Onboarding'
import ContractorPhase from './pages/services/ContractorPhase'
import CobieHandover from './pages/services/CobieHandover'
import DigitalTwinReadiness from './pages/services/DigitalTwinReadiness'
import RemoteModelling from './pages/services/RemoteModelling'
import ARImplementation from './pages/services/ARImplementation'
import About from './pages/About'
import SurveysIndex from './pages/SurveysIndex'
import ScanToBIMPage from './pages/surveys/ScanToBIM'
import HeritageSurveys from './pages/surveys/HeritagesurveyS'
import PostProcessing from './pages/surveys/PostProcessing'
import AsBuilt from './pages/surveys/AsBuilt'
import Resources from './pages/Resources'
import CaseStudies from './pages/CaseStudies'
import Iso19650Guide from './pages/resources/Iso19650Guide'
import PreAppointmentValue from './pages/resources/PreAppointmentValue'
import ScanToBIMGuide from './pages/resources/ScanToBIMGuide'
import ResponsibilityMatrix from './pages/resources/ResponsibilityMatrix'
import RFIDesk from './pages/tools/RFIDesk'
import AutomationIndex from './pages/tools/AutomationIndex'
import AppsIndex from './pages/tools/AppsIndex'
import LinkedInWriter from './pages/tools/LinkedInWriter'
import TidyBooks from './pages/tools/TidyBooks'
import ChatWidget from './components/ChatWidget'
import CursorDot from './components/CursorDot'
import { useReveal } from './hooks/useReveal'
import './App.css'

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#ffffff',
  surface: '#FAFAFA',
  border: '#E4E4E7',
  borderLight: '#F4F4F5',
  text: '#09090B',
  muted: '#71717A',
  subtle: '#A1A1AA',
  accent: '#2563EB',
  accentBg: '#EFF6FF',
  accentLight: 'rgba(37,99,235,0.08)',
  sidebar: '#FAFAFA',
  sidebarW: 248,
}

const T = {
  label: { fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3F3F46' },
  h1: { fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.025em', color: C.text, lineHeight: 1.2 },
  h2: { fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: C.text, lineHeight: 1.25 },
  h3: { fontSize: '0.875rem', fontWeight: 600, color: C.text, lineHeight: 1.3 },
  body: { fontSize: '0.775rem', color: C.muted, lineHeight: 1.75 },
  small: { fontSize: '0.7rem', color: C.subtle, lineHeight: 1.6 },
  nav: { fontSize: '0.775rem', fontWeight: 500 },
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
const Logo = ({ size = 36 }) => (
  <img
    src="/Top- r solutions background-removed-background-removed.png"
    alt="ToP-R Solutions"
    width={size}
    height={size}
    style={{ objectFit: 'contain', display: 'block' }}
    onError={e => {
      e.currentTarget.style.display = 'none'
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('width', size)
      svg.setAttribute('height', size)
      svg.setAttribute('viewBox', '0 0 120 120')
      svg.setAttribute('fill', 'none')
      svg.innerHTML = `
        <polygon points="60,10 108,36 60,62 12,36" stroke="#111" stroke-width="2" fill="none"/>
        <polygon points="12,36 12,80 60,106 60,62" stroke="#111" stroke-width="2" fill="none"/>
        <polygon points="108,36 108,80 60,106 60,62" stroke="#111" stroke-width="2" fill="none"/>
        <line x1="22" y1="54" x2="46" y2="41" stroke="#111" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="34" y1="47" x2="34" y2="88" stroke="#111" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="64" y1="42" x2="64" y2="82" stroke="#111" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M64 42 Q84 44 84 54 Q84 65 64 66" stroke="#111" stroke-width="2.8" fill="none" stroke-linecap="round"/>
        <line x1="66" y1="67" x2="85" y2="83" stroke="#111" stroke-width="2.8" stroke-linecap="round"/>
      `
      e.currentTarget.parentNode.replaceChild(svg, e.currentTarget)
    }}
  />
)

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const bimSubServices = [
  { path: '/services/pre-appointment',   label: 'Pre-Appointment BIM' },
  { path: '/services/post-appointment',  label: 'Post-Appointment BIM' },
  { path: '/services/onboarding',        label: 'Onboarding' },
  { path: '/services/contractor-phase',  label: 'Contractor Phase BIM' },
  { path: '/services/cobie-handover',    label: 'COBie & Handover' },
  { path: '/services/digital-twin',      label: 'Digital Twin Readiness' },
  { path: '/services/remote-modelling',  label: 'Remote Modelling' },
  { path: '/services/ar-implementation', label: 'BIM AR Implementation' },
]

const surveySubServices = [
  { path: '/surveys/scan-to-bim',    label: 'Scan to BIM' },
  { path: '/surveys/heritage',       label: 'Heritage Surveys' },
  { path: '/surveys/post-processing', label: 'Post-Processing' },
  { path: '/surveys/as-built',       label: 'As-Built Surveys' },
]

const resourcesSubItems = [
  { path: '/resources',     label: 'Resources & Guides' },
  { path: '/case-studies',  label: 'Case Studies' },
]

const automationSubItems = [
  { path: '/tools/rfi-desk',       label: 'RFI Desk' },
  { path: '/tools/linkedin-writer', label: 'LinkedIn Writer' },
  { path: '/tools/tidybooks',       label: 'TidyBooks' },
  { path: '/tools/apps',            label: 'AR SpotCheck & Apps' },
]

const appDevSubItems = [
  { path: '/services/ar-implementation', label: 'AR Implementation' },
]

function Sidebar({ active }) {
  const location = useLocation()
  const isServicePage = location.pathname.startsWith('/services')
  const isSurveyPage = location.pathname.startsWith('/surveys')
  const isResourcePage = location.pathname.startsWith('/resources') || location.pathname.startsWith('/case-studies')
  const isAutoPage = location.pathname.startsWith('/tools')
  const isAppDevPage = location.pathname === '/services/ar-implementation'
  const [bimOpen, setBimOpen] = useState(isServicePage)
  const [surveyOpen, setSurveyOpen] = useState(isSurveyPage)
  const [resourcesOpen, setResourcesOpen] = useState(isResourcePage)
  const [autoOpen, setAutoOpen] = useState(isAutoPage)
  const [appDevOpen, setAppDevOpen] = useState(isAppDevPage)

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0,
      width: C.sidebarW,
      background: C.sidebar,
      borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column',
      zIndex: 100, overflowY: 'auto',
    }}>
      {/* Brand */}
      <div style={{
        padding: '1.5rem 1.25rem 1.2rem',
        borderBottom: `1px solid ${C.border}`,
        background: '#ffffff',
      }}>
        <Link to="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
          <Logo size={60} />
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#111', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '0.6rem' }}>ToP-R Solutions</div>
          <div style={{ fontSize: '0.52rem', fontWeight: 400, color: '#B4B4B0', letterSpacing: '0.24em', textTransform: 'uppercase', marginTop: '0.25rem' }}>BIM · Survey · Automation</div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0' }}>

        {/* About */}
        <div style={{ marginBottom: '0.5rem' }}>
          <Link to="/" className={`snav-parent${location.pathname === '/' ? ' snav-active' : ''}`} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '0.55rem 1.25rem',
            fontSize: '0.7rem', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.05em',
            color: location.pathname === '/' ? C.text : C.muted,
            textDecoration: 'none',
            background: location.pathname === '/' ? '#F4F4F5' : 'transparent',
            borderRight: location.pathname === '/' ? `2px solid ${C.text}` : '2px solid transparent',
          }}>
            <span className="snav-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: location.pathname === '/' ? C.text : C.border, flexShrink: 0 }} />
            About
          </Link>
        </div>

        {/* BIM Services — parent with dropdown */}
        <div style={{ marginBottom: '0.25rem' }}>
          <div style={{ ...T.label, padding: '0.5rem 1.25rem 0.3rem', color: C.subtle }}>Services</div>

          {/* BIM Services parent row */}
          <button
            onClick={() => setBimOpen(o => !o)}
            className={`snav-parent${isServicePage ? ' snav-active' : ''}`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '0.5rem 1.25rem',
              background: isServicePage ? C.borderLight : 'transparent',
              border: 'none', borderRight: isServicePage ? `2px solid ${C.text}` : '2px solid transparent',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="snav-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: isServicePage ? C.text : C.border, flexShrink: 0 }} />
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', fontWeight: 600, color: isServicePage ? C.text : C.muted }}>
                BIM Services
              </span>
            </div>
            <span style={{ fontSize: '0.6rem', color: C.subtle, transition: 'transform 0.2s', display: 'inline-block', transform: bimOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
          </button>

          {/* Dropdown sub-services */}
          {bimOpen && (
            <div style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
              {bimSubServices.map(item => {
                const isCurrent = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`snav-sub${isCurrent ? ' snav-active' : ''}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '0.38rem 1.25rem 0.38rem 2rem',
                      fontSize: '0.68rem', fontWeight: isCurrent ? 600 : 400,
                      color: isCurrent ? C.text : C.muted,
                      textDecoration: 'none',
                      background: isCurrent ? C.borderLight : 'transparent',
                      borderRight: isCurrent ? `2px solid ${C.text}` : '2px solid transparent',
                    }}
                  >
                    <span className="snav-subdot" style={{ width: '3px', height: '3px', borderRadius: '50%', background: isCurrent ? C.text : C.border, flexShrink: 0 }} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Automation — dropdown */}
        <div style={{ marginBottom: '0.25rem', marginTop: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link
              to="/tools"
              className={`snav-parent${isAutoPage ? ' snav-active' : ''}`}
              style={{
                display: 'flex', alignItems: 'center', flex: 1,
                padding: '0.5rem 0.75rem 0.5rem 1.25rem',
                background: isAutoPage ? C.borderLight : 'transparent',
                borderRight: 'none',
                textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="snav-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: isAutoPage ? C.text : C.border, flexShrink: 0 }} />
                <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', fontWeight: 600, color: isAutoPage ? C.text : C.muted }}>
                  Automation
                </span>
              </div>
            </Link>
            <button
              onClick={() => setAutoOpen(o => !o)}
              style={{
                background: isAutoPage ? C.borderLight : 'transparent',
                border: 'none', borderRight: isAutoPage ? `2px solid ${C.text}` : '2px solid transparent',
                cursor: 'pointer', padding: '0.5rem 1.25rem 0.5rem 0.25rem',
                display: 'flex', alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '0.6rem', color: C.subtle, display: 'inline-block', transition: 'transform 0.2s', transform: autoOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
            </button>
          </div>

          {autoOpen && (
            <div style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
              {automationSubItems.map(item => {
                const isCurrent = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`snav-sub${isCurrent ? ' snav-active' : ''}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '0.38rem 1.25rem 0.38rem 2rem',
                      fontSize: '0.68rem', fontWeight: isCurrent ? 600 : 400,
                      color: isCurrent ? C.text : C.muted,
                      textDecoration: 'none',
                      background: isCurrent ? C.borderLight : 'transparent',
                      borderRight: isCurrent ? `2px solid ${C.text}` : '2px solid transparent',
                    }}
                  >
                    <span className="snav-subdot" style={{ width: '3px', height: '3px', borderRadius: '50%', background: isCurrent ? C.text : C.border, flexShrink: 0 }} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* App Development — dropdown */}
        <div style={{ marginBottom: '0.25rem', marginTop: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link
              to="/tools/apps"
              className={`snav-parent${isAppDevPage ? ' snav-active' : ''}`}
              style={{
                display: 'flex', alignItems: 'center', flex: 1,
                padding: '0.5rem 0.75rem 0.5rem 1.25rem',
                background: isAppDevPage ? C.borderLight : 'transparent',
                borderRight: 'none',
                textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="snav-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: isAppDevPage ? C.text : C.border, flexShrink: 0 }} />
                <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', fontWeight: 600, color: isAppDevPage ? C.text : C.muted }}>
                  App Development
                </span>
              </div>
            </Link>
            <button
              onClick={() => setAppDevOpen(o => !o)}
              style={{
                background: isAppDevPage ? C.borderLight : 'transparent',
                border: 'none', borderRight: isAppDevPage ? `2px solid ${C.text}` : '2px solid transparent',
                cursor: 'pointer', padding: '0.5rem 1.25rem 0.5rem 0.25rem',
                display: 'flex', alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '0.6rem', color: C.subtle, display: 'inline-block', transition: 'transform 0.2s', transform: appDevOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
            </button>
          </div>

          {appDevOpen && (
            <div style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
              {appDevSubItems.map(item => {
                const isCurrent = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`snav-sub${isCurrent ? ' snav-active' : ''}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '0.38rem 1.25rem 0.38rem 2rem',
                      fontSize: '0.68rem', fontWeight: isCurrent ? 600 : 400,
                      color: isCurrent ? C.text : C.muted,
                      textDecoration: 'none',
                      background: isCurrent ? C.borderLight : 'transparent',
                      borderRight: isCurrent ? `2px solid ${C.text}` : '2px solid transparent',
                    }}
                  >
                    <span className="snav-subdot" style={{ width: '3px', height: '3px', borderRadius: '50%', background: isCurrent ? C.text : C.border, flexShrink: 0 }} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Survey Services — dropdown */}
        <div style={{ marginBottom: '0.25rem', marginTop: '0.25rem' }}>
          <button
            onClick={() => setSurveyOpen(o => !o)}
            className={`snav-parent${isSurveyPage ? ' snav-active' : ''}`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '0.5rem 1.25rem',
              background: isSurveyPage ? C.borderLight : 'transparent',
              border: 'none', borderRight: isSurveyPage ? `2px solid ${C.text}` : '2px solid transparent',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="snav-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: isSurveyPage ? C.text : C.border, flexShrink: 0 }} />
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', fontWeight: 600, color: isSurveyPage ? C.text : C.muted }}>
                Survey Services
              </span>
            </div>
            <span style={{ fontSize: '0.6rem', color: C.subtle, display: 'inline-block', transition: 'transform 0.2s', transform: surveyOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
          </button>

          {surveyOpen && (
            <div style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
              {surveySubServices.map(item => {
                const isCurrent = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`snav-sub${isCurrent ? ' snav-active' : ''}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '0.38rem 1.25rem 0.38rem 2rem',
                      fontSize: '0.68rem', fontWeight: isCurrent ? 600 : 400,
                      color: isCurrent ? C.text : C.muted,
                      textDecoration: 'none',
                      background: isCurrent ? C.borderLight : 'transparent',
                      borderRight: isCurrent ? `2px solid ${C.text}` : '2px solid transparent',
                    }}
                  >
                    <span className="snav-subdot" style={{ width: '3px', height: '3px', borderRadius: '50%', background: isCurrent ? C.text : C.border, flexShrink: 0 }} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Resources — dropdown */}
        <div style={{ marginBottom: '0.25rem', marginTop: '0.25rem' }}>
          <button
            onClick={() => setResourcesOpen(o => !o)}
            className={`snav-parent${isResourcePage ? ' snav-active' : ''}`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '0.5rem 1.25rem',
              background: isResourcePage ? C.borderLight : 'transparent',
              border: 'none', borderRight: isResourcePage ? `2px solid ${C.text}` : '2px solid transparent',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="snav-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: isResourcePage ? C.text : C.border, flexShrink: 0 }} />
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', fontWeight: 600, color: isResourcePage ? C.text : C.muted }}>
                Resources
              </span>
            </div>
            <span style={{ fontSize: '0.6rem', color: C.subtle, transition: 'transform 0.2s', display: 'inline-block', transform: resourcesOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
          </button>
          {resourcesOpen && (
            <div style={{ paddingLeft: '0.25rem' }}>
              {resourcesSubItems.map(item => {
                const isActive = location.pathname === item.path || (item.path === '/resources' && location.pathname.startsWith('/resources/'))
                return (
                  <Link key={item.path} to={item.path} className={`snav-sub${isActive ? ' snav-active' : ''}`} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '0.45rem 1.25rem 0.45rem 1.5rem',
                    fontSize: '0.72rem', fontWeight: isActive ? 600 : 400,
                    color: isActive ? C.text : C.muted,
                    textDecoration: 'none',
                    background: isActive ? C.borderLight : 'transparent',
                    borderRight: isActive ? `2px solid ${C.text}` : '2px solid transparent',
                  }}>
                    <span className="snav-subdot" style={{ width: '4px', height: '4px', borderRadius: '50%', background: isActive ? C.text : C.border, flexShrink: 0 }} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

      </nav>

      {/* CTA */}
      <div style={{ padding: '1rem 1.25rem', borderTop: `1px solid ${C.border}` }}>
        <a href="/#contact-form" style={{
          display: 'block', textAlign: 'center',
          background: '#111111', color: '#fff',
          padding: '0.55rem', borderRadius: '6px',
          fontSize: '0.75rem', fontWeight: 600,
          textDecoration: 'none', transition: 'opacity 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >Book a Discovery Call</a>
      </div>
    </aside>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ id, children, style = {} }) {
  const ref = useReveal()
  return (
    <section id={id} ref={ref} className="reveal" style={{
      padding: '3.5rem 3rem',
      borderBottom: `1px solid ${C.border}`,
      background: C.bg,
      ...style,
    }}>
      <div style={{ maxWidth: '900px' }}>
        {children}
      </div>
    </section>
  )
}

function SectionHeader({ label, title, subtitle }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ ...T.label, marginBottom: '0.5rem' }}>{label}</div>
      <h2 style={{ ...T.h2, marginBottom: subtitle ? '0.5rem' : 0 }}>{title}</h2>
      {subtitle && <p style={{ ...T.body, maxWidth: '520px' }}>{subtitle}</p>}
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
const pipelineStages = [
  { label: 'Pre-Appt', full: 'Pre-Appointment', tip: 'EIR authored, scope defined, BEP issued before contract is signed' },
  { label: 'BEP', full: 'BEP', tip: 'Post-contract BEP — roles, deliverables, model breakdown agreed' },
  { label: 'CDE', full: 'CDE Setup', tip: 'Common Data Environment configured — ACC, BIM360, or Aconex' },
  { label: 'Coordination', full: 'Coordination', tip: 'Federated model reviews, clash detection, design-stage sign-off' },
  { label: 'Scan', full: 'Scan to BIM', tip: 'Point cloud capture → LOD 300–400 verified as-existing model' },
  { label: 'Handover', full: 'Handover', tip: 'COBie-compliant O&M dataset, digital twin-ready asset data' },
]

function Hero() {
  const [active, setActive] = useState(null)
  return (
    <section id="hero" style={{ padding: '3.5rem 3rem 2.5rem', background: C.bg, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: '900px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
          {/* Left */}
          <div>
            <div className="hero-headline" style={{
              display: 'inline-block', ...T.label,
              background: C.accentBg, padding: '0.2rem 0.6rem',
              borderRadius: '4px', border: `1px solid rgba(37,99,235,0.2)`,
              marginBottom: '1.25rem',
            }}>BIM Consultancy · London & UK-wide</div>
            <h1 className="hero-headline" style={{ ...T.h1, marginBottom: '1rem' }}>
              Standards-driven delivery.<br />
              <span style={{ color: C.accent }}>Appointment to handover.</span>
            </h1>
            <p className="hero-sub" style={{ ...T.body, marginBottom: '2rem', maxWidth: '380px' }}>
              We embed BIM standards into every project phase — eliminating rework, protecting margins, and ensuring every deliverable traces back to an employer's information requirement.
            </p>
            <div className="hero-ctas" style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="#contact" style={{
                background: C.accent, color: '#fff',
                padding: '0.55rem 1.25rem', borderRadius: '6px',
                fontSize: '0.775rem', fontWeight: 600, textDecoration: 'none',
              }}>Book a Discovery Call</a>
              <a href="#what-we-do" style={{
                color: C.muted, border: `1px solid ${C.border}`,
                padding: '0.55rem 1.25rem', borderRadius: '6px',
                fontSize: '0.775rem', fontWeight: 500, textDecoration: 'none',
              }}>View Services ↓</a>
            </div>
          </div>

          {/* Right */}
          <div>
            <div style={{ ...T.small, marginBottom: '0.75rem', color: C.subtle }}>
              Project lifecycle — hover each stage
            </div>
            {/* Pipeline */}
            <div style={{ display: 'flex', gap: '3px', marginBottom: '1.5rem' }}>
              {pipelineStages.map((s, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  style={{
                    flex: 1, padding: '0.4rem 0.2rem', borderRadius: '5px',
                    textAlign: 'center', cursor: 'default',
                    background: active === i ? '#111111' : C.surface,
                    border: `1px solid ${active === i ? '#111111' : C.border}`,
                    transition: 'all 0.15s', position: 'relative',
                  }}
                >
                  <div style={{
                    fontSize: '0.6rem', fontWeight: 600,
                    color: active === i ? '#fff' : C.muted,
                    whiteSpace: 'nowrap',
                  }}>{s.label}</div>
                  {active === i && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 6px)', left: '50%',
                      transform: 'translateX(-50%)',
                      background: C.text, color: '#fff',
                      padding: '0.4rem 0.65rem', borderRadius: '5px',
                      fontSize: '0.65rem', width: '160px',
                      textAlign: 'center', zIndex: 20, lineHeight: 1.5,
                      pointerEvents: 'none', fontWeight: 400,
                    }}>{s.tip}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {[
                { v: '73%', l: 'Projects missing EIR at pre-appointment — our statistics' },
                { v: '70%', l: 'Missing out on pre-appointment BIM — according to our statistics' },
                { v: '4 hrs', l: 'Avg full-site point cloud capture' },
                { v: 'ISO 19650', l: 'Every deliverable, every stage' },
              ].map((m, i) => (
                <div key={i} style={{
                  background: C.surface, border: `1px solid ${C.border}`,
                  borderRadius: '7px', padding: '0.85rem',
                }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: C.accent, letterSpacing: '-0.02em' }}>{m.v}</div>
                  <div style={{ ...T.small, marginTop: '0.2rem' }}>{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Trust strip ──────────────────────────────────────────────────────────────
function TrustStrip() {
  const items = ['ISO 19650', 'UK BIM Framework', 'Revit', 'Navisworks', 'ACC', 'BIM 360', 'Aconex', 'Leica RTC360', 'Trimble X7']
  return (
    <div style={{
      background: C.bg, borderBottom: `1px solid ${C.border}`,
      padding: '0.7rem 3rem', display: 'flex', gap: '1.75rem',
      alignItems: 'center', overflowX: 'auto',
    }}>
      <span style={{ ...T.label, color: C.subtle, whiteSpace: 'nowrap', flexShrink: 0 }}>Compatible</span>
      <div style={{ width: '1px', height: '12px', background: C.border, flexShrink: 0 }} />
      {items.map(item => (
        <span key={item} style={{ fontSize: '0.72rem', color: C.subtle, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}>{item}</span>
      ))}
    </div>
  )
}

// ─── What We Do ───────────────────────────────────────────────────────────────
const bimServices = [
  { title: 'Pre-Appointment BEP', tag: 'Standards', desc: 'EIR review, scope definition and pre-contract BEP authored before appointment is issued. Protects project margin from day one.', std: 'ISO 19650-2', del: 'Pre-contract BEP · EIR · Responsibility Matrix' },
  { title: 'Post-Appointment BEP', tag: 'Standards', desc: 'Detailed execution plan aligned to contract — model breakdown, deliverable schedule, and TIDP agreed with the full supply chain.', std: 'ISO 19650-2', del: 'Post-contract BEP · MIDP · TIDP' },
  { title: 'BIM Standards', tag: 'Standards', desc: 'Project-specific naming conventions, classification, model breakdown structure and information delivery milestones — written for the project, not copied from a template.', std: 'ISO 19650 · UK BIM Framework', del: 'Standards Package · Classification · Naming' },
  { title: 'BIM Integration', tag: 'Integration', desc: 'Revit workflows configured across the full design team — model federation, clash detection, and coordination established from day one.', std: 'ISO 19650-2', del: 'Federated Workflow · Integration Map' },
  { title: 'CDE Setup', tag: 'Infrastructure', desc: 'Common Data Environment structured from day one — ACC, BIM 360, or Aconex configured, folder structure defined, team onboarded and trained.', std: 'ISO 19650-3', del: 'CDE Configuration · Team Onboarding' },
]

const surveyServices = [
  { title: 'Scan to BIM', tag: 'Survey', desc: 'Leica RTC360 and Trimble X7 point cloud capture converted to LOD 300–400 verified models. Full site captured in hours, not days.', std: 'PAS 1192-2', del: 'Point Cloud · Registered Model · BIM Export' },
  { title: 'As-Built Survey', tag: 'Survey', desc: 'Post-construction verification and handover data capture. Dataset structured for FM and future works.', std: 'BS 8536', del: 'Handover Record · O&M Dataset · Survey Report' },
  { title: 'Heritage Scan', tag: 'Survey', desc: 'Millimetre-accurate capture of listed and historic structures. Permanent digital archive for conservation, planning submissions, and future refurbishment.', std: 'Historic England · BS 7913', del: 'High-Fidelity Scan · Georeferenced Record' },
]

// Keep combined for any legacy references
const services = [...bimServices, ...surveyServices]

const tagStyle = {
  Standards:     { bg: '#EFF6FF', fg: '#1D4ED8' },
  Integration:   { bg: '#F0FDF4', fg: '#15803D' },
  Infrastructure:{ bg: '#FFF7ED', fg: '#C2410C' },
  Survey:        { bg: '#F5F3FF', fg: '#7C3AED' },
}

function WhatWeDo() {
  const [hov, setHov] = useState(null)
  return (
    <Section id="what-we-do" style={{ background: C.surface }}>
      <SectionHeader
        label="Services"
        title="What We Do"
        subtitle="Project-specific standards. Every service is configured to the employer's information requirements, the contract, and the supply chain."
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        {bimServices.map((s, i) => {
          const ts = tagStyle[s.tag]
          return (
            <div key={i}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
              style={{
                background: C.bg, borderRadius: '8px', padding: '1.25rem',
                border: `1px solid ${hov === i ? C.accent : C.border}`,
                boxShadow: hov === i ? `0 0 0 3px ${C.accentLight}` : 'none',
                transition: 'all 0.15s', cursor: 'default',
              }}>
              <div style={{
                display: 'inline-block', fontSize: '0.58rem', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                background: ts.bg, color: ts.fg,
                padding: '0.15rem 0.45rem', borderRadius: '3px', marginBottom: '0.7rem',
              }}>{s.tag}</div>
              <h3 style={{ ...T.h3, marginBottom: '0.4rem' }}>{s.title}</h3>
              <p style={{ ...T.body, marginBottom: '0.85rem', fontSize: '0.75rem' }}>{s.desc}</p>
              <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: '0.7rem' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 600, color: C.accent, marginBottom: '0.15rem' }}>{s.std}</div>
                <div style={{ fontSize: '0.62rem', color: C.subtle }}>{s.del}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Standards callout */}
      <div style={{
        marginTop: '1.5rem',
        background: C.accentBg, borderLeft: `3px solid ${C.accent}`,
        borderRadius: '0 7px 7px 0', padding: '1.25rem 1.5rem',
      }}>
        <h3 style={{ ...T.h3, marginBottom: '0.4rem' }}>No two projects share the same information requirements</h3>
        <p style={{ ...T.body, color: '#3B5BDB', fontSize: '0.75rem', maxWidth: '700px' }}>
          Generic BIM templates cost projects money. We develop project-specific standards — tailored to the employer's information requirements, the contract type, the supply chain capability, and the intended operational use. This is what enables margin protection: standards that are actually followed because they are actually proportionate.
        </p>
      </div>

      {/* Automation callout */}
      <div style={{
        marginTop: '0.75rem',
        background: C.surface, borderLeft: `3px solid ${C.border}`,
        borderRadius: '0 7px 7px 0', padding: '1.25rem 1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem',
      }}>
        <div>
          <h3 style={{ ...T.h3, marginBottom: '0.3rem' }}>We also automate the tasks that slow project teams down</h3>
          <p style={{ ...T.body, fontSize: '0.75rem', maxWidth: '600px' }}>
            Material price checking, RFI tracking, information delivery monitoring — built as tools for specific problems, not general-purpose dashboards. Available to clients alongside any engagement.
          </p>
        </div>
        <a href="/tools" style={{
          flexShrink: 0, fontSize: '0.75rem', fontWeight: 600, color: C.text,
          textDecoration: 'none', borderBottom: `1.5px solid ${C.text}`, paddingBottom: '1px', whiteSpace: 'nowrap',
        }}>See automation tools →</a>
      </div>
    </Section>
  )
}

// ─── How We Work ──────────────────────────────────────────────────────────────
const steps = [
  { n: '01', title: 'Define Project Requirements', body: "We establish the Employer's Information Requirements — what data is needed, when, in what format, and to what level of detail. All downstream decisions trace back to this document." },
  { n: '02', title: 'Audit Existing Setup', body: 'We review the current model environment, CDE configuration, naming conventions, software stack, and team capability. Gaps are mapped against the EIR before any configuration begins.' },
  { n: '03', title: 'Configure', body: 'CDE is structured, naming standards issued, model breakdown and zone structure defined, software integrations tested. The environment is built before the team enters it.' },
  { n: '04', title: 'Embed', body: 'Standards are introduced to the project team with working examples, not slide decks. We remain available throughout delivery to maintain compliance and resolve coordination issues as they arise.' },
]

function HowWeWork() {
  return (
    <Section id="how-we-work">
      <SectionHeader
        label="How We Work"
        title="BIM integration from any stage"
        subtitle="We step into projects at any point — pre-appointment, mid-design, or pre-handover — and build a standards-compliant workflow around what already exists."
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
        {steps.map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: C.borderLight, letterSpacing: '-0.04em', marginBottom: '0.6rem' }}>{s.n}</div>
            <div style={{ width: '20px', height: '2px', background: C.accent, marginBottom: '0.75rem' }} />
            <h3 style={{ ...T.h3, marginBottom: '0.5rem' }}>{s.title}</h3>
            <p style={{ ...T.body, fontSize: '0.75rem' }}>{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ─── What Gets Missed ─────────────────────────────────────────────────────────
const insights = [
  { pct: '73%', label: 'No EIR at pre-appointment', body: "Projects begin without a defined Employer's Information Requirements. Consultants interpret scope independently — deliverables drift, variations accumulate at every stage." },
  { pct: '68%', label: 'No pre-contract BEP issued', body: "Projects proceed to appointment without agreeing roles, deliverable formats, or model responsibilities. Disputes begin at the first model submission." },
  { pct: '61%', label: 'CDE configured after work begins', body: 'The Common Data Environment set up after mobilisation. Files shared by email create version conflicts that persist throughout the project lifecycle.' },
  { pct: '64%', label: 'Design team lacks BIM capability', body: 'At least one design discipline joins without BIM training. A single non-federated model breaks coordination for the entire team.' },
  { pct: '57%', label: 'No clash detection before issue', body: 'Construction information released without coordination review. Most clashes that delay the programme were visible in the model weeks earlier.' },
  { pct: '52%', label: 'No survey of existing conditions', body: 'Projects on existing structures proceed without verified as-built baseline. Geometry assumptions are the leading cause of abortive work on site.' },
  { pct: '71%', label: 'As-built assembled retrospectively', body: 'Handover records compiled from drawings after the fact. The result cannot be relied on for FM or future works.' },
  { pct: '66%', label: 'Post-appointment BEP never updated', body: 'Post-contract BEP signed off at mobilisation and never revised. Standards drift silently across the delivery team.' },
]

function WhatGetsMissed() {
  const [hov, setHov] = useState(null)
  return (
    <Section id="what-gets-missed" style={{ background: C.surface }}>
      <SectionHeader
        label="BIM Insights"
        title="What Gets Missed"
        subtitle="Industry patterns across UK construction projects. Each figure represents projects where this practice was absent at the critical stage."
      />

      {/* Featured card */}
      <div style={{
        background: C.bg, border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${C.accent}`,
        borderRadius: '0 8px 8px 0', padding: '1.75rem',
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '2rem', alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: '3.5rem', fontWeight: 700, color: C.accent, letterSpacing: '-0.05em', lineHeight: 1 }}>73%</div>
            <div style={{ ...T.h3, marginTop: '0.4rem' }}>No EIR at pre-appointment</div>
          </div>
          <div>
            <p style={{ ...T.body, fontSize: '0.8rem', marginBottom: '0.6rem' }}>
              If scope is not defined before appointment, the consultant defines it for you.
            </p>
            <p style={{ ...T.body, fontSize: '0.75rem', marginBottom: '0.85rem' }}>
              This is the most commercially damaging gap in BIM practice. Every standard, deliverable, and cost assumption flows from the EIR. A consultant operating without a scoped EIR will interpret requirements to suit their existing workflow — and bill accordingly.
            </p>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: C.accent }}>
              → We write the EIR before appointment is issued.
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
        {insights.slice(1).map((ins, i) => (
          <div key={i}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
            style={{
              background: C.bg, borderRadius: '8px', padding: '1.25rem',
              border: `1px solid ${hov === i ? C.accent : C.border}`,
              transition: 'border-color 0.15s',
            }}>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: C.accent, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '0.3rem' }}>{ins.pct}</div>
            <div style={{ ...T.h3, fontSize: '0.78rem', marginBottom: '0.4rem' }}>{ins.label}</div>
            <p style={{ ...T.body, fontSize: '0.72rem' }}>{ins.body}</p>
          </div>
        ))}
      </div>

      <p style={{ ...T.small, textAlign: 'center', marginTop: '2rem', fontStyle: 'italic' }}>
        "Most of these failures are preventable at pre-appointment. None are visible until it is too late to avoid the cost."
      </p>
    </Section>
  )
}

// ─── Commercial Impact ────────────────────────────────────────────────────────
const failureData = [
  { label: 'Late-stage design clashes on site', pct: 88 },
  { label: 'No scan-to-BIM for existing conditions', pct: 82 },
  { label: 'Missing / incorrect handover data', pct: 74 },
  { label: 'No CDE — email versioning', pct: 67 },
  { label: 'No BEP at pre-appointment', pct: 60 },
  { label: 'Uncoordinated MEP in structural zones', pct: 54 },
  { label: 'PM / design team — no BIM awareness', pct: 46 },
  { label: 'Poorly classified model', pct: 38 },
]

const winData = [
  { label: 'Pre-appointment BEP', pct: 60 },
  { label: 'CDE from day one', pct: 45 },
  { label: 'Clash detection in design', pct: 70 },
  { label: 'Scan-to-BIM for existing', pct: 80 },
  { label: 'BIM-aware PM oversight', pct: 55 },
  { label: 'Compliant naming', pct: 90 },
  { label: 'BIM specialist pre-appt', pct: 65 },
]

const ChartTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: C.bg, border: `1px solid ${C.border}`, padding: '0.4rem 0.7rem', borderRadius: '5px', fontSize: '0.72rem', color: C.text }}>
      <span style={{ fontWeight: 600 }}>{payload[0].value}%</span>
    </div>
  )
}

function CommercialImpact() {
  return (
    <Section id="commercial-impact">
      <SectionHeader label="Analysis" title="Commercial Impact" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
        <div>
          <div style={{ ...T.label, marginBottom: '0.4rem' }}>Where Projects Lose Margin</div>
          <h3 style={{ ...T.h3, marginBottom: '0.3rem' }}>Top BIM failures by commercial impact</h3>
          <p style={{ ...T.small, marginBottom: '1.5rem' }}>Relative commercial impact index — UK construction projects</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={failureData} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke={C.borderLight} />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="label" width={195} tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} cursor={{ fill: C.surface }} />
              <Bar dataKey="pct" radius={[0, 3, 3, 0]}>
                {failureData.map((_, i) => (
                  <Cell key={i} fill={i < 3 ? C.accent : `rgba(37,99,235,${0.75 - i * 0.07})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div style={{ ...T.label, marginBottom: '0.4rem' }}>Where BIM Setup Wins</div>
          <h3 style={{ ...T.h3, marginBottom: '0.3rem' }}>Error reduction by BIM intervention</h3>
          <p style={{ ...T.small, marginBottom: '1.5rem' }}>A BIM specialist at design stage is the single highest-leverage intervention</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={winData} margin={{ left: 0, right: 0, top: 0, bottom: 50 }}>
              <CartesianGrid vertical={false} stroke={C.borderLight} />
              <XAxis dataKey="label" tick={{ fontSize: 9.5, fill: C.muted }} axisLine={false} tickLine={false} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<ChartTip />} cursor={{ fill: C.surface }} />
              <Bar dataKey="pct" radius={[3, 3, 0, 0]} fill={C.accent} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Outcomes row */}
      <div style={{ marginTop: '2.5rem' }}>
        <div style={{ ...T.label, marginBottom: '1rem' }}>Project Outcomes</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.6rem' }}>
          {[
            { v: '70%', l: 'Missing pre-appointment BIM — our statistics' },
            { v: '60%', l: 'Fewer information requests' },
            { v: '4 hrs', l: 'Avg full-site capture' },
            { v: '98%', l: 'COBie-compliant deliverables' },
            { v: 'ISO 19650', l: 'Every stage, every deliverable' },
          ].map((m, i) => (
            <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '7px', padding: '1rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: C.accent, letterSpacing: '-0.02em' }}>{m.v}</div>
              <div style={{ ...T.small, marginTop: '0.2rem' }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── BIM / Surveys divider ────────────────────────────────────────────────────
function SectionDivider() {
  return (
    <div style={{
      background: '#111111', padding: '2.5rem 3rem',
      display: 'flex', alignItems: 'center', gap: '2rem',
    }}>
      <div style={{ flex: 1, height: '1px', background: '#2a2a2a' }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555', marginBottom: '0.35rem' }}>
          Survey Services
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#F9F9F8', letterSpacing: '-0.02em' }}>
          Scan to BIM · As-Built · Future-Proofing
        </div>
      </div>
      <div style={{ flex: 1, height: '1px', background: '#2a2a2a' }} />
    </div>
  )
}

// ─── Scan to BIM ──────────────────────────────────────────────────────────────
const scanCases = [
  { title: 'Heritage & Listed Buildings', out: 'Permanent digital record — no re-survey required', desc: 'Millimetre-accurate capture for digital archive, planning submissions, and conservation documentation.' },
  { title: 'Pre-Fabrication Facades', out: 'Zero facade clash at installation', desc: 'As-built structure captured before panel manufacture — tolerances verified in model before factory production begins.' },
  { title: 'Complex Steel Coordination', out: 'Programme delays avoided', desc: 'Post-erection steel scan feeds directly into the structural coordination model. Fabrication deviations surfaced before cladding begins.' },
  { title: 'MEP Services Coordination', out: '70% fewer last-minute coordination changes', desc: 'Point cloud model used to route mechanical, electrical, and plumbing services in congested zones. Conflicts resolved in the model, not on site.' },
  { title: 'Main Contractor As-Built', out: 'Handover-ready dataset, same week', desc: 'Full site captured in a single session — progress monitoring, snagging, handover dataset, and O&M records in one deliverable.' },
  { title: 'Mechanical Plant Rooms', out: 'No site surprises during construction', desc: 'Dense geometry capture of existing MEP for refurbishment or extension. Access, clearance, and zone conflicts identified before design begins.' },
]

function ScanToBIM() {
  const [hov, setHov] = useState(null)
  return (
    <Section id="scan-to-bim" style={{ background: C.surface }}>
      <SectionHeader
        label="Surveying"
        title="One scan session. A complete digital record."
        subtitle="The Leica RTC360 and Trimble X7 capture full-site geometry in hours. Coordinating services against a point cloud model before construction begins removes the single biggest source of last-minute delays on complex projects."
      />

      {/* Survey service cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
        {surveyServices.map((s, i) => {
          const ts = tagStyle[s.tag]
          return (
            <div key={i} style={{
              background: C.bg, borderRadius: '8px', padding: '1.25rem',
              border: `1px solid ${C.border}`, cursor: 'default',
            }}>
              <div style={{
                display: 'inline-block', fontSize: '0.58rem', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                background: ts.bg, color: ts.fg,
                padding: '0.15rem 0.45rem', borderRadius: '3px', marginBottom: '0.7rem',
              }}>{s.tag}</div>
              <h3 style={{ ...T.h3, marginBottom: '0.4rem' }}>{s.title}</h3>
              <p style={{ ...T.body, marginBottom: '0.85rem', fontSize: '0.75rem' }}>{s.desc}</p>
              <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: '0.7rem' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 600, color: C.accent, marginBottom: '0.15rem' }}>{s.std}</div>
                <div style={{ fontSize: '0.62rem', color: C.subtle }}>{s.del}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Equipment */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
        {[
          { name: 'Leica RTC360', specs: ['360° HDR imaging', 'Up to 2M pts/sec', 'Indoor & outdoor', '±1mm accuracy'] },
          { name: 'Trimble X7', specs: ['Long-range survey-grade', 'Self-levelling', 'Sub-mm resolution', 'Automated registration'] },
        ].map((eq, i) => (
          <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ ...T.label, marginBottom: '0.3rem' }}>Equipment</div>
            <div style={{ ...T.h3, marginBottom: '0.75rem' }}>{eq.name}</div>
            {eq.specs.map((sp, j) => (
              <div key={j} style={{ ...T.body, fontSize: '0.72rem', marginBottom: '0.2rem', display: 'flex', gap: '0.45rem' }}>
                <span style={{ color: C.accent, flexShrink: 0 }}>—</span>{sp}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Use cases */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        {scanCases.map((uc, i) => (
          <div key={i}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
            style={{
              background: C.bg, borderRadius: '8px', padding: '1.25rem',
              border: `1px solid ${hov === i ? C.accent : C.border}`,
              transition: 'border-color 0.15s',
            }}>
            <h3 style={{ ...T.h3, fontSize: '0.8rem', marginBottom: '0.4rem' }}>{uc.title}</h3>
            <p style={{ ...T.body, fontSize: '0.72rem', marginBottom: '0.85rem' }}>{uc.desc}</p>
            <div style={{ fontSize: '0.68rem', color: C.accent, fontWeight: 500 }}>↗ {uc.out}</div>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ─── As-Built & Surveys ────────────────────────────────────────────────────────
function DigitalTwin() {
  return (
    <Section id="as-built-surveys">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
        <div>
          <div style={{ ...T.label, marginBottom: '0.5rem' }}>Future-Proofing</div>
          <h2 style={{ ...T.h2, marginBottom: '1rem' }}>Your survey model is the foundation.<br />Future-proof from the point of capture.</h2>
          <p style={{ ...T.body, marginBottom: '0.85rem' }}>
            On sites with complex mechanical plant — boiler rooms, substations, air handling units, HVAC distribution, building management systems — a static BIM model is only the beginning. A digital twin connects that model to real-time sensor data, maintenance schedules, and operational telemetry, creating a single intelligent source of truth for the entire facility lifecycle.
          </p>
          <p style={{ ...T.body, marginBottom: '1.5rem' }}>
            Models built without digital twin intent are expensive to retrofit. We configure every BIM deliverable — attributes, classification, COBie data, spatial hierarchies — so that the path to a live digital twin is direct, not rebuilt from scratch. Whether you are targeting Autodesk Tandem, Bentley iTwin, or a custom IoT integration, the model we deliver is structured to connect.
          </p>
          <a href="#contact" style={{
            display: 'inline-block', color: C.accent, border: `1px solid ${C.accent}`,
            padding: '0.5rem 1rem', borderRadius: '6px',
            fontSize: '0.75rem', fontWeight: 500, textDecoration: 'none',
          }}>Discuss Digital Twin Strategy →</a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {[
            { t: 'Sensor-ready attribution', d: 'Every asset attributed for live data binding — ready for BMS, IoT, and CAFM integration without model rework.' },
            { t: 'Operational integration', d: 'Connects to building management systems, facilities management platforms, and IoT sensor networks from day one.' },
            { t: 'Lifecycle value', d: 'Predictive maintenance, energy performance monitoring, and regulatory compliance — all driven by the same model delivered at handover.' },
            { t: 'Open standards output', d: 'IFC 4 and COBie-structured data ensures no vendor lock-in — your digital twin is portable and future-proof.' },
          ].map((item, i) => (
            <div key={i} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: '8px', padding: '1.1rem',
            }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: C.accent, marginTop: '3px', flexShrink: 0 }} />
                <div>
                  <div style={{ ...T.h3, fontSize: '0.8rem', marginBottom: '0.25rem' }}>{item.t}</div>
                  <div style={{ ...T.body, fontSize: '0.72rem' }}>{item.d}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── Document Standards & Sharing Regulations ─────────────────────────────────
const cdeStates = [
  { state: 'WIP', label: 'Work in Progress', color: '#F59E0B', desc: 'Author-owned files in personal work areas. No shared access until formally issued. Prevents premature coordination on incomplete information.' },
  { state: 'S', label: 'Shared', color: '#2563EB', desc: 'Issued for coordination within the project team. Subject to suitability review. Accessible to relevant disciplines for clash detection and coordination.' },
  { state: 'P', label: 'Published', color: '#059669', desc: 'Approved for construction or for contract. Information frozen at this status. Forms the contract baseline — changes require formal revision control.' },
  { state: 'A', label: 'Archive', color: '#71717A', desc: 'Superseded information retained for audit trail. Never deleted — ISO 19650-3 requires full version history for regulatory and legal compliance.' },
]

function DocumentStandards() {
  return (
    <Section id="document-standards" style={{ background: C.surface }}>
      <SectionHeader
        label="Document Sharing · Regulations"
        title="Information Management & CDE Compliance"
        subtitle="Every document, model, and data exchange on a ToP-R Solutions project is governed by ISO 19650 protocols. Information is controlled, auditable, and issued at the correct suitability status."
      />

      {/* CDE states */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ ...T.label, marginBottom: '1rem', color: C.subtle }}>Common Data Environment — information states</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
          {cdeStates.map((s, i) => (
            <div key={i} style={{
              background: C.bg, border: `1px solid ${C.border}`,
              borderTop: `3px solid ${s.color}`,
              borderRadius: '0 0 8px 8px', padding: '1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <span style={{
                  width: '22px', height: '22px', borderRadius: '4px',
                  background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>{s.state}</span>
                <span style={{ ...T.h3, fontSize: '0.78rem' }}>{s.label}</span>
              </div>
              <p style={{ ...T.body, fontSize: '0.72rem' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Naming convention */}
      <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' }}>
        <h3 style={{ ...T.h3, marginBottom: '0.75rem' }}>ISO 19650 Naming Convention</h3>
        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: C.text, background: C.surface, padding: '0.85rem 1rem', borderRadius: '6px', marginBottom: '0.75rem', letterSpacing: '0.03em' }}>
          [Project]-[Originator]-[Volume/System]-[Level]-[Type]-[Role]-[Number]_[Status]_[Revision]
        </div>
        <p style={{ ...T.body, fontSize: '0.72rem' }}>
          Every file name is machine-readable and human-readable. Naming is defined in the pre-contract BEP and enforced through CDE validation rules — preventing the ad-hoc naming that makes version control fail.
        </p>
      </div>

      {/* Regulations grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        {[
          {
            title: 'Access Control & Permissions',
            std: 'ISO 19650-3',
            points: [
              'Role-based access per discipline',
              'WIP containers — author access only',
              'Published containers — read-only for team',
              'No sharing outside CDE without formal issue',
              'Admin audit log for all access changes',
            ],
          },
          {
            title: 'Version Control & Audit Trail',
            std: 'ISO 19650-2 / BS EN ISO 19650',
            points: [
              'Full revision history retained in CDE',
              'Superseded files moved to Archive — never deleted',
              'Every issue carries date, author, and suitability code',
              'Transmittals issued for every formal exchange',
              'Change log maintained in MIDP',
            ],
          },
          {
            title: 'Data Security & GDPR Alignment',
            std: 'UK GDPR / ISO 27001 alignment',
            points: [
              'No personally identifiable data in model files',
              'CDE access via SSO — no shared credentials',
              'Third-party access reviewed at each project stage',
              'Data residency: UK-based CDE servers',
              'Project data retained per contract requirements',
            ],
          },
          {
            title: 'Structured Data for Handover',
            std: 'COBie UK 2012 / BS 8536',
            points: [
              'COBie spreadsheet validated before handover',
              'Asset attributes mapped to FM system fields',
              'Spaces, systems, and components classified to Uniclass',
              'Warranties and O&M documents linked to assets',
              'IFC export verified against COBie mapping',
            ],
          },
          {
            title: 'Model File Exchange',
            std: 'IFC 4 / ISO 16739',
            points: [
              'IFC used for inter-disciplinary exchange',
              'No proprietary format required by supply chain',
              'Export settings validated per discipline',
              'Federated model assembled in Navisworks / BIM Collab',
              'Open BIM workflow — no software lock-in',
            ],
          },
          {
            title: 'Information Delivery Planning',
            std: 'ISO 19650-2',
            points: [
              'MIDP issued at post-contract BEP',
              'TIDP agreed with every discipline',
              'Delivery milestones tied to programme dates',
              'Information containers scheduled and tracked',
              'Non-compliance escalated before milestone date',
            ],
          },
        ].map((block, i) => (
          <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, color: C.accent, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{block.std}</div>
            <h3 style={{ ...T.h3, fontSize: '0.8rem', marginBottom: '0.75rem' }}>{block.title}</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {block.points.map((p, j) => (
                <li key={j} style={{ ...T.body, fontSize: '0.7rem', marginBottom: '0.25rem', display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                  <span style={{ color: C.accent, flexShrink: 0, marginTop: '1px' }}>·</span>{p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ─── Contact / CTA ────────────────────────────────────────────────────────────
function Contact() {
  return (
    <Section id="contact">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
        <div>
          <div style={{ ...T.label, marginBottom: '0.5rem' }}>Get Started</div>
          <h2 style={{ ...T.h2, marginBottom: '0.85rem' }}>Ready to protect your project margins?</h2>
          <p style={{ ...T.body, marginBottom: '1.5rem', maxWidth: '360px' }}>
            We start with a 30-minute discovery call — structured around your project's information requirements. No pitch deck. No slide show.
          </p>
          <a href="mailto:hello@topr-solutions.com" style={{
            display: 'inline-block', background: C.accent, color: '#fff',
            padding: '0.6rem 1.4rem', borderRadius: '6px',
            fontSize: '0.775rem', fontWeight: 600, textDecoration: 'none',
          }}>Book a Discovery Call</a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {[
            { q: 'When can you start?', a: 'We can begin a pre-appointment BEP or audit within 5 working days of a scoping call.' },
            { q: 'Can you step into an active project?', a: 'Yes. We audit the existing setup, identify gaps, and configure around what is already in place — without disrupting delivery.' },
            { q: 'Do you provide scanning services directly?', a: 'Yes. We own Leica RTC360 and Trimble X7 equipment and deliver registered point cloud data and BIM export in-house.' },
            { q: 'What size of project do you work on?', a: 'From single-building refurbishments to multi-phase programmes. Standards are proportionate to the project — we do not apply enterprise process to a small job.' },
          ].map((item, i) => (
            <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '7px', padding: '1rem' }}>
              <div style={{ ...T.h3, fontSize: '0.775rem', marginBottom: '0.3rem' }}>{item.q}</div>
              <p style={{ ...T.body, fontSize: '0.72rem' }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      padding: '1.5rem 3rem',
      background: C.surface,
      borderTop: `1px solid ${C.border}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Logo size={28} />
        <span style={{ fontSize: '0.775rem', fontWeight: 600, color: C.text }}>ToP-R <span style={{ fontWeight: 400, color: C.muted }}>Solutions</span></span>
      </div>
      <div style={{ fontSize: '0.68rem', color: C.subtle }}>© 2026 ToP-R Solutions · ISO 19650 · UK BIM Framework</div>
      <div style={{ display: 'flex', gap: '1.25rem' }}>
        {['What We Do', 'How We Work', 'Scan to BIM', 'Contact'].map(l => (
          <a key={l} href="#" style={{ fontSize: '0.7rem', color: C.subtle, textDecoration: 'none' }}>{l}</a>
        ))}
      </div>
    </footer>
  )
}

// ─── Active section tracking ──────────────────────────────────────────────────
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const observers = ids.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])
  return active
}

// ─── App ──────────────────────────────────────────────────────────────────────
const sectionIds = ['what-we-do', 'how-we-work', 'what-gets-missed', 'commercial-impact', 'scan-to-bim', 'as-built-surveys', 'document-standards']

function HomePage({ active }) {
  return (
    <>
      <BentoHero />
      <div style={{ display: 'flex' }}>
        <main style={{ marginLeft: C.sidebarW, flex: 1, minHeight: '100vh' }}>
          <Hero />
          <TrustStrip />
          <WhatWeDo />
          <HowWeWork />
          <WhatGetsMissed />
          <CommercialImpact />
          <SectionDivider />
          <ScanToBIM />
          <DigitalTwin />
          <DocumentStandards />
          <Contact />
          <Footer />
        </main>
      </div>
    </>
  )
}

export default function App() {
  const active = useActiveSection(sectionIds)
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: C.bg }}>
      <Sidebar active={active} />
      <CursorDot />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/home" element={<HomePage active={active} />} />
        <Route path="/services" element={<ServicesIndex />} />
        <Route path="/services/pre-appointment"  element={<PreAppointment />} />
        <Route path="/services/post-appointment" element={<PostAppointment />} />
        <Route path="/services/onboarding"       element={<Onboarding />} />
        <Route path="/services/contractor-phase" element={<ContractorPhase />} />
        <Route path="/services/cobie-handover"   element={<CobieHandover />} />
        <Route path="/services/digital-twin"     element={<DigitalTwinReadiness />} />
        <Route path="/services/remote-modelling"  element={<RemoteModelling />} />
        <Route path="/services/ar-implementation" element={<ARImplementation />} />
        <Route path="/surveys" element={<SurveysIndex />} />
        <Route path="/surveys/scan-to-bim"     element={<ScanToBIMPage />} />
        <Route path="/surveys/heritage"         element={<HeritageSurveys />} />
        <Route path="/surveys/post-processing"  element={<PostProcessing />} />
        <Route path="/surveys/as-built"         element={<AsBuilt />} />
        <Route path="/resources"                element={<Resources />} />
        <Route path="/resources/iso-19650"      element={<Iso19650Guide />} />
        <Route path="/resources/pre-appointment-value" element={<PreAppointmentValue />} />
        <Route path="/resources/scan-to-bim-guide"     element={<ScanToBIMGuide />} />
        <Route path="/case-studies"             element={<CaseStudies />} />
        <Route path="/tools"                     element={<AutomationIndex />} />
        <Route path="/tools/rfi-desk" element={<RFIDesk />} />
        <Route path="/tools/linkedin-writer" element={<LinkedInWriter />} />
        <Route path="/tools/apps"               element={<AppsIndex />} />
        <Route path="/tools/tidybooks"          element={<TidyBooks />} />
        <Route path="/resources/responsibility-matrix"  element={<ResponsibilityMatrix />} />
      </Routes>
      <ChatWidget />
    </div>
  )
}
