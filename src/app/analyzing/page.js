'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const STEPS = [
  'Connecting to your TikTok profile...',
  'Scanning your recent videos...',
  'Analyzing your audience & content style...',
  'Matching trending products to your niche...',
  'Building your product recommendations...',
]

export default function AnalyzingPage() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const apiDone = useRef(false)
  const router = useRouter()

  useEffect(() => {
    // Start API call in background
    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ niches: [] }),
    })
      .then(res => res.json())
      .then(() => { apiDone.current = true })
      .catch(() => { apiDone.current = true })

    // Animate through steps on a fixed schedule
    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      if (currentStep < STEPS.length) {
        setStep(currentStep)
      } else {
        clearInterval(interval)
        // Wait for API if it hasn't finished
        const checkApi = setInterval(() => {
          if (apiDone.current) {
            clearInterval(checkApi)
            setDone(true)
          }
        }, 500)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (done) {
      const timer = setTimeout(() => router.push('/dashboard'), 1200)
      return () => clearTimeout(timer)
    }
  }, [done, router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0B' }}>
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF3B5C, #FF6B81)' }}>
          <span className="text-3xl">{done ? '✅' : '🔍'}</span>
        </div>
        <h1 className="font-display text-2xl font-extrabold mb-3" style={{ color: '#F0F0F2' }}>
          {done ? 'Analysis Complete!' : 'Analyzing Your Profile'}
        </h1>
        <p className="text-sm mb-8" style={{ color: '#8A8A96' }}>
          {done
            ? 'Loading your personalized product matches...'
            : 'Our AI is scanning your TikTok content to find the perfect products for your audience.'}
        </p>

        <div className="space-y-3 text-left mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all duration-500"
                style={{
                  background: i < step || done ? '#FF3B5C' : i === step ? 'rgba(255,59,92,0.2)' : '#16161A',
                  color: i <= step || done ? 'white' : '#5A5A66',
                  border: !done && i === step ? '2px solid #FF3B5C' : '1px solid transparent',
                }}>
                {i < step || done ? '✓' : i + 1}
              </div>
              <span className="text-sm transition-colors duration-500" style={{ color: i <= step || done ? '#F0F0F2' : '#5A5A66' }}>
                {s}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: '#16161A' }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              background: done
                ? '#00D1C1'
                : 'linear-gradient(90deg, #FF3B5C, #FF6B81)',
              width: done ? '100%' : `${((step + 1) / STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
