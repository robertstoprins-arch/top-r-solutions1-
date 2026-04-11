# ToP-R Solutions — Predicted Issues & Risk Analysis

An agent should read this file and the current codebase, then validate, add to, or challenge each item below. Look from a different angle — assume the developer is too close to the code to see these.

---

## Performance

### Bundle size — 803KB unminified
**Risk**: High. Recharts is the main culprit (includes D3 internals). On slow connections this delays first paint.
**Predicted issue**: Visitors on mobile or slower connections may see a blank screen for 2-3 seconds.
**Fix**: Dynamic import Recharts — only load it on the `/home` route where charts are used.
```js
const { BarChart } = await import('recharts')
```

### Recharts not tree-shaken
**Risk**: Medium. Named imports from recharts (`BarChart, Bar, XAxis...`) pull the full library.
**Fix**: Verify vite config has `optimizeDeps` set correctly, or switch to a lighter chart library for simple bar charts.

---

## Architecture

### No React error boundaries
**Risk**: Medium. If any component throws (e.g., chat API fails, BentoHero canvas errors), the entire page goes blank.
**Predicted issue**: Chat widget failure silently breaks the page.
**Fix**: Wrap `<ChatWidget />` and `<BentoHero />` in error boundaries.

### Inline styles throughout
**Risk**: Low-Medium. Works fine now but becomes harder to maintain as the project grows. Hover states require CSS class workarounds (already seen with `.snav-parent:hover`).
**Predicted issue**: Any new interactive component will need the same CSS class workaround pattern.
**Note**: Not urgent — document the pattern so new components follow it consistently.

### Single knowledge_base/services.md
**Risk**: Low. No versioning, no update workflow. If the file is edited incorrectly, chat responses break silently.
**Fix**: Add a simple update workflow in `workflows/` and keep a backup copy.

---

## Backend / Serverless

### Chat function cold start on Vercel free tier
**Risk**: Medium. Vercel free tier serverless functions can have 1-3 second cold starts after inactivity.
**Predicted issue**: First chat message after the site has been idle will feel slow.
**Fix**: Not easily avoidable on free tier. Consider adding a loading indicator in ChatWidget during the first response.

### Python scrapers not deployed to Vercel
**Risk**: High if used in production. `api/scrapers/` contains Python files but Vercel runs Node only.
**Predicted issue**: Material Price Checker may be calling these scrapers — if so, it will fail silently in production.
**Action**: Verify MaterialChecker.jsx — does it call the Python scrapers or a Node API? If Python, needs a separate deployment (Railway, Render) or rewrite in Node.

### No rate limiting on `/api/chat`
**Risk**: Medium. The endpoint is public. A bot could exhaust the Groq API quota.
**Fix**: Add simple IP-based rate limiting or a request counter in the function.

---

## Content & SEO

### No meta tags or page titles
**Risk**: Medium for SEO. All pages share the same `<title>` from `index.html`.
**Predicted issue**: Google indexes all pages as "ToP-R Solutions" with no page-specific description.
**Fix**: Add `react-helmet-async` or Vite's SSG plugin to set per-page meta tags.

### No sitemap.xml or robots.txt
**Risk**: Low-Medium. Search engines will still find the site, but without a sitemap, crawling is slower.
**Fix**: Generate a static `sitemap.xml` in `public/` listing all routes.

### Images have no alt text audit
**Risk**: Low. Accessibility and SEO both benefit from descriptive alt text.
**Action**: Audit all `<img>` tags, especially the logo and any service page images.

---

## UX / Interaction

### Pipeline stages hover uses C.accent (blue) in metrics cards
**Risk**: Low. The pipeline stages themselves were updated to black, but metric value colours (`color: C.accent`) in the Hero section still use blue.
**Predicted issue**: Slight colour inconsistency — stats show blue values while interactive elements are black.
**Fix**: Update metric `fontSize: '1.1rem', fontWeight: 700, color: C.accent` → `color: C.text` in Hero.

### BentoHero canvas ripple may lag on low-end devices
**Risk**: Low. Canvas requestAnimationFrame loop runs continuously.
**Fix**: Add `document.addEventListener('visibilitychange', ...)` to pause the loop when tab is hidden.

### Chat widget z-index conflict potential
**Risk**: Low. ChatWidget uses a high z-index. If any future modal or overlay is added, test for stacking conflicts.

---

## Agent Instructions

Read `src/App.jsx`, `src/components/BentoHero.jsx`, `src/components/ChatWidget.jsx`, and `api/chat.js`. For each issue above:
1. Confirm whether it exists in the current code
2. Rate actual severity (Low / Medium / High)
3. Add any new issues you find
4. Flag any issues that are already fixed
