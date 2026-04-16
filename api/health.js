/**
 * ToP-R Solutions — Health Check (Vercel)
 * GET /api/health  — no auth required
 * Tests Gmail SMTP, Upstash Redis, Telegram token, and CRON_SECRET presence.
 * Use to diagnose which env var or service is broken after a deployment issue.
 */

import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

  if (req.method === 'OPTIONS') { res.status(204).end(); return }
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return }

  const checks = {}
  const detail = {}

  // ── CRON_SECRET ──────────────────────────────────────────────────────────────
  checks.cronSecret = process.env.CRON_SECRET ? 'set' : 'missing'

  // ── TELEGRAM ─────────────────────────────────────────────────────────────────
  // Presence-only check — no live call to avoid sending accidental messages
  checks.telegram = process.env.TELEGRAM_BOT_TOKEN ? 'ok' : 'missing'

  // ── UPSTASH REDIS ─────────────────────────────────────────────────────────────
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!upstashUrl || !upstashToken) {
    checks.upstash = 'missing'
  } else {
    try {
      const upstashRes = await fetch(`${upstashUrl}/ping`, {
        headers: { Authorization: `Bearer ${upstashToken}` },
      })
      const data = await upstashRes.json()
      if (data.result === 'PONG') {
        checks.upstash = 'ok'
      } else {
        checks.upstash = 'error'
        detail.upstash = `Unexpected response: ${JSON.stringify(data)}`
      }
    } catch (err) {
      checks.upstash = 'error'
      detail.upstash = err.message
    }
  }

  // ── GMAIL SMTP ────────────────────────────────────────────────────────────────
  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_APP_PASSWORD

  if (!gmailUser || !gmailPass) {
    checks.gmail = 'missing'
  } else {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: gmailUser, pass: gmailPass },
      })
      await transporter.verify()
      checks.gmail = 'ok'
    } catch (err) {
      checks.gmail = 'auth_failed'
      detail.gmail = err.message
    }
  }

  // ── RESULT ────────────────────────────────────────────────────────────────────
  const ok = (
    checks.cronSecret === 'set' &&
    checks.telegram === 'ok' &&
    checks.upstash === 'ok' &&
    checks.gmail === 'ok'
  )

  const body = { ok, checks }
  if (Object.keys(detail).length > 0) body.detail = detail

  res.status(200).json(body)
}
