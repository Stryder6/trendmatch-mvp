# TrendMatch — AI-Powered Product Intelligence for TikTok Creators

TrendMatch analyzes TikTok creator profiles using AI to recommend trending products for TikTok Shop, complete with pricing, margins, sourcing, and content templates.

**Live:** [trendmatch.netlify.app](https://trendmatch.netlify.app)

## The Problem

Millions of TikTok creators want to sell products through TikTok Shop but don't know what to sell. Existing tools serve experienced e-commerce sellers — not creators. Creators have audiences but lack product intelligence.

## The Solution

TrendMatch connects to a creator's TikTok account, analyzes their content and audience using Claude AI, and generates personalized product recommendations with everything needed to start selling: pricing strategy, profit margins, supplier sourcing (US warehouses for TikTok Shop compliance), and ready-to-use content hooks.

## How It Works

1. **Connect TikTok** — OAuth 2.0 login pulls profile data, stats, and recent videos
2. **AI Analysis** — Claude AI analyzes content style, audience signals, and engagement patterns to auto-detect the creator's niche
3. **Product Matching** — Generates 6 personalized product recommendations with trend status, match scores, and margin calculations
4. **Dashboard** — Browse matches, save favorites, view detailed product briefs with content hooks and sourcing notes

## Tech Stack

- **Frontend:** Next.js 14, Tailwind CSS
- **Backend:** Next.js API Routes (serverless)
- **Database:** Supabase (PostgreSQL)
- **AI Engine:** Anthropic Claude API (Sonnet 4)
- **Auth:** TikTok OAuth 2.0
- **Deployment:** Netlify (CI/CD from GitHub)

## Key Features

- **Auto Niche Detection** — AI determines creator's niche from their content, no manual selection needed
- **Product Briefs** — Each recommendation includes pricing grid, trend status, content hook, video format suggestion, and sourcing notes
- **Usage Limits** — Free tier (1 analysis/month), Pro tier (unlimited)
- **Save Products** — Bookmark products for later review
- **Re-analyze** — Refresh recommendations with animated progress tracking
- **Mobile Responsive** — Hamburger menu, card-based layout on mobile, slide-up modals
- **Returning User Flow** — Existing users skip onboarding and go straight to dashboard

## Architecture

```
TikTok OAuth → /api/auth/tiktok → Supabase (user record)
                                        ↓
                               /api/analyze → TikTok API (fetch videos)
                                        ↓
                               Claude AI (analyze profile + generate products)
                                        ↓
                               Supabase (product_matches table)
                                        ↓
                               /api/products → Dashboard
```

## Project Structure

```
src/
├── app/
│   ├── page.js              # Landing page
│   ├── analyzing/page.js    # AI analysis progress screen
│   ├── dashboard/page.js    # Main product dashboard
│   ├── onboarding/page.js   # Niche selection (legacy)
│   └── api/
│       ├── auth/
│       │   ├── tiktok/route.js  # OAuth callback
│       │   └── logout/route.js  # Session logout
│       ├── analyze/route.js     # AI analysis endpoint
│       └── products/
│           ├── route.js         # Fetch user products
│           └── save/route.js    # Save/unsave products
├── lib/
│   ├── ai-engine.js         # Claude AI analysis engine
│   ├── supabase.js          # Supabase client
│   └── tiktok.js            # TikTok API helpers
```

## Business Model

| Tier | Price | Features |
|------|-------|----------|
| Free | $0/mo | 1 analysis per month |
| Pro | $49/mo | Unlimited analyses, daily alerts, content templates |
| Early Bird | $99/mo | Everything in Pro + early trend access, strategy calls |

## Sourcing Strategy

Products are sourced through CJ Dropshipping and Zendrop — both offer US-based warehouses with 3-5 day shipping, meeting TikTok Shop's delivery requirements.

## Setup

```bash
git clone https://github.com/Stryder6/trendmatch-mvp.git
cd trendmatch-mvp
npm install --legacy-peer-deps
cp .env.local.example .env.local
# Fill in your API keys
npm run dev
```

## Environment Variables

See `.env.local.example` for required variables:
- TikTok Developer credentials
- Supabase project keys
- Anthropic API key
- App URL

## Author

Built by Desmond Sleigh — [GitHub](https://github.com/Stryder6)
