'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const NICHES = [
  { id: 'cleaning', emoji: '🧹', label: 'Cleaning' },
  { id: 'beauty', emoji: '💄', label: 'Beauty' },
  { id: 'home', emoji: '🏠', label: 'Home & Living' },
  { id: 'kitchen', emoji: '🍳', label: 'Kitchen' },
  { id: 'pets', emoji: '🐾', label: 'Pets' },
  { id: 'fitness', emoji: '💪', label: 'Fitness' },
  { id: 'fashion', emoji: '👗', label: 'Fashion' },
  { id: 'tech', emoji: '📱', label: 'Tech & Gadgets' },
  { id: 'parenting', emoji: '👶', label: 'Parenting' },
  { id: 'food', emoji: '🍕', label: 'Food & Cooking' },
  { id: 'automotive', emoji: '🚗', label: 'Automotive' },
  { id: 'outdoors', emoji: '⛺', label: 'Outdoors' },
]

export default function OnboardingPage() {
  const [selectedNiches, setSelectedNiches] = useState([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('niches') // 'niches' | 'analyzing'
  const router = useRouter()

  const toggleNiche = (id) => {
    setSelectedNiches(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    )
  }

  const handleAnalyze = async () => {
    if (selectedNiches.length === 0) return
    setLoading(true)
    setStep('analyzing')

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niches: selectedNiches }),
      })

      if (res.ok) {
        router.push('/dashboard')
      } else {
        setStep('niches')
        setLoading(false)
        alert('Analysis failed. Please try again.')
      }
    } catch (err) {
      setStep('niches')
      setLoading(false)
      alert('Something went wrong. Please try again.')
    }
  }

  if (step === 'analyzing') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0B' }}>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6 animate-pulse">🔍</div>
          <h1 className="font-display text-2xl font-bold mb-3" style={{ color: '#F0F0F2' }}>
            Analyzing your profile...
          </h1>
          <p style={{ color: '#8A8A96' }} className="mb-8">
            Our AI is reviewing your content, audience, and niche to find the perfect products for you. This takes about 15-30 seconds.
          </p>
          <div className="flex justify-center gap-3">
            {['Content', 'Audience', 'Matching'].map((label, i) => (
              <div key={label} className="text-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg mb-2 mx-auto animate-pulse"
                  style={{
                    background: 'rgba(255,59,92,0.1)',
                    animationDelay: `${i * 0.3}s`,
                  }}
                >
                  {['📝', '👥', '📦'][i]}
                </div>
                <span className="text-xs" style={{ color: '#5A5A66' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0A0A0B' }}>
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg" style={{ background: 'linear-gradient(135deg, #FF3B5C, #FF6B81)' }} />
          <span className="font-display font-extrabold text-xl" style={{ color: '#F0F0F2' }}>TrendMatch</span>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-10">
          <div className="flex-1 h-1 rounded" style={{ background: '#FF3B5C' }} />
          <div className="flex-1 h-1 rounded" style={{ background: '#FF3B5C' }} />
          <div className="flex-1 h-1 rounded" style={{ background: 'linear-gradient(90deg, #FF3B5C, rgba(255,59,92,0.2))' }} />
          <div className="flex-1 h-1 rounded" style={{ background: '#16161A' }} />
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: '#16161A', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#FF3B5C' }}>
            Step 3 of 4
          </div>
          <h1 className="font-display text-2xl font-extrabold mb-2" style={{ color: '#F0F0F2' }}>
            What's your niche?
          </h1>
          <p className="text-sm mb-8" style={{ color: '#8A8A96' }}>
            Select all that apply. This helps our AI find products that match your content and audience.
          </p>

          {/* Niche grid */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            {NICHES.map(niche => (
              <button
                key={niche.id}
                onClick={() => toggleNiche(niche.id)}
                className="p-3 rounded-xl text-center transition-all"
                style={{
                  background: selectedNiches.includes(niche.id) ? 'rgba(255,59,92,0.08)' : '#0A0A0B',
                  border: `1px solid ${selectedNiches.includes(niche.id) ? '#FF3B5C' : 'rgba(255,255,255,0.06)'}`,
                  color: selectedNiches.includes(niche.id) ? '#FF3B5C' : '#8A8A96',
                }}
              >
                <span className="text-xl block mb-1">{niche.emoji}</span>
                <span className="text-xs font-medium">{niche.label}</span>
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <button
            onClick={handleAnalyze}
            disabled={selectedNiches.length === 0 || loading}
            className="w-full py-3.5 rounded-full text-sm font-semibold transition-all"
            style={{
              background: selectedNiches.length > 0 ? '#FF3B5C' : '#1C1C21',
              color: selectedNiches.length > 0 ? 'white' : '#5A5A66',
              cursor: selectedNiches.length > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? 'Analyzing...' : `Find Products for My Audience →`}
          </button>

          <p className="text-center mt-4 text-xs" style={{ color: '#5A5A66' }}>
            {selectedNiches.length} niche{selectedNiches.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      </div>
    </div>
  )
}
