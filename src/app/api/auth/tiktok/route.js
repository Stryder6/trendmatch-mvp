import { NextResponse } from 'next/server'
import { exchangeCodeForToken, getUserInfo, getUserStats } from '@/lib/tiktok'
import { createServerClient } from '@/lib/supabase'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth-error?code=auth_denied`)
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth-error?code=no_code`)
  }

  try {
    const tokenData = await exchangeCodeForToken(code)

    if (tokenData.error) {
      console.error('Token exchange error:', tokenData)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth-error?code=token_failed`)
    }

    const { access_token, refresh_token, open_id, expires_in } = tokenData.data || tokenData

    const [userInfoRes, userStatsRes] = await Promise.all([
      getUserInfo(access_token),
      getUserStats(access_token),
    ])

    const userInfo = userInfoRes.data?.user || {}
    const userStats = userStatsRes.data?.user || {}

    const supabase = createServerClient()

    // Check if returning user
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, onboarding_complete')
      .eq('tiktok_open_id', open_id)
      .single()

    const { data: user, error: dbError } = await supabase
      .from('users')
      .upsert({
        tiktok_open_id: open_id,
        display_name: userInfo.display_name,
        avatar_url: userInfo.avatar_url,
        bio: userInfo.bio_description,
        is_verified: userInfo.is_verified,
        follower_count: userStats.follower_count,
        following_count: userStats.following_count,
        likes_count: userStats.likes_count,
        video_count: userStats.video_count,
        access_token,
        refresh_token,
        token_expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'tiktok_open_id' })
      .select()
      .single()

    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth-error?code=db_failed`)
    }

    // Returning users go to dashboard, new users go to auto-analyze
    const redirectPath = existingUser?.onboarding_complete ? '/dashboard' : '/analyzing'

    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}${redirectPath}`)
    response.cookies.set('tm_user_id', user.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    })

    return response
  } catch (err) {
    console.error('Auth callback error:', err)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth-error?code=unknown`)
  }
}
