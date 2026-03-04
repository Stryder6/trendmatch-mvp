import { NextResponse } from 'next/server'

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  
  if (!query) return NextResponse.json({ image: '' })

  try {
    const token = process.env.CJ_ACCESS_TOKEN
    if (!token) return NextResponse.json({ image: '' })

    const res = await fetch(
      `${CJ_BASE}/product/list?pageNum=1&pageSize=5&productNameEn=${encodeURIComponent(query)}`,
      { headers: { 'CJ-Access-Token': token } }
    )
    const data = await res.json()
    
    if (data.code === 200 && data.data?.list) {
      const withImage = data.data.list.find(p => p.productImage)
      if (withImage) return NextResponse.json({ image: withImage.productImage })
    }

    return NextResponse.json({ image: '' })
  } catch (e) {
    return NextResponse.json({ image: '' })
  }
}
