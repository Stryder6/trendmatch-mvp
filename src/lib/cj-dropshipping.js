const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1'

let cachedToken = null
let tokenExpiry = 0

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken
  if (process.env.CJ_ACCESS_TOKEN) {
    cachedToken = process.env.CJ_ACCESS_TOKEN
    tokenExpiry = Date.now() + (14 * 24 * 60 * 60 * 1000)
    return cachedToken
  }
  if (!process.env.CJ_API_KEY) throw new Error('No CJ credentials configured')
  const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: process.env.CJ_API_KEY }),
  })
  const data = await res.json()
  if (data.code === 200 && data.data?.accessToken) {
    cachedToken = data.data.accessToken
    tokenExpiry = new Date(data.data.accessTokenExpiryDate).getTime() - 60000
    return cachedToken
  }
  throw new Error(`CJ Auth failed: ${data.message}`)
}

// Browse products by category ID — much more reliable than keyword search
export async function getProductsByCategory(categoryId, pageSize = 20) {
  const token = await getAccessToken()
  console.log(`CJ: Browsing category ${categoryId}...`)
  const res = await fetch(
    `${CJ_BASE}/product/list?pageNum=1&pageSize=${pageSize}&categoryId=${categoryId}`,
    { headers: { 'CJ-Access-Token': token } }
  )
  const data = await res.json()
  if (data.code === 200 && data.data?.list?.length > 0) {
    console.log(`CJ: Found ${data.data.list.length} products in category`)
    return mapProducts(data.data.list)
  }
  console.log(`CJ: No products in category ${categoryId}`)
  return []
}

// Keyword search as fallback
export async function searchProducts(keyword, pageSize = 20) {
  const token = await getAccessToken()
  console.log(`CJ: Searching "${keyword}"...`)
  const res = await fetch(
    `${CJ_BASE}/product/list?pageNum=1&pageSize=${pageSize}&productNameEn=${encodeURIComponent(keyword)}`,
    { headers: { 'CJ-Access-Token': token } }
  )
  const data = await res.json()
  if (data.code === 200 && data.data?.list?.length > 0) {
    console.log(`CJ: Found ${data.data.list.length} for "${keyword}"`)
    return mapProducts(data.data.list)
  }
  return []
}

function mapProducts(list) {
  return list.map(p => ({
    cj_pid: p.pid,
    name: p.productNameEn || '',
    sku: p.productSku,
    image: p.productImage,
    wholesale_price: parseFloat(p.sellPrice) || 0,
    category: p.categoryName,
    weight: p.productWeight,
    shipping_countries: p.shippingCountryCodes || [],
    free_shipping: p.isFreeShipping || false,
    listed_count: p.listedNum || 0,
  }))
}

// Available categories for AI to pick from
export const CJ_CATEGORIES = {
  'LED Lighting': 'DFFFDEDF-42F8-4D1F-B0A3-6B6744F7C1D3',
  'Smart Home Appliances': '36F73513-6A5A-445D-87F9-BF3D6629E649',
  'Wearable Devices': '11D33F89-9B90-4D1A-B977-DE229BAA7E86',
  'Power Bank': '491E5474-524C-4666-BDD7-4E35E38900EA',
  'Projectors': '0AC6B44A-12CC-456F-831F-54064C77D303',
  'Kitchen Storage': '87CF251F-8D11-4DE0-A154-9694D9858EB3',
  'Bracelets & Bangles': '0615F8DB-C10F-4BEF-892B-1C5B04268938',
  'Keychains': '1363289906151034880',
  'Pet Toys': '2410110339311602900',
  'Pet Bowls': '2410110341061612000',
  'Floor Mats': '2601070550351602500',
  'Cushion Covers': '300CC260-CF9D-4AEA-9FC2-6C8DB8A35B51',
  'Stickers & Decals': '25A6516D-3AE3-4207-BA00-6FD3CCE20201',
  'Nail Decorations': '26F7660F-A00A-468A-BA29-E61A465C0D0B',
  'Health Care Products': '2409190611101616600',
  'Running Shoes': '24A29AC9-8B9B-4552-AF5E-431E6CF47C67',
  'Electronic Pets': '6614840A-DB50-4FBB-80FD-705F4FD59BFA',
  'Car Aromatherapy': '2601070551311618400',
  'Flashlights & Torches': '7E431502-1275-4FF3-A236-B97C107C3AFA',
  'USB Flash Drives': '591E8920-019B-42FA-AE0B-420052E6C4F0',
  'Screen Protectors': '51D68796-F1B5-4BDC-B9E0-32C3D9FF6994',
  'Scarves & Wraps': '0DC4DF6F-4EC5-47DF-B20D-863ADF69319F',
  'Decor Paintings': '2409230854411618700',
  'Headband & Hair Band': '2502140903111619100',
  'Digital Cables': '40CC2ED1-8998-4515-9139-787CC25D42A7',
  'Blocks & Building Toys': '835F7743-8432-4D0F-90F0-E76C89F7C5B7',
  'Car Stickers': '255A489E-8518-4E31-AC84-A2E8EB645C78',
  'Bikini Sets': '56F1151E-2544-4044-BB41-03081A532B2F',
  'School Bags': '62A4235C-31EE-40E3-9D61-8F310470FEBC',
  'Office & School Supplies': '2252588B-72E3-4397-8C92-7D9967161084',
}
