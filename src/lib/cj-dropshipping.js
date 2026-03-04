const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1'

// Cache token in memory (lasts for the serverless function lifecycle)
let cachedToken = null
let tokenExpiry = 0

async function getAccessToken() {
  // Return cached token if still valid
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

  // Try env token first
  if (process.env.CJ_ACCESS_TOKEN) {
    cachedToken = process.env.CJ_ACCESS_TOKEN
    tokenExpiry = Date.now() + (14 * 24 * 60 * 60 * 1000) // assume 14 days
    return cachedToken
  }

  // Generate from API key
  if (!process.env.CJ_API_KEY) {
    throw new Error('No CJ_ACCESS_TOKEN or CJ_API_KEY configured')
  }

  console.log('CJ: Generating new access token from API key...')
  const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: process.env.CJ_API_KEY }),
  })
  const data = await res.json()
  if (data.code === 200 && data.data?.accessToken) {
    cachedToken = data.data.accessToken
    tokenExpiry = new Date(data.data.accessTokenExpiryDate).getTime() - 60000
    console.log('CJ: Got new access token, expires', data.data.accessTokenExpiryDate)
    return cachedToken
  }
  console.error('CJ Auth failed:', data)
  throw new Error(`CJ Auth failed: ${data.message}`)
}

export async function searchProducts(keyword, pageSize = 10) {
  const token = await getAccessToken()
  console.log(`CJ: Searching for "${keyword}"...`)
  const res = await fetch(
    `${CJ_BASE}/product/list?pageNum=1&pageSize=${pageSize}&productNameEn=${encodeURIComponent(keyword)}`,
    { headers: { 'CJ-Access-Token': token } }
  )
  const data = await res.json()
  if (data.code === 200 && data.data?.list) {
    console.log(`CJ: Found ${data.data.list.length} products for "${keyword}"`)
    return data.data.list.map(p => ({
      cj_pid: p.pid,
      name: p.productNameEn || p.productName,
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
  console.error(`CJ: Search failed for "${keyword}":`, data.code, data.message)
  return []
}

export async function searchProductsByCategory(categoryId, pageSize = 10) {
  const token = await getAccessToken()
  const res = await fetch(
    `${CJ_BASE}/product/list?pageNum=1&pageSize=${pageSize}&categoryId=${categoryId}`,
    { headers: { 'CJ-Access-Token': token } }
  )
  const data = await res.json()
  if (data.code === 200 && data.data?.list) {
    return data.data.list.map(p => ({
      cj_pid: p.pid,
      name: p.productNameEn || p.productName,
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
  return []
}

export async function getCategories() {
  const token = await getAccessToken()
  const res = await fetch(`${CJ_BASE}/product/getCategory`, {
    headers: { 'CJ-Access-Token': token },
  })
  const data = await res.json()
  if (data.code === 200) return data.data
  return []
}
