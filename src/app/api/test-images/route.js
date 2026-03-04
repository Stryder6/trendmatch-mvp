import { NextResponse } from 'next/server'

export async function GET() {
  const products = [
    { product_name: '3D Moon Lamp Night Light', product_image: '' },
    { product_name: 'Portable Mini Blender', product_image: '' },
    { product_name: 'LED Ring Light', product_image: '' },
    { product_name: 'Aromatherapy Diffuser', product_image: '' },
    { product_name: 'Water Bottle Insulated', product_image: '' },
    { product_name: 'Wireless Earbuds TWS', product_image: '' },
  ]

  const categoryImages = {
    lamp: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400',
    light: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400',
    led: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400',
    blender: 'https://images.pexels.com/photos/4397919/pexels-photo-4397919.jpeg?auto=compress&cs=tinysrgb&w=400',
    diffuser: 'https://images.pexels.com/photos/3270223/pexels-photo-3270223.jpeg?auto=compress&cs=tinysrgb&w=400',
    bottle: 'https://images.pexels.com/photos/1342529/pexels-photo-1342529.jpeg?auto=compress&cs=tinysrgb&w=400',
    earbuds: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400',
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

  return NextResponse.json({ products })
}
