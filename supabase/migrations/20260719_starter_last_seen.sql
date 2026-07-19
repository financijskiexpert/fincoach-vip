-- Track last portal visit for Starter re-engagement emails
ALTER TABLE starter_purchases
  ADD COLUMN IF NOT EXISTS last_seen_starter TIMESTAMPTZ;

-- Table to prevent duplicate re-engagement emails (max 1 per 5 days)
CREATE TABLE IF NOT EXISTS starter_inactivity_reminders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL,
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_starter_inactivity_email
  ON starter_inactivity_reminders (email, sent_at DESC);
