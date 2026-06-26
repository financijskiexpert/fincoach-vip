-- Preimenuj slug tečaja na SEO-friendly format z vezaji
UPDATE courses SET slug = 'volim-svoj-novac' WHERE slug = 'volim-svojnovac';

-- Verify
SELECT slug, title, is_active FROM courses;
