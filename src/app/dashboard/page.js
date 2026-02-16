'use client'

import { useState, useEffect } from 'react'

const TREND_COLORS = {
  hot: { bg: 'rgba(255,59,92,0.12)', color: '#FF3B5C', label: '🔥 Hot' },
  rising: { bg: 'rgba(0,209,193,0.12)', color: '#00D1C1', label: '↗ Rising' },
  new: { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6', label: '✨ New' },
}

export default function DashboardPage() {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data.products || [])
      setUser(data.user)
    } catch (err) {
      console.error('Failed to fetch:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = filter === 'all'
    ? products
    : products.filter(p => p.trend_status === filter)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0B' }}>
        <div className="text-center">
          <div className="text-4xl animate-pulse mb-4">📦</div>
          <p style={{ color: '#8A8A96' }}>Loading your product matches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0B' }}>
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-60 p-4" style={{ background: '#111114', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5 px-2 pb-6 mb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-7 h-7 rounded-lg" style={{ background: 'linear-gradient(135deg, #FF3B5C, #FF6B81)' }} />
          <span className="font-display font-extrabold text-base" style={{ color: '#F0F0F2' }}>TrendMatch</span>
        </div>

        <div className="text-[10px] uppercase tracking-widest px-3 pt-2 pb-2 font-semibold" style={{ color: '#5A5A66' }}>Discover</div>
        <NavItem icon="🔥" label="Product Matches" active />
        <NavItem icon="📡" label="Trend Radar" />
        <NavItem icon="💡" label="New Opportunities" />

        <div className="text-[10px] uppercase tracking-widest px-3 pt-4 pb-2 font-semibold" style={{ color: '#5A5A66' }}>My Store</div>
        <NavItem icon="🎯" label="My Niche Profile" />
        <NavItem icon="📦" label="Saved Products" />
        <NavItem icon="📝" label="Content Templates" />

        {/* User pill */}
        {user && (
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl flex items-center gap-3" style={{ background: '#16161A', border: '1px solid rgba(255,255,255,0.06)' }}>
            {user.avatar_url ? (
              <img src={user.avatar_url} className="w-8 h-8 rounded-full" alt="" />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #FF6B81, #8B5CF6)' }}>
                {user.display_name?.[0] || '?'}
              </div>
            )}
            <div>
              <div className="text-xs font-semibold" style={{ color: '#F0F0F2' }}>{user.display_name}</div>
              <div className="text-[11px]" style={{ color: '#5A5A66' }}>{user.follower_count?.toLocaleString()} followers</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="ml-60 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-7">
          <h1 className="font-display text-2xl font-extrabold" style={{ color: '#F0F0F2' }}>
            🔥 Product Matches
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-7">
          <StatCard label="Total Matches" value={products.length} />
          <StatCard label="Hot Products" value={products.filter(p => p.trend_status === 'hot').length} accent />
          <StatCard label="Avg. Margin" value={`$${(products.reduce((a, p) => a + (parseFloat(p.estimated_margin) || 0), 0) / (products.length || 1)).toFixed(2)}`} teal />
          <StatCard label="Best Match" value={`${products[0]?.match_score || 0}%`} teal />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-5">
          {[
            { id: 'all', label: 'All Matches' },
            { id: 'hot', label: '🔥 Hot Now' },
            { id: 'rising', label: '↗ Rising' },
            { id: 'new', label: '✨ New' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: filter === f.id ? '#FF3B5C' : '#16161A',
                border: `1px solid ${filter === f.id ? '#FF3B5C' : 'rgba(255,255,255,0.06)'}`,
                color: filter === f.id ? 'white' : '#8A8A96',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Product Table */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#16161A', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Table Header */}
          <div className="grid grid-cols-[40px_2fr_0.8fr_0.8fr_0.8fr_0.8fr_100px] px-5 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#5A5A66' }}>
            <div>#</div>
            <div>Product</div>
            <div>Trend</div>
            <div>Price</div>
            <div>Margin</div>
            <div>Match</div>
            <div></div>
          </div>

          {/* Rows */}
          {filteredProducts.map((product, i) => (
            <div
              key={product.id || i}
              className="grid grid-cols-[40px_2fr_0.8fr_0.8fr_0.8fr_0.8fr_100px] px-5 py-4 items-center transition-colors cursor-pointer"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              onClick={() => setSelectedProduct(product)}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div className="font-display font-bold text-sm" style={{ color: '#5A5A66' }}>{i + 1}</div>
              <div>
                <div className="text-sm font-semibold" style={{ color: '#F0F0F2' }}>{product.product_name}</div>
                <div className="text-[11px]" style={{ color: '#5A5A66' }}>{product.category}</div>
              </div>
              <div>
                <span
                  className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{
                    background: TREND_COLORS[product.trend_status]?.bg || TREND_COLORS.new.bg,
                    color: TREND_COLORS[product.trend_status]?.color || TREND_COLORS.new.color,
                  }}
                >
                  {TREND_COLORS[product.trend_status]?.label || '✨ New'}
                </span>
              </div>
              <div className="text-sm" style={{ color: '#F0F0F2' }}>{product.suggested_price}</div>
              <div className="text-sm font-semibold" style={{ color: '#00D1C1' }}>{product.estimated_margin}</div>
              <div className="text-sm font-bold" style={{ color: product.match_score >= 90 ? '#00D1C1' : '#FFB84D' }}>
                {product.match_score}%
              </div>
              <div>
                <button
                  className="px-3 py-1.5 rounded-md text-xs font-semibold"
                  style={{ background: 'rgba(255,59,92,0.1)', color: '#FF3B5C', border: '1px solid rgba(255,59,92,0.15)' }}
                >
                  View Brief
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </div>
    </div>
  )
}

function NavItem({ icon, label, active }) {
  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] mb-0.5"
      style={{
        background: active ? 'rgba(255,59,92,0.1)' : 'transparent',
        color: active ? '#FF3B5C' : '#8A8A96',
        fontWeight: active ? 600 : 400,
      }}
    >
      <span className="text-base">{icon}</span>
      {label}
    </div>
  )
}

function StatCard({ label, value, accent, teal }) {
  return (
    <div className="rounded-xl p-5" style={{ background: '#16161A', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="text-[11px] uppercase tracking-wider font-semibold mb-1.5" style={{ color: '#5A5A66' }}>{label}</div>
      <div
        className="font-display text-2xl font-extrabold"
        style={{ color: teal ? '#00D1C1' : accent ? '#FF3B5C' : '#F0F0F2' }}
      >
        {value}
      </div>
    </div>
  )
}

function ProductModal({ product, onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-6"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-8"
        style={{ background: '#16161A', border: '1px solid rgba(255,255,255,0.06)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex gap-2 mb-3">
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                style={{ background: TREND_COLORS[product.trend_status]?.bg, color: TREND_COLORS[product.trend_status]?.color }}>
                {TREND_COLORS[product.trend_status]?.label}
              </span>
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                style={{ background: 'rgba(0,209,193,0.12)', color: '#00D1C1' }}>
                {product.match_score}% Match
              </span>
            </div>
            <h2 className="font-display text-xl font-extrabold mb-1" style={{ color: '#F0F0F2' }}>{product.product_name}</h2>
            <p className="text-sm" style={{ color: '#8A8A96' }}>{product.category}</p>
          </div>
          <button onClick={onClose} className="text-2xl" style={{ color: '#5A5A66' }}>×</button>
        </div>

        {/* Description */}
        <p className="text-sm mb-6" style={{ color: '#8A8A96', lineHeight: 1.6 }}>{product.description}</p>

        {/* Pricing grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl p-4" style={{ background: '#0A0A0B' }}>
            <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#5A5A66' }}>Retail Price</div>
            <div className="font-display text-lg font-bold" style={{ color: '#F0F0F2' }}>{product.suggested_price}</div>
          </div>
          <div className="rounded-xl p-4" style={{ background: '#0A0A0B' }}>
            <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#5A5A66' }}>Est. Cost</div>
            <div className="font-display text-lg font-bold" style={{ color: '#F0F0F2' }}>{product.estimated_cost}</div>
          </div>
          <div className="rounded-xl p-4" style={{ background: '#0A0A0B' }}>
            <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#5A5A66' }}>Margin</div>
            <div className="font-display text-lg font-bold" style={{ color: '#00D1C1' }}>{product.estimated_margin}</div>
          </div>
        </div>

        {/* Why now */}
        <div className="rounded-xl p-4 mb-4" style={{ background: '#0A0A0B' }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#FF3B5C' }}>📈 Why Now</div>
          <p className="text-sm" style={{ color: '#8A8A96' }}>{product.why_now}</p>
        </div>

        {/* Content hook */}
        <div className="rounded-xl p-4 mb-4" style={{ background: '#0A0A0B' }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8B5CF6' }}>🎬 Content Hook</div>
          <p className="text-sm font-medium" style={{ color: '#F0F0F2' }}>"{product.content_hook}"</p>
          <p className="text-xs mt-2" style={{ color: '#5A5A66' }}>Format: {product.content_format}</p>
        </div>

        {/* Sourcing */}
        <div className="rounded-xl p-4" style={{ background: '#0A0A0B' }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#00D1C1' }}>📦 Sourcing</div>
          <p className="text-sm" style={{ color: '#8A8A96' }}>{product.sourcing_notes}</p>
        </div>
      </div>
    </div>
  )
}
