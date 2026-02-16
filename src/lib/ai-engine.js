import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function analyzeCreatorProfile({ userInfo, userStats, videos, niches }) {
  const videoSummary = videos.slice(0, 15).map(v => ({
    title: v.title || '',
    description: v.video_description || '',
    views: v.view_count,
    likes: v.like_count,
    comments: v.comment_count,
  }))

  const prompt = `You are a TikTok Shop product intelligence analyst. Analyze this creator's profile and recommend products they should sell on TikTok Shop.

CREATOR PROFILE:
- Display Name: ${userInfo.display_name}
- Bio: ${userInfo.bio_description}
- Followers: ${userStats.follower_count?.toLocaleString()}
- Total Likes: ${userStats.likes_count?.toLocaleString()}
- Videos: ${userStats.video_count}
- Selected Niches: ${niches.join(', ')}

RECENT VIDEOS:
${videoSummary.map((v, i) => `${i + 1}. "${v.title}" - ${v.description} (${v.views?.toLocaleString()} views, ${v.likes?.toLocaleString()} likes)`).join('\n')}

Based on this creator's content, audience size, and niche, recommend exactly 6 products they should sell on TikTok Shop.

For EACH product, provide:
1. product_name: Specific product name (not generic)
2. category: Product category
3. description: Why this product fits their audience (2 sentences)
4. suggested_price: Retail price ($15-50 range for impulse buys)
5. estimated_cost: Approximate sourcing cost
6. estimated_margin: Price minus cost
7. margin_percent: Margin as percentage
8. trend_status: "hot", "rising", or "new"
9. match_score: 0-100 how well this matches their audience
10. content_hook: A TikTok video hook they could use (1 sentence)
11. content_format: Suggested video format (e.g., "Before/After Demo", "Unboxing", "Day in my life", "Get ready with me")
12. sourcing_notes: Where to find this product (mention CJ Dropshipping or Zendrop with US warehouse)
13. why_now: Why this product is trending right now (1 sentence)

Respond ONLY with valid JSON array. No markdown, no explanation. Just the JSON array of 6 product objects.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].text
  try {
    return JSON.parse(text)
  } catch (e) {
    // Try to extract JSON from response if wrapped in anything
    const match = text.match(/\[[\s\S]*\]/)
    if (match) return JSON.parse(match[0])
    throw new Error('Failed to parse AI response')
  }
}

export async function generateContentTemplate({ product, creatorInfo }) {
  const prompt = `You are a TikTok content strategist. Create a detailed TikTok video script for selling this product.

PRODUCT: ${product.product_name}
CATEGORY: ${product.category}
CREATOR NICHE: ${creatorInfo.niches.join(', ')}
CREATOR FOLLOWERS: ${creatorInfo.follower_count?.toLocaleString()}
FORMAT: ${product.content_format}

Create a detailed script with:
1. hook (0-3 seconds): Attention-grabbing opening line
2. problem (3-8 seconds): Show the pain point
3. solution (8-20 seconds): Demonstrate the product
4. result (20-25 seconds): Show the transformation/result
5. cta (25-30 seconds): Call to action
6. suggested_sound: A type of trending TikTok sound that would work
7. hashtags: 5 relevant hashtags
8. best_posting_time: Best time to post this type of content
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
