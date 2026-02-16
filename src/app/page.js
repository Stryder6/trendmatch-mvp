'use client'

import { useState } from 'react'

const TIKTOK_AUTH_URL = `https://www.tiktok.com/v2/auth/authorize/?client_key=${process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || 'sbawn3n2q2jjpi80cr'}&scope=user.info.basic,user.info.profile,user.info.stats,video.list&response_type=code&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL + '/api/auth/tiktok' : 'https://trendmatch.netlify.app/api/auth/tiktok')}&state=trendmatch`

export default function HomePage() {
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0B' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg" style={{ background: 'linear-gradient(135deg, #FF3B5C, #FF6B81)' }} />
          <span className="font-display font-extrabold text-xl" style={{ color: '#F0F0F2' }}>TrendMatch</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm" style={{ color: '#8A8A96' }}>Features</a>
          <a href="#pricing" className="text-sm" style={{ color: '#8A8A96' }}>Pricing</a>
          <a
            href={TIKTOK_AUTH_URL}
            className="px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ background: '#FF3B5C', color: 'white' }}
          >
            Connect TikTok →
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-20 pb-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{ background: 'rgba(255,59,92,0.08)', color: '#FF3B5C', border: '1px solid rgba(255,59,92,0.15)' }}>
          🔥 AI-Powered Product Intelligence
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-extrabold max-w-3xl mx-auto mb-5 leading-tight" style={{ color: '#F0F0F2' }}>
          Know What to Sell<br />
          <span style={{ color: '#FF3B5C' }}>Before It Trends</span>
        </h1>
        <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: '#8A8A96' }}>
          TrendMatch analyzes your TikTok content and audience to recommend the perfect products for your shop — with sourcing, margins, and content templates.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href={TIKTOK_AUTH_URL}
            className="px-8 py-4 rounded-full text-base font-semibold inline-flex items-center gap-2"
            style={{ background: '#FF3B5C', color: 'white' }}
          >
            🔗 Connect TikTok — It's Free
          </a>
          <button
            onClick={() => setShowWaitlist(true)}
            className="px-8 py-4 rounded-full text-base font-semibold"
            style={{ background: '#16161A', color: '#F0F0F2', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            Learn More
          </button>
        </div>
        <p className="mt-5 text-xs" style={{ color: '#5A5A66' }}>
          Read-only access • We never post on your behalf • Free plan available
        </p>
      </section>

      {/* How it works */}
      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="font-display text-2xl font-extrabold text-center mb-12" style={{ color: '#F0F0F2' }}>
          How It Works
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { step: '01', emoji: '🔗', title: 'Connect TikTok', desc: 'Link your account with one click. We analyze your content, niche, and audience.' },
            { step: '02', emoji: '🤖', title: 'AI Matches Products', desc: 'Our AI finds trending products that fit your audience with margins and sourcing.' },
            { step: '03', emoji: '💰', title: 'Start Selling', desc: 'Get content templates, supplier links, and start adding products to your TikTok Shop.' },
          ].map(item => (
            <div key={item.step} className="rounded-xl p-6" style={{ background: '#16161A', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-xs font-bold mb-4" style={{ color: '#FF3B5C' }}>STEP {item.step}</div>
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className="font-display text-base font-bold mb-2" style={{ color: '#F0F0F2' }}>{item.title}</h3>
              <p className="text-sm" style={{ color: '#8A8A96', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="font-display text-2xl font-extrabold text-center mb-12" style={{ color: '#F0F0F2' }}>
          Everything You Need to Sell Smart
        </h2>
        <div className="grid grid-cols-2 gap-4">
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
              <h3 className="font-display text-sm font-bold mt-2 mb-1" style={{ color: '#F0F0F2' }}>{feat.title}</h3>
              <p className="text-xs" style={{ color: '#8A8A96', lineHeight: 1.5 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="font-display text-2xl font-extrabold text-center mb-12" style={{ color: '#F0F0F2' }}>
          Simple Pricing
        </h2>
        <div className="grid grid-cols-3 gap-5">
          <PricingCard
            title="Free"
            price="$0"
            features={['1 product analysis/month', 'Basic product matches', 'Community access']}
            cta="Get Started"
            href={TIKTOK_AUTH_URL}
          />
          <PricingCard
            title="Pro"
            price="$49"
            features={['Unlimited analyses', 'Daily trend alerts', 'Content templates', 'Supplier sourcing links', 'Priority support']}
            cta="Start Pro Trial"
            href={TIKTOK_AUTH_URL}
            featured
          />
          <PricingCard
            title="Early Bird"
            price="$99"
            features={['Everything in Pro', '48hr early trend access', '1-on-1 product strategy call', 'Custom niche reports', 'White-glove onboarding']}
            cta="Get Early Access"
            href={TIKTOK_AUTH_URL}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-center gap-2.5 mb-4">
          <div className="w-6 h-6 rounded" style={{ background: 'linear-gradient(135deg, #FF3B5C, #FF6B81)' }} />
          <span className="font-display font-bold text-sm" style={{ color: '#F0F0F2' }}>TrendMatch</span>
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
    <div
      className="rounded-xl p-6 flex flex-col"
      style={{
        background: '#16161A',
        border: `1px solid ${featured ? '#FF3B5C' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: featured ? '0 0 40px rgba(255,59,92,0.08)' : 'none',
      }}
    >
      {featured && (
        <div className="text-[10px] uppercase tracking-wider font-bold mb-3" style={{ color: '#FF3B5C' }}>Most Popular</div>
      )}
      <h3 className="font-display text-lg font-bold mb-1" style={{ color: '#F0F0F2' }}>{title}</h3>
      <div className="mb-4">
        <span className="font-display text-3xl font-extrabold" style={{ color: '#F0F0F2' }}>{price}</span>
        {price !== '$0' && <span className="text-sm" style={{ color: '#5A5A66' }}>/mo</span>}
      </div>
      <ul className="flex-1 mb-6">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2 mb-2 text-sm" style={{ color: '#8A8A96' }}>
            <span style={{ color: '#00D1C1' }}>✓</span> {f}
          </li>
        ))}
      </ul>
      <a
        href={href}
        className="text-center py-3 rounded-full text-sm font-semibold"
        style={{
          background: featured ? '#FF3B5C' : 'transparent',
          color: featured ? 'white' : '#FF3B5C',
          border: featured ? 'none' : '1px solid rgba(255,59,92,0.3)',
          textDecoration: 'none',
          display: 'block',
        }}
      >
        {cta}
      </a>
    </div>
  )
}
