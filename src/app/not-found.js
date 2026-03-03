import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0A0A0B' }}>
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-3xl font-extrabold mb-3" style={{ color: '#F0F0F2' }}>Page Not Found</h1>
        <p className="text-sm mb-8" style={{ color: '#8A8A96' }}>The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="inline-flex px-6 py-3 rounded-full text-sm font-semibold" style={{ background: '#FF3B5C', color: 'white', textDecoration: 'none' }}>
          ← Back to TrendMatch
        </Link>
      </div>
    </div>
  )
}
