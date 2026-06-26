-- ================================================================
-- Blog nadogradnja — pokrenuti u Supabase SQL Editor
-- Dodaje: fb_caption kolona, teme za osiguranje i mentorstvo
-- ================================================================

-- 1. Dodaj fb_caption kolonu na blog_posts (ako ne postoji)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS fb_caption TEXT;

-- 2. Dodaj generated_at i error_message na blog_topics (ako ne postoje)
ALTER TABLE blog_topics ADD COLUMN IF NOT EXISTS generated_at TIMESTAMPTZ;
ALTER TABLE blog_topics ADD COLUMN IF NOT EXISTS error_message TEXT;
ALTER TABLE blog_topics ADD COLUMN IF NOT EXISTS blog_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL;

-- 3. Nove teme — OSIGURANJE (Brane = 30g iskustva)
INSERT INTO blog_topics (title, angle, category, keywords, priority) VALUES
('Zašto je osiguranje života najvažnija financijska odluka — ne investicija', 'stručan iz iskustva', 'osiguranje', ARRAY['osiguranje života','financijska zaštita','obiteljske financije'], 9),
('5 grešaka koje Hrvati rade pri odabiru osiguranja — i kako ih izbjeći', 'lista grešaka, praktični vodič', 'osiguranje', ARRAY['osiguranje hrvatska','osiguranje savjeti','zaštita obitelji'], 8),
('Koliko osiguranja trebaš zapravo? Vodič za svaki životni korak', 'praktični vodič po životnim stadijima', 'osiguranje', ARRAY['koliko osiguranja','osiguranje planer','životni stadiji'], 8),
('Razlika između štednog i riziko osiguranja — što odabrati i kada', 'edukativno, usporedba', 'osiguranje', ARRAY['stedno osiguranje','riziko osiguranje','usporedba'], 7),
('Osiguranje vs. investiranje: ne moraš birati — oboje ima smisla', 'edukativno, smirujući ton', 'osiguranje', ARRAY['osiguranje investiranje','financijsko planiranje','portfelj'], 7),
('Zašto mladi ne razmišljaju o osiguranju — i zašto je to skupa greška', 'motivacijski, statistike', 'osiguranje', ARRAY['mladi i osiguranje','financijska pismenost','zaštita'], 6),

-- 4. Nove teme — MENTORSTVO (za nove zastopnike)
('Karijera zastopnika osiguranja: što nisam znao na početku', 'osobno iskustvo iz 30g', 'mentorstvo', ARRAY['karijera zastopnik osiguranja','posao u osiguranju','zastopnik savjeti'], 9),
('Što razlikuje prosječnog od odličnog zastopnika — 30 godina promatranja', 'uvidi iz prakse', 'mentorstvo', ARRAY['zastopnik osiguranja','prodajne vještine osiguranje','mentorstvo'], 9),
('Kako izgraditi bazu klijenata u osiguranju bez hladnih poziva', 'praktični vodič, alternativni pristup', 'mentorstvo', ARRAY['baza klijenata osiguranje','prodaja osiguranja','networking'], 8),
('Posao zastopnika u 2025.: realnost, prihodi i mogućnosti rasta', 'realan pregled, bez uljepšavanja', 'mentorstvo', ARRAY['zastopnik prihodi','karijera u osiguranju 2025','prihodi zastopnika'], 8),
('Mentorstvo u financijama: zašto ga trebaš i kako ga pronaći', 'motivacijski, pozivni', 'mentorstvo', ARRAY['mentorstvo financije','financijska karijera','coach'], 7),
('Od prvog do sto klijenata: moj put kroz 30 godina u osiguranju', 'osobna priča, motivacijska', 'mentorstvo', ARRAY['iskustvo zastopnika','karijera priča','osiguranje hrvatska'], 7)

ON CONFLICT DO NOTHING;

-- Provjera
SELECT category, COUNT(*) as ukupno, COUNT(*) FILTER (WHERE status = 'pending') as na_cekanju
FROM blog_topics
GROUP BY category
ORDER BY category;
