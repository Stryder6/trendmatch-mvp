export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0A0A0B' }}>
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg" style={{ background: 'linear-gradient(135deg, #FF3B5C, #FF6B81)' }} />
          <span className="font-extrabold text-lg" style={{ color: '#F0F0F2' }}>TrendMatch</span>
        </a>
      </nav>
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-12">
        <h1 className="text-3xl font-extrabold mb-8" style={{ color: '#F0F0F2' }}>Privacy Policy</h1>
        <div className="space-y-6 text-sm" style={{ color: '#8A8A96', lineHeight: 1.8 }}>
          <p><strong style={{ color: '#F0F0F2' }}>Last Updated:</strong> March 1, 2026</p>

          <div>
            <h2 className="text-base font-bold mb-2" style={{ color: '#F0F0F2' }}>1. Information We Collect</h2>
            <p>When you connect your TikTok account, we collect your public profile information (display name, avatar, bio), follower and engagement statistics, and metadata from your recent public videos (titles, descriptions, view counts). We do not collect private messages, passwords, or payment information stored on TikTok.</p>
          </div>

          <div>
            <h2 className="text-base font-bold mb-2" style={{ color: '#F0F0F2' }}>2. How We Use Your Information</h2>
            <p>Your TikTok data is used solely to generate personalized product recommendations through our AI analysis engine. We analyze your content style, audience patterns, and engagement metrics to match trending products to your specific niche and audience.</p>
          </div>

          <div>
            <h2 className="text-base font-bold mb-2" style={{ color: '#F0F0F2' }}>3. Data Storage</h2>
            <p>Your profile data and generated product recommendations are stored securely in our database hosted on Supabase (PostgreSQL). Data is encrypted in transit via HTTPS. We retain your data for as long as your account is active.</p>
          </div>

          <div>
            <h2 className="text-base font-bold mb-2" style={{ color: '#F0F0F2' }}>4. Third-Party Services</h2>
            <p>We use the following third-party services to operate TrendMatch:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong style={{ color: '#F0F0F2' }}>TikTok API</strong> — to access your public profile and video data</li>
              <li><strong style={{ color: '#F0F0F2' }}>Anthropic (Claude AI)</strong> — to analyze your profile and generate recommendations</li>
              <li><strong style={{ color: '#F0F0F2' }}>Supabase</strong> — to store your account data and product matches</li>
              <li><strong style={{ color: '#F0F0F2' }}>Netlify</strong> — to host and serve the application</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold mb-2" style={{ color: '#F0F0F2' }}>5. Data Sharing</h2>
            <p>We do not sell, rent, or share your personal data with third parties for marketing purposes. Your TikTok data is sent to Anthropic's AI API for analysis but is not stored by Anthropic beyond the duration of the API request.</p>
          </div>

          <div>
            <h2 className="text-base font-bold mb-2" style={{ color: '#F0F0F2' }}>6. Your Rights</h2>
            <p>You can disconnect your TikTok account and delete your data at any time by logging out. You may request a full deletion of your account and associated data by contacting us directly.</p>
          </div>

          <div>
            <h2 className="text-base font-bold mb-2" style={{ color: '#F0F0F2' }}>7. Cookies</h2>
            <p>We use a single session cookie (tm_user_id) to keep you logged in. We do not use advertising cookies or third-party tracking scripts.</p>
          </div>

          <div>
            <h2 className="text-base font-bold mb-2" style={{ color: '#F0F0F2' }}>8. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.</p>
          </div>

          <div>
            <h2 className="text-base font-bold mb-2" style={{ color: '#F0F0F2' }}>9. Contact</h2>
            <p>For privacy-related questions or data deletion requests, contact us at <a href="mailto:sleighdesmond@gmail.com" style={{ color: '#FF3B5C' }}>sleighdesmond@gmail.com</a>.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
