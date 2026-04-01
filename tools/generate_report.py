#!/usr/bin/env python3
"""
Competitor Analysis PDF Report Generator
ToP-R Solutions — WAT Framework

Runs competitor analysis for UK + Dubai markets and produces a
structured PDF report saved to .tmp/

Usage:
  python generate_report.py
"""

import sys
import os
from pathlib import Path
from datetime import date
from urllib.parse import urlparse

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(Path(__file__).parent))

# Import analysis engine
from analyse_competitors import analyse_site, SERVICES, FEATURES, MATURITY_CHECKS

# ── Market definitions ─────────────────────────────────────────────────────────
OWN = ('https://www.top-rsolutions.co.uk', 'ToP-R Solutions')

UK_COMPETITORS = [
    ('https://www.symetri.co.uk',           'Symetri'),
    ('https://www.bimbox.co.uk',            'BIMBox'),
    ('https://www.eryriconsulting.co.uk',   'Eryri Consulting'),
    ('https://www.pentagonsolutions.com',   'Pentagon Solutions'),
    ('https://www.powerkh.com',             'Powerkh'),
]

DUBAI_COMPETITORS = [
    ('https://www.datconsultancy.com',      'DAT Consultancy'),
    ('https://engisoftengineering.com',     'Engisoft'),
    ('https://www.olilo.ae',               'OlilO Technologies'),
    ('https://bim-me.com',                 'BIM-ME'),
    ('https://pinnacleinfotech.com',       'Pinnacle Infotech'),
]

# ── PDF styles ─────────────────────────────────────────────────────────────────
try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.colors import HexColor, black, white, grey
    from reportlab.lib.units import cm, mm
    from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
        PageBreak, HRFlowable, KeepTogether
    )
    from reportlab.platypus.flowables import Flowable
    from reportlab.pdfgen import canvas as pdfgen_canvas
except ImportError:
    print("ERROR: reportlab not installed. Run: pip install reportlab")
    sys.exit(1)

# Brand colours
BRAND_BLACK  = HexColor('#0C0A09')
BRAND_DARK   = HexColor('#1C1917')
BRAND_STONE  = HexColor('#78716C')
BRAND_MUTED  = HexColor('#A8A29E')
BRAND_BORDER = HexColor('#E7E5E4')
BRAND_SURFACE= HexColor('#FAFAF9')
BRAND_BLUE   = HexColor('#2563EB')
BRAND_GREEN  = HexColor('#16A34A')
BRAND_RED    = HexColor('#DC2626')
BRAND_AMBER  = HexColor('#D97706')
PAGE_W, PAGE_H = A4

def get_styles():
    styles = getSampleStyleSheet()
    custom = {
        'cover_title': ParagraphStyle('cover_title',
            fontSize=28, fontName='Helvetica-Bold', textColor=white,
            leading=34, spaceAfter=8),
        'cover_sub': ParagraphStyle('cover_sub',
            fontSize=12, fontName='Helvetica', textColor=HexColor('#D6D3D1'),
            leading=16, spaceAfter=4),
        'cover_meta': ParagraphStyle('cover_meta',
            fontSize=9, fontName='Helvetica', textColor=HexColor('#A8A29E'),
            leading=13),
        'section_label': ParagraphStyle('section_label',
            fontSize=7, fontName='Helvetica-Bold', textColor=BRAND_BLUE,
            letterSpacing=1.5, spaceAfter=4, spaceBefore=20),
        'h1': ParagraphStyle('h1',
            fontSize=18, fontName='Helvetica-Bold', textColor=BRAND_BLACK,
            leading=22, spaceAfter=6, spaceBefore=14),
        'h2': ParagraphStyle('h2',
            fontSize=13, fontName='Helvetica-Bold', textColor=BRAND_BLACK,
            leading=17, spaceAfter=4, spaceBefore=12),
        'h3': ParagraphStyle('h3',
            fontSize=10, fontName='Helvetica-Bold', textColor=BRAND_DARK,
            leading=14, spaceAfter=3, spaceBefore=8),
        'body': ParagraphStyle('body',
            fontSize=9, fontName='Helvetica', textColor=BRAND_STONE,
            leading=14, spaceAfter=4),
        'body_sm': ParagraphStyle('body_sm',
            fontSize=8, fontName='Helvetica', textColor=BRAND_STONE,
            leading=12, spaceAfter=3),
        'gap_item': ParagraphStyle('gap_item',
            fontSize=8.5, fontName='Helvetica', textColor=BRAND_DARK,
            leading=13, spaceAfter=5, leftIndent=12),
        'gap_label': ParagraphStyle('gap_label',
            fontSize=7, fontName='Helvetica-Bold', textColor=BRAND_BLUE,
            leading=10),
        'footer': ParagraphStyle('footer',
            fontSize=7, fontName='Helvetica', textColor=BRAND_MUTED,
            alignment=TA_CENTER),
    }
    return custom


class ColorRect(Flowable):
    """A filled colour rectangle, used for section dividers and cover."""
    def __init__(self, width, height, color):
        super().__init__()
        self.width = width
        self.height = height
        self.color = color

    def draw(self):
        self.canv.setFillColor(self.color)
        self.canv.rect(0, 0, self.width, self.height, fill=1, stroke=0)


def cover_page(styles, today: str) -> list:
    elems = []
    # Dark cover background block
    elems.append(ColorRect(PAGE_W - 4*cm, 9*cm, BRAND_BLACK))
    elems.append(Spacer(1, -9*cm))  # overlap
    cover_table = Table([[
        Paragraph('COMPETITOR &amp; MARKET<br/>ANALYSIS REPORT', styles['cover_title']),
    ]], colWidths=[PAGE_W - 5*cm])
    cover_table.setStyle(TableStyle([
        ('LEFTPADDING', (0,0), (-1,-1), 24),
        ('TOPPADDING', (0,0), (-1,-1), 28),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    elems.append(cover_table)
    elems.append(Spacer(1, 0.4*cm))
    meta_table = Table([[
        Paragraph(f'ToP-R Solutions &nbsp;|&nbsp; BIM Consultancy<br/>'
                  f'UK &amp; Dubai Market Intelligence &nbsp;|&nbsp; {today}', styles['cover_meta']),
    ]], colWidths=[PAGE_W - 5*cm])
    meta_table.setStyle(TableStyle([
        ('LEFTPADDING', (0,0), (-1,-1), 24),
        ('BACKGROUND', (0,0), (-1,-1), BRAND_DARK),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
    ]))
    elems.append(meta_table)
    elems.append(Spacer(1, 1*cm))

    # Summary box
    intro_data = [[
        Paragraph('REPORT SCOPE', styles['section_label']),
    ],[
        Paragraph(
            'This report analyses the digital presence and service coverage of <b>5 active UK competitors</b> '
            'and <b>5 active Dubai/UAE competitors</b> against ToP-R Solutions. '
            'Each site is evaluated across service coverage (14 BIM/Survey services), '
            'website features (12 conversion/trust signals), and a maturity score across '
            '6 dimensions (Design, Trust, Content, Conversion, Technical, Positioning). '
            'A gap analysis identifies actionable opportunities.',
            styles['body']),
    ]]
    intro_t = Table(intro_data, colWidths=[PAGE_W - 5*cm])
    intro_t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BRAND_SURFACE),
        ('BOX', (0,0), (-1,-1), 0.5, BRAND_BORDER),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    elems.append(intro_t)
    elems.append(PageBreak())
    return elems


def section_header(title: str, subtitle: str, styles: dict, color=BRAND_BLACK) -> list:
    return [
        HRFlowable(width='100%', thickness=1, color=BRAND_BORDER, spaceAfter=8),
        Paragraph(title.upper(), styles['section_label']),
        Paragraph(title, styles['h1']),
        Paragraph(subtitle, styles['body']),
        Spacer(1, 0.3*cm),
    ]


def tick_cell(val: bool, blocked: bool) -> Paragraph:
    styles = get_styles()
    if blocked:
        return Paragraph('<font color="#A8A29E">?</font>', styles['body_sm'])
    if val:
        return Paragraph('<font color="#16A34A"><b>✓</b></font>', styles['body_sm'])
    return Paragraph('<font color="#E7E5E4">–</font>', styles['body_sm'])


def service_matrix_table(own: dict, competitors: list) -> Table:
    styles = get_styles()
    all_sites = [own] + competitors
    headers = ['Service'] + [s['label'] for s in all_sites]
    col_w = [4.2*cm] + [2.5*cm] * len(all_sites)

    # Header row — white text directly in ParagraphStyle (TableStyle TEXTCOLOR doesn't apply to Paragraphs)
    header_row = [Paragraph(h, ParagraphStyle('th', fontSize=7, fontName='Helvetica-Bold',
                             textColor=white, leading=10)) for h in headers]
    rows = [header_row]
    for service in SERVICES:
        row = [Paragraph(service, ParagraphStyle('td', fontSize=7.5, fontName='Helvetica',
                         textColor=BRAND_DARK, leading=11))]
        for site in all_sites:
            row.append(tick_cell(site['services'].get(service, False), site['blocked']))
        rows.append(row)

    t = Table(rows, colWidths=col_w)
    style = [
        ('BACKGROUND', (0,0), (-1,0), BRAND_BLACK),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [white, BRAND_SURFACE]),
        ('GRID', (0,0), (-1,-1), 0.3, BRAND_BORDER),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('ALIGN', (1,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        # Own site column highlight
        ('BACKGROUND', (1,1), (1,-1), HexColor('#EFF6FF')),
    ]
    t.setStyle(TableStyle(style))
    return t


def feature_matrix_table(own: dict, competitors: list) -> Table:
    styles = get_styles()
    all_sites = [own] + competitors
    headers = ['Website Feature'] + [s['label'] for s in all_sites]
    col_w = [4.2*cm] + [2.5*cm] * len(all_sites)

    header_row = [Paragraph(h, ParagraphStyle('th', fontSize=7, fontName='Helvetica-Bold',
                             textColor=white, leading=10)) for h in headers]
    rows = [header_row]
    for feature in FEATURES:
        row = [Paragraph(feature, ParagraphStyle('td', fontSize=7.5, fontName='Helvetica',
                         textColor=BRAND_DARK, leading=11))]
        for site in all_sites:
            row.append(tick_cell(site['features'].get(feature, False), site['blocked']))
        rows.append(row)

    t = Table(rows, colWidths=col_w)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BRAND_DARK),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [white, BRAND_SURFACE]),
        ('GRID', (0,0), (-1,-1), 0.3, BRAND_BORDER),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('ALIGN', (1,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (1,1), (1,-1), HexColor('#EFF6FF')),
    ]))
    return t


def maturity_table(own: dict, competitors: list) -> Table:
    styles = get_styles()
    all_sites = [own] + competitors
    # Find dim names from any non-blocked site
    dims = list(next((s['maturity'] for s in all_sites if s['maturity']), {}).keys())
    if not dims:
        return Paragraph('No maturity data available.', styles['body'])

    short_dims = [d.split('&')[0].strip().split('/')[0].strip() for d in dims]
    headers = ['Site'] + short_dims + ['TOTAL']
    col_w = [3.8*cm] + [2.0*cm]*len(dims) + [1.8*cm]

    header_row = [Paragraph(h, ParagraphStyle('th', fontSize=6.5, fontName='Helvetica-Bold',
                             textColor=white, leading=9, alignment=TA_CENTER)) for h in headers]
    rows = [header_row]

    for site in all_sites:
        label_style = ParagraphStyle('td_own' if site == own else 'td',
            fontSize=7.5, fontName='Helvetica-Bold' if site == own else 'Helvetica',
            textColor=BRAND_BLACK if site == own else BRAND_DARK, leading=11)

        if site['blocked']:
            row = [Paragraph(site['label'], label_style)]
            row += [Paragraph('?', styles['body_sm'])] * (len(dims) + 1)
        else:
            row = [Paragraph(site['label'], label_style)]
            total = site['maturity_total']
            max_total = site['maturity_max']
            for d in dims:
                s = site['maturity'].get(d, {}).get('score', 0)
                m = site['maturity'].get(d, {}).get('max', 0)
                pct = s / m if m else 0
                color = '#16A34A' if pct >= 0.75 else '#D97706' if pct >= 0.5 else '#DC2626'
                row.append(Paragraph(f'<font color="{color}"><b>{s}</b></font>/{m}',
                    ParagraphStyle('score', fontSize=7.5, fontName='Helvetica',
                                   textColor=BRAND_DARK, leading=11, alignment=TA_CENTER)))
            pct_total = total / max_total if max_total else 0
            tc = '#16A34A' if pct_total >= 0.7 else '#D97706' if pct_total >= 0.5 else '#DC2626'
            row.append(Paragraph(f'<font color="{tc}"><b>{total}</b></font>/{max_total}',
                ParagraphStyle('total', fontSize=8, fontName='Helvetica-Bold',
                               textColor=BRAND_BLACK, leading=12, alignment=TA_CENTER)))
        rows.append(row)

    t = Table(rows, colWidths=col_w)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HexColor('#1C1917')),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [white, BRAND_SURFACE]),
        ('GRID', (0,0), (-1,-1), 0.3, BRAND_BORDER),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('ALIGN', (1,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        # Own row highlight
        ('BACKGROUND', (0,1), (-1,1), HexColor('#EFF6FF')),
        ('FONTNAME', (0,1), (-1,1), 'Helvetica-Bold'),
    ]))
    return t


def gap_analysis_section(own: dict, competitors: list, styles: dict) -> list:
    elems = []
    gaps = {'service': [], 'feature': [], 'maturity': []}

    for service in SERVICES:
        comp_has = [s['label'] for s in competitors if s['services'].get(service) and not s['blocked']]
        own_has = own['services'].get(service, False) if not own['blocked'] else False
        if comp_has and not own_has:
            gaps['service'].append((service, comp_has))

    for feature in FEATURES:
        comp_has = [s['label'] for s in competitors if s['features'].get(feature) and not s['blocked']]
        own_has = own['features'].get(feature, False) if not own['blocked'] else False
        if comp_has and not own_has:
            gaps['feature'].append((feature, comp_has))

    if not own['blocked']:
        dims = list(own['maturity'].keys())
        for d in dims:
            own_score = own['maturity'].get(d, {}).get('score', 0)
            own_max   = own['maturity'].get(d, {}).get('max', 1)
            own_pct   = own_score / own_max
            comp_higher = [(s['label'], s['maturity'][d]['score'], s['maturity'][d]['max'])
                           for s in competitors if not s['blocked']
                           and s['maturity'].get(d, {}).get('score', 0) > own_score]
            if comp_higher:
                gaps['maturity'].append((d, own_score, own_max, comp_higher))

    # Service gaps
    if gaps['service']:
        elems.append(Paragraph('SERVICE GAPS', styles['section_label']))
        elems.append(Paragraph('Services detected on competitor sites but not on yours:', styles['body_sm']))
        elems.append(Spacer(1, 0.15*cm))
        for service, sites in gaps['service']:
            found_on = ', '.join(sites)
            elems.append(Paragraph(
                f'<b>{service}</b> — found on: {found_on}. '
                f'Consider a dedicated page or stronger keyword presence.',
                styles['gap_item']))
        elems.append(Spacer(1, 0.3*cm))

    # Feature gaps
    if gaps['feature']:
        elems.append(Paragraph('FEATURE GAPS', styles['section_label']))
        elems.append(Paragraph('Website features present on competitor sites but not detected on yours:', styles['body_sm']))
        elems.append(Spacer(1, 0.15*cm))
        for feature, sites in gaps['feature']:
            found_on = ', '.join(sites)
            elems.append(Paragraph(
                f'<b>{feature}</b> — present on: {found_on}.',
                styles['gap_item']))
        elems.append(Spacer(1, 0.3*cm))

    # Maturity gaps
    if gaps['maturity']:
        elems.append(Paragraph('MATURITY GAPS', styles['section_label']))
        elems.append(Paragraph('Dimensions where competitors score higher:', styles['body_sm']))
        elems.append(Spacer(1, 0.15*cm))
        for dim, own_s, own_m, comp_higher in gaps['maturity']:
            comp_str = ', '.join(f'{n} ({s}/{m})' for n, s, m in comp_higher)
            elems.append(Paragraph(
                f'<b>{dim}</b> — your score: {own_s}/{own_m}. Higher: {comp_str}.',
                styles['gap_item']))
        elems.append(Spacer(1, 0.3*cm))

    if not any(gaps.values()):
        elems.append(Paragraph('No significant gaps detected — your site matches or exceeds competitor coverage.', styles['body']))

    return elems


def site_profile_card(site: dict, styles: dict) -> Table:
    """A compact card showing one site's services and score."""
    score_text = f"{site['maturity_total']}/{site['maturity_max']}" if not site['blocked'] else "N/A"
    services_found = [s for s, v in site['services'].items() if v]
    features_found = [f for f, v in site['features'].items() if v]

    data = [
        [Paragraph(f'<b>{site["label"]}</b>', ParagraphStyle("cn", fontSize=9, fontName='Helvetica-Bold', textColor=BRAND_BLACK, leading=12)),
         Paragraph(f'Maturity: <b>{score_text}</b>', ParagraphStyle("cs", fontSize=9, fontName='Helvetica', textColor=BRAND_STONE, leading=12, alignment=TA_RIGHT))],
        [Paragraph(site['url'], ParagraphStyle("cu", fontSize=7, fontName='Helvetica', textColor=BRAND_MUTED, leading=10)),
         Paragraph('BLOCKED' if site['blocked'] else '', ParagraphStyle("cb", fontSize=7, fontName='Helvetica-Bold', textColor=BRAND_RED, leading=10, alignment=TA_RIGHT))],
        [Paragraph(
            '<b>Services:</b> ' + (', '.join(services_found) if services_found else 'None detected'),
            ParagraphStyle("sv", fontSize=7.5, fontName='Helvetica', textColor=BRAND_STONE, leading=11)),
         Paragraph('')],
        [Paragraph(
            '<b>Features:</b> ' + (', '.join(features_found) if features_found else 'None detected'),
            ParagraphStyle("ft", fontSize=7.5, fontName='Helvetica', textColor=BRAND_STONE, leading=11)),
         Paragraph('')],
    ]
    t = Table(data, colWidths=[10*cm, 5.5*cm])
    t.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, BRAND_BORDER),
        ('BACKGROUND', (0,0), (-1,0), BRAND_SURFACE),
        ('BACKGROUND', (0,1), (-1,1), white),
        ('BACKGROUND', (0,2), (-1,3), white),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('SPAN', (0,2), (-1,2)),
        ('SPAN', (0,3), (-1,3)),
        ('LINEBELOW', (0,1), (-1,1), 0.3, BRAND_BORDER),
    ]))
    return t


# ── Page template with header/footer ──────────────────────────────────────────
def make_page_template(doc):
    def on_page(canvas, doc):
        canvas.saveState()
        # Footer
        canvas.setFont('Helvetica', 7)
        canvas.setFillColor(BRAND_MUTED)
        canvas.drawString(doc.leftMargin, 1.5*cm,
                          'ToP-R Solutions — Confidential Market Intelligence Report')
        canvas.drawRightString(PAGE_W - doc.rightMargin, 1.5*cm,
                               f'Page {doc.page}  |  {date.today().isoformat()}')
        # Top rule
        canvas.setStrokeColor(BRAND_BORDER)
        canvas.setLineWidth(0.5)
        canvas.line(doc.leftMargin, PAGE_H - 2*cm, PAGE_W - doc.rightMargin, PAGE_H - 2*cm)
        # Top label
        canvas.setFont('Helvetica-Bold', 7)
        canvas.setFillColor(BRAND_STONE)
        canvas.drawString(doc.leftMargin, PAGE_H - 1.7*cm, 'ToP-R Solutions')
        canvas.setFont('Helvetica', 7)
        canvas.setFillColor(BRAND_MUTED)
        canvas.drawRightString(PAGE_W - doc.rightMargin, PAGE_H - 1.7*cm, 'BIM COMPETITOR ANALYSIS')
        canvas.restoreState()
    return on_page


# ── Main build ─────────────────────────────────────────────────────────────────
def build():
    today = date.today().isoformat()
    tmp_dir = ROOT / '.tmp'
    tmp_dir.mkdir(exist_ok=True)
    out_path = tmp_dir / f'ToP-R_Competitor_Analysis_{today}_v2.pdf'

    print('='*60)
    print('ToP-R Solutions — Competitor Analysis Report Generator')
    print(f'Date: {today}')
    print('='*60)

    # ── Fetch all sites ──
    print('\n[1/3] Analysing own site...')
    own = analyse_site(*OWN)

    print('\n[2/3] Analysing UK competitors...')
    uk_sites = [analyse_site(url, label) for url, label in UK_COMPETITORS]

    print('\n[3/3] Analysing Dubai competitors...')
    dubai_sites = [analyse_site(url, label) for url, label in DUBAI_COMPETITORS]

    all_competitors = uk_sites + dubai_sites

    # ── Build PDF ──
    print(f'\nBuilding PDF -> {out_path}')
    doc = SimpleDocTemplate(
        str(out_path),
        pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2.5*cm, bottomMargin=2.5*cm,
        title=f'ToP-R Solutions — Competitor Analysis {today}',
        author='ToP-R Solutions WAT Framework',
        subject='BIM Consultancy Market Analysis — UK & Dubai',
    )

    on_page = make_page_template(doc)
    styles = get_styles()
    story = []

    # ── Cover ──
    story += cover_page(styles, today)

    # ══════════════════════════════════════════════════════════════════
    # SECTION 1 — UK Market
    # ══════════════════════════════════════════════════════════════════
    story += section_header(
        'UK Market', 'Analysis of 5 active UK BIM consultancy competitors', styles, BRAND_BLUE)

    story.append(Paragraph('COMPETITOR PROFILES — UK', styles['section_label']))
    for site in uk_sites:
        story.append(site_profile_card(site, styles))
        story.append(Spacer(1, 0.3*cm))

    story.append(Spacer(1, 0.4*cm))
    story.append(Paragraph('SERVICE COVERAGE MATRIX — UK', styles['section_label']))
    story.append(Paragraph('✓ = detected on site  –  = not found  ? = site blocked/unreachable', styles['body_sm']))
    story.append(Spacer(1, 0.2*cm))
    story.append(service_matrix_table(own, uk_sites))
    story.append(Spacer(1, 0.5*cm))

    story.append(Paragraph('FEATURE MATRIX — UK', styles['section_label']))
    story.append(feature_matrix_table(own, uk_sites))
    story.append(Spacer(1, 0.5*cm))

    story.append(Paragraph('MATURITY SCORES — UK', styles['section_label']))
    story.append(Paragraph(
        'Scores are heuristic (structural + keyword). Green ≥ 75%, Amber ≥ 50%, Red < 50% of dimension maximum.',
        styles['body_sm']))
    story.append(Spacer(1, 0.2*cm))
    story.append(maturity_table(own, uk_sites))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════
    # SECTION 2 — Dubai Market
    # ══════════════════════════════════════════════════════════════════
    story += section_header(
        'Dubai & UAE Market', 'Analysis of 5 active Dubai/UAE BIM consultancy competitors', styles)

    story.append(Paragraph('COMPETITOR PROFILES — DUBAI / UAE', styles['section_label']))
    for site in dubai_sites:
        story.append(site_profile_card(site, styles))
        story.append(Spacer(1, 0.3*cm))

    story.append(Spacer(1, 0.4*cm))
    story.append(Paragraph('SERVICE COVERAGE MATRIX — DUBAI', styles['section_label']))
    story.append(Paragraph('✓ = detected  –  = not found  ? = blocked', styles['body_sm']))
    story.append(Spacer(1, 0.2*cm))
    story.append(service_matrix_table(own, dubai_sites))
    story.append(Spacer(1, 0.5*cm))

    story.append(Paragraph('FEATURE MATRIX — DUBAI', styles['section_label']))
    story.append(feature_matrix_table(own, dubai_sites))
    story.append(Spacer(1, 0.5*cm))

    story.append(Paragraph('MATURITY SCORES — DUBAI', styles['section_label']))
    story.append(Spacer(1, 0.2*cm))
    story.append(maturity_table(own, dubai_sites))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════
    # SECTION 3 — Combined View
    # ══════════════════════════════════════════════════════════════════
    story += section_header(
        'Combined View', 'All 10 competitors across both markets — service & maturity overview', styles)

    story.append(Paragraph('MATURITY SCORES — ALL MARKETS', styles['section_label']))
    story.append(Spacer(1, 0.2*cm))
    story.append(maturity_table(own, all_competitors))

    story.append(Spacer(1, 0.6*cm))
    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════
    # SECTION 4 — Gap Analysis
    # ══════════════════════════════════════════════════════════════════
    story += section_header(
        'Gap Analysis & Recommendations',
        'Services, features, and maturity dimensions where competitors outperform your current site.',
        styles)

    story.append(Paragraph('UK GAP ANALYSIS', styles['h2']))
    story += gap_analysis_section(own, uk_sites, styles)

    story.append(HRFlowable(width='100%', thickness=0.5, color=BRAND_BORDER, spaceAfter=8, spaceBefore=12))
    story.append(Paragraph('DUBAI / UAE GAP ANALYSIS', styles['h2']))
    story += gap_analysis_section(own, dubai_sites, styles)

    story.append(Spacer(1, 0.8*cm))
    story.append(HRFlowable(width='100%', thickness=0.5, color=BRAND_BORDER))
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph(
        f'Report generated {today} by ToP-R Solutions WAT Framework — tools/generate_report.py | '
        f'Scores are heuristic and repeatable. Re-run quarterly to track market movement.',
        styles['footer']))

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f'\nDONE. PDF saved: {out_path}')
    return out_path


if __name__ == '__main__':
    build()
