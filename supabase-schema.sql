-- TrendMatch Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tiktok_open_id TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  likes_count BIGINT DEFAULT 0,
  video_count INTEGER DEFAULT 0,
  niches TEXT[] DEFAULT '{}',
  onboarding_complete BOOLEAN DEFAULT false,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'early_bird')),
  stripe_customer_id TEXT,
  analyses_used INTEGER DEFAULT 0,
  analyses_limit INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product matches table
CREATE TABLE product_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  suggested_price TEXT,
  estimated_cost TEXT,
  estimated_margin TEXT,
  margin_percent TEXT,
  trend_status TEXT DEFAULT 'new' CHECK (trend_status IN ('hot', 'rising', 'new')),
  match_score INTEGER DEFAULT 0,
  content_hook TEXT,
  content_format TEXT,
  sourcing_notes TEXT,
  why_now TEXT,
  saved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_users_tiktok_id ON users(tiktok_open_id);
CREATE INDEX idx_product_matches_user ON product_matches(user_id);
CREATE INDEX idx_product_matches_trend ON product_matches(trend_status);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_matches ENABLE ROW LEVEL SECURITY;

-- Policies (service role bypasses these, which is what our API uses)
CREATE POLICY "Service role full access users" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access products" ON product_matches
  FOR ALL USING (true) WITH CHECK (true);
