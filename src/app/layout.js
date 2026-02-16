import './globals.css'

export const metadata = {
  title: 'TrendMatch — AI Product Intelligence for TikTok Creators',
  description: 'Find the perfect products for your TikTok audience with AI-powered recommendations.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
