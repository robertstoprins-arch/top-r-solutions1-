# Workflow: Competitor & Website Maturity Analysis

## Objective
Scrape a list of competitor URLs and your own site, then produce:
1. **Feature & Service Matrix** — what each company offers vs ToP-R Solutions
2. **Webpage Maturity Score** — how professional/effective each site is across 6 dimensions

## When to Run
- Quarterly, or before launching a new service
- Before updating pricing or positioning
- When entering a new market (e.g. adding Scan-to-BIM, Digital Twin)

## Required Inputs
| Input | Where to set it |
|---|---|
| `--own` | Your site URL (default: https://www.top-rsolutions.co.uk) |
| `--competitors` | Comma-separated list of competitor URLs |
| `--output` | `markdown` (default) or `sheets` |

## Execution
```bash
cd tools
python analyse_competitors.py \
  --own "https://www.top-rsolutions.co.uk" \
  --competitors "https://competitor1.co.uk,https://competitor2.co.uk" \
  --output markdown
```

Output is saved to `.tmp/competitor_analysis_YYYY-MM-DD.md`

If `--output sheets` and `GOOGLE_SHEET_ID` is set in `.env`, results are also pushed to the configured Google Sheet (tab: "Competitor Analysis").

## What the Tool Analyses

### 1. Service Coverage
Checks for presence/mention of each service across the page text:
- Pre-appointment BIM / BIM appointment
- Post-appointment BIM / BEP / BIM Execution Plan
- Onboarding / ISO 19650 compliance
- Contractor Phase BIM / construction BIM
- COBie & Handover / FM handover
- Digital Twin
- Remote Modelling / offsite
- Scan to BIM / point cloud / LiDAR
- Heritage Survey / listed building
- Post-Processing / registration
- As-Built Survey
- AR / Augmented Reality BIM
- Training / workshops
- Software: Revit, Navisworks, BIM 360, ACC

### 2. Feature Analysis
Checks for website features that signal credibility and conversion:
- Quote / estimate form
- File upload on form
- Case studies / portfolio / projects
- Testimonials / client reviews
- Team / about page
- Blog / resources / guides
- Pricing transparency
- Standards mentioned (ISO 19650, PAS 1192, EIR, COBie)
- Accreditations / certifications
- Social proof (LinkedIn link, project counts, years experience)
- Video content
- Live chat / WhatsApp

### 3. Webpage Maturity Score (0–100)
Scores each site across 6 dimensions (max 100 pts total):

| Dimension | Max pts | What counts |
|---|---|---|
| **Design & UX** | 20 | Clean layout, no clutter, modern typography signals |
| **Trust Signals** | 20 | Testimonials, case studies, certifications, logos |
| **Content Depth** | 20 | Services described in detail, not just listed |
| **Conversion** | 15 | Clear CTAs, quote form, easy contact |
| **Technical** | 15 | HTTPS, fast load (heuristic), mobile meta tag |
| **Positioning** | 10 | Clear niche, specialty language (ISO, COBie, EIR) |

### 4. Gap Analysis
Automatically flags services that competitors offer but ToP-R Solutions does not (based on site text), and features where competitors score higher — presented as actionable recommendations.

## Output Format

```
# Competitor Analysis — 2026-03-29

## Service Matrix
| Service              | ToP-R | Competitor A | Competitor B |
|---|---|---|---|
| Pre-appointment BIM  |  ✓   |      ✓      |      -      |
| COBie & Handover     |  ✓   |      -      |      ✓      |
...

## Feature Matrix
| Feature              | ToP-R | Competitor A | Competitor B |
...

## Maturity Scores
| Site          | Design | Trust | Content | Conversion | Technical | Positioning | TOTAL |
...

## Gap Analysis & Recommendations
1. Competitor A advertises ISO 19650 training — ToP-R has no training page
2. Both competitors display client logos — consider adding a social proof section
...
```

## Edge Cases & Notes
- Some sites block scrapers (Cloudflare, bot detection). If a site returns 403/429, the tool logs a warning and marks that site as "manual review needed" rather than crashing.
- JavaScript-heavy sites (React SPAs, Webflow) may not render all text via requests. The tool falls back to meta tags, title, and visible static HTML. For deeper analysis of these sites, load them manually and paste the page text into `.tmp/manual_SITENAME.txt` — the tool will read that file instead.
- Run from the project root or the `tools/` directory; the tool resolves `.env` from the project root.
- Scores are heuristic and keyword-based, not AI-graded. They are consistent and repeatable, which makes them useful for tracking change over time.

## Maintenance
- Update the `SERVICES` and `FEATURES` keyword lists in `tools/analyse_competitors.py` as new services are added to the business.
- After each run, commit the output to `.tmp/` with a dated filename so you have a historical record.
