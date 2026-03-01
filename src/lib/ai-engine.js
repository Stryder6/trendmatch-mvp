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

  const nicheContext = niches && niches.length > 0
    ? `- Selected Niches: ${niches.join(', ')}`
    : `- Niches: Auto-detect from their content, bio, and video topics`

  const prompt = `You are a TikTok Shop product intelligence analyst. Analyze this creator's profile and recommend products they should sell on TikTok Shop.

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
First, analyze the creator's content to identify their niche, audience interests, and content style. Then recommend exactly 6 products they should sell on TikTok Shop that align with their audience.

If the creator has few followers or videos, recommend beginner-friendly products with low cost and high viral potential in trending categories.

For EACH product, provide:
1. product_name: Specific product name (not generic)
2. category: Product category
3. description: Why this product fits their audience (2 sentences)
4. suggested_price: Retail price as a string with $ (e.g. "$24.99") - keep in $15-50 range for impulse buys
5. estimated_cost: Approximate sourcing cost as string with $ (e.g. "$8.00")
6. estimated_margin: Price minus cost as string with $ (e.g. "$16.99")
7. margin_percent: Margin as percentage number (e.g. 68)
8. trend_status: "hot", "rising", or "new"
9. match_score: 0-100 how well this matches their audience
10. content_hook: A TikTok video hook they could use (1 sentence)
11. content_format: Suggested video format (e.g., "Before/After Demo", "Unboxing", "Day in my life", "Get ready with me")
12. sourcing_notes: Where to find this product (mention CJ Dropshipping or Zendrop with US warehouse)
13. why_now: Why this product is trending right now (1 sentence)
14. detected_niche: What niche you detected this creator is in

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
    const match = text.match(/\[[\s\S]*\]/)
    if (match) return JSON.parse(match[0])
    throw new Error('Failed to parse AI response')
  }
}

export async function generateContentTemplate({ product, creatorInfo }) {
  const prompt = `You are a TikTok content strategist. Create a detailed TikTok video script for selling this product.

PRODUCT: ${product.product_name}
CATEGORY: ${product.category}
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
