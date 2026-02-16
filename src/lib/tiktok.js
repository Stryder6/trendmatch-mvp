const TIKTOK_AUTH_URL = 'https://www.tiktok.com/v2/auth/authorize/'
const TIKTOK_TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/'
const TIKTOK_API_BASE = 'https://open.tiktokapis.com/v2'

export function getTikTokAuthUrl() {
  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY,
    scope: 'user.info.basic,user.info.profile,user.info.stats,video.list',
    response_type: 'code',
    redirect_uri: process.env.TIKTOK_REDIRECT_URI,
    state: 'trendmatch',
  })
  return `${TIKTOK_AUTH_URL}?${params.toString()}`
}

export async function exchangeCodeForToken(code) {
  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.TIKTOK_REDIRECT_URI,
    }),
  })
  return response.json()
}

export async function getUserInfo(accessToken) {
  const response = await fetch(
    `${TIKTOK_API_BASE}/user/info/?fields=open_id,avatar_url,display_name,bio_description,profile_deep_link,is_verified`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
  return response.json()
}

export async function getUserStats(accessToken) {
  const response = await fetch(
    `${TIKTOK_API_BASE}/user/info/?fields=follower_count,following_count,likes_count,video_count`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
  return response.json()
}

export async function getUserVideos(accessToken, cursor = 0) {
  const response = await fetch(
    `${TIKTOK_API_BASE}/video/list/?fields=id,title,video_description,create_time,cover_image_url,share_url,like_count,comment_count,share_count,view_count,duration`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ max_count: 20, cursor }),
    }
  )
  return response.json()
}
