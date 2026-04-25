# Workflow: LinkedIn Post Intelligence Writer

## Objective
Write, review, and auto-post LinkedIn content using a 4-pass agentic loop. Triggered via Telegram bot or web UI.

## Inputs
- Topic (text or inferred from photo)
- Key bullet points (optional)
- Tone: excited | professional | thought-leader
- Voice samples (optional — stored in browser localStorage)

## Full Workflow

### Trigger A — Telegram Bot
1. Send text message with topic to bot → `api/telegram-webhook.js` picks it up
2. Send a photo → Gemini Vision infers topic from image
3. Bot runs 4-pass writer engine and replies with draft + scores
4. Reply `/approve long` (or short / case) → bot posts to LinkedIn
5. Bot confirms with success message

### Trigger B — Web UI (`/tools/linkedin-writer`)
1. Enter topic + bullets, select tone, optionally paste voice samples
2. Click Generate Post
3. Watch 4 pass progress: Writing → Critiquing → Rewriting → Scoring
4. Review 3 variant tabs (Long / Short / Case Study)
5. Edit post inline if needed
6. Click Post to LinkedIn or Copy for manual posting

## 4-Pass Gemini Engine (`api/linkedin-writer.js`)

| Pass | Model | Purpose |
|------|-------|---------|
| 1A,1B,1C | gemini-1.5-flash | Write 3 variants in parallel |
| 2 | gemini-1.5-flash | Critic scores long variant |
| 3 | gemini-1.5-flash | Rewrite with critique applied |
| 4 | gemini-1.5-flash | Final score + hashtag generation |

## LinkedIn Posting (`api/post-to-linkedin.js`)
- Requires `LINKEDIN_ACCESS_TOKEN` in .env (expires every 60 days)
- Posts via LinkedIn UGC Posts API v2
- Supports text-only or text + image
- Token refresh: visit `/api/linkedin-auth` to reauthorise

## One-Time Setup

### LinkedIn OAuth (run once, refresh every 60 days)
1. Visit: `https://www.top-rsolutions.co.uk/api/linkedin-auth`
2. Authorise with LinkedIn
3. Copy `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_PERSON_URN` from the response page
4. Paste into `.env` and Vercel environment variables

### Telegram Webhook (run once)
```
curl -X POST "https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.top-rsolutions.co.uk/api/telegram-webhook"}'
```

### Required .env Keys
```
GEMINI_API_KEY=               # Already set
LINKEDIN_CLIENT_ID=           # From LinkedIn Developer App
LINKEDIN_CLIENT_SECRET=       # From LinkedIn Developer App
LINKEDIN_ACCESS_TOKEN=        # From /api/linkedin-auth (refresh every 60 days)
LINKEDIN_PERSON_URN=          # From /api/linkedin-auth (permanent)
TELEGRAM_BOT_TOKEN=           # From BotFather
TELEGRAM_CHAT_ID=             # Your personal Telegram chat ID
```

## Telegram Bot Commands
| Command | Action |
|---------|--------|
| Send text | Start writing workflow |
| Send photo | Infer topic via Gemini Vision, then write |
| `/approve long` | Post long variant to LinkedIn |
| `/approve short` | Post short variant |
| `/approve case` | Post case study variant |
| `/variants` | Show all 3 variants |
| `/regenerate` | Rewrite from scratch |
| `/help` | Show all commands |

## Review Criteria (Pass 4 Scoring)
- **Hook (1–10):** Does the first line grab attention without starting with "I"?
- **Readability (1–10):** Short sentences, line breaks every 1–2 lines, scannable?
- **Industry Relevance (1–10):** BIM terminology, UK standards, AEC pain points present?
- **CTA (1–10):** Clear invitation, question, or call to action at the end?

## Hashtag Strategy
- **Niche:** #RFIAutomation #VoidClosure #BIMIntelligence #DocumentIntelligence
- **Industry:** #BIM #AEC #ConstructionTech #UKConstruction #AgenticAI #ModelContextProtocol
- **Market Leaders:** #Autodesk #Procore #Trimble #Bentley #Nemetschek #Graphisoft #Aconex #Hexagon

## Edge Cases
- If Gemini returns invalid JSON in Pass 2 or 4: gracefully degrade (skip critique, show unscored post)
- If LinkedIn token expired: error message instructs to visit `/api/linkedin-auth`
- If photo has no caption and Vision inference fails: use "Construction site progress update" as fallback topic
- Voice samples are stored in `localStorage` — persist across browser sessions, cleared if user wipes storage
