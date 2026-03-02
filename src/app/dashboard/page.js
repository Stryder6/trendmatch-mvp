'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const TREND_COLORS = {
  hot: { bg: 'rgba(255,59,92,0.12)', color: '#FF3B5C', label: '🔥 Hot' },
  rising: { bg: 'rgba(0,209,193,0.12)', color: '#00D1C1', label: '↗ Rising' },
  new: { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6', label: '✨ New' },
}

const ANALYZE_STEPS = [
  'Connecting to your TikTok profile...',
  'Scanning your recent videos...',
  'Analyzing your audience & content style...',
  'Matching trending products to your niche...',
  'Building your product recommendations...',
]

export default function DashboardPage() {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [filter, setFilter] = useState('all')
  const [activeView, setActiveView] = useState('matches')
  const [reanalyzing, setReanalyzing] = useState(false)
  const [analyzeStep, setAnalyzeStep] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.status === 401) { router.push('/'); return }
      const data = await res.json()
      setProducts(data.products || [])
      setUser(data.user)
    } catch (err) { console.error('Failed to fetch:', err) }
    finally { setLoading(false) }
  }

  const handleSave = async (productId) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, saved: !p.saved } : p))
    try {
      await fetch('/api/products/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId }) })
    } catch (err) {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, saved: !p.saved } : p))
    }
  }

  const handleReanalyze = async () => {
    setReanalyzing(true); setAnalyzeStep(0); setSidebarOpen(false)
    let apiDone = false, apiError = null
    fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ niches: user?.niches || [] }) })
      .then(r => r.json()).then(d => { apiDone = true; if (d.error === "limit_reached") apiError = "limit" })
      .catch(() => { apiDone = true; apiError = "failed" })
    let cur = 0
    const iv = setInterval(() => {
      cur++
      if (cur < ANALYZE_STEPS.length) setAnalyzeStep(cur)
      else { clearInterval(iv); const ck = setInterval(async () => { if (apiDone) { clearInterval(ck); if (apiError === "limit") { setReanalyzing(false); alert("Free analysis used. Upgrade to Pro for unlimited.") } else { await fetchProducts(); setTimeout(() => setReanalyzing(false), 800) } } }, 500) }
    }, 2000)
  }

  const handleLogout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/') }
  const switchView = (v) => { setActiveView(v); setSidebarOpen(false) }

  const filteredProducts = (() => {
    let list = products
    if (activeView === 'saved') list = list.filter(p => p.saved)
    if (filter !== 'all') list = list.filter(p => p.trend_status === filter)
    return list
  })()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0B' }}>
      <div className="text-center"><div className="text-4xl animate-pulse mb-4">📦</div><p style={{ color: '#8A8A96' }}>Loading your product matches...</p></div>
    </div>
  )

  if (reanalyzing) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0A0A0B' }}>
      <div className="text-center max-w-md w-full">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF3B5C, #FF6B81)' }}><span className="text-3xl">🔍</span></div>
        <h1 className="text-xl sm:text-2xl font-extrabold mb-3" style={{ color: '#F0F0F2' }}>Re-analyzing Your Profile</h1>
        <p className="text-sm mb-8" style={{ color: '#8A8A96' }}>Finding fresh product matches based on your latest content.</p>
        <div className="space-y-3 text-left mb-8">
          {ANALYZE_STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all duration-500" style={{ background: i < analyzeStep ? '#FF3B5C' : i === analyzeStep ? 'rgba(255,59,92,0.2)' : '#16161A', color: i <= analyzeStep ? 'white' : '#5A5A66', border: i === analyzeStep ? '2px solid #FF3B5C' : '1px solid rgba(255,255,255,0.06)' }}>{i < analyzeStep ? '✓' : i + 1}</div>
              <span className="text-sm transition-colors duration-500" style={{ color: i <= analyzeStep ? '#F0F0F2' : '#5A5A66' }}>{s}</span>
            </div>
          ))}
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: '#16161A' }}>
          <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ background: 'linear-gradient(90deg, #FF3B5C, #FF6B81)', width: `${((analyzeStep + 1) / ANALYZE_STEPS.length) * 100}%` }} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0B' }}>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3" style={{ background: '#111114', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md" style={{ background: 'linear-gradient(135deg, #FF3B5C, #FF6B81)' }} />
          <span className="font-extrabold text-sm" style={{ color: '#F0F0F2' }}>TrendMatch</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: '#16161A', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ color: '#F0F0F2', fontSize: '16px' }}>{sidebarOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {sidebarOpen && <div className="lg:hidden fixed inset-0 z-30" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setSidebarOpen(false)} />}

      <div className={`fixed top-0 bottom-0 w-60 p-4 flex flex-col z-40 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`} style={{ background: '#111114', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5 px-2 pb-6 mb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-7 h-7 rounded-lg" style={{ background: 'linear-gradient(135deg, #FF3B5C, #FF6B81)' }} />
          <span className="font-extrabold text-base" style={{ color: '#F0F0F2' }}>TrendMatch</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest px-3 pt-2 pb-2 font-semibold" style={{ color: '#5A5A66' }}>Discover</div>
        <NavItem icon="🔥" label="Product Matches" active={activeView === 'matches'} onClick={() => switchView('matches')} />
        <NavItem icon="📦" label="Saved Products" active={activeView === 'saved'} onClick={() => switchView('saved')} />
        <div className="text-[10px] uppercase tracking-widest px-3 pt-4 pb-2 font-semibold" style={{ color: '#5A5A66' }}>Account</div>
        <NavItem icon="🎯" label="My Profile" active={activeView === 'profile'} onClick={() => switchView('profile')} />
        <div className="flex-1" />
        {user && (
          <div className="p-3 rounded-xl mb-2" style={{ background: '#16161A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3 mb-3">
              {user.avatar_url ? <img src={user.avatar_url} className="w-8 h-8 rounded-full" alt="" /> : <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #FF6B81, #8B5CF6)' }}>{user.display_name?.[0] || '?'}</div>}
              <div><div className="text-xs font-semibold" style={{ color: '#F0F0F2' }}>{user.display_name}</div><div className="text-[11px]" style={{ color: '#5A5A66' }}>{user.follower_count?.toLocaleString()} followers</div></div>
            </div>
            <button onClick={handleLogout} className="w-full py-1.5 rounded-lg text-[11px] font-medium" style={{ background: '#0A0A0B', color: '#5A5A66', border: '1px solid rgba(255,255,255,0.06)' }}>Sign Out</button>
          </div>
        )}
      </div>

      <div className="lg:ml-60 pt-14 lg:pt-0 p-4 sm:p-6 lg:p-8">
        {activeView === 'profile' ? <ProfileView user={user} onReanalyze={handleReanalyze} /> : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 lg:mb-7">
              <h1 className="text-xl sm:text-2xl font-extrabold" style={{ color: '#F0F0F2' }}>{activeView === 'saved' ? '📦 Saved Products' : '🔥 Product Matches'}</h1>
              <button onClick={handleReanalyze} className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 whitespace-nowrap" style={{ background: '#FF3B5C', color: 'white' }}>🔄 Re-analyze</button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-5 lg:mb-7">
              <StatCard label="Total Matches" value={products.length} />
              <StatCard label="Saved" value={products.filter(p => p.saved).length} accent />
              <StatCard label="Avg. Margin" value={`$${(products.reduce((a, p) => a + (parseFloat(String(p.estimated_margin).replace('$','')) || 0), 0) / (products.length || 1)).toFixed(2)}`} teal />
              <StatCard label="Best Match" value={`${products[0]?.match_score || 0}%`} teal />
            </div>
            <div className="flex gap-2 mb-4 lg:mb-5 overflow-x-auto pb-1">
              {[{ id: 'all', label: 'All' }, { id: 'hot', label: '🔥 Hot' }, { id: 'rising', label: '↗ Rising' }, { id: 'new', label: '✨ New' }].map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)} className="px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0" style={{ background: filter === f.id ? '#FF3B5C' : '#16161A', border: `1px solid ${filter === f.id ? '#FF3B5C' : 'rgba(255,255,255,0.06)'}`, color: filter === f.id ? 'white' : '#8A8A96' }}>{f.label}</button>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block rounded-xl overflow-hidden" style={{ background: '#16161A', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="grid grid-cols-[40px_2fr_0.8fr_0.8fr_0.8fr_0.8fr_140px] px-5 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#5A5A66' }}><div>#</div><div>Product</div><div>Trend</div><div>Price</div><div>Margin</div><div>Match</div><div></div></div>
              {filteredProducts.length === 0 ? <div className="py-12 text-center" style={{ color: '#5A5A66' }}>{activeView === 'saved' ? 'No saved products yet.' : 'No products match this filter.'}</div> : filteredProducts.map((p, i) => (
                <div key={p.id || i} className="grid grid-cols-[40px_2fr_0.8fr_0.8fr_0.8fr_0.8fr_140px] px-5 py-4 items-center transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div className="font-bold text-sm" style={{ color: '#5A5A66' }}>{i + 1}</div>
                  <div className="cursor-pointer" onClick={() => setSelectedProduct(p)}><div className="text-sm font-semibold" style={{ color: '#F0F0F2' }}>{p.product_name}</div><div className="text-[11px]" style={{ color: '#5A5A66' }}>{p.category}</div></div>
                  <div><span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: TREND_COLORS[p.trend_status]?.bg || TREND_COLORS.new.bg, color: TREND_COLORS[p.trend_status]?.color || TREND_COLORS.new.color }}>{TREND_COLORS[p.trend_status]?.label || '✨ New'}</span></div>
                  <div className="text-sm" style={{ color: '#F0F0F2' }}>{p.suggested_price}</div>
                  <div className="text-sm font-semibold" style={{ color: '#00D1C1' }}>{p.estimated_margin}</div>
                  <div className="text-sm font-bold" style={{ color: p.match_score >= 90 ? '#00D1C1' : '#FFB84D' }}>{p.match_score}%</div>
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: p.saved ? 'rgba(255,59,92,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${p.saved ? 'rgba(255,59,92,0.3)' : 'rgba(255,255,255,0.06)'}` }}>{p.saved ? '❤️' : '🤍'}</button>
                    <button onClick={() => setSelectedProduct(p)} className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: 'rgba(255,59,92,0.1)', color: '#FF3B5C', border: '1px solid rgba(255,59,92,0.15)' }}>View Brief</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
              {filteredProducts.length === 0 ? <div className="py-12 text-center rounded-xl" style={{ background: '#16161A', color: '#5A5A66' }}>{activeView === 'saved' ? 'No saved products yet.' : 'No products match this filter.'}</div> : filteredProducts.map((p, i) => (
                <div key={p.id || i} className="rounded-xl p-4" style={{ background: '#16161A', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 cursor-pointer" onClick={() => setSelectedProduct(p)}><div className="text-sm font-semibold mb-0.5" style={{ color: '#F0F0F2' }}>{p.product_name}</div><div className="text-[11px]" style={{ color: '#5A5A66' }}>{p.category}</div></div>
                    <button onClick={() => handleSave(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ml-2" style={{ background: p.saved ? 'rgba(255,59,92,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${p.saved ? 'rgba(255,59,92,0.3)' : 'rgba(255,255,255,0.06)'}` }}>{p.saved ? '❤️' : '🤍'}</button>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: TREND_COLORS[p.trend_status]?.bg || TREND_COLORS.new.bg, color: TREND_COLORS[p.trend_status]?.color || TREND_COLORS.new.color }}>{TREND_COLORS[p.trend_status]?.label || '✨ New'}</span>
                    <span className="text-[11px] font-bold" style={{ color: p.match_score >= 90 ? '#00D1C1' : '#FFB84D' }}>{p.match_score}% match</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4"><div><div className="text-[10px] uppercase" style={{ color: '#5A5A66' }}>Price</div><div className="text-sm font-semibold" style={{ color: '#F0F0F2' }}>{p.suggested_price}</div></div><div><div className="text-[10px] uppercase" style={{ color: '#5A5A66' }}>Margin</div><div className="text-sm font-semibold" style={{ color: '#00D1C1' }}>{p.estimated_margin}</div></div></div>
                    <button onClick={() => setSelectedProduct(p)} className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: 'rgba(255,59,92,0.1)', color: '#FF3B5C', border: '1px solid rgba(255,59,92,0.15)' }}>View Brief</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onSave={handleSave} />}
      </div>
    </div>
  )
}

function ProfileView({ user, onReanalyze }) {
  if (!user) return null
  return (
    <div className="max-w-xl">
      <h1 className="text-xl sm:text-2xl font-extrabold mb-6" style={{ color: '#F0F0F2' }}>🎯 My Profile</h1>
      <div className="rounded-xl p-5 sm:p-6 mb-4" style={{ background: '#16161A', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-4 mb-6">
          {user.avatar_url ? <img src={user.avatar_url} className="w-12 sm:w-14 h-12 sm:h-14 rounded-full" alt="" /> : <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold" style={{ background: 'linear-gradient(135deg, #FF6B81, #8B5CF6)' }}>{user.display_name?.[0] || '?'}</div>}
          <div><div className="text-base sm:text-lg font-bold" style={{ color: '#F0F0F2' }}>{user.display_name}</div><div className="text-sm" style={{ color: '#8A8A96' }}>TikTok Creator</div></div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[['Followers', user.follower_count], ['Likes', user.likes_count], ['Videos', user.video_count]].map(([l, v]) => (
            <div key={l} className="rounded-lg p-2.5 sm:p-3 text-center" style={{ background: '#0A0A0B' }}><div className="text-base sm:text-lg font-bold" style={{ color: '#F0F0F2' }}>{v?.toLocaleString() || 0}</div><div className="text-[10px] sm:text-[11px]" style={{ color: '#5A5A66' }}>{l}</div></div>
          ))}
        </div>
        {user.niches?.length > 0 && <div className="mb-6"><div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5A5A66' }}>Detected Niches</div><div className="flex flex-wrap gap-2">{user.niches.map(n => <span key={n} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(255,59,92,0.08)', color: '#FF3B5C', border: '1px solid rgba(255,59,92,0.15)' }}>{n}</span>)}</div></div>}
        <div className="text-xs mb-4" style={{ color: '#5A5A66' }}>Analyses used: {user.analyses_used || 0} / {user.plan === 'pro' || user.plan === 'early_bird' ? 'Unlimited' : '1 (Free)'}</div>
        <button onClick={onReanalyze} className="w-full py-3 rounded-xl text-sm font-semibold" style={{ background: '#FF3B5C', color: 'white' }}>🔄 Re-analyze My Profile</button>
      </div>
    </div>
  )
}

function NavItem({ icon, label, active, onClick }) {
  return <div onClick={onClick} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] mb-0.5 cursor-pointer" style={{ background: active ? 'rgba(255,59,92,0.1)' : 'transparent', color: active ? '#FF3B5C' : '#8A8A96', fontWeight: active ? 600 : 400 }}><span className="text-base">{icon}</span>{label}</div>
}

function StatCard({ label, value, accent, teal }) {
  return <div className="rounded-xl p-4 lg:p-5" style={{ background: '#16161A', border: '1px solid rgba(255,255,255,0.06)' }}><div className="text-[10px] lg:text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: '#5A5A66' }}>{label}</div><div className="text-xl lg:text-2xl font-extrabold" style={{ color: teal ? '#00D1C1' : accent ? '#FF3B5C' : '#F0F0F2' }}>{value}</div></div>
}

function ProductModal({ product, onClose, onSave }) {
  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 sm:p-6" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div className="w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-5 sm:p-8" style={{ background: '#16161A', border: '1px solid rgba(255,255,255,0.06)' }} onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: TREND_COLORS[product.trend_status]?.bg, color: TREND_COLORS[product.trend_status]?.color }}>{TREND_COLORS[product.trend_status]?.label}</span>
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: 'rgba(0,209,193,0.12)', color: '#00D1C1' }}>{product.match_score}% Match</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold mb-1" style={{ color: '#F0F0F2' }}>{product.product_name}</h2>
            <p className="text-sm" style={{ color: '#8A8A96' }}>{product.category}</p>
          </div>
          <div className="flex gap-2 items-center flex-shrink-0 ml-3">
            <button onClick={() => onSave(product.id)} className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: product.saved ? 'rgba(255,59,92,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${product.saved ? 'rgba(255,59,92,0.3)' : 'rgba(255,255,255,0.06)'}` }}>{product.saved ? '❤️' : '🤍'}</button>
            <button onClick={onClose} className="text-2xl leading-none" style={{ color: '#5A5A66' }}>×</button>
          </div>
        </div>
        <p className="text-sm mb-5" style={{ color: '#8A8A96', lineHeight: 1.6 }}>{product.description}</p>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
          {[['Price', product.suggested_price, '#F0F0F2'], ['Cost', product.estimated_cost, '#F0F0F2'], ['Margin', product.estimated_margin, '#00D1C1']].map(([l, v, c]) => (
            <div key={l} className="rounded-xl p-3 sm:p-4" style={{ background: '#0A0A0B' }}><div className="text-[9px] sm:text-[10px] uppercase tracking-wider mb-1" style={{ color: '#5A5A66' }}>{l}</div><div className="text-base sm:text-lg font-bold" style={{ color: c }}>{v}</div></div>
          ))}
        </div>
        <div className="rounded-xl p-4 mb-3" style={{ background: '#0A0A0B' }}><div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#FF3B5C' }}>📈 Why Now</div><p className="text-sm" style={{ color: '#8A8A96' }}>{product.why_now}</p></div>
        <div className="rounded-xl p-4 mb-3" style={{ background: '#0A0A0B' }}><div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8B5CF6' }}>🎬 Content Hook</div><p className="text-sm font-medium" style={{ color: '#F0F0F2' }}>"{product.content_hook}"</p><p className="text-xs mt-2" style={{ color: '#5A5A66' }}>Format: {product.content_format}</p></div>
        <div className="rounded-xl p-4" style={{ background: '#0A0A0B' }}><div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#00D1C1' }}>📦 Sourcing</div><p className="text-sm" style={{ color: '#8A8A96' }}>{product.sourcing_notes}</p></div>
      </div>
    </div>
  )
}
