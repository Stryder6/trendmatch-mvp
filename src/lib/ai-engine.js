import Anthropic from '@anthropic-ai/sdk'
import { searchProducts } from './cj-dropshipping'

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

  // Step 1: Ask AI to identify product search terms for this creator
  const searchPrompt = `You are a TikTok Shop product intelligence analyst. Based on this creator's profile, suggest 6 specific product search keywords that would match their audience.

CREATOR PROFILE:
- Display Name: ${userInfo.display_name}
- Bio: ${userInfo.bio_description || 'No bio set'}
- Followers: ${userStats.follower_count?.toLocaleString()}
- Total Likes: ${userStats.likes_count?.toLocaleString()}
- Videos: ${userStats.video_count}
${nicheContext}

RECENT VIDEOS:
${videoSummary.length > 0
  ? videoSummary.map((v, i) => `${i + 1}. "${v.title}" - ${v.description} (${v.views?.toLocaleString()} views)`).join('\n')
  : 'No videos available - use bio and profile info.'}

Return exactly 6 product search keywords that would find real dropshipping products for this creator's audience. Keywords should be specific product types (e.g. "LED sunset lamp", "portable blender", "cloud slides", "ring light").

If the creator has few followers or no clear niche, suggest trending TikTok Shop products that work for beginners.

Respond ONLY with a JSON array of 6 strings. No markdown, no explanation. Example: ["LED sunset lamp","portable blender","cloud slides","ring light","mini projector","aromatherapy diffuser"]`

  const searchRes = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [{ role: 'user', content: searchPrompt }],
  })

  let searchTerms = []
  try {
    searchTerms = JSON.parse(searchRes.content[0].text)
  } catch (e) {
    const match = searchRes.content[0].text.match(/\[[\s\S]*\]/)
    if (match) searchTerms = JSON.parse(match[0])
    else searchTerms = ['LED lamp', 'phone accessory', 'beauty tool', 'home gadget', 'fitness band', 'kitchen tool']
  }

  // Step 2: Search CJ Dropshipping for real products
  let allCjProducts = []
  for (const term of searchTerms) {
    try {
      const results = await searchProducts(term, 5)
      // Filter for products with English names and reasonable prices
      const good = results.filter(p =>
        p.name &&
        !p.name.startsWith('[') &&
        p.wholesale_price > 1 &&
        p.wholesale_price < 50
      )
      allCjProducts.push(...good.map(p => ({ ...p, searchTerm: term })))
    } catch (e) {
      console.error(`CJ search failed for "${term}":`, e.message)
    }
  }

  // Deduplicate by SKU
  const seen = new Set()
  allCjProducts = allCjProducts.filter(p => {
    if (seen.has(p.sku)) return false
    seen.add(p.sku)
    return true
  })

  // Step 3: Have AI pick the best 6 and add TikTok strategy
  const cjContext = allCjProducts.slice(0, 30).map((p, i) => (
    `${i + 1}. "${p.name}" - $${p.wholesale_price.toFixed(2)} wholesale - Category: ${p.category} - SKU: ${p.sku} - Image: ${p.image} - Ships to: ${p.shipping_countries.join(', ') || 'varies'} - Search: "${p.searchTerm}"`
  )).join('\n')

  const analysisPrompt = `You are a TikTok Shop product intelligence analyst. A creator wants to sell products on TikTok Shop. Pick the BEST 6 products from the real supplier catalog below and create a selling strategy for each.

CREATOR PROFILE:
- Display Name: ${userInfo.display_name}
- Bio: ${userInfo.bio_description || 'No bio set'}
- Followers: ${userStats.follower_count?.toLocaleString()}
- Total Likes: ${userStats.likes_count?.toLocaleString()}
${nicheContext}

REAL PRODUCTS FROM CJ DROPSHIPPING CATALOG:
${cjContext || 'No products found - generate recommendations based on niche.'}

${allCjProducts.length > 0 ? `Pick the 6 best products from the list above that match this creator's audience. Use the REAL product names and wholesale prices from the catalog.` : `Since no catalog products were found, recommend 6 products this creator should sell.`}

For each product, provide:
1. product_name: The exact product name from the catalog (or a clean version of it)
2. category: Product category
3. description: Why this product fits their audience (2 sentences)
4. suggested_price: Retail price as "$XX.XX" — mark up 2-3x from wholesale for impulse buy range ($15-50)
5. estimated_cost: The wholesale price from catalog as "$XX.XX"
6. estimated_margin: suggested_price minus estimated_cost as "$XX.XX"
7. margin_percent: Margin as percentage number
8. trend_status: "hot", "rising", or "new"
9. match_score: 0-100 how well this matches their audience
10. content_hook: A TikTok video hook they could use (1 sentence)
11. content_format: Suggested video format (e.g., "Before/After Demo", "Unboxing")
12. sourcing_notes: "Available on CJ Dropshipping — SKU: [sku]" with the real SKU
13. why_now: Why this product is trending right now (1 sentence)
14. detected_niche: What niche you detected this creator is in
15. product_image: The image URL from the catalog (or empty string if none)
16. cj_sku: The SKU from the catalog

Respond ONLY with valid JSON array of 6 objects. No markdown.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: analysisPrompt }],
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
