import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get('tm_user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const supabase = createServerClient()

    const { data: products, error } = await supabase
      .from('product_matches')
      .select('*')
      .eq('user_id', userId)
      .order('match_score', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    const { data: user } = await supabase
      .from('users')
      .select('display_name, avatar_url, follower_count, likes_count, video_count, niches')
      .eq('id', userId)
      .single()

    return NextResponse.json({ products, user })
  } catch (err) {
    console.error('Products fetch error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
