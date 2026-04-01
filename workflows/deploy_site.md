# Workflow: Deploy Site

## Objective
Build and deploy the ToP-R Solutions website (frontend + API) to production.

## Stack
- **Frontend**: Vite + React → static files → Netlify / Vercel / Nginx
- **API**: FastAPI (Python) → Railway / Render / VPS

## Pre-deploy Checklist
- [ ] `npx vite build` completes with no errors
- [ ] All `.env` variables set in deployment dashboard
- [ ] `VITE_API_URL` points to production API URL
- [ ] Logo and profile photo in `public/`
- [ ] Test contact form submission end-to-end
- [ ] All service page routes resolve correctly

## Frontend Deploy (Netlify)
```bash
npm run build
# Upload dist/ to Netlify, or connect GitHub repo
# Set publish directory: dist
# Set build command: npm run build
```

## API Deploy (Railway)
```bash
# Push api/ folder to Railway
# Set all env vars from .env
# Start command: uvicorn server:app --host 0.0.0.0 --port $PORT
```

## Post-deploy
- Verify form submissions arrive at info@top-rsolutions.co.uk
- Verify Google Sheet is being populated
- Check all routes work (React Router needs `_redirects` file for Netlify)

## Netlify _redirects file
Create `public/_redirects`:
```
/*  /index.html  200
```
This ensures React Router routes don't 404 on direct URL access.
