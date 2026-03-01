'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AnalyzingPage() {
  const [status, setStatus] = useState('Connecting to your TikTok profile...')
  const [step, setStep] = useState(0)
  const router = useRouter()

  const steps = [
    'Connecting to your TikTok profile...',
    'Scanning your recent videos...',
    'Analyzing your audience & content style...',
    'Matching trending products to your niche...',
    'Building your product recommendations...',
  ]

  useEffect(() => {
    // Animate through steps
    const interval = setInterval(() => {
      setStep(prev => {
        if (prev < steps.length - 1) {
          setStatus(steps[prev + 1])
          return prev + 1
        }
        return prev
      })
    }, 2500)

    // Trigger the analysis
    runAnalysis()

    return () => clearInterval(interval)
  }, [])

  const runAnalysis = async () => {
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niches: [] }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('Done! Loading your dashboard...')
        setTimeout(() => router.push('/dashboard'), 1500)
      } else {
        setStatus('Analysis complete. Redirecting...')
        setTimeout(() => router.push('/dashboard'), 1500)
      }
    } catch (err) {
      console.error('Analysis error:', err)
      setStatus('Something went wrong. Redirecting...')
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0B' }}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF3B5C, #FF6B81)' }}>
          <span className="text-3xl">🔍</span>
        </div>
        <h1 className="font-display text-2xl font-extrabold mb-3" style={{ color: '#F0F0F2' }}>
          Analyzing Your Profile
        </h1>
        <p className="text-sm mb-8" style={{ color: '#8A8A96' }}>
          Our AI is scanning your TikTok content to find the perfect products for your audience.
        </p>

        {/* Progress steps */}
        <div className="space-y-3 text-left mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                style={{
                  background: i < step ? '#FF3B5C' : i === step ? 'rgba(255,59,92,0.2)' : '#16161A',
                  color: i <= step ? 'white' : '#5A5A66',
                  border: i === step ? '2px solid #FF3B5C' : '1px solid rgba(255,255,255,0.06)',
                }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-sm" style={{ color: i <= step ? '#F0F0F2' : '#5A5A66' }}>
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Animated bar */}
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: '#16161A' }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              background: 'linear-gradient(90deg, #FF3B5C, #FF6B81)',
              width: `${((step + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
