"""
CPIS Lean MVP v0.2 — Excel Workbook Generator
Generates: tools/CPIS_Lean_MVP_v0.2.xlsx

Gates:
  1. Planning Submission Gate         (PS01–PS12)
  2. Post-Consent/Pre-Demolition Gate (PC-LA, ASB, ARB, CDM, DEM — 58 milestones)
  3. Pre-Demolition Start Gate        (UTL, PW — 25 milestones)
  4. Substructure Design Freeze Gate  (SS01–SS10)

Sheets:
  1. Project Setup          — anchor dates, named ranges, demo instructions
  2. Milestone Library      — 105 milestone records
  3. Project Programme      — A–X (24 cols) with live formulas
  4. Sub-Tasks              — sub-task breakdown, seeded examples
  5. Gate Dashboard         — 4 gate cards, KPI summary
  6. Gate Scope of Work     — discipline-level scope per gate
  7. Document Register      — ~112 document rows (LA, PCD, CDM, ASB, ARB, DEM, PW, UTL, LOG)
  8. Programme Chart        — Gantt-style chart (~20 hard blockers)
  9. Lists                  — all dropdown sources
"""

import os
from openpyxl import Workbook
from openpyxl.styles import PatternFill, Font, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.workbook.defined_name import DefinedName
from openpyxl.formatting.rule import CellIsRule
from openpyxl.chart import BarChart, Reference, Series
from openpyxl.utils import get_column_letter

# ---------------------------------------------------------------------------
# COLOURS & STYLE HELPERS
# ---------------------------------------------------------------------------
C_NAVY     = "1F4E79"
C_BLUE2    = "2E75B6"
C_WHITE    = "FFFFFF"
C_LTBLUE   = "D9E1F2"
C_LTGREY   = "F2F2F2"
C_GREYBLUE = "BDD7EE"
C_GREEN_BG = "C6EFCE"; C_GREEN_FG = "276221"
C_AMBER_BG = "FFEB9C"; C_AMBER_FG = "9C5700"
C_RED_BG   = "FFC7CE"; C_RED_FG   = "9C0006"
C_GREY_BG  = "D9D9D9"

def hdr_fill(c=C_NAVY): return PatternFill("solid", fgColor=c)
def alt_fill():          return PatternFill("solid", fgColor=C_LTBLUE)
def grey_fill():         return PatternFill("solid", fgColor=C_LTGREY)

def hdr_font(sz=11):     return Font(bold=True, color=C_WHITE, size=sz, name="Calibri")
def body_font(sz=10, bold=False): return Font(size=sz, bold=bold, name="Calibri")
def lbl_font(sz=10):     return Font(size=sz, bold=True, name="Calibri")

def center():   return Alignment(horizontal="center", vertical="center", wrap_text=False)
def left(w=False): return Alignment(horizontal="left", vertical="center", wrap_text=w)

def thin_side(): return Side(style="thin")
def thin_border(): return Border(left=thin_side(), right=thin_side(), top=thin_side(), bottom=thin_side())
def bot_border():  return Border(bottom=thin_side())

def style_cell(c, fill=None, font=None, alignment=None, border=None, nf=None):
    if fill:      c.fill = fill
    if font:      c.font = font
    if alignment: c.alignment = alignment
    if border:    c.border = border
    if nf:        c.number_format = nf

def set_w(ws, col, w): ws.column_dimensions[get_column_letter(col)].width = w

# ---------------------------------------------------------------------------
# ANCHOR DATE NAMED RANGES
# ---------------------------------------------------------------------------
ANCHOR_CELLS = {
    "target_planning_submission_date": ("C", 13),
    "planning_consent_date":           ("C", 14),
    "target_demolition_date":          ("C", 15),
    "target_start_on_site_date":       ("C", 16),
    "target_substructure_start_date":  ("C", 17),
    "target_handover_date":            ("C", 18),
}
ANCHOR_LABELS = {
    "target_planning_submission_date": "Target Planning Submission Date",
    "planning_consent_date":           "Planning Consent Date",
    "target_demolition_date":          "Target Demolition Date",
    "target_start_on_site_date":       "Target Start on Site Date",
    "target_substructure_start_date":  "Target Substructure Start Date",
    "target_handover_date":            "Target Handover Date",
}

def _m(ref, gate, cluster, milestone, responsible, external, trigger, lead, calc,
        blocker, approval_type, doc_ref, evidence="", risk="", lead_basis="Industry benchmark"):
    return dict(ref=ref, gate=gate, cluster=cluster, milestone=milestone,
                responsible=responsible, external=external, trigger=trigger,
                lead=lead, calc=calc, blocker=blocker, approval_type=approval_type,
                doc_ref=doc_ref, evidence=evidence, risk=risk, lead_basis=lead_basis,
                phase="Pre-Construction", mvp="Yes")

G1 = "Planning Submission Gate"
G2 = "Post-Consent / Pre-Demolition Approvals Gate"
G3 = "Pre-Demolition Start Gate"
G4 = "Substructure Design Freeze Gate"

GATE_OWNERS = {
    G1: "PM / Architect",
    G2: "PM / Planning Consultant / Principal Designer",
    G3: "PM / Principal Contractor",
    G4: "PM / SE / Waterproofing Specialist",
}

GATE_PURPOSES = {
    G1: "Confirm all survey, design, and statutory inputs are ready before submitting the planning application.",
    G2: "Confirm all long-lead post-consent approvals, appointments, statutory notices, plans, and specialist reviews are in place or progressed before final demolition approval.",
    G3: "Final go/no-go check. Confirm all utility disconnections, asbestos clearance, RAMS, party wall awards, site logistics, welfare, and licence approvals are complete before demolition starts.",
    G4: "Confirm below-ground design, waterproofing, temporary works, drainage, penetrations, slab openings, and specialist items are coordinated before substructure works begin.",
}

# ---------------------------------------------------------------------------
# MILESTONE DATA — 105 milestones
# ---------------------------------------------------------------------------
MILESTONES = [
    # ── GATE 1: Planning Submission Gate ──────────────────────────────────
    _m("PS01", G1, "Surveys", "Topographic survey complete",
       "Surveyor", "", "target_planning_submission_date", 42, "before_anchor",
       "Hard Blocker", "Professional Review", "DEM-001",
       "Topographic survey report", "Planning drawings inaccurate",
       "Consultant appoint + mobilise + survey = 6 weeks"),
    _m("PS02", G1, "Surveys", "Below-ground utility survey complete",
       "Surveyor / Civil Engineer", "", "target_planning_submission_date", 42, "before_anchor",
       "Hard Blocker", "Professional Review", "UTL-001 / UTL-002",
       "Utility survey report", "Incorrect drainage strategy",
       "Consultant appoint + survey = 6 weeks"),
    _m("PS03", G1, "Surveys", "CCTV drainage survey complete",
       "Civil / Drainage Engineer", "", "target_planning_submission_date", 35, "before_anchor",
       "Hard Blocker", "Professional Review", "UTL-003",
       "CCTV survey report", "Drainage strategy unsupported",
       "Appoint + access + survey = 5 weeks"),
    _m("PS04", G1, "Geotechnical", "Geotechnical report issued",
       "Geotechnical Consultant", "", "target_planning_submission_date", 56, "before_anchor",
       "Hard Blocker", "Professional Review", "CDM-004",
       "Geotechnical report", "No ground data for BIA or structural design",
       "Appoint 2 wks + mobilise 2 wks + trial pits + lab + report = 8 wks"),
    _m("PS05", G1, "Trees", "Tree survey and RPZ plan complete",
       "Arboriculturalist", "", "target_planning_submission_date", 35, "before_anchor",
       "Hard Blocker", "Professional Review", "ARB-002",
       "BS5837 tree survey", "TPO / conservation objection at planning",
       "Appoint + survey + report = 5 weeks"),
    _m("PS06", G1, "Environment", "Phase 1 desk study complete",
       "Environmental Consultant", "", "target_planning_submission_date", 35, "before_anchor",
       "Soft Warning", "Professional Review", "",
       "Phase 1 desk study", "Contamination risk unassessed",
       "Appoint + desk research + report = 5 weeks"),
    _m("PS07", G1, "Architecture", "Planning drawings package issued",
       "Architect", "", "target_planning_submission_date", 14, "before_anchor",
       "Hard Blocker", "Internal Approval", "DEM-003",
       "Drawing issue sheet", "Incomplete application",
       "2 weeks before submission"),
    _m("PS08", G1, "Planning", "Design and Access Statement issued",
       "Architect / Planning Consultant", "", "target_planning_submission_date", 14, "before_anchor",
       "Hard Blocker", "Internal Approval", "",
       "DAS document", "Application invalid without DAS",
       "2 weeks before submission"),
    _m("PS09", G1, "Basement", "Basement Impact Assessment complete",
       "Architect / SE", "", "target_planning_submission_date", 14, "before_anchor",
       "Hard Blocker", "Internal Approval", "",
       "BIA report", "Application refused without BIA",
       "2 weeks before submission"),
    _m("PS10", G1, "Drainage", "Drainage strategy and SuDS assessment complete",
       "Civil / Drainage Engineer", "", "target_planning_submission_date", 14, "before_anchor",
       "Hard Blocker", "Internal Approval", "",
       "Drainage strategy report", "SuDS condition or delay",
       "2 weeks before submission"),
    _m("PS11", G1, "Energy", "Pre-construction SAP / energy input issued",
       "Energy Assessor", "", "target_planning_submission_date", 14, "before_anchor",
       "Soft Warning", "Professional Review", "",
       "SAP / energy report", "Energy condition may be attached",
       "2 weeks before submission"),
    _m("PS12", G1, "Submission", "Planning application submitted",
       "PM / Planning Consultant", "Council", "target_planning_submission_date", 0, "fixed_gate",
       "Hard Blocker", "Local Authority Approval", "PCD-001",
       "Submission receipt", "Programme delay",
       "Fixed to submission date"),

    # ── GATE 2: Post-Consent / Pre-Demolition Approvals Gate ──────────────
    # Planning Conditions
    _m("PC-LA01", G2, "Planning Conditions", "Planning decision notice received and filed",
       "PM / Planning Consultant", "Local Planning Authority", "planning_consent_date", 0, "fixed_gate",
       "Hard Blocker", "Local Authority Approval", "PCD-001",
       "Planning decision notice", "Cannot commence without consent",
       "Fixed to consent date"),
    _m("PC-LA02", G2, "Planning Conditions", "Planning conditions schedule prepared",
       "PM / Planning Consultant", "Internal", "planning_consent_date", 7, "after_anchor",
       "Hard Blocker", "Internal Approval", "PCD-002",
       "Conditions schedule", "Conditions unknown — commencement risk",
       "1 week after consent"),
    _m("PC-LA03", G2, "Planning Conditions", "Pre-commencement conditions tracker issued",
       "PM", "Internal", "planning_consent_date", 14, "after_anchor",
       "Hard Blocker", "Internal Approval", "PCD-003",
       "Conditions tracker", "No visibility of pre-commencement obligations",
       "2 weeks after consent"),
    _m("PC-LA04", G2, "Planning Conditions", "Pre-commencement conditions discharge pack submitted",
       "PM / Planning Consultant", "Local Planning Authority", "planning_consent_date", 28, "after_anchor",
       "Hard Blocker", "Planning Condition Discharge", "PCD-004",
       "Discharge submission pack", "Cannot start works",
       "4 weeks after consent"),
    _m("PC-LA05", G2, "Planning Conditions", "Pre-commencement conditions discharged in writing",
       "PM / Planning Consultant", "Local Planning Authority", "target_demolition_date", 14, "before_anchor",
       "Hard Blocker", "Planning Condition Discharge", "PCD-005",
       "Written approval", "Illegal commencement",
       "Written discharge required 14 days before demolition"),
    _m("PC-LA06", G2, "CIL / S106", "CIL / S106 obligations reviewed before commencement",
       "PM / QS / Solicitor", "Local Planning Authority", "target_start_on_site_date", 28, "before_anchor",
       "Soft Warning", "Local Authority Approval", "PCD-006",
       "CIL / S106 review note", "Financial liability risk",
       "28 days before start on site"),
    # CMP / DMP
    _m("PC-LA07", G2, "CMP / DMP", "Construction / Demolition Management Plan drafted",
       "PM / Main Contractor", "Internal", "target_demolition_date", 70, "before_anchor",
       "Hard Blocker", "Internal Approval", "LA-005",
       "Draft CMP / DMP", "Council submission delayed",
       "10 weeks before demolition"),
    _m("PC-LA08", G2, "CMP / DMP", "Construction / Demolition Management Plan submitted to council",
       "PM / Main Contractor", "Council", "target_demolition_date", 56, "before_anchor",
       "Hard Blocker", "Local Authority Approval", "LA-005",
       "CMP submission confirmation", "Approval delayed — demolition blocked",
       "8 weeks before demolition (council needs 4+ weeks to approve)"),
    _m("PC-LA09", G2, "CMP / DMP", "Construction / Demolition Management Plan approved / condition discharged",
       "PM", "Council", "target_demolition_date", 28, "before_anchor",
       "Hard Blocker", "Local Authority Approval", "LA-006",
       "Approval letter / condition discharge", "Cannot start demolition",
       "28 days before demolition"),
    # Section 80
    _m("PC-LA10", G2, "Demolition Notice", "Section 80 demolition notice prepared",
       "PM / Demolition Contractor", "Building Control", "target_demolition_date", 49, "before_anchor",
       "Hard Blocker", "Local Authority Notice", "LA-001",
       "Draft S80 notice", "Submission deadline missed",
       "7 weeks before demolition"),
    _m("PC-LA11", G2, "Demolition Notice", "Section 80 demolition notice submitted to council",
       "PM / Demolition Contractor", "Building Control", "target_demolition_date", 42, "before_anchor",
       "Hard Blocker", "Local Authority Notice", "LA-001",
       "S80 submission receipt", "Demolition illegal without S80",
       "42-day statutory minimum notice period"),
    _m("PC-LA12", G2, "Demolition Notice", "Section 81 counter notice / conditions received or 6-week period expired",
       "PM", "Building Control", "target_demolition_date", 0, "fixed_gate",
       "Hard Blocker", "Local Authority Approval", "LA-002",
       "Counter notice or expiry confirmation", "Cannot demolish before counter notice resolved",
       "Fixed — must be confirmed before demolition date"),
    # Section 61
    _m("PC-LA13", G2, "Section 61", "Section 61 prior consent application prepared",
       "PM / Main Contractor / Acoustic Consultant", "Environmental Health", "target_demolition_date", 63, "before_anchor",
       "Hard Blocker", "Local Authority Approval", "LA-003",
       "Draft S61 application", "Submission delayed — approval won't arrive in time",
       "9 weeks before demolition"),
    _m("PC-LA14", G2, "Section 61", "Section 61 prior consent submitted",
       "PM / Main Contractor", "Environmental Health", "target_demolition_date", 56, "before_anchor",
       "Hard Blocker", "Local Authority Approval", "LA-003",
       "S61 submission confirmation", "Cannot start demolition without consent",
       "8 weeks before demolition (28-day statutory minimum but 4 weeks contingency)"),
    _m("PC-LA15", G2, "Section 61", "Section 61 consent received with conditions",
       "PM", "Environmental Health", "target_demolition_date", 14, "before_anchor",
       "Hard Blocker", "Local Authority Approval", "LA-004",
       "S61 consent document", "Cannot proceed without consent",
       "14 days before demolition — must hold written consent"),
    # Highways Licences
    _m("PC-LA16", G2, "Highways Licences", "Hoarding licence application submitted if highway affected",
       "PM / Main Contractor", "Highways", "target_demolition_date", 42, "before_anchor",
       "Hard Blocker", "Local Authority Licence", "LA-007",
       "Hoarding licence application", "Cannot erect hoarding on highway",
       "6 weeks before demolition"),
    _m("PC-LA17", G2, "Highways Licences", "Hoarding licence approved if highway affected",
       "PM", "Highways", "target_demolition_date", 14, "before_anchor",
       "Hard Blocker", "Local Authority Licence", "LA-008",
       "Hoarding licence", "Works on highway without licence",
       "14 days before demolition"),
    _m("PC-LA18", G2, "Highways Licences", "Scaffold licence application submitted if required",
       "PM / Scaffold Contractor", "Highways", "target_demolition_date", 35, "before_anchor",
       "Conditional / If Required", "Local Authority Licence", "LA-009",
       "Scaffold licence application", "Cannot erect scaffold on highway",
       "5 weeks before demolition if required"),
    _m("PC-LA19", G2, "Highways Licences", "Scaffold licence approved if required",
       "PM", "Highways", "target_demolition_date", 14, "before_anchor",
       "Conditional / If Required", "Local Authority Licence", "LA-010",
       "Scaffold licence", "Works on highway without licence",
       "14 days before demolition"),
    _m("PC-LA20", G2, "Highways Licences", "Skip / waste container permit confirmed if placed on highway",
       "Main Contractor", "Highways", "target_demolition_date", 14, "before_anchor",
       "Conditional / If Required", "Local Authority Licence", "LA-011",
       "Skip permit", "Enforcement action",
       "14 days before demolition"),
    _m("PC-LA21", G2, "Highways Licences", "Parking bay suspension confirmed if required",
       "PM / Main Contractor", "Highways", "target_demolition_date", 21, "before_anchor",
       "Conditional / If Required", "Local Authority Licence", "LA-012",
       "Parking suspension approval", "Delivery access blocked",
       "3 weeks before demolition"),
    _m("PC-LA22", G2, "Highways Licences", "Temporary Traffic Order / restriction approved if required",
       "PM / Main Contractor", "Highways", "target_demolition_date", 42, "before_anchor",
       "Conditional / If Required", "Local Authority Approval", "LA-013",
       "TTO approval", "Cannot restrict traffic without approval",
       "6 weeks before demolition"),
    _m("PC-LA23", G2, "Highways Licences", "Temporary crossover / dropped kerb licence approved if required",
       "PM / Main Contractor", "Highways", "target_demolition_date", 42, "before_anchor",
       "Conditional / If Required", "Local Authority Licence", "LA-015",
       "Crossover licence", "Vehicle access not permitted",
       "6 weeks before demolition"),
    _m("PC-LA24", G2, "Highways / Legal", "S278 / S38 highways agreement confirmed if required",
       "PM / Legal / Highways Consultant", "Highways", "target_start_on_site_date", 84, "before_anchor",
       "Conditional / If Required", "Highways Approval", "LA-016",
       "S278 / S38 agreement", "Legal obligation — financial risk",
       "12 weeks minimum — legal process"),
    _m("PC-LA25", G2, "Conservation / Listed Building", "Conservation area / listed building demolition consent confirmed if applicable",
       "PM / Planning Consultant / Architect", "Local Planning Authority", "target_demolition_date", 56, "before_anchor",
       "Conditional / If Required", "Local Authority Approval", "LA-019",
       "Conservation / LBC consent", "Illegal demolition in conservation area",
       "8 weeks — planning determination period"),
    # Asbestos
    _m("ASB01", G2, "Asbestos", "Asbestos management survey reviewed",
       "PM / Asbestos Consultant", "Asbestos Consultant", "target_demolition_date", 56, "before_anchor",
       "Hard Blocker", "Evidence Only", "ASB-001",
       "Asbestos management survey", "Unknown ACM risk",
       "8 weeks before demolition"),
    _m("ASB02", G2, "Asbestos", "Refurbishment & Demolition asbestos survey instructed",
       "PM", "Asbestos Consultant", "target_demolition_date", 49, "before_anchor",
       "Hard Blocker", "Professional Review", "ASB-002",
       "R&D survey instruction", "Demolition illegal without R&D survey",
       "7 weeks before demolition"),
    _m("ASB03", G2, "Asbestos", "Refurbishment & Demolition asbestos survey complete",
       "Asbestos Consultant", "Asbestos Consultant", "target_demolition_date", 35, "before_anchor",
       "Hard Blocker", "Professional Review", "ASB-002",
       "R&D asbestos survey report", "HSE enforcement — illegal demolition",
       "5 weeks before demolition — survey access + lab time"),
    _m("ASB04", G2, "Asbestos", "Asbestos removal scope confirmed if ACMs identified",
       "PM / Asbestos Contractor", "Licensed Asbestos Contractor", "target_demolition_date", 28, "before_anchor",
       "Conditional / If Required", "Professional Review", "ASB-004",
       "Asbestos plan of work", "Cannot demolish with ACMs present",
       "28 days before demolition"),
    _m("ASB05", G2, "Asbestos", "ASB5 licensed asbestos notification submitted if applicable",
       "Licensed Asbestos Contractor", "HSE / Enforcing Authority", "target_demolition_date", 21, "before_anchor",
       "Conditional / If Required", "HSE / Enforcing Authority Notification", "ASB-005",
       "ASB5 notification receipt", "HSE enforcement — failure to notify",
       "Statutory 14-day minimum — 21 days recommended"),
    _m("ASB06", G2, "Asbestos", "NNLW notification submitted if applicable",
       "Asbestos Contractor", "HSE / Enforcing Authority", "target_demolition_date", 14, "before_anchor",
       "Conditional / If Required", "HSE / Enforcing Authority Notification", "ASB-006",
       "NNLW notification receipt", "HSE enforcement",
       "Statutory 3-day minimum — 14 days recommended"),
    _m("ASB07", G2, "Asbestos", "Licensed asbestos contractor appointed if required",
       "PM", "Licensed Asbestos Contractor", "target_demolition_date", 28, "before_anchor",
       "Conditional / If Required", "Internal Approval", "ASB-007",
       "Contractor appointment letter", "Removal cannot proceed",
       "28 days before demolition"),
    _m("ASB08", G2, "Asbestos", "Asbestos removal complete and clearance certificate issued if required",
       "Licensed Asbestos Contractor / Analyst", "Independent Analyst", "target_demolition_date", 7, "before_anchor",
       "Conditional / If Required", "Evidence Only", "ASB-009",
       "Four-stage clearance certificate", "Demolition cannot start",
       "7 days before demolition"),
    _m("ASB09", G2, "Hazardous Materials", "Hazardous materials / soft strip waste review complete",
       "Demolition Contractor", "Internal / Waste Contractor", "target_demolition_date", 21, "before_anchor",
       "Soft Warning", "Professional Review", "ASB-011",
       "Waste review record", "Waste compliance risk",
       "3 weeks before demolition"),
    # Arboriculture
    _m("ARB01", G2, "Trees / Arboriculture", "Arboriculturalist appointed",
       "PM", "Arboriculturalist", "target_demolition_date", 70, "before_anchor",
       "Conditional / If Required", "Professional Review", "ARB-001",
       "Appointment letter", "Tree works cannot proceed without specialist",
       "10 weeks before demolition"),
    _m("ARB02", G2, "Trees / Arboriculture", "Tree survey / BS5837 report complete",
       "Arboriculturalist", "Arboriculturalist", "target_demolition_date", 63, "before_anchor",
       "Conditional / If Required", "Professional Review", "ARB-002",
       "BS5837 tree survey", "Unknown TPO / root constraint",
       "9 weeks before demolition"),
    _m("ARB03", G2, "Trees / Arboriculture", "TPO / Conservation Area tree check complete",
       "Arboriculturalist / PM", "Local Planning Authority", "target_demolition_date", 63, "before_anchor",
       "Conditional / If Required", "Local Authority Approval", "ARB-004",
       "TPO check record", "Illegal tree removal — enforcement notice",
       "9 weeks before demolition"),
    _m("ARB04", G2, "Trees / Arboriculture", "Tree works / tree removal application submitted if TPO protected",
       "Arboriculturalist / PM", "Local Planning Authority", "target_demolition_date", 56, "before_anchor",
       "Conditional / If Required", "Local Authority Approval", "ARB-005",
       "TPO application submission", "8-week LPA determination period",
       "8 weeks before demolition"),
    _m("ARB05", G2, "Trees / Arboriculture", "Section 211 Conservation Area tree notice submitted if applicable",
       "Arboriculturalist / PM", "Local Planning Authority", "target_demolition_date", 42, "before_anchor",
       "Conditional / If Required", "Local Authority Notice", "ARB-006",
       "S211 notice", "6-week statutory notice period",
       "6 weeks before demolition — statutory minimum"),
    _m("ARB06", G2, "Trees / Arboriculture", "Tree works / tree removal consent received if required",
       "PM / Arboriculturalist", "Local Planning Authority", "target_demolition_date", 14, "before_anchor",
       "Conditional / If Required", "Local Authority Approval", "ARB-011",
       "TPO consent / no-objection", "Cannot remove protected tree",
       "14 days before demolition"),
    _m("ARB07", G2, "Trees / Arboriculture", "Arboricultural Impact Assessment / Method Statement issued",
       "Arboriculturalist", "Arboriculturalist", "target_demolition_date", 35, "before_anchor",
       "Conditional / If Required", "Professional Review", "ARB-007",
       "AIA / AMS report", "Root damage during demolition",
       "5 weeks before demolition"),
    _m("ARB08", G2, "Trees / Arboriculture", "Tree Protection Plan approved / condition discharged if required",
       "PM / Arboriculturalist", "Local Planning Authority", "target_demolition_date", 28, "before_anchor",
       "Conditional / If Required", "Planning Condition Discharge", "ARB-009",
       "Approved TPP", "Planning condition not discharged",
       "4 weeks before demolition"),
    _m("ARB09", G2, "Trees / Arboriculture", "Tree protection fencing installed and inspected before demolition",
       "Arboriculturalist / Main Contractor", "Arboriculturalist", "target_demolition_date", 7, "before_anchor",
       "Conditional / If Required", "Evidence Only", "ARB-010",
       "Inspection sign-off", "Root damage — planning enforcement",
       "7 days before demolition"),
    # CDM
    _m("CDM01", G2, "CDM Appointments", "Principal Designer formally appointed",
       "Client / PM", "Internal", "target_demolition_date", 84, "before_anchor",
       "Hard Blocker", "Internal Approval", "CDM-002",
       "PD appointment letter", "CDM breach — no PD appointed",
       "12 weeks before demolition"),
    _m("CDM02", G2, "CDM Appointments", "Principal Contractor formally appointed",
       "Client / PM", "Internal", "target_demolition_date", 70, "before_anchor",
       "Hard Blocker", "Internal Approval", "CDM-003",
       "PC appointment letter", "CDM breach — no PC appointed",
       "10 weeks before demolition"),
    _m("CDM03", G2, "CDM", "Pre-Construction Information pack issued",
       "Principal Designer / PM", "Internal", "target_demolition_date", 56, "before_anchor",
       "Hard Blocker", "Internal Approval", "CDM-004",
       "PCI pack", "PC cannot prepare CPP without PCI",
       "8 weeks before demolition"),
    _m("CDM04", G2, "CDM", "Construction Phase Plan issued",
       "Principal Contractor", "Principal Designer / Client", "target_demolition_date", 28, "before_anchor",
       "Hard Blocker", "Internal Approval", "CDM-005",
       "Construction Phase Plan", "Works cannot commence without CPP",
       "4 weeks before demolition"),
    _m("CDM05", G2, "CDM / HSE", "F10 submitted if project is notifiable",
       "Client / PD / PC", "HSE", "target_demolition_date", 14, "before_anchor",
       "Conditional / If Required", "HSE / Enforcing Authority Notification", "CDM-006",
       "F10 acknowledgement", "HSE enforcement — notifiable project",
       "Statutory — before works start on notifiable project"),
    _m("CDM06", G2, "CDM", "Demolition contractor competence and insurance checked",
       "PM / Principal Contractor", "Internal", "target_demolition_date", 28, "before_anchor",
       "Hard Blocker", "Internal Approval", "CDM-007",
       "Competence / insurance record", "Uninsured / incompetent contractor on site",
       "4 weeks before demolition"),
    _m("CDM07", G2, "CDM / Welfare", "Site welfare plan and emergency arrangements confirmed",
       "Principal Contractor", "Principal Designer / Client", "target_demolition_date", 14, "before_anchor",
       "Hard Blocker", "Internal Approval", "CDM-008",
       "Welfare plan / emergency arrangements", "CDM breach — welfare not in place",
       "14 days before demolition"),
    # Demolition Design
    _m("DEM01", G2, "Demolition Design", "Existing building / measured survey complete",
       "Surveyor / Architect", "Internal", "target_demolition_date", 70, "before_anchor",
       "Hard Blocker", "Professional Review", "DEM-001",
       "Measured survey report", "Demolition drawings inaccurate",
       "10 weeks before demolition"),
    _m("DEM02", G2, "Demolition Design", "Existing structural condition survey complete",
       "Structural Engineer", "Structural Engineer", "target_demolition_date", 56, "before_anchor",
       "Hard Blocker", "Professional Review", "DEM-002",
       "Structural condition survey", "Unknown structural risk during demolition",
       "8 weeks before demolition"),
    _m("DEM03", G2, "Demolition Design", "Architectural demolition extent drawings issued",
       "Architect", "PM / Design Team", "target_demolition_date", 42, "before_anchor",
       "Hard Blocker", "Professional Review", "DEM-003",
       "Demolition extent drawings", "Incorrect demolition scope",
       "6 weeks before demolition"),
    _m("DEM04", G2, "Demolition Design", "Retained structure / protection drawings issued",
       "Architect / SE", "PM / Design Team", "target_demolition_date", 35, "before_anchor",
       "Hard Blocker", "Professional Review", "DEM-004",
       "Retained structure drawings", "Retained elements damaged",
       "5 weeks before demolition"),
    _m("DEM05", G2, "Demolition Design", "Structural demolition review note issued",
       "Structural Engineer", "Structural Engineer", "target_demolition_date", 35, "before_anchor",
       "Hard Blocker", "Professional Review", "DEM-005",
       "Structural review note", "No structural sign-off on demolition method",
       "5 weeks before demolition"),
    _m("DEM06", G2, "Temporary Works", "Temporary works / propping strategy confirmed",
       "SE / Temporary Works Designer", "Principal Contractor / SE", "target_demolition_date", 28, "before_anchor",
       "Hard Blocker", "Professional Review", "DEM-006",
       "TW strategy / propping scheme", "Structural collapse risk during demolition",
       "4 weeks before demolition"),
    _m("DEM07", G2, "Demolition Methodology", "Demolition sequence / methodology issued",
       "Demolition Contractor", "Principal Contractor / PD", "target_demolition_date", 21, "before_anchor",
       "Hard Blocker", "Internal Approval", "DEM-007",
       "Demolition method statement", "No approved sequence",
       "3 weeks before demolition"),
    _m("DEM08", G2, "Demolition RAMS", "Demolition RAMS approved",
       "Demolition Contractor / PC", "Principal Contractor / PD", "target_demolition_date", 7, "before_anchor",
       "Hard Blocker", "Internal Approval", "DEM-008",
       "Signed RAMS approval", "CDM breach — works cannot start without approved RAMS",
       "7 days before demolition — statutory requirement"),

    # ── GATE 3: Pre-Demolition Start Gate ────────────────────────────────
    # Utilities
    _m("UTL01", G3, "Utilities / Services", "Existing services search / records complete",
       "PM / Civil Engineer", "Internal", "target_demolition_date", 56, "before_anchor",
       "Hard Blocker", "Evidence Only", "UTL-001",
       "Services search record", "Live services struck during demolition",
       "8 weeks before demolition"),
    _m("UTL02", G3, "Utilities / Services", "CAT & Genny survey complete",
       "Surveyor / Civil Engineer", "Internal", "target_demolition_date", 14, "before_anchor",
       "Hard Blocker", "Evidence Only", "UTL-002",
       "CAT & Genny survey record", "Live services struck during excavation",
       "14 days before demolition"),
    _m("UTL03", G3, "Utilities / Services", "CCTV drainage survey complete",
       "Civil / Drainage Engineer", "Internal", "target_demolition_date", 28, "before_anchor",
       "Hard Blocker", "Evidence Only", "UTL-003",
       "CCTV drainage survey", "Drainage conflict during demolition",
       "4 weeks before demolition"),
    _m("UTL04", G3, "Utilities / Services", "Service entry positions confirmed on demolition plan",
       "PM / Civil Engineer", "Internal", "target_demolition_date", 21, "before_anchor",
       "Hard Blocker", "Professional Review", "UTL-004",
       "Annotated demolition plan", "Services not identified and protected",
       "3 weeks before demolition"),
    _m("UTL05", G3, "Utilities / Services", "Utility disconnection schedule issued",
       "PM", "Internal", "target_demolition_date", 14, "before_anchor",
       "Hard Blocker", "Internal Approval", "UTL-005",
       "Disconnection schedule", "Disconnections not coordinated",
       "14 days before demolition"),
    _m("UTL06", G3, "Utilities / Services", "Gas disconnection application submitted",
       "PM / Utility Provider", "Cadent", "target_demolition_date", 56, "before_anchor",
       "Hard Blocker", "Utility Provider Approval", "UTL-006",
       "Cadent application confirmation", "Live gas during demolition — fatal risk",
       "Cadent standard lead time 8–12 weeks — 56 days minimum"),
    _m("UTL07", G3, "Utilities / Services", "Gas disconnection certificate received",
       "Utility Provider", "Cadent", "target_demolition_date", 7, "before_anchor",
       "Hard Blocker", "Utility Provider Approval", "UTL-007",
       "Gas disconnection certificate", "Live gas during demolition — fatal risk",
       "Certificate must be in hand 7 days before demolition"),
    _m("UTL08", G3, "Utilities / Services", "Electricity disconnection application submitted",
       "PM / Utility Provider", "UKPN", "target_demolition_date", 70, "before_anchor",
       "Hard Blocker", "Utility Provider Approval", "UTL-008",
       "UKPN application confirmation", "Live electricity during demolition — fatal risk",
       "UKPN 70+ days for LV disconnection — critical path item"),
    _m("UTL09", G3, "Utilities / Services", "Electricity disconnection certificate received",
       "Utility Provider", "UKPN", "target_demolition_date", 7, "before_anchor",
       "Hard Blocker", "Utility Provider Approval", "UTL-009",
       "UKPN disconnection certificate", "Live electricity during demolition — fatal risk",
       "Certificate must be in hand 7 days before demolition"),
    _m("UTL10", G3, "Utilities / Services", "Water capping / disconnection confirmed",
       "Utility Provider", "Thames Water", "target_demolition_date", 14, "before_anchor",
       "Hard Blocker", "Utility Provider Approval", "UTL-010",
       "Thames Water confirmation", "Flooding risk during demolition",
       "Thames Water 2–4 weeks standard lead time"),
    _m("UTL11", G3, "Utilities / Services", "Telecoms disconnection confirmed",
       "Utility Provider", "Openreach / Virgin", "target_demolition_date", 14, "before_anchor",
       "Soft Warning", "Utility Provider Approval", "UTL-012",
       "Telecoms disconnection confirmation", "Infrastructure damage claim",
       "Openreach / Virgin 2 weeks standard"),
    _m("UTL12", G3, "Utilities / Services", "Oil tank decommissioning certificate received if applicable",
       "Specialist Contractor", "Internal", "target_demolition_date", 14, "before_anchor",
       "Conditional / If Required", "Evidence Only", "UTL-013",
       "Decommissioning certificate", "Environmental contamination risk",
       "14 days before demolition"),
    _m("UTL13", G3, "Temporary Services", "Temporary builder's power strategy agreed",
       "Main Contractor", "Internal", "target_demolition_date", 14, "before_anchor",
       "Hard Blocker", "Internal Approval", "UTL-014",
       "Temporary power strategy", "Works delayed — no power on site",
       "14 days before demolition"),
    _m("UTL14", G3, "Temporary Services", "Temporary water supply strategy agreed",
       "Main Contractor", "Internal", "target_demolition_date", 14, "before_anchor",
       "Hard Blocker", "Internal Approval", "UTL-015",
       "Temporary water strategy", "Welfare / dust suppression unavailable",
       "14 days before demolition"),
    _m("UTL15", G3, "Temporary Services", "Temporary drainage / pumping strategy agreed",
       "Main Contractor", "Internal", "target_demolition_date", 14, "before_anchor",
       "Hard Blocker", "Internal Approval", "UTL-016",
       "Temporary drainage strategy", "Site flooding risk",
       "14 days before demolition"),
    _m("UTL16", G3, "Temporary Services", "Temporary welfare services confirmed live",
       "Main Contractor", "Internal", "target_demolition_date", 1, "before_anchor",
       "Hard Blocker", "Evidence Only", "UTL-017",
       "Welfare confirmation", "CDM breach — welfare required before works start",
       "Day before demolition starts"),
    # Party Wall / Neighbours
    _m("PW01", G3, "Party Wall", "Adjoining owner register complete",
       "Party Wall Surveyor / PM", "Internal", "target_demolition_date", 84, "before_anchor",
       "Hard Blocker", "Internal Approval", "PW-001",
       "Adjoining owner register", "Notices served to wrong parties",
       "12 weeks before demolition"),
    _m("PW02", G3, "Party Wall", "Party wall notices served",
       "Party Wall Surveyor", "Adjoining Owners", "target_demolition_date", 70, "before_anchor",
       "Hard Blocker", "Internal Approval", "PW-002",
       "Served notice copies", "Statutory notice periods not met",
       "10 weeks before demolition — 1 or 2 month notice periods"),
    _m("PW03", G3, "Party Wall", "Party wall responses tracked",
       "Party Wall Surveyor", "Adjoining Owners", "target_demolition_date", 42, "before_anchor",
       "Hard Blocker", "Internal Approval", "PW-003",
       "Response tracker", "No visibility of dissents / consents",
       "6 weeks before demolition"),
    _m("PW04", G3, "Party Wall", "Schedules of condition complete",
       "Party Wall Surveyor", "Adjoining Owners", "target_demolition_date", 28, "before_anchor",
       "Hard Blocker", "Professional Review", "PW-004",
       "Schedule of condition reports", "Dispute over pre-existing damage",
       "4 weeks before demolition"),
    _m("PW05", G3, "Party Wall", "Party wall awards agreed and signed",
       "Party Wall Surveyor", "Adjoining Owners", "target_demolition_date", 14, "before_anchor",
       "Hard Blocker", "Professional Review", "PW-005",
       "Signed party wall awards", "Adjoining owner injunction — works halted",
       "14 days before demolition — awards must be in place"),
    _m("PW06", G3, "Monitoring", "Movement / crack monitoring strategy agreed",
       "Party Wall Surveyor / Structural Engineer", "Internal", "target_demolition_date", 14, "before_anchor",
       "Hard Blocker", "Professional Review", "PW-006",
       "Monitoring strategy", "No baseline — dispute risk",
       "14 days before demolition"),
    _m("PW07", G3, "Monitoring", "Monitoring baseline readings recorded before demolition",
       "Monitoring Engineer", "Internal", "target_demolition_date", 1, "before_anchor",
       "Hard Blocker", "Evidence Only", "PW-007",
       "Baseline monitoring record", "No pre-demolition baseline — cannot defend damage claims",
       "Day before demolition starts"),
    _m("PW08", G3, "Neighbours", "Neighbour notification letters issued",
       "PM", "Neighbours", "target_demolition_date", 14, "before_anchor",
       "Soft Warning", "Internal Approval", "PW-008",
       "Notification record", "Complaint and reputational risk",
       "14 days before demolition"),
    _m("PW09", G3, "Neighbours", "Complaints / liaison contact route established",
       "PM", "Internal", "target_demolition_date", 7, "before_anchor",
       "Soft Warning", "Internal Approval", "PW-009",
       "Contact route / complaints procedure", "No route for neighbour concerns",
       "7 days before demolition"),

    # ── GATE 4: Substructure Design Freeze Gate ───────────────────────────
    _m("SS01", G4, "Structure", "Retention system design issued",
       "Structural Engineer", "", "target_substructure_start_date", 28, "before_anchor",
       "Hard Blocker", "Professional Review", "DEM-004",
       "Structural design package", "Substructure works cannot start",
       "4 weeks before substructure start"),
    _m("SS02", G4, "Temporary Works", "Temporary works design approved",
       "SE / Temporary Works Designer", "", "target_substructure_start_date", 21, "before_anchor",
       "Hard Blocker", "Professional Review", "DEM-006",
       "TW design approval", "CDM / safety breach — works without approved TW",
       "3 weeks before substructure start"),
    _m("SS03", G4, "Waterproofing", "BS8102 waterproofing strategy issued",
       "Waterproofing Specialist", "", "target_substructure_start_date", 28, "before_anchor",
       "Hard Blocker", "Professional Review", "",
       "Waterproofing strategy", "Below-ground waterproofing uncoordinated — warranty void",
       "4 weeks before substructure start"),
    _m("SS04", G4, "Drainage", "Below-ground drainage design issued",
       "Civil / Drainage Engineer", "", "target_substructure_start_date", 28, "before_anchor",
       "Hard Blocker", "Professional Review", "",
       "Drainage design drawings", "Drainage conflicts with waterproofing or structure",
       "4 weeks before substructure start"),
    _m("SS05", G4, "Waterproofing", "Puddle flange schedule issued",
       "MEP / Civil / Waterproofing", "", "target_substructure_start_date", 21, "before_anchor",
       "Hard Blocker", "Professional Review", "",
       "Puddle flange schedule", "Service penetrations not waterproofed — basement leaks",
       "3 weeks before substructure start"),
    _m("SS06", G4, "Access", "Basement access strategy confirmed",
       "PM / MC / SE", "", "target_substructure_start_date", 21, "before_anchor",
       "Hard Blocker", "Internal Approval", "",
       "Access strategy note", "Oversized plant cannot be installed post-slab",
       "3 weeks before substructure start"),
    _m("SS07", G4, "Access", "Slab openings for oversized equipment confirmed",
       "SE / MEP / PM", "", "target_substructure_start_date", 21, "before_anchor",
       "Hard Blocker", "Internal Approval", "",
       "Slab opening schedule", "Costly slab break-out required post-pour",
       "3 weeks before substructure start"),
    _m("SS08", G4, "Pumps", "Cavity drain and sump pump strategy issued",
       "Waterproofing / MEP", "", "target_substructure_start_date", 21, "before_anchor",
       "Hard Blocker", "Professional Review", "",
       "Pump strategy / drawings", "Basement flooding risk — pump pits not cast in",
       "3 weeks before substructure start"),
    _m("SS09", G4, "Lightning", "Lightning protection foundation electrode design issued",
       "Lightning Specialist", "", "target_substructure_start_date", 21, "before_anchor",
       "Hard Blocker", "Professional Review", "",
       "Electrode design", "Foundation electrode cannot be retro-fitted after slab",
       "3 weeks before substructure start"),
    _m("SS10", G4, "Building Control", "BC hold points agreed",
       "PM / Building Control", "Building Control", "target_substructure_start_date", 14, "before_anchor",
       "Hard Blocker", "Building Control Approval", "",
       "BC inspection schedule", "BC inspection missed — works uncertified",
       "2 weeks before substructure start"),
]

# ── Programme chart priority milestones ──────────────────────────────────
CHART_REFS = {
    "PS04","PS07","PS09","PS10",
    "PC-LA08","PC-LA09","PC-LA15","ASB03","CDM01","CDM02","CDM03","DEM05",
    "UTL07","UTL09","UTL10","PW05","PW07",
    "SS02","SS03","SS05","SS09",
}

# ── Document Register data ────────────────────────────────────────────────
DOC_REGISTER = [
    # LA
    ("LA-001","Section 80 Demolition Notice",G2,"Local Authority Notice","PM / Demolition Contractor","Building Control","Pre-Demolition","42 days before demolition"),
    ("LA-002","Section 81 Counter Notice / Demolition Conditions",G2,"Local Authority Approval","Building Control","Building Control","Pre-Demolition","Before demolition"),
    ("LA-003","Section 61 Prior Consent Application",G2,"Local Authority Approval","PM / Contractor","Environmental Health","Pre-Demolition","56 days before demolition"),
    ("LA-004","Section 61 Consent / Conditions",G2,"Local Authority Approval","Environmental Health","Environmental Health","Pre-Demolition","14 days before demolition"),
    ("LA-005","Construction / Demolition Management Plan Submission",G2,"Local Authority Approval","PM / Main Contractor","Council","Pre-Demolition","56 days before demolition"),
    ("LA-006","Construction / Demolition Management Plan Approval",G2,"Local Authority Approval","Council","Council","Pre-Demolition","28 days before demolition"),
    ("LA-007","Hoarding Licence Application",G2,"Local Authority Licence","PM / Main Contractor","Highways","Pre-Demolition","42 days before demolition"),
    ("LA-008","Hoarding Licence Approval",G2,"Local Authority Licence","Highways","Highways","Pre-Demolition","14 days before demolition"),
    ("LA-009","Scaffold Licence Application",G2,"Local Authority Licence","PM / Scaffold Contractor","Highways","Pre-Demolition","35 days if required"),
    ("LA-010","Scaffold Licence Approval",G2,"Local Authority Licence","Highways","Highways","Pre-Demolition","14 days if required"),
    ("LA-011","Skip / Waste Container Permit",G2,"Local Authority Licence","Main Contractor","Highways","Pre-Demolition","14 days if highway affected"),
    ("LA-012","Parking Bay Suspension Approval",G2,"Local Authority Licence","PM / Main Contractor","Highways","Pre-Demolition","21 days if required"),
    ("LA-013","Temporary Traffic Order / Restriction Approval",G2,"Local Authority Approval","PM / Main Contractor","Highways","Pre-Demolition","42 days if required"),
    ("LA-014","Temporary Crossover / Dropped Kerb Licence Application",G2,"Local Authority Licence","PM / Main Contractor","Highways","Pre-Demolition","42 days if required"),
    ("LA-015","Temporary Crossover / Dropped Kerb Licence Approval",G2,"Local Authority Licence","Highways","Highways","Pre-Demolition","42 days if required"),
    ("LA-016","S278 / S38 Highways Agreement Confirmation",G2,"Highways Approval","PM / Legal","Highways","Pre-Demolition","84 days if required"),
    ("LA-017","Road Opening / Footway Opening Licence",G2,"Local Authority Licence","Main Contractor","Highways","During Works","As required"),
    ("LA-018","Crane / Hoist / Oversail Highway Licence",G2,"Local Authority Licence","Main Contractor","Highways","During Works","As required"),
    ("LA-019","Conservation Area Demolition Consent",G2,"Local Authority Approval","PM / Planning Consultant","Local Planning Authority","Pre-Demolition","56 days if applicable"),
    ("LA-020","Listed Building Consent",G2,"Local Authority Approval","PM / Planning Consultant","Local Planning Authority","Pre-Demolition","56 days if applicable"),
    # PCD
    ("PCD-001","Planning Decision Notice",G2,"Local Authority Approval","Local Planning Authority","Local Planning Authority","Post-Consent","On consent date"),
    ("PCD-002","Planning Conditions Schedule",G2,"Internal Approval","PM / Planning Consultant","Internal","Post-Consent","7 days after consent"),
    ("PCD-003","Pre-Commencement Conditions Tracker",G2,"Internal Approval","PM","Internal","Post-Consent","14 days after consent"),
    ("PCD-004","Condition Discharge Submission Pack",G2,"Planning Condition Discharge","PM / Planning Consultant","Local Planning Authority","Post-Consent","28 days after consent"),
    ("PCD-005","Written Approval of Pre-Commencement Conditions",G2,"Planning Condition Discharge","Local Planning Authority","Local Planning Authority","Pre-Demolition","14 days before demolition"),
    ("PCD-006","CIL Liability Notice / Demand Notice",G2,"Local Authority Approval","Council","Council","Pre-Commencement","Before start on site"),
    ("PCD-007","S106 Obligations Confirmation",G2,"Local Authority Approval","Solicitor / PM","Council / Legal","Pre-Commencement","Before start on site"),
    ("PCD-008","Biodiversity / Ecology Condition Discharge",G2,"Planning Condition Discharge","Ecologist / PM","Local Planning Authority","Pre-Demolition","As required"),
    # CDM
    ("CDM-001","Client CDM Appointment Record",G2,"Internal Approval","Client / PM","Internal","Pre-Demolition","Before works start"),
    ("CDM-002","Principal Designer Appointment",G2,"Internal Approval","Client / PM","Internal","Pre-Demolition","Before design starts"),
    ("CDM-003","Principal Contractor Appointment",G2,"Internal Approval","Client / PM","Internal","Pre-Demolition","Before construction starts"),
    ("CDM-004","Pre-Construction Information Pack",G2,"Internal Approval","Principal Designer / PM","Internal","Pre-Demolition","Before works start"),
    ("CDM-005","Construction Phase Plan",G2,"Internal Approval","Principal Contractor","Principal Designer","Pre-Demolition","Before works start"),
    ("CDM-006","F10 Notification",G2,"HSE / Enforcing Authority Notification","Client / PD / PC","HSE","Pre-Demolition","Before notifiable works start"),
    ("CDM-007","Contractor Competence / Insurance Checks",G2,"Internal Approval","PM / PC","Internal","Pre-Demolition","Before works start"),
    ("CDM-008","Site Welfare Plan",G2,"Internal Approval","Principal Contractor","Principal Designer","Pre-Demolition","Before works start"),
    ("CDM-009","Emergency Arrangements / Site Rules",G2,"Internal Approval","Principal Contractor","Internal","Pre-Demolition","Before works start"),
    # ASB
    ("ASB-001","Asbestos Management Survey",G2,"Evidence Only","Asbestos Consultant","PM","Pre-Demolition","8 weeks before demolition"),
    ("ASB-002","Refurbishment & Demolition Asbestos Survey",G2,"Professional Review","Asbestos Consultant","PM","Pre-Demolition","5–7 weeks before demolition"),
    ("ASB-003","Asbestos Register / Risk Assessment",G2,"Evidence Only","Asbestos Consultant","PM","Pre-Demolition","With R&D survey"),
    ("ASB-004","Asbestos Plan of Work",G2,"Professional Review","Licensed Asbestos Contractor","PM","Pre-Demolition","4 weeks before demolition if required"),
    ("ASB-005","ASB5 Licensed Asbestos Notification Receipt",G2,"HSE / Enforcing Authority Notification","Licensed Asbestos Contractor","HSE","Pre-Demolition","14-day statutory minimum"),
    ("ASB-006","NNLW Notification Receipt",G2,"HSE / Enforcing Authority Notification","Asbestos Contractor","HSE","Pre-Demolition","3-day statutory minimum"),
    ("ASB-007","Licensed Asbestos Contractor Appointment",G2,"Internal Approval","PM","Internal","Pre-Demolition","If ACMs found"),
    ("ASB-008","Air Monitoring Strategy",G2,"Professional Review","Asbestos Analyst","PM","Pre-Demolition","If licensed works required"),
    ("ASB-009","Four-Stage Clearance Certificate",G2,"Evidence Only","Independent Analyst","PM","Pre-Demolition","7 days before demolition if required"),
    ("ASB-010","Certificate of Reoccupation",G2,"Evidence Only","Independent Analyst","PM","Post-Removal","After licensed removal"),
    ("ASB-011","Hazardous Materials / Soft Strip Waste Review",G2,"Professional Review","Demolition Contractor","PM","Pre-Demolition","3 weeks before demolition"),
    ("ASB-012","Waste Consignment Notes / Hazardous Waste Transfer Records",G3,"Evidence Only","Demolition Contractor","PM","During Demolition","During works"),
    # ARB
    ("ARB-001","Arboriculturalist Appointment",G2,"Professional Review","PM","PM","Pre-Demolition","10 weeks if trees present"),
    ("ARB-002","Tree Survey / BS5837 Report",G2,"Professional Review","Arboriculturalist","PM","Pre-Demolition","9 weeks before demolition"),
    ("ARB-003","Tree Constraints Plan",G2,"Professional Review","Arboriculturalist","PM","Pre-Demolition","With tree survey"),
    ("ARB-004","TPO / Conservation Area Tree Check",G2,"Local Authority Approval","Arboriculturalist / PM","Local Planning Authority","Pre-Demolition","9 weeks before demolition"),
    ("ARB-005","Tree Works / Tree Removal Application",G2,"Local Authority Approval","Arboriculturalist / PM","Local Planning Authority","Pre-Demolition","8 weeks before demolition if TPO"),
    ("ARB-006","Section 211 Conservation Area Tree Notice",G2,"Local Authority Notice","Arboriculturalist / PM","Local Planning Authority","Pre-Demolition","6 weeks before demolition"),
    ("ARB-007","Arboricultural Impact Assessment",G2,"Professional Review","Arboriculturalist","PM","Pre-Demolition","5 weeks before demolition"),
    ("ARB-008","Arboricultural Method Statement",G2,"Professional Review","Arboriculturalist","PM","Pre-Demolition","5 weeks before demolition"),
    ("ARB-009","Tree Protection Plan",G2,"Planning Condition Discharge","Arboriculturalist / PM","Local Planning Authority","Pre-Demolition","4 weeks before demolition"),
    ("ARB-010","Tree Protection Fencing Inspection / Sign-Off",G2,"Evidence Only","Arboriculturalist","PM","Pre-Demolition","7 days before demolition"),
    ("ARB-011","Tree Removal Approval / Consent",G2,"Local Authority Approval","Local Planning Authority","Local Planning Authority","Pre-Demolition","14 days before demolition"),
    ("ARB-012","Replacement Planting Requirement",G2,"Planning Condition Discharge","PM / Landscape Architect","Local Planning Authority","Post-Construction","As condition requires"),
    # DEM
    ("DEM-001","Existing Building / Measured Survey",G2,"Professional Review","Surveyor / Architect","PM","Pre-Demolition","10 weeks before demolition"),
    ("DEM-002","Existing Structural Condition Survey",G2,"Professional Review","Structural Engineer","PM","Pre-Demolition","8 weeks before demolition"),
    ("DEM-003","Architectural Demolition Extent Drawings",G2,"Professional Review","Architect","PM","Pre-Demolition","6 weeks before demolition"),
    ("DEM-004","Retained Structure / Protection Drawings",G2,"Professional Review","Architect / SE","PM","Pre-Demolition","5 weeks before demolition"),
    ("DEM-005","Structural Demolition Review Note",G2,"Professional Review","Structural Engineer","PM","Pre-Demolition","5 weeks before demolition"),
    ("DEM-006","Temporary Works / Propping Strategy",G2,"Professional Review","SE / TW Designer","PC","Pre-Demolition","4 weeks before demolition"),
    ("DEM-007","Demolition Sequence / Methodology",G2,"Internal Approval","Demolition Contractor","PC / PD","Pre-Demolition","3 weeks before demolition"),
    ("DEM-008","Demolition RAMS",G2,"Internal Approval","Demolition Contractor / PC","PC / PD","Pre-Demolition","7 days before demolition"),
    ("DEM-009","Soft Strip Plan",G2,"Internal Approval","Demolition Contractor","PM","Pre-Demolition","3 weeks before demolition"),
    ("DEM-010","Waste Management Plan",G2,"Internal Approval","Demolition Contractor","PM","Pre-Demolition","3 weeks before demolition"),
    ("DEM-011","Dust / Noise / Vibration Control Plan",G2,"Internal Approval","Demolition Contractor / Acoustic","PM / Council","Pre-Demolition","With S61 submission"),
    ("DEM-012","Neighbour Protection Plan",G3,"Internal Approval","Main Contractor","PM","Pre-Demolition","14 days before demolition"),
    ("DEM-013","Demolition Contractor Appointment / Competence Record",G2,"Internal Approval","PM / PC","Internal","Pre-Demolition","4 weeks before demolition"),
    ("DEM-014","Principal Contractor Approval of Demolition RAMS",G2,"Internal Approval","Principal Contractor","PC","Pre-Demolition","7 days before demolition"),
    ("DEM-015","Principal Designer Review of Demolition RAMS",G2,"Internal Approval","Principal Designer","PD","Pre-Demolition","7 days before demolition"),
    # PW
    ("PW-001","Adjoining Owner Register",G3,"Internal Approval","Party Wall Surveyor / PM","PM","Pre-Demolition","12 weeks before demolition"),
    ("PW-002","Party Wall Notices Served",G3,"Internal Approval","Party Wall Surveyor","Adjoining Owners","Pre-Demolition","10 weeks before demolition"),
    ("PW-003","Party Wall Response Tracker",G3,"Internal Approval","Party Wall Surveyor","PM","Pre-Demolition","6 weeks before demolition"),
    ("PW-004","Schedule of Condition Reports",G3,"Professional Review","Party Wall Surveyor","PM / Adjoining Owner","Pre-Demolition","4 weeks before demolition"),
    ("PW-005","Party Wall Awards",G3,"Professional Review","Party Wall Surveyor","Adjoining Owners","Pre-Demolition","14 days before demolition"),
    ("PW-006","Movement / Crack Monitoring Strategy",G3,"Professional Review","PW Surveyor / SE","PM","Pre-Demolition","14 days before demolition"),
    ("PW-007","Monitoring Baseline Readings",G3,"Evidence Only","Monitoring Engineer","PM","Pre-Demolition","Day before demolition"),
    ("PW-008","Neighbour Notification Letters",G3,"Internal Approval","PM","Neighbours","Pre-Demolition","14 days before demolition"),
    ("PW-009","Complaints / Liaison Contact Route",G3,"Internal Approval","PM","Internal","Pre-Demolition","7 days before demolition"),
    # UTL
    ("UTL-001","Existing Services Search / Utility Records",G3,"Evidence Only","PM / Civil Engineer","PM","Pre-Demolition","8 weeks before demolition"),
    ("UTL-002","CAT & Genny Survey",G3,"Evidence Only","Surveyor / Civil Engineer","PM","Pre-Demolition","14 days before demolition"),
    ("UTL-003","CCTV Drainage Survey",G3,"Evidence Only","Civil / Drainage Engineer","PM","Pre-Demolition","4 weeks before demolition"),
    ("UTL-004","Service Entry Position Survey",G3,"Professional Review","PM / Civil Engineer","PM","Pre-Demolition","3 weeks before demolition"),
    ("UTL-005","Utility Disconnection Schedule",G3,"Internal Approval","PM","PM","Pre-Demolition","14 days before demolition"),
    ("UTL-006","Gas Disconnection Application",G3,"Utility Provider Approval","PM / Cadent","Cadent","Pre-Demolition","56 days before demolition"),
    ("UTL-007","Gas Disconnection Confirmation / Certificate",G3,"Utility Provider Approval","Cadent","Cadent","Pre-Demolition","7 days before demolition"),
    ("UTL-008","Electricity Disconnection Application",G3,"Utility Provider Approval","PM / UKPN","UKPN","Pre-Demolition","70 days before demolition"),
    ("UTL-009","Electricity Disconnection Confirmation / Certificate",G3,"Utility Provider Approval","UKPN","UKPN","Pre-Demolition","7 days before demolition"),
    ("UTL-010","Water Disconnection / Capping Application",G3,"Utility Provider Approval","PM / Thames Water","Thames Water","Pre-Demolition","14 days before demolition"),
    ("UTL-011","Water Capping Confirmation",G3,"Utility Provider Approval","Thames Water","Thames Water","Pre-Demolition","14 days before demolition"),
    ("UTL-012","Telecoms Disconnection Confirmation",G3,"Utility Provider Approval","Openreach / Virgin","Openreach / Virgin","Pre-Demolition","14 days before demolition"),
    ("UTL-013","Oil Tank Decommissioning Certificate",G3,"Evidence Only","Specialist Contractor","PM","Pre-Demolition","14 days if applicable"),
    ("UTL-014","Temporary Builder's Power Strategy",G3,"Internal Approval","Main Contractor","PM","Pre-Demolition","14 days before demolition"),
    ("UTL-015","Temporary Water Supply Strategy",G3,"Internal Approval","Main Contractor","PM","Pre-Demolition","14 days before demolition"),
    ("UTL-016","Temporary Drainage / Pumping Strategy",G3,"Internal Approval","Main Contractor","PM","Pre-Demolition","14 days before demolition"),
    ("UTL-017","Temporary Welfare Services Confirmation",G3,"Evidence Only","Main Contractor","PM","Pre-Demolition","Day before demolition"),
    # LOG
    ("LOG-001","Site Logistics Plan",G3,"Internal Approval","Main Contractor / PM","PM","Pre-Demolition","14 days before demolition"),
    ("LOG-002","Delivery / Vehicle Routing Plan",G3,"Internal Approval","Main Contractor","PM","Pre-Demolition","14 days before demolition"),
    ("LOG-003","Traffic Management Plan",G3,"Internal Approval","Main Contractor","PM / Highways","Pre-Demolition","14 days before demolition"),
    ("LOG-004","Muck-Away Strategy",G3,"Internal Approval","Main Contractor","PM","Pre-Demolition","14 days before demolition"),
    ("LOG-005","Wheel Wash / Road Cleaning Plan",G3,"Internal Approval","Main Contractor","PM","Pre-Demolition","14 days before demolition"),
    ("LOG-006","Banksman / Delivery Management Plan",G3,"Internal Approval","Main Contractor","PM","Pre-Demolition","Before works start"),
    ("LOG-007","Hoarding Layout Drawing",G3,"Internal Approval","Main Contractor","PM","Pre-Demolition","14 days before demolition"),
    ("LOG-008","Scaffold Design / Layout",G3,"Professional Review","Scaffold Contractor","PM / PC","Pre-Demolition","14 days if required"),
    ("LOG-009","Temporary Pedestrian Management Plan",G3,"Internal Approval","Main Contractor","PM / Highways","Pre-Demolition","14 days before demolition"),
    ("LOG-010","Site Waste Management / Waste Carrier Evidence",G3,"Evidence Only","Main Contractor","PM","During Works","Ongoing"),
]

# ── Gate Scope data ───────────────────────────────────────────────────────
GATE_SCOPE = [
    (G1,"PM","Coordinate consultant appointments, survey access, and planning submission readiness","Submission tracker / readiness checklist","Hard Blocker"),
    (G1,"Architect","Prepare planning drawings, DAS, plans, elevations, sections, roof plan","Drawing issue sheet / DAS","Hard Blocker"),
    (G1,"Structural Engineer","Provide basement structural methodology input for BIA","SE method statement input","Hard Blocker"),
    (G1,"Civil / Drainage Engineer","Prepare drainage strategy, SuDS assessment, drainage system review","Drainage strategy report","Hard Blocker"),
    (G1,"Surveyor","Complete topographic, measured, utility and drainage survey inputs","Survey reports","Hard Blocker"),
    (G1,"Arboriculturalist","Complete tree survey, RPZ plan and TPO/conservation checks","BS5837 tree report","Hard Blocker"),
    (G1,"Energy Assessor","Provide pre-construction SAP / energy / overheating input","Energy report","Soft Warning"),
    (G2,"PM","Coordinate all long-lead approvals: CMP/DMP, S80, S61, planning conditions, CDM appointments, consultant reviews","Approval tracker / gate checklist","Hard Blocker"),
    (G2,"Planning Consultant","Track and discharge pre-commencement planning conditions. Manage S106 / CIL obligations","Conditions discharge confirmation","Hard Blocker"),
    (G2,"Architect","Issue demolition extent drawings, retained structure drawings, coordinate design team during approval period","Drawing issue record","Hard Blocker"),
    (G2,"Structural Engineer","Complete structural condition survey, issue demolition review note, confirm temporary works strategy","SE review notes / TW strategy","Hard Blocker"),
    (G2,"Demolition Contractor","Prepare demolition sequence, methodology, RAMS, waste management and soft strip plan","Approved RAMS / methodology","Hard Blocker"),
    (G2,"Principal Designer","Review CDM compliance, issue pre-construction information pack, review RAMS","PCI pack / PD sign-off","Hard Blocker"),
    (G2,"Asbestos Consultant","Complete R&D survey, confirm asbestos scope, manage notifications (ASB5 / NNLW) if required","R&D survey / clearance evidence","Hard Blocker"),
    (G2,"Arboriculturalist","Complete tree survey, confirm TPO / conservation status, manage applications, install tree protection","AIA / AMS / protection sign-off","Conditional / If Required"),
    (G2,"Council / Environmental Health","Obtain S61 prior consent, CMP/DMP approval, hoarding licence, and confirm planning condition discharge","S61 consent / CMP approval / licences","Hard Blocker"),
    (G3,"PM","Confirm all utility disconnections, asbestos clearance, party wall awards, RAMS, logistics, welfare in place","Final gate checklist","Hard Blocker"),
    (G3,"Principal Contractor","Confirm site logistics plan, temporary services, welfare, banksman, road cleaning and hoarding in place","PC confirmation / logistics plan","Hard Blocker"),
    (G3,"Utility Providers","Confirm gas, electricity, water and telecoms disconnections/capping certificates received","Written disconnection certificates","Hard Blocker"),
    (G3,"Party Wall Surveyor","Confirm awards, schedules of condition, monitoring strategy and baseline readings","Signed awards / baseline records","Hard Blocker"),
    (G3,"Monitoring Engineer","Install monitoring points, record baseline readings before demolition starts","Baseline monitoring report","Hard Blocker"),
    (G3,"CDM / Welfare","Confirm welfare live, emergency arrangements in place, site rules issued","Welfare confirmation / emergency record","Hard Blocker"),
    (G4,"PM / BIM Lead","Coordinate design freeze, clash review, opening schedule and gate readiness","Coordination tracker / design freeze checklist","Hard Blocker"),
    (G4,"Structural Engineer","Issue retention system, piling, temporary works, slab opening and pour strategy","Structural package / TW approval","Hard Blocker"),
    (G4,"Waterproofing Specialist","Issue BS8102 waterproofing strategy, cavity drain, sump/pump and warranty requirements","Waterproofing strategy","Hard Blocker"),
    (G4,"Civil / Drainage Engineer","Issue below-ground drainage design and coordinate penetrations through waterproofing","Drainage drawings / schedules","Hard Blocker"),
    (G4,"MEP Engineer","Confirm service penetrations, builder's work openings and basement plant access","BWO / penetration schedule","Hard Blocker"),
    (G4,"Lightning Specialist","Confirm foundation electrode design and cast-in requirements before slab pour","Electrode design","Hard Blocker"),
    (G4,"Building Control","Confirm inspection schedule and hold points","BC inspection schedule","Hard Blocker"),
]

# ── Sub-task seed data ────────────────────────────────────────────────────
SUBTASKS_SEED = [
    ("UTL06","Gas disconnection application submitted","Identify gas meter location and service entry","PM",None),
    ("UTL06","Gas disconnection application submitted","Contact Cadent and request disconnection pack","PM",None),
    ("UTL06","Gas disconnection application submitted","Submit disconnection application form to Cadent","PM",None),
    ("UTL06","Gas disconnection application submitted","Confirm booking date and site access arrangements","PM",None),
    ("UTL06","Gas disconnection application submitted","Obtain written disconnection certificate from Cadent","Utility Provider",None),
    ("UTL08","Electricity disconnection application submitted","Identify UKPN supply point and service reference","PM",None),
    ("UTL08","Electricity disconnection application submitted","Contact UKPN and submit disconnection application","PM",None),
    ("UTL08","Electricity disconnection application submitted","Confirm UKPN survey date and site access","PM",None),
    ("UTL08","Electricity disconnection application submitted","Confirm UKPN disconnection date","PM",None),
    ("UTL08","Electricity disconnection application submitted","Obtain UKPN disconnection certificate","Utility Provider",None),
    ("SS03","BS8102 waterproofing strategy issued","Appoint waterproofing specialist","PM",None),
    ("SS03","BS8102 waterproofing strategy issued","Issue soil investigation and groundwater data to specialist","PM",None),
    ("SS03","BS8102 waterproofing strategy issued","Review draft waterproofing strategy with SE and civil engineer","Structural Engineer",None),
    ("SS03","BS8102 waterproofing strategy issued","Issue final BS8102 waterproofing strategy","Waterproofing Specialist",None),
    ("SS03","BS8102 waterproofing strategy issued","Confirm warranty terms and requirements","Waterproofing Specialist",None),
    ("PS04","Geotechnical report issued","Appoint geotechnical consultant","PM",None),
    ("PS04","Geotechnical report issued","Arrange site access for trial pits / window samples","PM",None),
    ("PS04","Geotechnical report issued","Trial pits / windowsampling undertaken on site","Geotechnical Consultant",None),
    ("PS04","Geotechnical report issued","Review draft geotechnical report and comment","Structural Engineer",None),
    ("PS04","Geotechnical report issued","Issue final geotechnical report","Geotechnical Consultant",None),
    ("PW05","Party wall awards agreed and signed","Identify all adjoining owners and prepare register","Party Wall Surveyor",None),
    ("PW05","Party wall awards agreed and signed","Serve party wall notices to all adjoining owners","Party Wall Surveyor",None),
    ("PW05","Party wall awards agreed and signed","Agree surveyor appointments for each dissenting owner","Party Wall Surveyor",None),
    ("PW05","Party wall awards agreed and signed","Review draft party wall awards","Party Wall Surveyor",None),
    ("PW05","Party wall awards agreed and signed","Execute signed party wall awards with all owners","Party Wall Surveyor",None),
]

# ── Project Programme column map (24 cols A–X) ───────────────────────────
PROG_HEADERS = [
    "Ref","Phase","Gate","Cluster","Milestone","Responsible Party",
    "External / Approval Authority","Trigger Field","Lead Time Days","Calc Type",
    "Anchor Date","Start Date","Deadline Date","Actual Completion Date",
    "Status","Evidence Status","Evidence / Link","Blocker Type",
    "Approval Type","Document Ref","RAG Status","Gate Impact","Sub-Task Count","Notes"
]
PROG_WIDTHS = [10,16,32,18,42,28,28,32,12,14,14,14,14,20,16,18,28,18,22,12,12,14,14,22]

def _anchor_formula(row):
    keys = list(ANCHOR_CELLS.keys())
    inner = '""'
    for k in reversed(keys):
        inner = f'IF(H{row}="{k}",{k},{inner})'
    return "=" + inner

def _prog_formulas(row, calc, lead_col="I"):
    anchor_f = _anchor_formula(row)
    i, k, l, m = f"K{row}", f"L{row}", f"M{row}", f"N{row}"
    anchor = f"K{row}"
    if calc == "before_anchor":
        deadline_f = f'=IF({anchor}="","",{anchor}-{lead_col}{row})'
        start_f    = f'=IF({anchor}="","",{anchor}-{lead_col}{row})'
    elif calc == "after_anchor":
        deadline_f = f'=IF({anchor}="","",{anchor}+{lead_col}{row})'
        start_f    = f'=IF({anchor}="","",{anchor})'
    else:  # fixed_gate
        deadline_f = f'=IF({anchor}="","",{anchor})'
        start_f    = f'=IF({anchor}="","",{anchor})'
    rag_f = (
        f'=IF(OR(O{row}="Complete",O{row}="Approved",O{row}="Not Applicable"),"Green",'
        f'IF(K{row}="","Blocked",IF(M{row}="","Blocked",'
        f'IF(M{row}-TODAY()<0,"Red",IF(M{row}-TODAY()<=14,"Amber","Green")))))'
    )
    gi_f = (
        f'=IF(AND(R{row}="Hard Blocker",NOT(OR(O{row}="Complete",O{row}="Approved",O{row}="Not Applicable"))),"Blocks Gate",'
        f'IF(AND(OR(R{row}="Soft Warning",R{row}="Conditional / If Required"),NOT(OR(O{row}="Complete",O{row}="Approved",O{row}="Not Applicable",O{row}="Not Started"))),"Warning Only","Clear"))'
    )
    st_count_f = f'=COUNTIF(\'Sub-Tasks\'!A:A,A{row})'
    return {
        11: (anchor_f,   "DD/MM/YYYY"),
        12: (start_f,    "DD/MM/YYYY"),
        13: (deadline_f, "DD/MM/YYYY"),
        21: (rag_f,      None),
        22: (gi_f,       None),
        23: (st_count_f, None),
    }

# ---------------------------------------------------------------------------
# SHEET BUILDERS
# ---------------------------------------------------------------------------
def build_lists(ws):
    data = [
        ("Status", ["Not Started","In Progress","Submitted","Approved","Complete","Blocked","Not Applicable"]),
        ("Evidence Status", ["No Evidence","Evidence Required","Evidence Added","Evidence Verified","Evidence Rejected","Not Required"]),
        ("RAG Status", ["Green","Amber","Red","Blocked"]),
        ("Blocker Type", ["Hard Blocker","Soft Warning","Conditional / If Required"]),
        ("Gate Status", ["Ready","Blocked","Ready with Warnings"]),
        ("Gates", [G1, G2, G3, G4]),
        ("Approval Type", ["Local Authority Approval","Local Authority Notice","Local Authority Licence",
                           "HSE / Enforcing Authority Notification","Building Control Approval",
                           "Highways Approval","Planning Condition Discharge","Utility Provider Approval",
                           "Professional Review","Internal Approval","Evidence Only","Conditional / If Required"]),
        ("Document Status", ["Not Started","Drafting","Submitted","Approved / Received","Rejected / Revise","Not Applicable"]),
        ("Approval Authority", ["Barnet Council","Camden Council","Local Planning Authority",
                                "Building Control","Environmental Health","Highways","HSE",
                                "Utility Provider","Arboriculturalist","Structural Engineer",
                                "Principal Designer","Principal Contractor","Client / PM",
                                "Independent Analyst","Other"]),
        ("Phase", ["Pre-Construction","Planning Conditions","Substructure","Superstructure","Handover"]),
        ("Trigger Fields", list(ANCHOR_CELLS.keys())),
        ("Responsible Parties", ["PM","Architect","Structural Engineer","Civil / Drainage Engineer",
                                  "Surveyor","Geotechnical Consultant","Arboriculturalist","Environmental Consultant",
                                  "Energy Assessor","Utility Provider","Demolition Contractor","Principal Contractor",
                                  "Principal Designer","Party Wall Surveyor","Waterproofing Specialist",
                                  "MEP Engineer","Lightning Specialist","Building Control","Council / Highways",
                                  "Client / Development Lead","Asbestos Consultant","Monitoring Engineer"]),
    ]
    for col_idx, (header, values) in enumerate(data, start=1):
        c = ws.cell(row=1, column=col_idx, value=header)
        style_cell(c, fill=hdr_fill(), font=hdr_font(), alignment=center())
        for row_idx, v in enumerate(values, start=2):
            style_cell(ws.cell(row=row_idx, column=col_idx, value=v), font=body_font(), alignment=left())
        set_w(ws, col_idx, 30)

def build_project_setup(ws):
    ws.sheet_view.showGridLines = False
    for c, w in [("A",2),("B",38),("C",30),("D",2)]:
        ws.column_dimensions[c].width = w
    ws.merge_cells("B1:C1")
    style_cell(ws["B1"], fill=hdr_fill(), font=Font(bold=True,color=C_WHITE,size=14,name="Calibri"), alignment=center())
    ws["B1"].value = "CPIS LEAN MVP v0.2 — PROJECT SETUP"
    ws.row_dimensions[1].height = 30
    ws.merge_cells("B2:C2")
    style_cell(ws["B2"], fill=hdr_fill(C_BLUE2), font=Font(color=C_WHITE,size=11,name="Calibri"), alignment=center())
    ws["B2"].value = "Construction Programme Intelligence System"
    ws.merge_cells("B4:C4")
    style_cell(ws["B4"], fill=grey_fill(), font=lbl_font(11), alignment=left())
    ws["B4"].value = "PROJECT DETAILS"
    for i, (lbl, val) in enumerate([
        ("Project Name","Avenue Road Demo Project"),("Project Code","LB2501"),
        ("Borough","Barnet"),("Project Type","Super-prime residential double basement"),
        ("PM / Lead","Roberts"),("Current Project Stage","Pre-Construction")], start=5):
        lb = ws.cell(row=i, column=2, value=lbl)
        vl = ws.cell(row=i, column=3, value=val)
        style_cell(lb, font=lbl_font(), alignment=left(), border=bot_border())
        style_cell(vl, font=body_font(), alignment=left(), border=bot_border())
    ws.merge_cells("B12:C12")
    style_cell(ws["B12"], fill=grey_fill(), font=lbl_font(11), alignment=left())
    ws["B12"].value = "KEY PROJECT DATES  (enter dates here — these drive all milestone deadlines)"
    for key, (col_letter, row_num) in ANCHOR_CELLS.items():
        style_cell(ws.cell(row=row_num, column=2, value=ANCHOR_LABELS[key]), font=lbl_font(), alignment=left())
        style_cell(ws.cell(row=row_num, column=3), font=body_font(), alignment=left(), border=thin_border(), nf="DD/MM/YYYY")
    ws.cell(row=19, column=2).value = "Today (auto)"
    style_cell(ws.cell(row=19, column=2), font=lbl_font(), alignment=left())
    tc = ws.cell(row=19, column=3); tc.value = "=TODAY()"; tc.number_format = "DD/MM/YYYY"
    style_cell(tc, font=body_font(), alignment=left())
    ws.merge_cells("B21:C21")
    style_cell(ws["B21"], fill=PatternFill("solid",fgColor="EBF3FB"),
               font=Font(italic=True,size=10,name="Calibri",color=C_NAVY),
               alignment=Alignment(wrap_text=True, vertical="center"))
    ws["B21"].value = ("This Excel prototype tests CPIS v0.2 control logic. "
                       "Dates entered above drive milestone deadlines, blocker status, and gate readiness. "
                       "Lead times in Project Programme (col I) are industry-standard benchmarks — they are fully editable.")
    ws.row_dimensions[21].height = 45
    ws.merge_cells("B23:C23")
    style_cell(ws["B23"], fill=hdr_fill(), font=hdr_font(), alignment=left())
    ws["B23"].value = "DEMO TEST INSTRUCTIONS"
    for i, step in enumerate([
        "1.  Enter all six key project dates in the cells above (C13–C18).",
        "2.  Go to 'Project Programme' — confirm milestone deadlines have calculated.",
        "3.  Change the Target Demolition Date by +21 days — confirm Gates 2 & 3 milestones shift.",
        "4.  Confirm Gate 1 (Planning) and Gate 4 (Substructure) milestones do NOT move.",
        "5.  Mark a Hard Blocker as 'Complete' — Gate Dashboard status should improve.",
        "6.  Set a 'Conditional / If Required' item to 'Not Applicable' — Gate Impact → Clear.",
        "7.  Check Document Register — filter by Gate to review required documents.",
    ], start=24):
        ws.merge_cells(f"B{i}:C{i}")
        style_cell(ws.cell(row=i, column=2, value=step), font=body_font(), alignment=left(True))
        ws.row_dimensions[i].height = 18

def build_milestone_library(ws):
    ws.freeze_panes = "A2"
    headers = ["Ref","Phase","Gate","Cluster","Milestone","Responsible Party","External Party",
               "Trigger Field","Lead Time Days","Calculation Type","Lead Time Basis",
               "Evidence Required","Risk If Missed","Blocker Type","Approval Type","Document Ref","Notes"]
    widths  = [10,16,30,16,42,28,20,32,12,14,32,34,40,20,24,14,28]
    for col, (h, w) in enumerate(zip(headers, widths), start=1):
        style_cell(ws.cell(row=1,column=col,value=h), fill=hdr_fill(), font=hdr_font(), alignment=center(), border=thin_border())
        set_w(ws, col, w)
    ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}1"
    for r, m in enumerate(MILESTONES, start=2):
        fill = alt_fill() if r % 2 == 0 else None
        row_data = [m["ref"],m["phase"],m["gate"],m["cluster"],m["milestone"],
                    m["responsible"],m["external"],m["trigger"],m["lead"],m["calc"],
                    m["lead_basis"],m["evidence"],m["risk"],m["blocker"],
                    m["approval_type"],m["doc_ref"],""]
        for col, val in enumerate(row_data, start=1):
            style_cell(ws.cell(row=r,column=col,value=val),
                       fill=fill, font=body_font(), alignment=left(col in (5,11,12,13)), border=thin_border())

def build_project_programme(ws):
    ws.freeze_panes = "A2"
    for col, (h, w) in enumerate(zip(PROG_HEADERS, PROG_WIDTHS), start=1):
        style_cell(ws.cell(row=1,column=col,value=h), fill=hdr_fill(), font=hdr_font(), alignment=center(), border=thin_border())
        set_w(ws, col, w)
    ws.auto_filter.ref = f"A1:{get_column_letter(len(PROG_HEADERS))}1"

    for idx, m in enumerate(MILESTONES):
        r = idx + 2
        fill = alt_fill() if r % 2 == 0 else None
        static = {
            1:m["ref"], 2:m["phase"], 3:m["gate"], 4:m["cluster"], 5:m["milestone"],
            6:m["responsible"], 7:m["external"], 8:m["trigger"], 9:m["lead"], 10:m["calc"],
            15:"Not Started", 16:"No Evidence", 17:"", 18:m["blocker"],
            19:m["approval_type"], 20:m["doc_ref"], 24:""
        }
        for col, val in static.items():
            style_cell(ws.cell(row=r,column=col,value=val),
                       fill=fill, font=body_font(), alignment=left(col==5), border=thin_border())

        formulas = _prog_formulas(r, m["calc"])
        for col, (formula, nf) in formulas.items():
            style_cell(ws.cell(row=r,column=col,value=formula),
                       fill=fill, font=body_font(), alignment=center(), border=thin_border(), nf=nf)

    n = len(MILESTONES) + 1
    # RAG (col U=21)
    for val, bg, fg in [("Green",C_GREEN_BG,C_GREEN_FG),("Amber",C_AMBER_BG,C_AMBER_FG),
                         ("Red",C_RED_BG,C_RED_FG),("Blocked",C_GREY_BG,"595959")]:
        ws.conditional_formatting.add(f"U2:U{n}",
            CellIsRule("equal",[f'"{val}"'], fill=PatternFill("solid",fgColor=bg), font=Font(color=fg)))
    # Gate Impact (col V=22)
    for val, bg, fg in [("Blocks Gate",C_RED_BG,C_RED_FG),("Warning Only",C_AMBER_BG,C_AMBER_FG),("Clear",C_GREEN_BG,C_GREEN_FG)]:
        ws.conditional_formatting.add(f"V2:V{n}",
            CellIsRule("equal",[f'"{val}"'], fill=PatternFill("solid",fgColor=bg), font=Font(color=fg,bold=(val=="Blocks Gate"))))
    # Status (col O=15)
    for val, bg, fg in [("Complete",C_GREEN_BG,C_GREEN_FG),("Approved",C_GREEN_BG,C_GREEN_FG),
                         ("Blocked",C_RED_BG,C_RED_FG),("In Progress",C_AMBER_BG,C_AMBER_FG),("Submitted",C_AMBER_BG,C_AMBER_FG)]:
        ws.conditional_formatting.add(f"O2:O{n}",
            CellIsRule("equal",[f'"{val}"'], fill=PatternFill("solid",fgColor=bg), font=Font(color=fg)))

def build_subtasks(ws):
    ws.freeze_panes = "A2"
    headers = ["Milestone Ref","Gate","Parent Milestone","Sub-Task #","Sub-Task Description",
               "Responsible Party","Due Date","Status","Notes"]
    widths  = [14,30,42,10,50,26,14,16,28]
    for col, (h, w) in enumerate(zip(headers, widths), start=1):
        style_cell(ws.cell(row=1,column=col,value=h), fill=hdr_fill(), font=hdr_font(), alignment=center(), border=thin_border())
        set_w(ws, col, w)
    ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}1"

    r = 2
    prev_ref = None; task_num = 0
    for ref, parent, desc, responsible, due in SUBTASKS_SEED:
        if ref != prev_ref:
            task_num = 0
            prev_ref = ref
        task_num += 1
        gate = next((m["gate"] for m in MILESTONES if m["ref"]==ref), "")
        fill = alt_fill() if r % 2 == 0 else None
        vals = [ref, gate, parent, task_num, desc, responsible, due or "", "Not Started", ""]
        for col, val in enumerate(vals, start=1):
            style_cell(ws.cell(row=r,column=col,value=val),
                       fill=fill, font=body_font(), alignment=left(col==5), border=thin_border())
            if col == 7 and val:
                ws.cell(row=r,column=col).number_format = "DD/MM/YYYY"
        r += 1

def build_gate_dashboard(ws):
    ws.sheet_view.showGridLines = False
    for c, w in [("A",2),("B",34),("C",22),("D",2)]: ws.column_dimensions[c].width = w
    ws.merge_cells("B1:C1")
    style_cell(ws["B1"], fill=hdr_fill(),
               font=Font(bold=True,color=C_WHITE,size=14,name="Calibri"), alignment=center())
    ws["B1"].value = "CPIS LEAN MVP v0.2 — GATE DASHBOARD"
    ws.row_dimensions[1].height = 30

    ws.merge_cells("B3:C3")
    style_cell(ws["B3"], fill=grey_fill(), font=lbl_font(11), alignment=left())
    ws["B3"].value = "PORTFOLIO SUMMARY"

    n = len(MILESTONES) + 1
    kpis = [
        ("Total Milestones",         f"=COUNTA('Project Programme'!A2:A{n})"),
        ("Open Hard Blockers",       "=COUNTIFS('Project Programme'!R:R,\"Hard Blocker\",'Project Programme'!V:V,\"Blocks Gate\")"),
        ("Open Soft Warnings",       "=COUNTIFS('Project Programme'!R:R,\"Soft Warning\",'Project Programme'!V:V,\"Warning Only\")"),
        ("Conditional Items Open",   "=COUNTIFS('Project Programme'!R:R,\"Conditional / If Required\",'Project Programme'!V:V,\"Warning Only\")"),
        ("Overdue Items",            "=COUNTIF('Project Programme'!U:U,\"Red\")"),
        ("Local Authority Approvals Open",
         "=COUNTIFS('Project Programme'!S:S,\"Local Authority Approval\",'Project Programme'!V:V,\"Blocks Gate\")"
         "+COUNTIFS('Project Programme'!S:S,\"Local Authority Notice\",'Project Programme'!V:V,\"Blocks Gate\")"
         "+COUNTIFS('Project Programme'!S:S,\"Local Authority Licence\",'Project Programme'!V:V,\"Blocks Gate\")"),
        ("HSE Notifications Open",
         "=COUNTIFS('Project Programme'!S:S,\"HSE / Enforcing Authority Notification\",'Project Programme'!O:O,\"Not Started\")"
         "+COUNTIFS('Project Programme'!S:S,\"HSE / Enforcing Authority Notification\",'Project Programme'!O:O,\"In Progress\")"),
        ("Missing Documents",        "=COUNTIF('Project Programme'!P:P,\"No Evidence\")+COUNTIF('Project Programme'!P:P,\"Evidence Required\")"),
    ]
    for i, (lbl, formula) in enumerate(kpis, start=4):
        style_cell(ws.cell(row=i,column=2,value=lbl), font=lbl_font(), alignment=left(), border=bot_border())
        style_cell(ws.cell(row=i,column=3,value=formula), font=body_font(bold=True), alignment=center(), border=bot_border())

    gates = [G1, G2, G3, G4]
    start_row = 14
    for gate in gates:
        r = start_row
        ws.merge_cells(f"B{r}:C{r}")
        style_cell(ws[f"B{r}"], fill=hdr_fill(), font=hdr_font(12), alignment=left())
        ws[f"B{r}"].value = gate.upper()
        ws.row_dimensions[r].height = 22

        hard_f = f"=COUNTIFS('Project Programme'!C:C,\"{gate}\",'Project Programme'!V:V,\"Blocks Gate\")"
        soft_f = f"=COUNTIFS('Project Programme'!C:C,\"{gate}\",'Project Programme'!V:V,\"Warning Only\")"
        status_f = f'=IF({hard_f[1:]}>0,"Blocked",IF({soft_f[1:]}>0,"Ready with Warnings","Ready"))'

        card_rows = [
            ("Gate Status",              status_f),
            ("Gate Owner",               GATE_OWNERS[gate]),
            ("Hard Blockers Open",       hard_f),
            ("Conditional Items Open",
             f"=COUNTIFS('Project Programme'!C:C,\"{gate}\",'Project Programme'!R:R,\"Conditional / If Required\",'Project Programme'!V:V,\"Warning Only\")"),
            ("Local Authority Approvals Open",
             f"=COUNTIFS('Project Programme'!C:C,\"{gate}\",'Project Programme'!S:S,\"Local Authority Approval\",'Project Programme'!V:V,\"Blocks Gate\")"
             f"+COUNTIFS('Project Programme'!C:C,\"{gate}\",'Project Programme'!S:S,\"Local Authority Licence\",'Project Programme'!V:V,\"Blocks Gate\")"),
            ("HSE Notifications Open",
             f"=COUNTIFS('Project Programme'!C:C,\"{gate}\",'Project Programme'!S:S,\"HSE / Enforcing Authority Notification\",'Project Programme'!O:O,\"Not Started\")"
             f"+COUNTIFS('Project Programme'!C:C,\"{gate}\",'Project Programme'!S:S,\"HSE / Enforcing Authority Notification\",'Project Programme'!O:O,\"In Progress\")"),
            ("Overdue Items",
             f"=COUNTIFS('Project Programme'!C:C,\"{gate}\",'Project Programme'!U:U,\"Red\")"),
            ("Missing Documents",
             f"=COUNTIFS('Project Programme'!C:C,\"{gate}\",'Project Programme'!P:P,\"No Evidence\")"
             f"+COUNTIFS('Project Programme'!C:C,\"{gate}\",'Project Programme'!P:P,\"Evidence Required\")"),
            ("Next Critical Deadline",
             f"=IFERROR(TEXT(MINIFS('Project Programme'!M:M,'Project Programme'!C:C,\"{gate}\",'Project Programme'!V:V,\"Blocks Gate\"),\"DD/MM/YYYY\"),\"—\")"),
            ("Next Critical Action",
             f"=IFERROR(INDEX('Project Programme'!E:E,MATCH(MINIFS('Project Programme'!M:M,'Project Programme'!C:C,\"{gate}\",'Project Programme'!V:V,\"Blocks Gate\"),'Project Programme'!M:M,0)),\"—\")"),
        ]
        for j, (lbl, val) in enumerate(card_rows, start=r+1):
            style_cell(ws.cell(row=j,column=2,value=lbl), font=lbl_font(), alignment=left(), border=thin_border())
            style_cell(ws.cell(row=j,column=3,value=val), font=body_font(), alignment=left(True), border=thin_border())

        gs_cell = f"C{r+1}"
        for val, bg, fg in [("Blocked",C_RED_BG,C_RED_FG),("Ready with Warnings",C_AMBER_BG,C_AMBER_FG),("Ready",C_GREEN_BG,C_GREEN_FG)]:
            ws.conditional_formatting.add(gs_cell, CellIsRule("equal",[f'"{val}"'],
                fill=PatternFill("solid",fgColor=bg), font=Font(bold=True,color=fg)))

        start_row = r + len(card_rows) + 3

def build_gate_scope(ws):
    ws.freeze_panes = "A2"
    headers = ["Gate","Discipline / Party","Scope Required","Evidence Required","Status","Blocker Type","Notes"]
    widths  = [30,24,52,36,16,22,28]
    for col, (h, w) in enumerate(zip(headers, widths), start=1):
        style_cell(ws.cell(row=1,column=col,value=h), fill=hdr_fill(), font=hdr_font(), alignment=center(), border=thin_border())
        set_w(ws, col, w)
    ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}1"

    row = 2; prev_gate = None
    for scope in GATE_SCOPE:
        gate = scope[0]
        if gate != prev_gate:
            ws.merge_cells(f"A{row}:G{row}")
            style_cell(ws[f"A{row}"],
                       fill=PatternFill("solid",fgColor=C_BLUE2),
                       font=Font(bold=True,italic=True,color=C_WHITE,size=10,name="Calibri"),
                       alignment=left(True))
            ws[f"A{row}"].value = f"Gate Purpose: {GATE_PURPOSES[gate]}"
            ws.row_dimensions[row].height = 22
            row += 1; prev_gate = gate
        fill = alt_fill() if row % 2 == 0 else None
        for col, val in enumerate([scope[0],scope[1],scope[2],scope[3],"Not Started",scope[4],""], start=1):
            style_cell(ws.cell(row=row,column=col,value=val),
                       fill=fill, font=body_font(), alignment=left(col in (3,4)), border=thin_border())
        row += 1

def build_document_register(ws):
    ws.freeze_panes = "A2"
    headers = ["Document Ref","Document Title","Gate","Approval Type","Issuing Party",
               "Approval Authority / Reviewer","Required For","Typical Timing",
               "Status","Date Submitted","Date Approved / Received","Evidence Link","Notes"]
    widths  = [12,44,30,24,28,28,20,28,18,16,20,28,24]
    for col, (h, w) in enumerate(zip(headers, widths), start=1):
        style_cell(ws.cell(row=1,column=col,value=h), fill=hdr_fill(), font=hdr_font(), alignment=center(), border=thin_border())
        set_w(ws, col, w)
    ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}1"

    for r, doc in enumerate(DOC_REGISTER, start=2):
        fill = alt_fill() if r % 2 == 0 else None
        # doc = (ref, title, gate, approval_type, issuing_party, authority, required_for, timing)
        vals = list(doc) + ["Not Started","","","",""]
        for col, val in enumerate(vals, start=1):
            style_cell(ws.cell(row=r,column=col,value=val),
                       fill=fill, font=body_font(), alignment=left(col==2), border=thin_border())
            if col in (10, 11):
                ws.cell(row=r,column=col).number_format = "DD/MM/YYYY"

def build_programme_chart(ws, ws_prog):
    ws.freeze_panes = "A2"
    chart_order = [
        "PS04","PS07","PS09","PS10",
        "PC-LA08","PC-LA09","PC-LA15","ASB03","CDM01","CDM02","CDM03","DEM05",
        "UTL07","UTL09","UTL10","PW05","PW07",
        "SS02","SS03","SS05","SS09",
    ]
    chart_order = [r for r in chart_order if r in CHART_REFS]

    headers = ["Ref","Gate","Milestone (Short)","Start Date","Deadline Date","Lead Time Days","RAG Status"]
    widths  = [10,30,40,14,14,14,12]
    for col, (h, w) in enumerate(zip(headers, widths), start=1):
        style_cell(ws.cell(row=1,column=col,value=h), fill=hdr_fill(), font=hdr_font(), alignment=center(), border=thin_border())
        set_w(ws, col, w)

    ws.merge_cells("A2:G2")
    style_cell(ws["A2"],
               fill=PatternFill("solid",fgColor="EBF3FB"),
               font=Font(italic=True,size=10,name="Calibri",color=C_NAVY),
               alignment=left(True))
    ws["A2"].value = ("Lead times shown are industry-standard benchmarks for London basement projects. "
                      "Actual lead times are editable in Project Programme col I. "
                      "Chart shows Hard Blocker milestones only.")
    ws.row_dimensions[2].height = 30

    # Build row index of milestones in Programme sheet
    prog_rows = {m["ref"]: i+2 for i, m in enumerate(MILESTONES)}

    data_start = 3
    for chart_idx, ref in enumerate(chart_order):
        if ref not in prog_rows:
            continue
        prog_row = prog_rows[ref]
        r = data_start + chart_idx
        m = next(x for x in MILESTONES if x["ref"]==ref)
        ws.cell(row=r,column=1).value = ref
        ws.cell(row=r,column=2).value = m["gate"]
        ws.cell(row=r,column=3).value = m["milestone"][:40]
        for col_chart, col_prog, nf in [(4,12,"DD/MM/YYYY"),(5,13,"DD/MM/YYYY"),(6,9,None),(7,21,None)]:
            col_letter = get_column_letter(col_prog)
            cell = ws.cell(row=r,column=col_chart,value=f"='Project Programme'!{col_letter}{prog_row}")
            if nf: cell.number_format = nf
        for col in range(1,8):
            style_cell(ws.cell(row=r,column=col), font=body_font(), alignment=left(col==3), border=thin_border())

    last = data_start + len(chart_order) - 1
    chart = BarChart()
    chart.type = "bar"; chart.barDir = "bar"; chart.grouping = "stacked"
    chart.title = "CPIS Programme — Hard Blockers (Gantt View)"
    chart.y_axis.title = "Milestone"; chart.x_axis.title = "Lead Time Days"
    chart.width = 30; chart.height = 20
    dur_data = Reference(ws, min_col=6, min_row=data_start, max_row=last)
    s1 = Series(dur_data, title="Lead Time (days)")
    s1.graphicalProperties.solidFill = C_NAVY
    s1.graphicalProperties.line.solidFill = C_NAVY
    chart.series.append(s1)
    chart.set_categories(Reference(ws, min_col=3, min_row=data_start, max_row=last))
    ws.add_chart(chart, "I3")

def define_named_ranges(wb):
    for name, (col_letter, row_num) in ANCHOR_CELLS.items():
        dn = DefinedName(name, attr_text=f"'Project Setup'!${col_letter}${row_num}")
        wb.defined_names[name] = dn

def apply_data_validation(wb):
    ws_prog   = wb["Project Programme"]
    ws_scope  = wb["Gate Scope of Work"]
    ws_doc    = wb["Document Register"]
    ws_sub    = wb["Sub-Tasks"]
    n = len(MILESTONES) + 1
    n_doc = len(DOC_REGISTER) + 1
    n_sub = len(SUBTASKS_SEED) + 1

    def dv(formula, sheet, cell_range):
        d = DataValidation(type="list", formula1=formula, allow_blank=True, showErrorMessage=False)
        sheet.add_data_validation(d)
        d.add(cell_range)

    dv("Lists!$A$2:$A$8",  ws_prog,  f"O2:O{n}")    # Status
    dv("Lists!$B$2:$B$7",  ws_prog,  f"P2:P{n}")    # Evidence Status
    dv("Lists!$D$2:$D$4",  ws_prog,  f"R2:R{n}")    # Blocker Type
    dv("Lists!$G$2:$G$13", ws_prog,  f"S2:S{n}")    # Approval Type
    dv("Lists!$A$2:$A$8",  ws_scope, f"E2:E{len(GATE_SCOPE)+len([G1,G2,G3,G4])+5}")
    dv("Lists!$H$2:$H$7",  ws_doc,   f"I2:I{n_doc}")  # Document Status
    dv("Lists!$A$2:$A$8",  ws_sub,   f"H2:H{n_sub+5}")  # Sub-task Status

# ---------------------------------------------------------------------------
# VERIFICATION
# ---------------------------------------------------------------------------
def verify_workbook(wb):
    errors = []
    expected_sheets = ["Project Setup","Milestone Library","Project Programme","Sub-Tasks",
                       "Gate Dashboard","Gate Scope of Work","Document Register","Programme Chart","Lists"]
    for s in expected_sheets:
        if s not in wb.sheetnames:
            errors.append(f"Missing sheet: {s}")

    for name in ANCHOR_CELLS:
        if name not in wb.defined_names:
            errors.append(f"Missing named range: {name}")

    ws_lib = wb["Milestone Library"]
    count = sum(1 for row in ws_lib.iter_rows(min_row=2,max_col=1,values_only=True) if row[0])
    if count != len(MILESTONES):
        errors.append(f"Milestone Library has {count} rows, expected {len(MILESTONES)}")

    ws_prog = wb["Project Programme"]
    for col_letter, col_name in [("K","Anchor Date"),("M","Deadline Date"),("U","RAG"),("V","Gate Impact")]:
        cell = ws_prog[f"{col_letter}2"]
        if not (isinstance(cell.value,str) and cell.value.startswith("=")):
            errors.append(f"Project Programme col {col_letter} ({col_name}) row 2 is not a formula")

    ws_dash = wb["Gate Dashboard"]
    found = any(isinstance(c.value,str) and "Project Programme" in c.value
                for row in ws_dash.iter_rows() for c in row)
    if not found:
        errors.append("Gate Dashboard has no reference to 'Project Programme'")

    ws_doc = wb["Document Register"]
    doc_count = sum(1 for row in ws_doc.iter_rows(min_row=2,max_col=1,values_only=True) if row[0])
    if doc_count < 100:
        errors.append(f"Document Register has only {doc_count} rows (expected ~112)")

    return errors, doc_count

# ---------------------------------------------------------------------------
# MASTER ORCHESTRATOR
# ---------------------------------------------------------------------------
def create_workbook():
    wb = Workbook()
    wb.remove(wb.active)

    ws_setup   = wb.create_sheet("Project Setup")
    ws_library = wb.create_sheet("Milestone Library")
    ws_prog    = wb.create_sheet("Project Programme")
    ws_sub     = wb.create_sheet("Sub-Tasks")
    ws_dash    = wb.create_sheet("Gate Dashboard")
    ws_scope   = wb.create_sheet("Gate Scope of Work")
    ws_doc     = wb.create_sheet("Document Register")
    ws_chart   = wb.create_sheet("Programme Chart")
    ws_lists   = wb.create_sheet("Lists")

    build_lists(ws_lists)
    build_project_setup(ws_setup)
    build_milestone_library(ws_library)
    build_project_programme(ws_prog)
    build_subtasks(ws_sub)
    build_gate_dashboard(ws_dash)
    build_gate_scope(ws_scope)
    build_document_register(ws_doc)
    build_programme_chart(ws_chart, ws_prog)

    define_named_ranges(wb)
    apply_data_validation(wb)

    wb.active = ws_setup

    errors, doc_count = verify_workbook(wb)

    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "CPIS_Lean_MVP_v0.2.xlsx")
    wb.save(out_path)

    # Gate milestone counts
    gate_counts = {}
    for gate in [G1,G2,G3,G4]:
        gate_counts[gate] = sum(1 for m in MILESTONES if m["gate"]==gate)
    la_count  = sum(1 for m in MILESTONES if "Local Authority" in m["approval_type"])
    hse_count = sum(1 for m in MILESTONES if "HSE" in m["approval_type"])

    print("\n" + "="*62)
    print("CPIS WORKBOOK GENERATED")
    print("="*62)
    print(f"  Output:                    {out_path}")
    print(f"  Sheets created:            {len(wb.sheetnames)}")
    print(f"  Milestone rows:            {len(MILESTONES)}")
    print(f"    Gate 1 (Planning):       {gate_counts[G1]}")
    print(f"    Gate 2 (Post-Consent):   {gate_counts[G2]}")
    print(f"    Gate 3 (Pre-Demo Start): {gate_counts[G3]}")
    print(f"    Gate 4 (Substructure):   {gate_counts[G4]}")
    print(f"  Document register rows:    {doc_count}")
    print(f"  Local Authority items:     {la_count}")
    print(f"  HSE notification items:    {hse_count}")
    print(f"  Chart milestones:          {len(CHART_REFS)}")
    if errors:
        print(f"  Verification:              FAILED")
        for e in errors: print(f"    ✗ {e}")
    else:
        print(f"  Verification:              PASSED")
    print("="*62 + "\n")
    return out_path

if __name__ == "__main__":
    create_workbook()
