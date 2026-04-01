# Workflow: Material Price Checker

## Objective
Let anyone enter a UK postcode and a list of construction materials, then get real-time prices, availability, and delivery estimates across four major UK building merchants: **Screwfix**, **Toolstation**, **Travis Perkins**, and **Wickes**.

## Route
`/tools/material-checker` — visible in the sidebar under **Tools**.

## Architecture

```
React page (MaterialChecker.jsx)
  → POST /api/tools/material-checker
  → material_checker.py (orchestrator)
  → asyncio.gather [ ScrewfixScraper, ToolstationScraper, TravisPerkinsScraper, WickesScraper ]
                    × N items
  → _collate() → JSON response
  → Results table
```

| Layer | File |
|---|---|
| Frontend page | `src/pages/tools/MaterialChecker.jsx` |
| API endpoint | `api/server.py` → `POST /api/tools/material-checker` |
| Orchestrator | `api/material_checker.py` |
| Scrapers | `api/scrapers/screwfix.py`, `toolstation.py`, `travis_perkins.py`, `wickes.py` |
| Base class | `api/scrapers/base.py` |

## Inputs

| Field | Validation |
|---|---|
| `postcode` | UK postcode format, e.g. `SW1A 1AA` |
| `items` | 1–10 items: `{ description, quantity, unit }` |
| `unit` | One of: `units`, `m²`, `m`, `kg`, `litres` |

## Running Locally (Development)

```bash
# 1. Install dependencies (one-time)
cd api
pip install -r requirements.txt
playwright install chromium   # downloads ~130MB Chromium binary

# 2. Start the API
uvicorn server:app --reload --port 8000

# 3. Start the frontend (separate terminal, from repo root)
npm run dev
```

Navigate to `http://localhost:5173/tools/material-checker`.

## Supplier Search URLs

| Supplier | Search URL pattern |
|---|---|
| Screwfix | `https://www.screwfix.com/search?search={query}` |
| Toolstation | `https://www.toolstation.com/search?q={query}` |
| Travis Perkins | `https://www.travisperkins.co.uk/search?term={query}` |
| Wickes | `https://www.wickes.co.uk/search#q={query}&t=All` |

## Parallelism & Timeouts

- All item × supplier combinations run concurrently via `asyncio.gather`
- Concurrency cap: **8 simultaneous pages** (Semaphore in `material_checker.py`)
- Per-task timeout: **25 seconds** (in `_run_single`)
- Overall endpoint timeout: **90 seconds** (in `server.py`)
- Frontend request abort: **95 seconds** (AbortController in `MaterialChecker.jsx`)

## Bot Detection Mitigation

Each scraper runs in a shared Playwright browser context with:
- Chrome 122 user-agent
- 1280×800 viewport, `en-GB` locale, `Europe/London` timezone
- `navigator.webdriver` masked via `add_init_script`
- 0.5–1.5s random sleep before each page navigation

If a supplier returns a captcha or 403, the scraper returns `error: "blocked"` — the UI renders this as "Unavailable". It never crashes the whole request.

## Updating Selectors (Most Common Maintenance Task)

Supplier sites change their DOM occasionally. When a scraper stops returning prices:

1. Open the supplier search URL in Chrome (e.g. `https://www.screwfix.com/search?search=wood+screws`)
2. Inspect the first product card in DevTools (right-click → Inspect)
3. Find the CSS selector for the price element
4. Update the selector constant at the top of the relevant scraper file (e.g. `PRICE_MAIN` in `api/scrapers/screwfix.py`)
5. Smoke-test using the script below

```bash
cd api
python -c "
import asyncio
from scrapers.screwfix import ScrewfixScraper
from playwright.async_api import async_playwright

async def t():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(headless=False)  # headless=False to see the browser
        ctx = await b.new_context(locale='en-GB')
        page = await ctx.new_page()
        r = await ScrewfixScraper().get_price(page, 'wood screws', 200, 'units', 'SW1A 1AA')
        print(r)
        await b.close()

asyncio.run(t())
"
```

## Known Constraints

- **Travis Perkins** may not show trade pricing without an account login. The scraper captures the public/list price if visible, otherwise returns `price_per_unit: null` with `availability: "price on request"`.
- **Wickes** uses a hash-based search URL (`#q=...`) and requires `wait_until="networkidle"` — it's slower than the others.
- **Screwfix** and **Toolstation** are JS-rendered SPAs but generally respond well to Playwright with `domcontentloaded`.
- The Playwright Chromium binary (~130MB) must be installed separately after `pip install playwright` with `playwright install chromium`. This is a one-time step per environment (dev machine, server, CI).
- On a Linux deployment (Railway/Render), also run `playwright install-deps chromium` to install system-level dependencies.

## Testing the API Endpoint Directly

```bash
curl -X POST http://localhost:8000/api/tools/material-checker \
  -H "Content-Type: application/json" \
  -d '{
    "postcode": "SW1A 1AA",
    "items": [
      {"description": "wood screws 4x50mm", "quantity": 200, "unit": "units"},
      {"description": "plasterboard 12.5mm", "quantity": 10, "unit": "units"}
    ]
  }'
```

Expected: JSON with `rows` array. At least 2 of 4 suppliers should return `price_per_unit` values.

## Post-MVP Enhancements

1. **Postcode-specific branch availability** — use each supplier's branch/store API to check local stock at the nearest store to the entered postcode
2. **Result caching** — cache results in Redis with 30-minute TTL to avoid re-scraping identical searches
3. **More suppliers** — Buildbase, Jewson, B&Q / Tradepoint, Builders Warehouse
4. **Export basket** — download comparison table as CSV or PDF
5. **Price history** — track and chart price changes per material over time
6. **Natural-language input** — paste a raw material schedule and auto-parse it into structured rows using the Claude API
