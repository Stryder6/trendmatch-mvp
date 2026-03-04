const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1'

async function getAccessToken() {
  // Use cached token from env if available
  if (process.env.CJ_ACCESS_TOKEN) {
    return process.env.CJ_ACCESS_TOKEN
  }

  // Otherwise generate from API key
  const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: process.env.CJ_API_KEY }),
  })
  const data = await res.json()
  if (data.code === 200) {
    return data.data.accessToken
  }
  throw new Error(`CJ Auth failed: ${data.message}`)
}

export async function searchProducts(keyword, pageSize = 10) {
  const token = await getAccessToken()
  const res = await fetch(
    `${CJ_BASE}/product/list?pageNum=1&pageSize=${pageSize}&productNameEn=${encodeURIComponent(keyword)}`,
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
