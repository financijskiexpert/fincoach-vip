-- Dodaj like_count na blog_posts (če še ne obstaja)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS like_count INTEGER NOT NULL DEFAULT 0;

-- Verify
SELECT id, slug, title, like_count, is_published FROM blog_posts LIMIT 5;
