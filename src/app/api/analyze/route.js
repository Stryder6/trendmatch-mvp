import { NextResponse } from 'next/server'
import { getUserVideos } from '@/lib/tiktok'
import { analyzeCreatorProfile } from '@/lib/ai-engine'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get('tm_user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const supabase = createServerClient()

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Monthly reset for free users
    const now = new Date()
    const lastReset = user.last_reset_at ? new Date(user.last_reset_at) : null
    const needsReset = !lastReset || (now.getMonth() !== lastReset.getMonth()) || (now.getFullYear() !== lastReset.getFullYear())
    if (needsReset && user.plan !== "pro" && user.plan !== "early_bird") {
      await supabase.from("users").update({ analyses_used: 0, last_reset_at: now.toISOString() }).eq("id", userId)
      user.analyses_used = 0
    }

    // Check usage limits
    const limit = user.plan === "pro" ? 999 : user.plan === "early_bird" ? 999 : 1
    if (user.analyses_used >= limit) {
      return NextResponse.json({
        error: "limit_reached",
        message: "You have used your free analysis this month. Upgrade to Pro for unlimited analyses.",
        analyses_used: user.analyses_used,
        analyses_limit: limit,
        resets_at: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
      }, { status: 403 })
    }

    // Get optional niches from request body
    let niches = []
    try {
      const body = await request.json()
      niches = body.niches || []
    } catch (e) {
      // No body or invalid JSON - that's fine, AI will auto-detect
    }

    // Fetch user's videos from TikTok
    let videos = []
    try {
      const videosRes = await getUserVideos(user.access_token)
      videos = videosRes.data?.videos || []
    } catch (e) {
      console.error('Failed to fetch videos:', e)
    }

    // Run AI analysis
    const products = await analyzeCreatorProfile({
      userInfo: {
        display_name: user.display_name,
        bio_description: user.bio,
      },
      userStats: {
        follower_count: user.follower_count,
        likes_count: user.likes_count,
        video_count: user.video_count,
      },
      videos,
      niches,
    })

    // Extract detected niches from products
    const detectedNiches = [...new Set(products.map(p => p.detected_niche).filter(Boolean))]

    // Assign product images from Pexels (free API) or fallback to category-based images
    const PEXELS_KEY = process.env.PEXELS_API_KEY
    if (PEXELS_KEY) {
      for (const p of products) {
        if (p.product_image) continue
        try {
          const query = p.product_name.split(' ').slice(0, 3).join(' ')
          const res = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query + ' product')}&per_page=1&orientation=square`,
            { headers: { Authorization: PEXELS_KEY } }
          )
          const data = await res.json()
          if (data.photos?.[0]) {
            p.product_image = data.photos[0].src.medium
          }
        } catch (e) { /* silent */ }
      }
    }

    // Fallback: assign category-based stock images for any products still missing images
    const categoryImages = {
      lamp: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400',
      light: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400',
      led: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400',
      projector: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=400',
      speaker: 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=400',
      earbuds: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400',
      headphone: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400',
      phone: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',
      charger: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',
      watch: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400',
      bracelet: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400',
      jewelry: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400',
      ring: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400',
      necklace: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400',
      skincare: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400',
      beauty: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400',
      makeup: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400',
      serum: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400',
      bottle: 'https://images.pexels.com/photos/1342529/pexels-photo-1342529.jpeg?auto=compress&cs=tinysrgb&w=400',
      water: 'https://images.pexels.com/photos/1342529/pexels-photo-1342529.jpeg?auto=compress&cs=tinysrgb&w=400',
      kitchen: 'https://images.pexels.com/photos/4397919/pexels-photo-4397919.jpeg?auto=compress&cs=tinysrgb&w=400',
      blender: 'https://images.pexels.com/photos/4397919/pexels-photo-4397919.jpeg?auto=compress&cs=tinysrgb&w=400',
      cup: 'https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg?auto=compress&cs=tinysrgb&w=400',
      mug: 'https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg?auto=compress&cs=tinysrgb&w=400',
      bag: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
      backpack: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
      fitness: 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=400',
      yoga: 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=400',
      mat: 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=400',
      pet: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      dog: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      cat: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      candle: 'https://images.pexels.com/photos/3270223/pexels-photo-3270223.jpeg?auto=compress&cs=tinysrgb&w=400',
      diffuser: 'https://images.pexels.com/photos/3270223/pexels-photo-3270223.jpeg?auto=compress&cs=tinysrgb&w=400',
      aroma: 'https://images.pexels.com/photos/3270223/pexels-photo-3270223.jpeg?auto=compress&cs=tinysrgb&w=400',
      pillow: 'https://images.pexels.com/photos/545012/pexels-photo-545012.jpeg?auto=compress&cs=tinysrgb&w=400',
      cushion: 'https://images.pexels.com/photos/545012/pexels-photo-545012.jpeg?auto=compress&cs=tinysrgb&w=400',
      decor: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
      home: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
      mirror: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
      brush: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400',
      hair: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400',
      glasses: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400',
      sunglasses: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400',
    }
    const defaultImage = 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=400'

    for (const p of products) {
      if (p.product_image) continue
      const nameLower = p.product_name.toLowerCase()
      let matched = false
      for (const [keyword, url] of Object.entries(categoryImages)) {
        if (nameLower.includes(keyword)) {
          p.product_image = url
          matched = true
          break
        }
      }
      if (!matched) p.product_image = defaultImage
    }

    // Save products to DB
    const productRecords = products.map(p => ({
      user_id: userId,
      product_name: p.product_name,
      category: p.category,
      description: p.description,
      suggested_price: p.suggested_price,
      estimated_cost: p.estimated_cost,
      estimated_margin: p.estimated_margin,
      margin_percent: p.margin_percent,
      trend_status: p.trend_status,
      match_score: p.match_score,
      content_hook: p.content_hook,
      content_format: p.content_format,
      sourcing_notes: p.sourcing_notes,
      why_now: p.why_now,
      product_image: p.product_image || null,
      cj_sku: p.cj_sku || null,
      created_at: new Date().toISOString(),
    }))

    // Clear old recommendations
    await supabase.from('product_matches').delete().eq('user_id', userId)

    // Insert new ones
    const { error: insertError } = await supabase
      .from('product_matches')
      .insert(productRecords)

    if (insertError) {
      console.error('Insert error:', insertError)
    }

    // Update user
    await supabase
      .from('users')
      .update({
        niches: detectedNiches.length > 0 ? detectedNiches : (niches.length > 0 ? niches : user.niches),
        onboarding_complete: true,
        analyses_used: (user.analyses_used || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    return NextResponse.json({
      products,
      success: true,
      detected_niches: detectedNiches,
      analyses_used: (user.analyses_used || 0) + 1,
      analyses_limit: limit,
    })
  } catch (err) {
    console.error('Analysis error:', err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
