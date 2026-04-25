// One-time OAuth callback — exchanges LinkedIn auth code for access token.
// After getting the token, copy it to LINKEDIN_ACCESS_TOKEN in .env and Vercel.
// This endpoint can be disabled once the token is stored.

export default async function handler(req, res) {
  const { code, error, error_description } = req.query

  if (error) {
    return res.status(400).send(`
      <h2>LinkedIn Auth Error</h2>
      <p><strong>${error}</strong>: ${error_description}</p>
    `)
  }

  if (!code) {
    // Step 1: Redirect to LinkedIn authorization
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.LINKEDIN_CLIENT_ID,
      redirect_uri: `${process.env.FRONTEND_URL}/api/linkedin-auth`,
      scope: 'w_member_social openid profile email',
    })
    return res.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params}`)
  }

  // Step 2: Exchange code for token
  try {
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.FRONTEND_URL}/api/linkedin-auth`,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
    })

    const tokenData = await tokenRes.json()

    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || 'Token exchange failed')
    }

    // Fetch person URN
    const meRes = await fetch('https://api.linkedin.com/v2/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const meData = await meRes.json()
    const personUrn = `urn:li:person:${meData.id}`

    return res.status(200).send(`
      <html><body style="font-family:monospace;padding:2rem;background:#f5f5f5">
        <h2>✅ LinkedIn Connected</h2>
        <p>Copy these values into your <strong>.env</strong> file and Vercel environment variables:</p>
        <pre style="background:#111;color:#0f0;padding:1rem;border-radius:8px">
LINKEDIN_ACCESS_TOKEN=${tokenData.access_token}
LINKEDIN_PERSON_URN=${personUrn}
        </pre>
        <p><strong>Token expires in:</strong> ${Math.round(tokenData.expires_in / 86400)} days</p>
        <p style="color:#888">After copying, you can disable or delete this endpoint.</p>
      </body></html>
    `)
  } catch (err) {
    return res.status(500).send(`
      <h2>❌ Token Exchange Failed</h2>
      <p>${err.message}</p>
    `)
  }
}
