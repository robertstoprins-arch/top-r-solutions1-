# Workflow: Contact Form Routing

## Objective
Ensure form submissions from the website are received by email, logged to a Google Sheet, and trigger an auto-reply to the client.

## Architecture
```
Browser (ContactForm.jsx)
  → POST /api/submit
  → api/server.py (FastAPI)
      → tools/send_email.py       — notification to info@top-rsolutions.co.uk
      → tools/log_to_sheet.py     — appends row to Google Sheet
      → tools/send_autoreply.py   — confirmation email to client
```

## Required Inputs
All fields from ContactForm: name, company, email, phone, projectType, size, stage, location, services[], timeline, standards, notes, files[]

## Environment Variables (.env)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@top-rsolutions.co.uk
SMTP_PASS=<app-password>
NOTIFY_EMAIL=info@top-rsolutions.co.uk
GOOGLE_SHEET_ID=<sheet-id>
GOOGLE_CREDS_FILE=credentials.json
```

## Steps

### 1. Start the API server
```bash
cd api
uvicorn server:app --port 8000 --reload
```

### 2. Vite proxies /api → :8000
Already configured in `vite.config.js`. No CORS issues in dev.

### 3. Form submission flow
- ContactForm.jsx POSTs JSON to `/api/submit`
- Server validates required fields (name, email minimum)
- Runs send_email, log_to_sheet, send_autoreply in parallel
- Returns `{ success: true }` → frontend shows confirmation

### 4. File uploads
- Files are sent as `multipart/form-data`
- Server saves to `.tmp/uploads/[timestamp]/`
- File paths attached to notification email

## Error Handling
- If email fails: log error, still return success to user (don't block UX)
- If Sheet fails: log error, email still sends
- If both fail: return 500, frontend shows "please email us directly"

## Testing
```bash
curl -X POST http://localhost:8000/api/submit \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","projectType":"New build"}'
```

## Production
- Deploy API to Railway, Render, or a VPS alongside the static frontend
- Set all env vars in the deployment dashboard
- Update `VITE_API_URL` in `.env.production`
