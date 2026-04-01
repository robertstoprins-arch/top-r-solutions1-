"""
ToP-R Solutions — Contact Form API
Receives form submissions, sends email notification + auto-reply,
and logs to Google Sheets (optional).
"""

import asyncio
import os
import json
import smtplib
import logging
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from typing import Literal

from google import genai as google_genai

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from dotenv import load_dotenv

try:
    from material_checker import check_prices
    _MATERIAL_CHECKER_AVAILABLE = True
except ImportError:
    check_prices = None
    _MATERIAL_CHECKER_AVAILABLE = False
from chat_prompt import build_system_prompt

load_dotenv(Path(__file__).parent.parent / ".env")

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("topr-api")

# Gemini setup
_gemini_key = os.getenv("GEMINI_API_KEY", "")
if not _gemini_key:
    log.warning("GEMINI_API_KEY not set — /api/chat will be unavailable")
_gemini_client = google_genai.Client(api_key=_gemini_key) if _gemini_key else None

app = FastAPI(title="ToP-R Solutions API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", os.getenv("FRONTEND_URL", "")],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ── Schemas ───────────────────────────────────────────────────────────────────

# Contact form
class FormSubmission(BaseModel):
    name: str
    company: str = ""
    email: str
    phone: str = ""
    projectType: str = ""
    size: str = ""
    stage: str = ""
    location: str = ""
    services: list[str] = []
    timeline: str = ""
    standards: str = ""
    notes: str = ""


# ── Email helpers ─────────────────────────────────────────────────────────────
def _smtp_connection():
    host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    port = int(os.getenv("SMTP_PORT", 587))
    user = os.getenv("SMTP_USER")
    pwd  = os.getenv("SMTP_PASS")
    if not user or not pwd:
        raise ValueError("SMTP_USER and SMTP_PASS must be set in .env")
    server = smtplib.SMTP(host, port)
    server.starttls()
    server.login(user, pwd)
    return server


def send_notification(data: FormSubmission):
    """Internal notification to info@top-rsolutions.co.uk"""
    notify_to = os.getenv("NOTIFY_EMAIL", "info@top-rsolutions.co.uk")
    smtp_user  = os.getenv("SMTP_USER")

    services_list = "\n  - ".join(data.services) if data.services else "Not specified"

    body = f"""
New project enquiry received from the ToP-R Solutions website.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:     {data.name}
Company:  {data.company or '—'}
Email:    {data.email}
Phone:    {data.phone or '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type:       {data.projectType or '—'}
Size:       {data.size or '—'}
Stage:      {data.stage or '—'}
Location:   {data.location or '—'}
Timeline:   {data.timeline or '—'}
Standards:  {data.standards or '—'}

Services requested:
  - {services_list}

Notes:
{data.notes or '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Received: {datetime.now().strftime('%d %b %Y at %H:%M')}
    """.strip()

    msg = MIMEText(body, "plain")
    msg["Subject"] = f"New Enquiry: {data.name} — {data.company or data.projectType or 'Website'}"
    msg["From"]    = smtp_user
    msg["To"]      = notify_to

    with _smtp_connection() as s:
        s.sendmail(smtp_user, notify_to, msg.as_string())

    log.info(f"Notification sent for {data.email}")


def send_autoreply(data: FormSubmission):
    """Auto-reply confirmation to the client"""
    smtp_user = os.getenv("SMTP_USER")

    services_str = ", ".join(data.services) if data.services else "your enquiry"

    body = f"""
Dear {data.name},

Thank you for getting in touch with ToP-R Solutions.

We have received your project details and will review them shortly. You can expect to hear back from us within one working day with an assessment of how we can support your project.

Your enquiry summary:
  Project type:  {data.projectType or '—'}
  Stage:         {data.stage or '—'}
  Services:      {services_str}

If you need to reach us directly in the meantime:

  Email:   info@top-rsolutions.co.uk
  UK:      +44 7565 260 827

Kind regards,
Roberts Toprins
Managing Director, ToP-R Solutions

—
ToP-R Solutions
2 Eastbourne Terrace, London, W2 6LG
www.top-rsolutions.co.uk
    """.strip()

    msg = MIMEText(body, "plain")
    msg["Subject"] = "ToP-R Solutions — We've received your enquiry"
    msg["From"]    = smtp_user
    msg["To"]      = data.email
    msg["Reply-To"] = os.getenv("NOTIFY_EMAIL", "info@top-rsolutions.co.uk")

    with _smtp_connection() as s:
        s.sendmail(smtp_user, data.email, msg.as_string())

    log.info(f"Auto-reply sent to {data.email}")


def log_to_sheet(data: FormSubmission):
    """Append submission to Google Sheet (requires gspread + credentials.json)"""
    try:
        import gspread
        from google.oauth2.service_account import Credentials

        creds_file = os.getenv("GOOGLE_CREDS_FILE", "credentials.json")
        sheet_id   = os.getenv("GOOGLE_SHEET_ID")
        if not sheet_id:
            log.warning("GOOGLE_SHEET_ID not set — skipping sheet logging")
            return

        scopes = ["https://www.googleapis.com/auth/spreadsheets"]
        creds  = Credentials.from_service_account_file(creds_file, scopes=scopes)
        gc     = gspread.authorize(creds)
        sheet  = gc.open_by_key(sheet_id).sheet1

        sheet.append_row([
            datetime.now().strftime("%d/%m/%Y %H:%M"),
            data.name, data.company, data.email, data.phone,
            data.projectType, data.size, data.stage, data.location,
            ", ".join(data.services), data.timeline, data.standards, data.notes,
        ])
        log.info(f"Logged to Google Sheet: {data.email}")
    except ImportError:
        log.warning("gspread not installed — run: pip install gspread google-auth")
    except Exception as e:
        log.error(f"Sheet logging failed: {e}")


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {"status": "ok", "service": "ToP-R Solutions API"}


@app.post("/api/submit")
async def submit_form(data: FormSubmission):
    if not data.name or not data.email:
        raise HTTPException(status_code=422, detail="Name and email are required")

    errors = []

    try:
        send_notification(data)
    except Exception as e:
        log.error(f"Notification email failed: {e}")
        errors.append("notification")

    try:
        send_autoreply(data)
    except Exception as e:
        log.error(f"Auto-reply failed: {e}")
        errors.append("autoreply")

    # Sheet logging — non-blocking
    try:
        log_to_sheet(data)
    except Exception as e:
        log.error(f"Sheet log failed: {e}")

    if "notification" in errors and "autoreply" in errors:
        raise HTTPException(
            status_code=500,
            detail="Email delivery failed. Please contact us directly at info@top-rsolutions.co.uk"
        )

    return {"success": True, "message": "Enquiry received. We'll be in touch within one working day."}


# ── Chat (Gemini) ─────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []
    page: str = "/"
    session_id: str = ""


@app.post("/api/chat")
async def chat(data: ChatRequest):
    if not _gemini_client:
        raise HTTPException(status_code=503, detail="Chat service not configured")

    system_prompt = build_system_prompt(data.page)

    # Build conversation history in google-genai format
    history = []
    for msg in data.history:
        history.append(
            google_genai.types.Content(
                role="user" if msg.role == "user" else "model",
                parts=[google_genai.types.Part(text=msg.content)],
            )
        )

    try:
        def _call():
            chat_session = _gemini_client.chats.create(
                model="gemini-2.5-flash",
                config=google_genai.types.GenerateContentConfig(
                    system_instruction=system_prompt,
                ),
                history=history,
            )
            response = chat_session.send_message(data.message)
            return response.text.strip()

        reply = await asyncio.to_thread(_call)
    except Exception as e:
        log.error(f"Gemini chat error: {e}")
        raise HTTPException(status_code=500, detail="Chat service temporarily unavailable")

    return {"reply": reply}


# ── Material Price Checker ────────────────────────────────────────────────────

class MaterialItem(BaseModel):
    description: str = Field(..., min_length=2, max_length=200)
    quantity: float = Field(..., gt=0, le=10000)
    unit: Literal["units", "m²", "m", "kg", "litres"]


class MaterialCheckerRequest(BaseModel):
    postcode: str = Field(
        ...,
        min_length=5,
        max_length=8,
        description="UK postcode, e.g. SW1A 1AA",
    )
    items: list[MaterialItem] = Field(..., min_length=1, max_length=10)


class SupplierResult(BaseModel):
    price_per_unit: float | None = None
    total_price: float | None = None
    unit: str = "units"
    availability: str = "unknown"
    delivery_days: str = "unknown"
    product_name: str = ""
    product_url: str = ""
    error: str | None = None


class MaterialRow(BaseModel):
    description: str
    quantity: float
    unit: str
    results: dict[str, SupplierResult]


class MaterialCheckerResponse(BaseModel):
    rows: list[MaterialRow]
    postcode: str
    scraped_at: str
    warnings: list[str] = []


@app.post("/api/tools/material-checker", response_model=MaterialCheckerResponse)
async def material_price_checker(data: MaterialCheckerRequest):
    if not _MATERIAL_CHECKER_AVAILABLE:
        raise HTTPException(status_code=503, detail="Material checker is not available in this environment")
    postcode = data.postcode.upper().strip()
    items = [i.model_dump() for i in data.items]

    try:
        raw_rows = await asyncio.wait_for(
            check_prices(items, postcode),
            timeout=90.0,
        )
    except asyncio.TimeoutError:
        raise HTTPException(
            status_code=504,
            detail="Price check timed out. Please try with fewer items.",
        )
    except Exception as e:
        log.error(f"Material checker error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Price check failed. Please try again.",
        )

    # Collect warnings for suppliers that returned errors on all items
    warnings = []
    suppliers = ["Screwfix", "Toolstation", "Travis Perkins", "Wickes"]
    for supplier in suppliers:
        all_errors = all(
            row["results"].get(supplier, {}).get("error") for row in raw_rows
        )
        if all_errors:
            warnings.append(f"{supplier} returned no results — site may be temporarily unavailable.")

    rows = []
    for row in raw_rows:
        rows.append(MaterialRow(
            description=row["description"],
            quantity=row["quantity"],
            unit=row["unit"],
            results={
                s: SupplierResult(**v)
                for s, v in row["results"].items()
            },
        ))

    return MaterialCheckerResponse(
        rows=rows,
        postcode=postcode,
        scraped_at=datetime.utcnow().isoformat() + "Z",
        warnings=warnings,
    )
