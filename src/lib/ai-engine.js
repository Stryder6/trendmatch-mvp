import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function analyzeCreatorProfile({ userInfo, userStats, videos, niches }) {
  const videoSummary = videos.slice(0, 15).map(v => ({
    title: v.title || '',
    description: v.video_description || '',
    views: v.view_count,
    likes: v.like_count,
  }))

  const nicheContext = niches?.length > 0
    ? `- Selected Niches: ${niches.join(', ')}`
    : `- Niches: Auto-detect from their content`

  const prompt = `You are a TikTok Shop product intelligence analyst. Analyze this creator's profile and recommend 6 real, specific products they should sell on TikTok Shop.

CREATOR PROFILE:
- Display Name: ${userInfo.display_name}
- Bio: ${userInfo.bio_description || 'No bio set'}
- Followers: ${userStats.follower_count?.toLocaleString()}
- Total Likes: ${userStats.likes_count?.toLocaleString()}
- Videos: ${userStats.video_count}
${nicheContext}

RECENT VIDEOS:
${videoSummary.length > 0 
  ? videoSummary.map((v, i) => `${i + 1}. "${v.title}" - ${v.description} (${v.views?.toLocaleString()} views, ${v.likes?.toLocaleString()} likes)`).join('\n')
  : 'No videos available - use bio and profile info to make recommendations.'}

INSTRUCTIONS:
Recommend exactly 6 REAL products that actually exist on dropshipping platforms like CJ Dropshipping, Zendrop, or AliExpress. Use real product names that a seller would find on these platforms. Keep prices in the $15-45 impulse buy range.

If the creator has few followers or videos, recommend beginner-friendly viral products.

For EACH product, provide:
1. product_name: A real, specific product name (e.g. "3D Moon Lamp Night Light" not just "lamp")
2. category: Product category
3. description: Why this product fits their audience (2 sentences)
4. suggested_price: Retail price "$XX.XX" in $15-45 range
5. estimated_cost: Realistic wholesale cost "$X.XX" (typically $3-15)
6. estimated_margin: Price minus cost "$XX.XX"
7. margin_percent: Margin as percentage number
8. trend_status: "hot", "rising", or "new"
9. match_score: 0-100 how well this matches their audience
10. content_hook: A TikTok video hook they could use (1 sentence)
11. content_format: Suggested video format (e.g., "Before/After Demo", "Unboxing", "GRWM")
12. sourcing_notes: "Available on CJ Dropshipping" with a realistic SKU like "CJXXXXXX"
13. why_now: Why this product is trending right now (1 sentence)
14. detected_niche: What niche you detected this creator is in
15. product_image: Leave as empty string ""
16. cj_sku: A realistic CJ-style SKU (format: "CJ" + 2 letters + 5-7 digits, e.g. "CJHM2847103")

Respond ONLY with valid JSON array. No markdown, no explanation.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].text
  try {
    return JSON.parse(text)
  } catch (e) {
    const match = text.match(/\[[\s\S]*\]/)
    if (match) return JSON.parse(match[0])
    throw new Error('Failed to parse AI response')
  }
}

export async function generateContentTemplate({ product, creatorInfo }) {
  const prompt = `You are a TikTok content strategist. Create a TikTok video script for selling this product.

PRODUCT: ${product.product_name}
CATEGORY: ${product.category}
CREATOR FOLLOWERS: ${creatorInfo.follower_count?.toLocaleString()}
FORMAT: ${product.content_format}

Create a script with:
1. hook (0-3s): Attention-grabbing opener
2. problem (3-8s): Pain point
3. solution (8-20s): Demo the product
4. result (20-25s): Transformation
5. cta (25-30s): Call to action
6. suggested_sound: Trending sound type
7. hashtags: 5 hashtags
8. best_posting_time: Best time to post
9. pro_tips: 2-3 filming tips

Respond ONLY with valid JSON. No markdown.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].text
  try {
    return JSON.parse(text)
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error('Failed to parse AI response')
  }
}
