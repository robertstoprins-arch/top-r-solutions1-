#!/usr/bin/env python3
"""
Competitor & Website Maturity Analysis Tool
ToP-R Solutions — WAT Framework

Usage:
  python analyse_competitors.py \
    --own "https://www.top-rsolutions.co.uk" \
    --competitors "https://site1.co.uk,https://site2.co.uk" \
    --output markdown

Outputs to .tmp/competitor_analysis_YYYY-MM-DD.md
"""

import argparse
import os
import sys
import re
import json
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# ── Load env ───────────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / '.env')

# ── Service keyword map ────────────────────────────────────────────────────────
SERVICES = {
    'Pre-appointment BIM':    ['pre-appointment', 'pre appointment', 'bim appointment', 'appointment bim', 'pre-contract bim'],
    'Post-appointment BIM':   ['post-appointment', 'post appointment', 'bim management', 'bim manager'],
    'Onboarding / ISO 19650': ['onboarding', 'iso 19650', 'bep', 'bim execution plan', 'pas 1192'],
    'Contractor Phase BIM':   ['contractor phase', 'construction bim', 'contractor bim', 'site bim'],
    'COBie & Handover':       ['cobie', 'handover', 'fm handover', 'asset data', 'golden thread'],
    'Digital Twin':           ['digital twin', 'digital twins', 'asset management', 'smart building'],
    'Remote Modelling':       ['remote modelling', 'remote modeling', 'offsite modelling', 'remote bim'],
    'Scan to BIM':            ['scan to bim', 'point cloud', 'lidar', 'laser scan', 'reality capture'],
    'Heritage Survey':        ['heritage', 'listed building', 'historic', 'conservation'],
    'Post-Processing':        ['post-processing', 'post processing', 'registration', 'cloud registration'],
    'As-Built Survey':        ['as-built', 'as built', 'measured survey', 'existing conditions'],
    'AR / BIM AR':            ['augmented reality', 'bim ar', 'ar implementation', ' ar '],
    'Training / Workshops':   ['training', 'workshop', 'course', 'cpd', 'education'],
    'Revit / BIM Software':   ['revit', 'navisworks', 'bim 360', 'autodesk construction cloud', 'acc', 'archicad', 'openBIM'],
}

# ── Feature keyword map ────────────────────────────────────────────────────────
FEATURES = {
    'Quote / estimate form':        ['get a quote', 'request a quote', 'estimate', 'free quote', 'contact form'],
    'File upload on form':          ['upload', 'attach', 'send files', 'attach files'],
    'Case studies / portfolio':     ['case study', 'case studies', 'portfolio', 'projects', 'our work'],
    'Testimonials / reviews':       ['testimonial', 'review', 'client said', 'what our clients', 'rated'],
    'Team / about page':            ['our team', 'meet the team', 'about us', 'who we are'],
    'Blog / resources':             ['blog', 'resources', 'guides', 'articles', 'insights', 'news'],
    'Pricing transparency':         ['pricing', 'price', 'fee', 'rates', 'cost from', 'starting at'],
    'ISO 19650 / Standards':        ['iso 19650', 'pas 1192', 'eir', 'cobie', 'bim level 2', 'uk bim framework'],
    'Accreditations':               ['accredit', 'certified', 'rics', 'cibse', 'bsria', 'ukbima', 'labc'],
    'Social proof (LinkedIn/count)':['linkedin', 'projects completed', 'years experience', 'clients served', 'trusted by'],
    'Video content':                ['video', 'youtube', 'vimeo', 'watch', 'demo'],
    'Live chat / WhatsApp':         ['live chat', 'chat with us', 'whatsapp', 'tawk', 'intercom', 'tidio'],
}

# ── Maturity scoring criteria ──────────────────────────────────────────────────
# Each check: (dimension, points, description, test_fn)
# test_fn receives (soup, text, url, response) → bool

def _has(text, keywords):
    return any(k.lower() in text for k in keywords)

def _tag_exists(soup, selector):
    return bool(soup.select_one(selector))

MATURITY_CHECKS = [
    # Design & UX (20 pts)
    ('Design & UX',    4,  'Has meta viewport (mobile-ready)',   lambda s,t,u,r: bool(s.find('meta', attrs={'name': 'viewport'}))),
    ('Design & UX',    4,  'Has clear H1 heading',               lambda s,t,u,r: bool(s.find('h1'))),
    ('Design & UX',    4,  'Navigation has 4+ items',            lambda s,t,u,r: len(s.find_all('nav')) > 0 and len(s.select('nav a')) >= 4),
    ('Design & UX',    4,  'No Lorem Ipsum placeholder text',    lambda s,t,u,r: 'lorem ipsum' not in t.lower()),
    ('Design & UX',    4,  'Has Open Graph meta tags',           lambda s,t,u,r: bool(s.find('meta', property='og:title'))),

    # Trust Signals (20 pts)
    ('Trust Signals',  5,  'Has testimonials or reviews',        lambda s,t,u,r: _has(t, ['testimonial','review','client said','rated us','stars'])),
    ('Trust Signals',  5,  'Has case studies or portfolio',      lambda s,t,u,r: _has(t, ['case study','case studies','portfolio','our work','projects'])),
    ('Trust Signals',  5,  'Mentions accreditations',            lambda s,t,u,r: _has(t, ['accredit','certified','rics','cibse','iso 9001','ukbima'])),
    ('Trust Signals',  5,  'Shows years experience or count',    lambda s,t,u,r: bool(re.search(r'\d+\+?\s*(years|projects|clients)', t.lower()))),

    # Content Depth (20 pts)
    ('Content Depth',  5,  'Services described in detail (>600 words)', lambda s,t,u,r: len(t.split()) > 600),
    ('Content Depth',  5,  'Mentions ISO 19650 or BIM standards',       lambda s,t,u,r: _has(t, ['iso 19650','pas 1192','uk bim framework','eir','cobie'])),
    ('Content Depth',  5,  'Has a dedicated About/Team page link',      lambda s,t,u,r: _has(t, ['about us','our team','meet the team','who we are'])),
    ('Content Depth',  5,  'Has blog, resources, or insights',          lambda s,t,u,r: _has(t, ['blog','resources','insights','guides','articles'])),

    # Conversion (15 pts)
    ('Conversion',     5,  'Has a contact or quote form',         lambda s,t,u,r: bool(s.find('form')) or _has(t, ['get a quote','request a quote','contact us'])),
    ('Conversion',     5,  'Has a clear CTA button',              lambda s,t,u,r: bool(s.select('a[href*="contact"], button, a.btn, a.button')) or _has(t, ['get started','contact us','book','enquire'])),
    ('Conversion',     5,  'Phone or email visible in page text', lambda s,t,u,r: bool(re.search(r'(\+44|0\d{10}|\d{5}\s\d{6}|[\w.]+@[\w.]+\.\w+)', t))),

    # Technical (15 pts)
    ('Technical',      5,  'Served over HTTPS',                   lambda s,t,u,r: u.startswith('https')),
    ('Technical',      5,  'Has canonical tag',                   lambda s,t,u,r: bool(s.find('link', rel='canonical'))),
    ('Technical',      5,  'Has meta description',                lambda s,t,u,r: bool(s.find('meta', attrs={'name': 'description'}))),

    # Positioning (10 pts)
    ('Positioning',    5,  'Mentions specific BIM niche/speciality', lambda s,t,u,r: _has(t, ['specialist','bespoke','uk-wide','nationwide','independent','boutique'])),
    ('Positioning',    5,  'Uses professional BIM vocabulary',       lambda s,t,u,r: _has(t, ['riba','aps','cdm','lod','loi','bim level','openBIM','ifc','revit'])),
]

# ── Scraper ────────────────────────────────────────────────────────────────────
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                  '(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'en-GB,en;q=0.9',
}

def fetch_site(url: str) -> tuple[BeautifulSoup | None, str, requests.Response | None]:
    """Fetch a URL, return (soup, plain_text, response). Returns (None,'',None) on failure."""
    # Check for manual override file
    domain = urlparse(url).netloc.replace('www.', '').replace('.', '_').replace('-', '_')
    manual = ROOT / '.tmp' / f'manual_{domain}.txt'
    if manual.exists():
        print(f'  [manual] Using {manual.name} for {url}')
        text = manual.read_text(encoding='utf-8')
        soup = BeautifulSoup(f'<html><body><p>{text}</p></body></html>', 'html.parser')
        return soup, text.lower(), None

    try:
        r = requests.get(url, headers=HEADERS, timeout=15, allow_redirects=True)
        if r.status_code in (403, 429, 503):
            print(f'  [blocked] {url} returned {r.status_code} — manual review needed')
            return None, '', r
        r.raise_for_status()
        soup = BeautifulSoup(r.text, 'html.parser')
        # Strip scripts and styles
        for tag in soup(['script', 'style', 'noscript']):
            tag.decompose()
        text = soup.get_text(separator=' ', strip=True).lower()
        return soup, text, r
    except requests.RequestException as e:
        print(f'  [error] {url}: {e}')
        return None, '', None


def analyse_site(url: str, label: str) -> dict:
    print(f'Analysing: {label} ({url})')
    soup, text, response = fetch_site(url)

    blocked = soup is None
    result = {
        'label': label,
        'url': url,
        'blocked': blocked,
        'services': {},
        'features': {},
        'maturity': {},
        'maturity_total': 0,
        'maturity_max': sum(pts for _, pts, _, _ in MATURITY_CHECKS),
    }

    if blocked:
        print(f'  [skip] Could not retrieve {url}')
        return result

    # Service detection
    for service, keywords in SERVICES.items():
        result['services'][service] = any(k in text for k in keywords)

    # Feature detection
    for feature, keywords in FEATURES.items():
        result['features'][feature] = any(k in text for k in keywords)

    # Maturity scoring
    dim_scores = {}
    dim_max = {}
    for dim, pts, desc, fn in MATURITY_CHECKS:
        if dim not in dim_scores:
            dim_scores[dim] = 0
            dim_max[dim] = 0
        dim_max[dim] += pts
        try:
            passed = fn(soup, text, url, response)
        except Exception:
            passed = False
        if passed:
            dim_scores[dim] += pts

    result['maturity'] = {d: {'score': dim_scores[d], 'max': dim_max[d]} for d in dim_scores}
    result['maturity_total'] = sum(v['score'] for v in result['maturity'].values())
    return result


# ── Report builder ─────────────────────────────────────────────────────────────

def tick(val: bool, blocked: bool) -> str:
    if blocked:
        return '?'
    return '✓' if val else '–'


def build_report(sites: list[dict]) -> str:
    today = date.today().isoformat()
    lines = [f'# Competitor Analysis — {today}', '']

    # Own site first, then competitors
    own = sites[0]
    others = sites[1:]
    headers = [s['label'] for s in sites]

    # ── Service Matrix ──
    lines.append('## Service Coverage Matrix')
    lines.append('')
    col_w = max(len(h) for h in headers) + 2
    header_row = '| {:<30} |'.format('Service') + ''.join(f' {h:<{col_w}} |' for h in headers)
    sep_row    = '|' + '-'*32 + '|' + (''.join(f'-{"-"*col_w}-|' for _ in headers))
    lines.append(header_row)
    lines.append(sep_row)
    for service in SERVICES:
        row = '| {:<30} |'.format(service)
        for site in sites:
            val = site['services'].get(service, False)
            row += ' {:<{}} |'.format(tick(val, site['blocked']), col_w)
        lines.append(row)
    lines.append('')

    # ── Feature Matrix ──
    lines.append('## Feature Matrix')
    lines.append('')
    lines.append(header_row.replace('Service', 'Feature '))
    lines.append(sep_row)
    for feature in FEATURES:
        row = '| {:<30} |'.format(feature)
        for site in sites:
            val = site['features'].get(feature, False)
            row += ' {:<{}} |'.format(tick(val, site['blocked']), col_w)
        lines.append(row)
    lines.append('')

    # ── Maturity Scores ──
    lines.append('## Webpage Maturity Scores')
    lines.append('')
    dims = list(next(s['maturity'] for s in sites if not s['blocked']).keys())
    dim_header = '| {:<20} |'.format('Site') + ''.join(f' {d:<14} |' for d in dims) + ' **TOTAL** |'
    dim_sep    = '|' + '-'*22 + '|' + ''.join('-'*16 + '|' for _ in dims) + '-'*11 + '|'
    lines.append(dim_header)
    lines.append(dim_sep)
    for site in sites:
        if site['blocked']:
            row = '| {:<20} |'.format(site['label']) + ''.join(f' {"?":<14} |' for _ in dims) + f' ?/100    |'
        else:
            row = '| {:<20} |'.format(site['label'])
            for d in dims:
                s = site['maturity'][d]['score']
                m = site['maturity'][d]['max']
                row += f' {s}/{m:<12} |'
            row += f' **{site["maturity_total"]}/100** |'
        lines.append(row)
    lines.append('')

    # ── Gap Analysis ──
    lines.append('## Gap Analysis & Recommendations')
    lines.append('')

    gaps = []
    own_services = own['services']
    own_features = own['features']

    # Services competitors have, own site doesn't
    for service, keywords in SERVICES.items():
        competitor_has = [s['label'] for s in others if s['services'].get(service) and not s['blocked']]
        if competitor_has and not own_services.get(service):
            gaps.append(f'**Service gap** — `{service}`: found on {", ".join(competitor_has)} but not detected on your site. '
                        f'Consider a dedicated page or mention on existing pages.')

    # Features competitors have, own site doesn't
    for feature, keywords in FEATURES.items():
        competitor_has = [s['label'] for s in others if s['features'].get(feature) and not s['blocked']]
        if competitor_has and not own_features.get(feature):
            gaps.append(f'**Feature gap** — `{feature}`: present on {", ".join(competitor_has)}. '
                        f'Adding this could improve trust or conversion.')

    # Maturity dimensions where competitors score higher
    if not own['blocked']:
        for d in dims:
            own_score = own['maturity'].get(d, {}).get('score', 0)
            for site in others:
                if site['blocked']:
                    continue
                their_score = site['maturity'].get(d, {}).get('score', 0)
                if their_score > own_score:
                    gaps.append(f'**Maturity gap** — `{d}`: your site scores {own_score}, '
                                f'{site["label"]} scores {their_score}.')

    if gaps:
        for i, g in enumerate(gaps, 1):
            lines.append(f'{i}. {g}')
    else:
        lines.append('No significant gaps detected — your site covers all detected competitor services and features.')

    lines.append('')
    lines.append('---')
    lines.append(f'*Generated {today} by ToP-R Solutions WAT Framework — tools/analyse_competitors.py*')
    lines.append(f'*Scores are heuristic (keyword + structural). Re-run quarterly to track progress.*')

    return '\n'.join(lines)


# ── Google Sheets export ───────────────────────────────────────────────────────

def push_to_sheets(sites: list[dict], report: str):
    try:
        import gspread
        from google.oauth2.service_account import Credentials
    except ImportError:
        print('[sheets] gspread not installed — skipping Google Sheets export')
        return

    sheet_id = os.getenv('GOOGLE_SHEET_ID', '')
    creds_file = ROOT / os.getenv('GOOGLE_CREDS_FILE', 'credentials.json')
    if not sheet_id or not creds_file.exists():
        print('[sheets] GOOGLE_SHEET_ID or credentials.json not configured — skipping')
        return

    scopes = ['https://www.googleapis.com/auth/spreadsheets']
    creds = Credentials.from_service_account_file(str(creds_file), scopes=scopes)
    gc = gspread.authorize(creds)
    sh = gc.open_by_key(sheet_id)

    tab_name = f'Competitor Analysis {date.today().isoformat()}'
    try:
        ws = sh.add_worksheet(title=tab_name, rows=200, cols=20)
    except Exception:
        ws = sh.worksheet(tab_name)
        ws.clear()

    rows = [line.split('|') for line in report.split('\n') if '|' in line]
    cleaned = [[cell.strip() for cell in row if cell.strip()] for row in rows]
    ws.update('A1', cleaned)
    print(f'[sheets] Exported to Google Sheet tab: {tab_name}')


# ── CLI ────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='Competitor & maturity analysis for BIM consultancy websites')
    parser.add_argument('--own', default='https://www.top-rsolutions.co.uk', help='Your own site URL')
    parser.add_argument('--competitors', required=True, help='Comma-separated competitor URLs')
    parser.add_argument('--output', choices=['markdown', 'sheets', 'both'], default='markdown')
    args = parser.parse_args()

    own_url = args.own.strip()
    competitor_urls = [u.strip() for u in args.competitors.split(',') if u.strip()]

    all_urls = [(own_url, 'ToP-R Solutions')] + [
        (url, urlparse(url).netloc.replace('www.', '')) for url in competitor_urls
    ]

    sites = [analyse_site(url, label) for url, label in all_urls]

    report = build_report(sites)

    # Save markdown
    tmp_dir = ROOT / '.tmp'
    tmp_dir.mkdir(exist_ok=True)
    out_path = tmp_dir / f'competitor_analysis_{date.today().isoformat()}.md'
    out_path.write_text(report, encoding='utf-8')
    print(f'\nReport saved: {out_path}')

    if args.output in ('markdown', 'both'):
        print('\n' + '='*60)
        print(report)

    if args.output in ('sheets', 'both'):
        push_to_sheets(sites, report)


if __name__ == '__main__':
    main()
