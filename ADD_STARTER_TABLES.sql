-- ============================================================
-- FinCoach VIP — Starter Paket tabele
-- Zaženi v Supabase → SQL Editor
-- ============================================================

-- 1. Starter Paket nakupi (ne vezan na auth.users)
CREATE TABLE IF NOT EXISTS starter_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,
  amount_paid INTEGER, -- v centih
  financial_type TEXT CHECK (financial_type IN ('hedonist', 'branic', 'vrtlog', 'teoreticar')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'refunded')),
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Access tokeni za /starter APP (GDPR: minimalni podatki)
CREATE TABLE IF NOT EXISTS starter_access_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  starter_purchase_id UUID REFERENCES starter_purchases(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS — samo service_role (backend) sme brati/pisati
ALTER TABLE starter_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE starter_access_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access starter_purchases"
  ON starter_purchases FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access starter_access_tokens"
  ON starter_access_tokens FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 3. Dodaj stolpce v leads tabelo
ALTER TABLE leads ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS marketing_consent_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS starter_purchased BOOLEAN DEFAULT false;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS starter_purchased_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS financial_type TEXT;

-- 4. Email sequence queue: dodaj sequence_type za segmentacijo
ALTER TABLE email_sequence_queue ADD COLUMN IF NOT EXISTS sequence_type TEXT DEFAULT 'lead';

-- 5. Indexi za performance
CREATE INDEX IF NOT EXISTS idx_starter_tokens_token
  ON starter_access_tokens(token);
CREATE INDEX IF NOT EXISTS idx_starter_purchases_email
  ON starter_purchases(email);
CREATE INDEX IF NOT EXISTS idx_email_queue_type
  ON email_sequence_queue(sequence_type, status, scheduled_at)
  WHERE status = 'pending';
