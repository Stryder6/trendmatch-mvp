# TrendMatch MVP

AI-powered product intelligence for TikTok creators.

## Setup

### 1. Install dependencies
```bash
cd trendmatch-mvp
npm install
```

### 2. Set up Supabase
1. Go to [supabase.com](https://supabase.com) and create a new project (free)
2. Go to SQL Editor and paste the contents of `supabase-schema.sql`
3. Run the SQL to create your tables
4. Go to Settings → API and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Set up environment variables
```bash
cp .env.local.example .env.local
```
Fill in:
- `TIKTOK_CLIENT_KEY` — from TikTok Developer Portal
- `TIKTOK_CLIENT_SECRET` — from TikTok Developer Portal
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase
- `ANTHROPIC_API_KEY` — from console.anthropic.com
- `NEXT_PUBLIC_APP_URL` — your deployed URL

### 4. Run locally
```bash
npm run dev
```
Open http://localhost:3000

### 5. Deploy
For Netlify:
```bash
npm run build
netlify deploy --prod --dir .next
```

Or push to GitHub and connect to Vercel for auto-deploys.

## Architecture

```
User clicks "Connect TikTok"
  → TikTok OAuth flow
  → /api/auth/tiktok exchanges code for token
  → Saves user to Supabase
  → Redirects to /onboarding

User selects niches on /onboarding
  → POST /api/analyze
  → Fetches TikTok videos via API
  → Claude AI analyzes profile + videos
  → Generates 6 product recommendations
  → Saves to Supabase
  → Redirects to /dashboard

/dashboard displays product matches
  → Fetches from /api/products
  → Shows table with filtering
  → Click product → modal with full brief
```

## Tech Stack
- **Frontend**: Next.js 14 + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude Sonnet (Anthropic API)
- **Auth**: TikTok OAuth 2.0
- **Payments**: Stripe (coming soon)
