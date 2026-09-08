# Workflow: LinkedIn Post Intelligence Writer

## Objective
Write, review, and auto-post LinkedIn content using a 4-pass agentic loop. Triggered via Telegram bot or web UI.

Voice/prompt logic lives in **`api/_voice.js`**, shared by both triggers — edit
it once, both stay in sync. It used to be duplicated and had drifted (the
Telegram bot silently posted the same text for all 3 "variants" — fixed
2026-09-08, see `docs/agent-work-log.md`).

## Inputs
- Topic (text or inferred from photo), or a free-form `/write <instructions>` directive
- Key bullet points (optional, web UI only)
- Tone: `direct` (default) | `professional` | `promising` | `thought-leader` — see `TONE_PRESETS` in `api/_voice.js`
- Language: `en` (default) | `lv` | `ru` | any language name — see `LANGUAGE_PRESETS`
- Point of view: `first` (default) | `third`
- Voice grounding: real published posts (last 3, from the permanent post log) once any exist; falls back to fixed example posts in `api/_voice.js` until then
- Voice samples (web UI only, optional — pasted into the UI, stored in browser localStorage, split on `---` into individual examples)

## Full Workflow

### Trigger A — Telegram Bot
1. Send text message with topic to bot → `api/telegram-webhook.js` picks it up, using your saved `/tone` `/lang` `/pov` defaults
2. Send a photo → Gemini Vision infers topic from image (unless a caption is given, which is used as the topic instead)
3. Or send `/write <topic plus any instructions>` to direct tone/POV/language/angle for just this one post, overriding your saved defaults
4. Bot runs the writer engine (3 parallel variants, critique + rewrite on the long one, then scoring) and replies with draft + scores
5. Reply `/approve long` (or short / case) → bot posts to LinkedIn and logs the post permanently
6. Bot confirms with success message + the live post URL

### Standing preferences (persist across sessions, no expiry)
- `/tone [name]` — view or set default tone
- `/lang [name]` — view or set default language
- `/pov [first|third]` — view or set default point of view
- `/history` — show the last 5 published posts (topic, settings, date, link) from the permanent log

### Trigger C — Commenting on other people's posts (`/comment`)
1. `/comment <linkedin post url>` — bot stores the link and asks for the post's text
2. Paste the post's text (copy it from LinkedIn) as a plain message
3. Bot drafts 3 short comment options via `buildCommentSystem` in `api/_voice.js` (agree+detail / respectful alternate angle / sharp question — never generic praise, never self-promotional)
4. Reply `1`, `2`, or `3` to pick one, or type your own replacement text instead
5. Bot logs the final text (`/chistory` to review) and sends it back ready to paste into LinkedIn yourself
6. `/cancel` abandons an in-progress comment draft at any point

**Why this stays manual (no auto-post):** LinkedIn's comment-creation endpoint
(`POST /rest/socialActions/{urn}/comments`, the Comments API under the
Community Management API product) requires the `w_member_social_feed` scope.
That product is gated behind LinkedIn's Partner Program application process —
verified registered business, verified company Page, manual review — and is
explicitly not available to individual/solo developer apps. This app only has
the self-serve "Sign In with LinkedIn" + "Share on LinkedIn" products
(`w_member_social`, used for the bot's own posts). Building browser-automation
or scraping around this restriction was deliberately not done — it would
violate LinkedIn's automation terms and risk the account. If TOP-R Solutions
ever completes LinkedIn's business verification and gets Community Management
API access approved, this can be upgraded to auto-post the picked comment the
same way `/approve` does for posts — see `postToLinkedIn` in
`api/telegram-webhook.js` for the pattern to replicate.

### Trigger B — Web UI (`/tools/linkedin-writer`)
1. Enter topic + bullets, select tone, optionally paste voice samples
2. Click Generate Post
3. Watch 4 pass progress: Writing → Critiquing → Rewriting → Scoring
4. Review 3 variant tabs (Long / Short / Case Study)
5. Edit post inline if needed
6. Click Post to LinkedIn or Copy for manual posting

## 4-Pass Gemini Engine (shared by `api/linkedin-writer.js` and `api/telegram-webhook.js`)

| Pass | Model | Purpose |
|------|-------|---------|
| 1A,1B,1C | gemini-2.5-flash | Write 3 genuinely distinct variants in parallel (short/long/caseStudy — each gets its own `buildAuthorSystem` call from `api/_voice.js`) |
| 2 | gemini-2.5-flash | Critic scores the long variant |
| 3 | gemini-2.5-flash | Rewrite the long variant with critique applied |
| 4 | gemini-2.5-flash | Final score + hashtag generation |

Every pass's system prompt is composed in `api/_voice.js` from: the fixed
voice rules (`buildStyleRulesBlock`), the requested tone/language/POV, any
`/write` directive, and up to 3 real recently-published posts (or the fallback
examples if none exist yet).

## LinkedIn Posting (`api/post-to-linkedin.js`)
- Requires `LINKEDIN_ACCESS_TOKEN` in .env (expires every 60 days)
- Posts via LinkedIn UGC Posts API v2
- Supports text-only or text + image
- Token refresh: visit `/api/linkedin-auth` to reauthorise

## One-Time Setup

### LinkedIn OAuth (run once, refresh every 60 days)
1. Visit: `https://top-rsolutions.co.uk/api/linkedin-auth`
2. Authorise with LinkedIn
3. Copy `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_PERSON_URN` from the response page
4. Paste into `.env` and Vercel environment variables

### Telegram Webhook (run once)
```
curl -X POST "https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://top-rsolutions.co.uk/api/telegram-webhook"}'
```

> **Use the apex domain (`top-rsolutions.co.uk`), not `www.`** — as of 2026-08-22 the TLS
> certificate served for `www.top-rsolutions.co.uk` has no `www` entry in its SAN list, so
> Telegram's webhook delivery fails TLS verification against `www`. The apex domain has a
> valid cert and works. Fix `www` properly in the Vercel dashboard (Project → Settings →
> Domains) before switching back, and update the LinkedIn app's registered redirect URI to
> match whichever host you use.

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
| Send text | Start writing workflow (uses saved tone/lang/pov defaults) |
| Send photo | Infer topic via Gemini Vision (or use the caption if given), then write |
| `/write <instructions>` | Free-form directive — topic plus tone/POV/language/angle overrides for this post only |
| `/tone [name]` | View or set default tone (`direct`, `professional`, `promising`, `thought-leader`) |
| `/lang [name]` | View or set default language (`en`, `lv`, `ru`, or any language name) |
| `/pov [first\|third]` | View or set default point of view |
| `/approve long` | Post long variant to LinkedIn, log it permanently |
| `/approve short` | Post short variant |
| `/approve case` | Post case study variant |
| `/variants` | Show all 3 variants |
| `/regenerate` | Rewrite from scratch, same topic + settings |
| `/history` | Show last 5 published posts from the permanent log |
| `/comment <url>` | Start a comment draft on someone else's post — bot then asks for the post's text |
| (reply after `/comment`) | Paste post text → get 3 comment options; reply `1`/`2`/`3` to pick, or type your own — result is copy-paste-ready, not auto-posted |
| `/chistory` | Show last 5 comments drafted |
| `/cancel` | Abandon an in-progress comment draft |
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
- **Your own tags:** any `#hashtag` you type directly in the topic/message (Telegram path only) is extracted (`extractUserHashtags` in `api/telegram-webhook.js`) and placed *first* in the final hashtag line at `/approve` time, ahead of the generated set above — deduped case-insensitively against it so nothing appears twice. Confirmed behaviour (2026-09-08): if you type `#LinkBritannia #Developers #LondonSuperPrime` as part of your topic message, all three survive into the posted hashtag line regardless of what the generated niche/industry/marketLeaders sets contain.

## Edge Cases
- If Gemini returns invalid JSON in Pass 2 or 4: gracefully degrade (skip critique, show unscored post)
- If LinkedIn token expired: error message instructs to visit `/api/linkedin-auth`
- If photo has no caption and Vision inference fails: use "Professional update" as fallback topic
- Voice samples pasted into the web UI are stored in `localStorage` — persist across browser sessions, cleared if user wipes storage
- The permanent post log and standing tone/lang/pov preferences live in Redis (`REDIS_URL`, no new env var needed — already required for session state). If `REDIS_URL` is unset, both silently no-op: drafts still work but nothing persists, defaults reset to `direct`/`en`/`first` every message, and `/history` reports empty
- Post log entries are capped at the last 200 (oldest trimmed) so it never grows unbounded
- Comment drafts use their own Redis session key (`linkedin:comment-session:{chatId}`) so a `/comment` flow never clobbers an in-progress post draft, and vice versa
- If a `/comment` session is abandoned (chat goes quiet) it simply expires after 24h like the post-draft session — no cleanup needed
- Comment text is sent to Telegram with `parse_mode` disabled (unlike most bot messages) because it's arbitrary pasted/generated content that may contain Markdown-breaking characters
- User-typed hashtags are extracted from `session.topic` at `/approve` time, so they only survive for the text/`/write`/photo-caption trigger paths that actually set `session.topic` to what the user typed — this is the Telegram path only, not the web UI (`api/linkedin-writer.js`/`api/post-to-linkedin.js`), which was left out of scope for this fix

## Known Gotchas
- **The Telegram and web-UI writers used to be two separate, drifted implementations** — the Telegram path's `runWriter` generated one draft and copied it into all three "variant" slots, so `/approve short` and `/approve case` silently posted the identical long-form text. Fixed 2026-09-08 by moving all prompt-building into `api/_voice.js` and giving the Telegram path its own real 3-variant + critique + rewrite + score pipeline, matching the web UI. If you ever add a third trigger, build its prompts from `_voice.js` too rather than writing a new `AUTHOR_SYSTEM` inline.
- **Few-shot example posts can hijack the topic.** `buildAuthorSystem`/`buildRewriteSystem` show 2–3 full real posts as voice reference. Observed live (2026-09-08): with `thinkingConfig: { thinkingBudget: 0 }` (no extended reasoning) and the actual topic mentioned only in the user turn, the model would independently reproduce or riff on one of the *example* posts' story instead of writing about the assigned topic. Since the three variants are three independent parallel Gemini calls, drift can hit *any one* of them — the confirmed live instance had LONG reproduce `FALLBACK_EXAMPLES[1]` (the "300 RFIs" post) verbatim while SHORT and CASE STUDY correctly matched the real topic ("Link Britannia" super-prime development); an earlier working theory that SHORT/CASE STUDY were the ones that drifted was wrong and has been corrected. Fixed by adding `topic` as a parameter to both builders and a `topicLockBlock()` that restates the mandatory topic in the *system* prompt itself (both right after the examples and again at the very end), explicitly telling the model the examples are style-only and reproducing their subject matter is a failure — applied uniformly to all three variant calls since any of them can be the one that drifts. If topic drift reappears, the next lever to pull is raising `thinkingBudget` above 0 for the drafting pass (costs more latency/tokens) before touching the prompt further.
- Tone/language/POV preferences are keyed per Telegram `chat_id` (`linkedin:prefs:{chatId}`) with no TTL — they're meant to persist indefinitely. Don't add an `EX` to that Redis key.
