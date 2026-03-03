'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const ERROR_MESSAGES = {
  auth_denied: { title: 'Access Denied', desc: 'You declined the TikTok connection. TrendMatch needs read-only access to analyze your profile and recommend products.', icon: '🚫' },
  no_code: { title: 'Connection Failed', desc: 'We didn\'t receive a response from TikTok. This can happen if the connection was interrupted.', icon: '🔌' },
  token_failed: { title: 'Authentication Error', desc: 'TikTok rejected the connection request. This is usually temporary. Please try again.', icon: '🔑' },
  db_failed: { title: 'Server Error', desc: 'We had trouble saving your account. Our database may be temporarily unavailable. Please try again in a moment.', icon: '🗄️' },
  unknown: { title: 'Unexpected Error', desc: 'Something went wrong during sign-in. Please try again. If this persists, contact support.', icon: '⚠️' },
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code') || 'unknown'
  const err = ERROR_MESSAGES[code] || ERROR_MESSAGES.unknown

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0A0A0B' }}>
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">{err.icon}</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-3" style={{ color: '#F0F0F2' }}>{err.title}</h1>
        <p className="text-sm mb-8" style={{ color: '#8A8A96', lineHeight: 1.6 }}>{err.desc}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="/" className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-semibold inline-block text-center" style={{ background: '#FF3B5C', color: 'white', textDecoration: 'none' }}>
            Try Again
          </a>
          <a href="mailto:sleighdesmond@gmail.com" className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-semibold inline-block text-center" style={{ background: '#16161A', color: '#F0F0F2', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0B' }}>
        <div className="text-4xl animate-pulse">⏳</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
