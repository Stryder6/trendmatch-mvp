import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(request) {
  const cookieStore = cookies()
  const userId = cookieStore.get('tm_user_id')?.value
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { productId } = await request.json()
  const supabase = createServerClient()

  const { data: product } = await supabase
    .from('product_matches')
    .select('saved')
    .eq('id', productId)
    .eq('user_id', userId)
    .single()

  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await supabase
    .from('product_matches')
    .update({ saved: !product.saved })
    .eq('id', productId)
    .eq('user_id', userId)

  return NextResponse.json({ saved: !product.saved })
}
