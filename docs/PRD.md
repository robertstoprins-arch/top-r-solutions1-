# ToP-R Solutions — Product Requirements Document

## What ToP-R Is

A BIM consultancy and practical PM automation practice. Small, founder-led team headed by Roberts Toprins. Operates worldwide. Engages directly with clients — no account managers, no junior handoffs.

**Two distinct pillars:**
1. **BIM Consultancy** — project-specific standards, EIRs, BEPs, CDE setup, coordination. Every standard is written for the project, not adapted from a template. Heavy standards do not help every project.
2. **PM Automation** — targeted tools for repetitive project management tasks (RFI tracking, material price checking). Not automation for its own sake. Not dashboards. Specific tools for specific problems.

**Critical distinction**: BIM standards and EIRs are NOT automated. They are written by hand, project-specifically. Only repetitive PM tasks (tracking, validation, checking) are automated.

## Primary Goals of the Website

1. **Lead generation** — get serious enquiries from developers, architects, and contractors
2. **Credibility signalling** — prove expertise before a call is booked
3. **Service explanation** — make complex BIM/survey services understandable to non-specialists
4. **Worldwide reach** — not limited to UK or UAE. Global client base.

## Target Users

| User type | Pain point | What they need from the site |
|---|---|---|
| Developers & Employers | No EIR before appointment, scope creep, margin loss | Pre-appointment BIM services, Responsibility Matrix |
| Design Teams & Architects | ISO 19650 compliance, coordination, CDE setup | Onboarding, BIM standards, remote modelling |
| Main Contractors | Contractor phase BIM, clash detection, COBie handover | Contractor phase, COBie, scan-to-BIM |

## Services

### BIM Services (8)
- Pre-Appointment BIM — EIR, scope definition, pre-contract BEP
- Post-Appointment BIM — detailed execution plan, MIDP, TIDP
- Onboarding — ISO 19650 team onboarding
- Contractor Phase BIM — contractor-side delivery
- COBie & Handover — compliant O&M dataset
- Digital Twin Readiness — sensor-ready attribution, IFC4, COBie
- Remote Modelling — design support
- BIM AR Implementation — augmented reality for BIM

### Survey Services (4)
- Scan to BIM — Leica RTC360 + Trimble X7, LOD 300-400
- Heritage Surveys — listed buildings, millimetre-accurate
- Post-Processing — point cloud processing
- As-Built Surveys — post-construction verification

### Automation Tools (2)
- Material Price Checker — live price comparison across suppliers
- RFI Desk — RFI management, escalation tracking, programme impact

## Key Differentiators

- **Pre-appointment focus** — most competitors engage post-appointment; ToP-R engages before
- **Responsibility Matrix** — defined at pre-appointment stage in BEP, developed post-appointment. Eliminates design gaps, dependencies, and rework. Proactive coordination approach.
- **Project-specific** — never template-based
- **Small team** — Roberts oversees every engagement directly
- **Proportionate standards** — minimal standards that work, not enterprise process on small jobs

## Design Direction

- Black and white only. No colour accents in interactive UI (indigo, purple, green, teal all removed).
- `C.accent = #2563EB` used only for data/charts, never for buttons or hover states.
- Clean, minimal, professional. Signals established consultancy, not startup.
- Sidebar navigation. Fixed left panel, 248px wide.
- Inter font throughout.
- Scroll reveal animations — subtle, purposeful.
- Custom cursor dot on desktop.

## Non-Goals

- No e-commerce or payment processing
- No client portal or authenticated area
- No automated BIM standard generation (BIM standards are written manually)
- No template downloads
- No CMS — content is hardcoded in React components
- No multi-language support

## Content Tone

- Professional but direct. No jargon without explanation.
- Confident without being salesy.
- Insight-based — data and statistics to support claims.
- "Small team" positioning is a feature, not an apology.
- Worldwide positioning — do not limit to UK or UAE.
