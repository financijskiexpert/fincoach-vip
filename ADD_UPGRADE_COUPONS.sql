-- ── Upgrade Coupons tabela ───────────────────────────────────────────────────
-- Unikatni 1x kuponi za upgrade Starter kupaca na 397€ tečaj (50% off = 198.50€)
-- Generirani automatski u Stripe webhookuu pri kupnji Starter Paketa.

CREATE TABLE IF NOT EXISTS upgrade_coupons (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  code                TEXT        UNIQUE NOT NULL,                    -- npr. UPGRADE-AB3XY7
  email               TEXT        NOT NULL,
  starter_purchase_id UUID        REFERENCES starter_purchases(id) ON DELETE SET NULL,
  discount_percent    INT         NOT NULL DEFAULT 50,
  used_at             TIMESTAMPTZ,                                    -- NULL = nije iskorišten
  expires_at          TIMESTAMPTZ,                                    -- NULL = bez roka
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index za brzo pronalaženje po emailu i kodu
CREATE INDEX IF NOT EXISTS upgrade_coupons_email_idx ON upgrade_coupons(email);
CREATE INDEX IF NOT EXISTS upgrade_coupons_code_idx  ON upgrade_coupons(code);

-- RLS: samo service_role može čitati/pisati (backend only)
ALTER TABLE upgrade_coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON upgrade_coupons
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
