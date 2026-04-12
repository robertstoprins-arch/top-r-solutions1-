/**
 * ToP-R Solutions — Contact Form Submission (Vercel)
 * Routes enquiries to the correct email address based on selected services.
 */

import nodemailer from 'nodemailer'

const SURVEY_SERVICES = ['Scan to BIM', 'Heritage Survey', 'Post-Processing', 'As-Built Survey']
const AUTOMATION_SERVICES = ['Material Price Checker', 'RFI Desk']

function getToAddress(services = []) {
  const hasSurvey = services.some(s => SURVEY_SERVICES.includes(s))
  const hasAutomation = services.some(s => AUTOMATION_SERVICES.includes(s))
  if (hasSurvey) return 'surveys@top-rsolutions.co.uk'
  if (hasAutomation) return 'automations@top-rsolutions.co.uk'
  return 'info@top-rsolutions.co.uk'
}

function buildEmailBody(form) {
  const lines = [
    `Name: ${form.name || '—'}`,
    `Company: ${form.company || '—'}`,
    `Email: ${form.email || '—'}`,
    `Phone: ${form.phone || '—'}`,
    ``,
    `Project type: ${form.projectType || '—'}`,
    `Approximate size: ${form.size || '—'}`,
    `Current stage: ${form.stage || '—'}`,
    `Location: ${form.location || '—'}`,
    `Timeline: ${form.timeline || '—'}`,
    ``,
    `Services required: ${(form.services || []).join(', ') || '—'}`,
    `Known standards / BIM requirements: ${form.standards || '—'}`,
    ``,
    `Additional notes:`,
    form.notes || '—',
  ]
  return lines.join('\n')
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') { res.status(204).end(); return }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return }

  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_APP_PASSWORD

  const form = req.body || {}

  if (!gmailUser || !gmailPass) {
    console.error('Email env vars missing — GMAIL_USER:', gmailUser ? 'set' : 'MISSING', 'GMAIL_APP_PASSWORD:', gmailPass ? 'set' : 'MISSING')
    res.status(503).json({ error: 'Contact form not configured', detail: 'env vars missing' })
    return
  }
  console.log('Email env vars present, sending to:', getToAddress(form.services))

  if (!form.name || !form.email) {
    res.status(400).json({ error: 'Name and email are required' })
    return
  }

  const toAddress = getToAddress(form.services)
  const serviceList = (form.services || []).join(', ') || 'General enquiry'
  const subject = `New enquiry — ${serviceList} — ${form.name}${form.company ? ', ' + form.company : ''}`

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: gmailPass },
    })

    await transporter.sendMail({
      from: `"ToP-R Solutions" <${gmailUser}>`,
      to: toAddress,
      cc: 'roberts@top-rsolutions.co.uk',
      replyTo: form.email,
      subject,
      text: buildEmailBody(form),
    })

    console.log(`Form submitted OK → ${toAddress} | ${subject}`)
    res.status(200).json({ ok: true, sentTo: toAddress })
  } catch (err) {
    console.error('Email send failed:', err.message, err.code, err.response)
    res.status(500).json({ error: 'Failed to send', detail: err.message, code: err.code })
  }
}
