'use client'

export default function ErrorPage({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0A0A0B' }}>
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-3xl font-extrabold mb-3" style={{ color: '#F0F0F2' }}>Something Went Wrong</h1>
        <p className="text-sm mb-8" style={{ color: '#8A8A96' }}>We hit an unexpected error. This has been noted and we're working on it.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={reset} className="px-6 py-3 rounded-full text-sm font-semibold" style={{ background: '#FF3B5C', color: 'white' }}>
            Try Again
          </button>
          <a href="/" className="px-6 py-3 rounded-full text-sm font-semibold" style={{ background: '#16161A', color: '#F0F0F2', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
