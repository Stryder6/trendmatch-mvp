'use client'

import { useState } from 'react'

const TIKTOK_AUTH_URL = `https://www.tiktok.com/v2/auth/authorize/?client_key=${process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || 'sbawn3n2q2jjpi80cr'}&scope=user.info.basic,user.info.profile,user.info.stats,video.list&response_type=code&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL + '/api/auth/tiktok' : 'https://trendmatch.netlify.app/api/auth/tiktok')}&state=trendmatch`

const MOCK_PRODUCTS = [
  { name: 'LED Sunset Lamp', category: 'Home Decor', trend: 'hot', trendLabel: '🔥 Hot', price: '$24.99', margin: '$17.49', score: 97, trendBg: 'rgba(255,59,92,0.12)', trendColor: '#FF3B5C' },
  { name: 'Portable Blender Pro', category: 'Kitchen', trend: 'hot', trendLabel: '🔥 Hot', price: '$29.99', margin: '$19.99', score: 94, trendBg: 'rgba(255,59,92,0.12)', trendColor: '#FF3B5C' },
  { name: 'Cloud Slides', category: 'Fashion', trend: 'rising', trendLabel: '↗ Rising', price: '$19.99', margin: '$13.99', score: 91, trendBg: 'rgba(0,209,193,0.12)', trendColor: '#00D1C1' },
  { name: 'Mini Projector', category: 'Tech', trend: 'hot', trendLabel: '🔥 Hot', price: '$45.99', margin: '$28.99', score: 89, trendBg: 'rgba(255,59,92,0.12)', trendColor: '#FF3B5C' },
  { name: 'Aromatherapy Diffuser', category: 'Home', trend: 'new', trendLabel: '✨ New', price: '$22.99', margin: '$15.49', score: 86, trendBg: 'rgba(139,92,246,0.12)', trendColor: '#8B5CF6' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: '#0A0A0B' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg" style={{ background: 'linear-gradient(135deg, #FF3B5C, #FF6B81)' }} />
          <span className="font-extrabold text-lg sm:text-xl" style={{ color: '#F0F0F2' }}>TrendMatch</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <a href="#features" className="text-sm hidden sm:inline" style={{ color: '#8A8A96' }}>Features</a>
          <a href="#pricing" className="text-sm hidden sm:inline" style={{ color: '#8A8A96' }}>Pricing</a>
          <a href={TIKTOK_AUTH_URL} className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold" style={{ background: '#FF3B5C', color: 'white' }}>
            Connect TikTok →
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-4 sm:px-6 pt-12 sm:pt-20 pb-8 sm:pb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{ background: 'rgba(255,59,92,0.08)', color: '#FF3B5C', border: '1px solid rgba(255,59,92,0.15)' }}>
          🔥 AI-Powered Product Intelligence
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold max-w-3xl mx-auto mb-5 leading-tight" style={{ color: '#F0F0F2' }}>
          Know What to Sell<br />
          <span style={{ color: '#FF3B5C' }}>Before It Trends</span>
        </h1>
        <p className="text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10" style={{ color: '#8A8A96' }}>
          TrendMatch analyzes your TikTok content and audience to recommend the perfect products for your shop — with sourcing, margins, and content templates.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a href={TIKTOK_AUTH_URL} className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold inline-flex items-center justify-center gap-2" style={{ background: '#FF3B5C', color: 'white' }}>
            🔗 Connect TikTok — It's Free
          </a>
          <a href="#preview" className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold text-center" style={{ background: '#16161A', color: '#F0F0F2', border: '1px solid rgba(255,255,255,0.06)' }}>
            See How It Works ↓
          </a>
        </div>
        <p className="mt-5 text-xs" style={{ color: '#5A5A66' }}>
          Read-only access • We never post on your behalf • Free plan available
        </p>
      </section>

      {/* Dashboard Preview */}
      <section id="preview" className="px-4 sm:px-8 pb-16 sm:pb-24 max-w-5xl mx-auto">
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden" style={{ background: '#111114', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 60px rgba(255,59,92,0.06)' }}>
          {/* Fake browser bar */}
          <div className="flex items-center gap-2 px-4 py-3" style={{ background: '#0A0A0B', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#FEBC2E' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
            </div>
            <div className="flex-1 mx-4">
              <div className="max-w-xs mx-auto px-3 py-1 rounded-md text-[11px] text-center" style={{ background: '#16161A', color: '#5A5A66' }}>trendmatch.netlify.app/dashboard</div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="flex">
            {/* Mini sidebar - desktop only */}
            <div className="hidden sm:flex flex-col w-44 p-3 flex-shrink-0" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 px-2 pb-4 mb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-5 h-5 rounded" style={{ background: 'linear-gradient(135deg, #FF3B5C, #FF6B81)' }} />
                <span className="text-xs font-bold" style={{ color: '#F0F0F2' }}>TrendMatch</span>
              </div>
              <div className="text-[9px] uppercase tracking-wider px-2 mb-2 font-semibold" style={{ color: '#5A5A66' }}>Discover</div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md mb-0.5 text-[11px]" style={{ background: 'rgba(255,59,92,0.1)', color: '#FF3B5C', fontWeight: 600 }}>🔥 Product Matches</div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md mb-0.5 text-[11px]" style={{ color: '#5A5A66' }}>📦 Saved Products</div>
              <div className="text-[9px] uppercase tracking-wider px-2 mt-3 mb-2 font-semibold" style={{ color: '#5A5A66' }}>Account</div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px]" style={{ color: '#5A5A66' }}>🎯 My Profile</div>

              <div className="mt-auto">
                <div className="p-2 rounded-lg" style={{ background: '#16161A' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: 'linear-gradient(135deg, #FF6B81, #8B5CF6)', color: 'white' }}>S</div>
                    <div><div className="text-[10px] font-semibold" style={{ color: '#F0F0F2' }}>Sarah_Creates</div><div className="text-[9px]" style={{ color: '#5A5A66' }}>245K followers</div></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main area */}
            <div className="flex-1 p-4 sm:p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm sm:text-base font-extrabold" style={{ color: '#F0F0F2' }}>🔥 Product Matches</h2>
                <div className="px-3 py-1.5 rounded-full text-[10px] font-semibold" style={{ background: '#FF3B5C', color: 'white' }}>🔄 Re-analyze</div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4">
                {[['Total Matches', '6', '#F0F0F2'], ['Hot Products', '3', '#FF3B5C'], ['Avg. Margin', '$18.32', '#00D1C1'], ['Best Match', '97%', '#00D1C1']].map(([label, val, color]) => (
                  <div key={label} className="rounded-lg p-2 sm:p-3" style={{ background: '#16161A', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold mb-0.5" style={{ color: '#5A5A66' }}>{label}</div>
                    <div className="text-sm sm:text-lg font-extrabold" style={{ color }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Filter pills */}
              <div className="flex gap-1.5 mb-3">
                {['All Matches', '🔥 Hot', '↗ Rising', '✨ New'].map((f, i) => (
                  <div key={f} className="px-2.5 py-1 rounded-full text-[10px] font-medium" style={{ background: i === 0 ? '#FF3B5C' : '#16161A', color: i === 0 ? 'white' : '#5A5A66', border: `1px solid ${i === 0 ? '#FF3B5C' : 'rgba(255,255,255,0.06)'}` }}>{f}</div>
                ))}
              </div>

              {/* Product table */}
              <div className="rounded-lg overflow-hidden" style={{ background: '#16161A', border: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Header */}
                <div className="hidden sm:grid grid-cols-[24px_2fr_0.8fr_0.8fr_0.8fr_0.8fr_60px] px-3 py-2 text-[9px] uppercase tracking-wider font-semibold" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#5A5A66' }}>
                  <div>#</div><div>Product</div><div>Trend</div><div>Price</div><div>Margin</div><div>Match</div><div></div>
                </div>
                {MOCK_PRODUCTS.map((p, i) => (
                  <div key={i} className="grid grid-cols-[24px_2fr_0.8fr_0.8fr_0.8fr_0.8fr_60px] px-3 py-2.5 items-center text-[11px]" style={{ borderBottom: i < MOCK_PRODUCTS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div className="font-bold hidden sm:block" style={{ color: '#5A5A66' }}>{i + 1}</div>
                    <div>
                      <div className="font-semibold text-[11px] sm:text-xs" style={{ color: '#F0F0F2' }}>{p.name}</div>
                      <div className="text-[9px] sm:text-[10px]" style={{ color: '#5A5A66' }}>{p.category}</div>
                    </div>
                    <div><span className="inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-semibold" style={{ background: p.trendBg, color: p.trendColor }}>{p.trendLabel}</span></div>
                    <div className="hidden sm:block" style={{ color: '#F0F0F2' }}>{p.price}</div>
                    <div className="hidden sm:block font-semibold" style={{ color: '#00D1C1' }}>{p.margin}</div>
                    <div className="font-bold" style={{ color: p.score >= 90 ? '#00D1C1' : '#FFB84D' }}>{p.score}%</div>
                    <div><span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: 'rgba(255,59,92,0.1)', color: '#FF3B5C' }}>Brief</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Glow effect */}
        <div className="text-center mt-8">
          <a href={TIKTOK_AUTH_URL} className="inline-flex px-6 py-3 rounded-full text-sm font-semibold items-center gap-2" style={{ background: '#FF3B5C', color: 'white' }}>
            Get Your Product Matches →
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 sm:px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-extrabold text-center mb-12" style={{ color: '#F0F0F2' }}>How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: '01', emoji: '🔗', title: 'Connect TikTok', desc: 'Link your account with one click. We analyze your content, niche, and audience.' },
            { step: '02', emoji: '🤖', title: 'AI Matches Products', desc: 'Our AI finds trending products that fit your audience with margins and sourcing.' },
            { step: '03', emoji: '💰', title: 'Start Selling', desc: 'Get content templates, supplier links, and start adding products to your TikTok Shop.' },
          ].map(item => (
            <div key={item.step} className="rounded-xl p-6" style={{ background: '#16161A', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-xs font-bold mb-4" style={{ color: '#FF3B5C' }}>STEP {item.step}</div>
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className="text-base font-bold mb-2" style={{ color: '#F0F0F2' }}>{item.title}</h3>
              <p className="text-sm" style={{ color: '#8A8A96', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 sm:px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-extrabold text-center mb-12" style={{ color: '#F0F0F2' }}>Everything You Need to Sell Smart</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { emoji: '🎯', title: 'Audience-Matched Products', desc: 'Products selected specifically for YOUR audience, not generic bestsellers.' },
            { emoji: '📊', title: 'Margin Calculator', desc: 'See estimated profit margins for every product with supplier pricing built in.' },
            { emoji: '📦', title: 'US-Based Sourcing', desc: 'Only products available from US warehouses. 3-5 day shipping for TikTok Shop compliance.' },
            { emoji: '🎬', title: 'Content Templates', desc: 'Ready-made TikTok scripts with hooks, formats, and hashtags for each product.' },
            { emoji: '🔥', title: 'Trend Detection', desc: 'Catch rising products before they peak. Get early-mover advantage.' },
            { emoji: '⚡', title: 'AI-Powered Analysis', desc: 'Claude AI analyzes your entire profile to find non-obvious product opportunities.' },
          ].map(feat => (
            <div key={feat.title} className="rounded-xl p-5" style={{ background: '#16161A', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-2xl">{feat.emoji}</span>
              <h3 className="text-sm font-bold mt-2 mb-1" style={{ color: '#F0F0F2' }}>{feat.title}</h3>
              <p className="text-xs" style={{ color: '#8A8A96', lineHeight: 1.5 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 sm:px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-extrabold text-center mb-12" style={{ color: '#F0F0F2' }}>Simple Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <PricingCard title="Free" price="$0" features={['1 product analysis/month', 'Basic product matches', 'Community access']} cta="Get Started" href={TIKTOK_AUTH_URL} />
          <PricingCard title="Pro" price="$49" features={['Unlimited analyses', 'Daily trend alerts', 'Content templates', 'Supplier sourcing links', 'Priority support']} cta="Start Pro Trial" href={TIKTOK_AUTH_URL} featured />
          <PricingCard title="Early Bird" price="$99" features={['Everything in Pro', '48hr early trend access', '1-on-1 product strategy call', 'Custom niche reports', 'White-glove onboarding']} cta="Get Early Access" href={TIKTOK_AUTH_URL} />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-8 py-12 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-center gap-2.5 mb-4">
          <div className="w-6 h-6 rounded" style={{ background: 'linear-gradient(135deg, #FF3B5C, #FF6B81)' }} />
          <span className="font-bold text-sm" style={{ color: '#F0F0F2' }}>TrendMatch</span>
        </div>
        <div className="flex justify-center gap-6 mb-4">
          <a href="/terms" className="text-xs" style={{ color: '#5A5A66' }}>Terms of Service</a>
          <a href="/privacy" className="text-xs" style={{ color: '#5A5A66' }}>Privacy Policy</a>
          <a href="mailto:hello@trendmatch.io" className="text-xs" style={{ color: '#5A5A66' }}>Contact</a>
        </div>
        <p className="text-xs" style={{ color: '#5A5A66' }}>© 2026 TrendMatch. All rights reserved.</p>
      </footer>
    </div>
  )
}

function PricingCard({ title, price, features, cta, href, featured }) {
  return (
    <div className="rounded-xl p-6 flex flex-col" style={{ background: '#16161A', border: `1px solid ${featured ? '#FF3B5C' : 'rgba(255,255,255,0.06)'}`, boxShadow: featured ? '0 0 40px rgba(255,59,92,0.08)' : 'none' }}>
      {featured && <div className="text-[10px] uppercase tracking-wider font-bold mb-3" style={{ color: '#FF3B5C' }}>Most Popular</div>}
      <h3 className="text-lg font-bold mb-1" style={{ color: '#F0F0F2' }}>{title}</h3>
      <div className="mb-4"><span className="text-3xl font-extrabold" style={{ color: '#F0F0F2' }}>{price}</span>{price !== '$0' && <span className="text-sm" style={{ color: '#5A5A66' }}>/mo</span>}</div>
      <ul className="flex-1 mb-6">
        {features.map(f => <li key={f} className="flex items-start gap-2 mb-2 text-sm" style={{ color: '#8A8A96' }}><span style={{ color: '#00D1C1' }}>✓</span> {f}</li>)}
      </ul>
      <a href={href} className="text-center py-3 rounded-full text-sm font-semibold block" style={{ background: featured ? '#FF3B5C' : 'transparent', color: featured ? 'white' : '#FF3B5C', border: featured ? 'none' : '1px solid rgba(255,59,92,0.3)', textDecoration: 'none' }}>{cta}</a>
    </div>
  )
}
