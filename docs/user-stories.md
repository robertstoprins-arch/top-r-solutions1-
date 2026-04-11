# ToP-R Solutions — User Stories & Testing Scenarios

## Navigation

- [ ] Visitor lands on `/` → About page loads, hero visible above fold
- [ ] Visitor clicks "Explore BIM services →" in About hero → navigates to `/services/pre-appointment`
- [ ] Visitor clicks "See automation tools →" in About hero → navigates to `/tools/material-checker`
- [ ] Sidebar BIM Services dropdown opens → 8 sub-items visible
- [ ] Sidebar Automation dropdown opens → Material Price Checker + RFI Desk visible
- [ ] Sidebar Survey Services dropdown opens → 4 sub-items visible
- [ ] Active page is highlighted in sidebar with black right border
- [ ] "Book a Discovery Call" button in sidebar scrolls to contact form

## About Page

- [ ] Hero headline, paragraph, and CTAs animate in on load (staggered)
- [ ] Credentials strip shows ISO 19650-2, ISO 19650-3, UK BIM Framework, AEC BIM Protocol badges
- [ ] "Who we work with" section shows 3 client types: Developers, Design Teams, Contractors
- [ ] "From the field" section shows 3 article cards with working links
- [ ] CEO section includes founder-led sentence
- [ ] All sections reveal smoothly on scroll

## BIM Services

- [ ] `/services/pre-appointment` loads Pre-Appointment BIM page
- [ ] Each service page has a contact CTA
- [ ] Navigating between service pages updates active state in sidebar

## Survey Services

- [ ] `/surveys/scan-to-bim` loads correctly
- [ ] Heritage, Post-Processing, As-Built pages all load

## Resources

- [ ] `/resources` shows 4 article cards (ISO 19650, Pre-Appointment Value, Scan-to-BIM Guide, Responsibility Matrix)
- [ ] Each article card links to its full article page
- [ ] `/resources/responsibility-matrix` loads full article

## Case Studies

- [ ] `/case-studies` loads with NDA note visible above case study cards
- [ ] NDA note explains client confidentiality and offers presentations

## Automation Tools

- [ ] `/tools/material-checker` loads Material Price Checker page
- [ ] `/tools/rfi-desk` loads RFI Desk page with 400-word hero
- [ ] Both tools have contact CTAs

## Chat Widget

- [ ] Chat launcher visible bottom-right on all pages
- [ ] Opening chat shows welcome message from Alex
- [ ] Sending a message gets a response within 5 seconds
- [ ] After 20 messages, input is replaced with contact links (email + WhatsApp)
- [ ] Chat does not reveal pricing information

## Animations & Interactions

- [ ] Hero headline/sub/CTAs on home page animate in on load
- [ ] Bento cards stagger in with delays (0, 80, 160, 240ms)
- [ ] Water ripple on BentoHero canvas is black, not indigo
- [ ] Scroll down → each section fades + slides up as it enters viewport
- [ ] Cursor dot visible on desktop (8px black dot)
- [ ] Cursor dot enlarges to ring on hover over buttons/links/cards
- [ ] Pipeline stages on home page highlight black on hover (not blue)
- [ ] Sidebar nav items show hover effect (slide right, dot scale, background)

## Mobile / Touch

- [ ] Cursor dot hidden on touch devices
- [ ] Sidebar scrollable on smaller screens
- [ ] Animations still fire on mobile
- [ ] Chat widget accessible on mobile

## Deployment

- [ ] `POST /api/chat` with `{ messages: [] }` returns `{ reply: "..." }` JSON
- [ ] Build: `npm run build` completes without errors
- [ ] Vercel production URL loads correctly after push to `main`
- [ ] SPA routing works — navigating directly to `/services/pre-appointment` loads correctly (not 404)
