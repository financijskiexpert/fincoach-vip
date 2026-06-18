-- ============================================================
-- FinCoach VIP — Supabase SQL setup
-- Zaženi v Supabase → SQL Editor
-- ============================================================

-- 1. COUPONS
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Obstoječi kupon PRILIKA (€200 popust = cena €197 namesto €397)
INSERT INTO coupons (code, discount_type, discount_value, is_active)
VALUES ('PRILIKA', 'fixed', 200, true)
ON CONFLICT (code) DO NOTHING;

-- 2. BLOG POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AFFILIATES
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  commission_percent NUMERIC DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  total_sales NUMERIC DEFAULT 0,
  total_commission NUMERIC DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  bank_account TEXT,
  paypal_email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AFFILIATE CONVERSIONS
CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
  commission_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RPC za increment affiliate stats
CREATE OR REPLACE FUNCTION increment_affiliate_stats(
  affiliate_id UUID,
  sale_amount NUMERIC,
  commission NUMERIC
) RETURNS void AS $$
BEGIN
  UPDATE affiliates
  SET
    total_sales = total_sales + sale_amount,
    total_commission = total_commission + commission,
    total_conversions = total_conversions + 1
  WHERE id = affiliate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RPC za increment coupon uses
CREATE OR REPLACE FUNCTION increment_coupon_uses(coupon_code TEXT)
RETURNS void AS $$
BEGIN
  UPDATE coupons SET used_count = used_count + 1 WHERE code = coupon_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. ADMIN ROLE za Brane (zaženi PO prvem loginu)
-- INSERT INTO profiles (id, email, full_name, role)
-- SELECT id, email, 'Brane Recek', 'admin'
-- FROM auth.users WHERE email = 'brane.recek@gmail.com'
-- ON CONFLICT (id) DO UPDATE SET role = 'admin', full_name = 'Brane Recek';

-- ============================================================
-- RLS policies (priporočeno)
-- ============================================================
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;

-- Blog: javno branje objavljenih
CREATE POLICY "Public read published posts" ON blog_posts
  FOR SELECT USING (is_published = true);

-- Admin full access (service role bypasses RLS)
