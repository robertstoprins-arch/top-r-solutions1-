const LI = 'https://api.linkedin.com/v2'

async function getPersonUrn() {
  if (process.env.LINKEDIN_PERSON_URN) return process.env.LINKEDIN_PERSON_URN
  const res = await fetch(`${LI}/me`, {
    headers: { Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}` },
  })
  const data = await res.json()
  if (!data.id) throw new Error('Could not fetch LinkedIn person URN')
  return `urn:li:person:${data.id}`
}

async function uploadImage(imageUrl) {
  const personUrn = await getPersonUrn()

  // Step 1: Register upload
  const registerRes = await fetch(`${LI}/assets?action=registerUpload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        owner: personUrn,
        serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }],
      },
    }),
  })
  const registerData = await registerRes.json()
  const uploadUrl = registerData.value?.uploadMechanism?.['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']?.uploadUrl
  const assetUrn = registerData.value?.asset

  if (!uploadUrl || !assetUrn) throw new Error('LinkedIn image registration failed')

  // Step 2: Fetch and upload image binary
  const imgRes = await fetch(imageUrl)
  const imgBuffer = await imgRes.arrayBuffer()
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/jpeg' },
    body: imgBuffer,
  })

  return assetUrn
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token = process.env.LINKEDIN_ACCESS_TOKEN
  if (!token) return res.status(503).json({ error: 'LINKEDIN_ACCESS_TOKEN not configured' })

  const { text, imageUrl } = req.body || {}
  if (!text?.trim()) return res.status(400).json({ error: 'text is required' })

  try {
    const personUrn = await getPersonUrn()
    let assetUrn = null

    if (imageUrl) {
      try { assetUrn = await uploadImage(imageUrl) } catch (imgErr) {
        console.warn('Image upload failed, posting text only:', imgErr.message)
      }
    }

    const postBody = {
      author: personUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: text.trim() },
          shareMediaCategory: assetUrn ? 'IMAGE' : 'NONE',
          ...(assetUrn && {
            media: [{ status: 'READY', media: assetUrn }],
          }),
        },
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
    }

    const postRes = await fetch(`${LI}/ugcPosts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(postBody),
    })

    const postData = await postRes.json()

    if (!postRes.ok) {
      console.error('LinkedIn post failed:', JSON.stringify(postData))
      throw new Error(postData.message || `LinkedIn API ${postRes.status}`)
    }

    res.status(200).json({ success: true, postId: postData.id })
  } catch (err) {
    console.error('post-to-linkedin error:', err)
    res.status(500).json({ error: err.message })
  }
}
