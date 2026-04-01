# Workflow: Add a New Service Page

## Objective
Add a fully structured service page to the ToP-R Solutions website with correct routing, sidebar navigation, and contact form integration.

## Required Inputs
- Service category: `bim` | `survey` | `develop`
- Page title (e.g. "BIM Audit")
- Route slug (e.g. `bim-audit`)
- Label text (e.g. "BIM Services · Audit")
- Tagline (1–2 sentences)
- Overview paragraph (detailed)
- 3 delivery points: `{ title, body }`
- 4–6 process stages: `{ stage, desc }`
- Deliverables list (array of strings)
- `serviceName` for form pre-selection

## Steps

### 1. Create the page file
- BIM service → `src/pages/services/[PascalCaseName].jsx`
- Survey service → `src/pages/surveys/[PascalCaseName].jsx`
- Use `ServicePage` component for BIM, `SurveyPage` for surveys
- Pass all props as defined above

### 2. Add to sidebar (App.jsx)
- BIM → add to `bimSubServices` array: `{ path: '/services/[slug]', label: '[Label]' }`
- Survey → add to `surveySubServices` array: `{ path: '/surveys/[slug]', label: '[Label]' }`

### 3. Add the route (App.jsx)
- Import the new page component at the top
- Add `<Route path="/services/[slug]" element={<ComponentName />} />` inside `<Routes>`

### 4. Add to index page
- BIM → add entry to `services` array in `src/pages/ServicesIndex.jsx`
- Survey → add entry to `surveys` array in `src/pages/SurveysIndex.jsx`

### 5. Verify
- Run `npm run dev`
- Navigate to `/services/[slug]` or `/surveys/[slug]`
- Confirm sidebar highlights the correct item
- Confirm contact form pre-selects the service
- Confirm breadcrumb shows correct path

## Edge Cases
- If slug conflicts with existing route, rename both the file and route
- If `serviceName` doesn't match ContactForm's `allServices` list, add it there too
- Always run `npx vite build` after changes to check for import errors
