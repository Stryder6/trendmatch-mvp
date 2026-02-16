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

    // Get user from DB
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get niches from request body
    const { niches } = await request.json()

    // Fetch user's videos from TikTok
    let videos = []
    try {
      const videosRes = await getUserVideos(user.access_token)
      videos = videosRes.data?.videos || []
    } catch (e) {
      console.error('Failed to fetch videos:', e)
      // Continue with empty videos - AI can still recommend based on profile
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

    // Update user niches
    await supabase
      .from('users')
      .update({ niches, onboarding_complete: true })
      .eq('id', userId)

    return NextResponse.json({ products, success: true })
  } catch (err) {
    console.error('Analysis error:', err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
