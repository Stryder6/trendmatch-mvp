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
    }    }

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
