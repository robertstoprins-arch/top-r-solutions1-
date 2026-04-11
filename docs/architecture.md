# ToP-R Solutions — Architecture

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19.2.4, React Router DOM 7.13.2, Vite 8.0.1 |
| Charts | Recharts 3.8.0 |
| Backend | Node.js serverless (Vercel functions) |
| AI | Groq API via `api/chat.js` |
| Email | Nodemailer 8.0.4 |
| Python tools | Web scrapers (Selenium/BS4), report generation |
| Deployment | Vercel (primary), Netlify (legacy backup) |

## Design System

- **Colours**: Black/white only. No indigo, purple, green, or teal in interactive states.
- **Tokens**: `src/tokens.js` exports `C` (colour tokens) and `T` (typography tokens)
  - `C.text = #09090B`, `C.muted = #71717A`, `C.border = #E4E4E7`, `C.borderLight = #F4F4F5`
  - `C.accent = #2563EB` (charts/data only — not interactive UI)
- **Styles**: Inline styles throughout. No CSS modules. CSS classes only for animations and hover states.
- **Font**: Inter (Google Fonts), loaded in App.css
- **Sidebar width**: 248px (`C.sidebarW`)

## Animation System

All in `src/App.css`:
- `.reveal` + `.reveal.visible` — scroll-triggered fade+slideUp via IntersectionObserver
- `@keyframes slideUp` — entrance animation
- `.hero-headline`, `.hero-sub`, `.hero-ctas` — staggered mount animations (0ms, 150ms, 280ms)
- `.bento-card-enter` — bento card stagger (delay set per card via inline animationDelay)
- `.snav-parent`, `.snav-sub` hover classes — sidebar nav hover with `!important` to override inline styles

Hook: `src/hooks/useReveal.js` — IntersectionObserver hook, auto-applied by `Section` wrapper component.

Custom cursor: `src/components/CursorDot.jsx` — 8px dot → 32px ring on hover. Hidden on touch.

## Component Map

| Component | File | Purpose |
|---|---|---|
| Sidebar | `src/App.jsx` | Fixed left nav, dropdowns, brand |
| Section | `src/App.jsx` | Wrapper with auto scroll-reveal |
| Hero | `src/App.jsx` | Main page hero with pipeline stages |
| BentoHero | `src/components/BentoHero.jsx` | Card grid with canvas water ripple |
| ChatWidget | `src/components/ChatWidget.jsx` | AI chat (Groq), 20-message cap, WhatsApp alert |
| CursorDot | `src/components/CursorDot.jsx` | Custom mouse follower |
| ArticlePage | `src/components/ArticlePage.jsx` | Reusable resource article layout |
| ServicePage | `src/components/ServicePage.jsx` | Reusable service detail layout |
| ContactForm | `src/components/ContactForm.jsx` | Contact form with Nodemailer |

## Routing Table

| Path | Component |
|---|---|
| `/` | About |
| `/home` | HomePage (main page with all sections) |
| `/services` | ServicesIndex |
| `/services/pre-appointment` | PreAppointment |
| `/services/post-appointment` | PostAppointment |
| `/services/onboarding` | Onboarding |
| `/services/contractor-phase` | ContractorPhase |
| `/services/cobie-handover` | CobieHandover |
| `/services/digital-twin` | DigitalTwinReadiness |
| `/services/remote-modelling` | RemoteModelling |
| `/services/ar-implementation` | ARImplementation |
| `/surveys` | SurveysIndex |
| `/surveys/scan-to-bim` | ScanToBIMPage |
| `/surveys/heritage` | HeritageSurveys |
| `/surveys/post-processing` | PostProcessing |
| `/surveys/as-built` | AsBuilt |
| `/resources` | Resources |
| `/resources/iso-19650` | Iso19650Guide |
| `/resources/pre-appointment-value` | PreAppointmentValue |
| `/resources/scan-to-bim-guide` | ScanToBIMGuide |
| `/resources/responsibility-matrix` | ResponsibilityMatrix |
| `/case-studies` | CaseStudies |
| `/tools/material-checker` | MaterialChecker |
| `/tools/rfi-desk` | RFIDesk |

## Backend

**`api/chat.js`** — Vercel serverless function
- Accepts `POST /api/chat` with `{ messages: [] }`
- Reads `knowledge_base/services.md` as system context
- Calls Groq API for AI responses
- Sends WhatsApp alert via CallMeBot after 4 user messages
- 20-message cap enforced client-side in ChatWidget

**Environment variables (Vercel dashboard):**
- `GROQ_API_KEY`
- `CALLMEBOT_APIKEY`

## Python Tools

- `api/scrapers/` — Screwfix, Toolstation, Travis Perkins, Wickes price scrapers
- `tools/analyse_competitors.py` — competitor analysis
- `tools/generate_report.py` — report generation
- Note: Python files do NOT deploy to Vercel (Node only). Run locally.

## Workflows / SOPs

Located in `workflows/`:
- `add_service_page.md`
- `competitor_analysis.md`
- `contact_form_routing.md`
- `deploy_site.md`
- `material_price_checker.md`

## Deployment

**Vercel (primary):**
- Build: `npm run build` → `dist/`
- `vercel.json`: SPA rewrite `/((?!api/).*)` → `/index.html`
- GitHub repo: `robertstoprins-arch/top-r-solutions1-`, branch `main`
- Auto-deploy on push to `main`

**Git workflow:**
- Feature work on branches → Vercel preview URL generated automatically
- Merge to `main` → production deploy
