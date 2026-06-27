-- Dodaj category i cover_image_url kolone u blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- Backfill category za već generirane članke (preko topic_id → blog_topics)
UPDATE blog_posts bp
SET category = bt.category
FROM blog_topics bt
WHERE bp.topic_id = bt.id
  AND bp.category IS NULL;
