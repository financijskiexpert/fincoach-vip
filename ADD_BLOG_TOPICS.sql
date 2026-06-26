-- Blog avtomatika: tabela tem za samodejno generiranje
CREATE TABLE IF NOT EXISTS blog_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  angle TEXT,                     -- kakšen kot/pristop (npr. "praktični vodič", "mindset", "kalkulator")
  category TEXT,                  -- mindset | praksa | investiranje | psihologija | obitelj
  keywords TEXT[],                -- SEO ključne riječi
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generated', 'published', 'skipped')),
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
  generated_at TIMESTAMPTZ,
  error_message TEXT,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_topics_status ON blog_topics(status, priority DESC, created_at);

-- Stolpec na blog_posts za sledenje auto-generated člankov
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_auto_generated BOOLEAN DEFAULT false;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS topic_id UUID REFERENCES blog_topics(id) ON DELETE SET NULL;

-- Seed: 30 tem za prvi mesec
INSERT INTO blog_topics (title, angle, category, keywords) VALUES
('Zašto novac "nestaje" do kraja mjeseca — i kako to zaustaviti', 'praktični vodič', 'praksa', ARRAY['osobne financije','novac nestaje','mjesečni proračun','kontrola troškova']),
('5 financijskih navika koje će ti promijeniti život za 30 dana', 'lista', 'praksa', ARRAY['financijske navike','osobne financije','štednja','planiranje']),
('Kako razgovarati s partnerom o novcu — bez svađe', 'odnosi', 'psihologija', ARRAY['partnerstvo i novac','obiteljske financije','komunikacija']),
('Hitni fond: koliko stvarno trebaš i kako ga izgraditi', 'praktični vodič', 'praksa', ARRAY['hitni fond','sigurnosni fond','štednja']),
('Sustav 6 kasica — kako automatski rasporediti svaki prihod', 'sustav', 'praksa', ARRAY['raspodjela prihoda','6 kasica','t. harv eker']),
('80% novca = mindset, 20% matematika — istina ili mit?', 'edukativno', 'mindset', ARRAY['mindset o novcu','financijska psihologija']),
('Kako prepoznati emocionalnu kupovinu — i naučiti reći NE', 'samosvijest', 'psihologija', ARRAY['emocionalna kupovina','impulzivna potrošnja']),
('5 znakova da si zaglavljen/a u "preživljavanju" — i izlaz', 'samosvijest', 'mindset', ARRAY['plaća do plaće','financijski stres']),
('Od duga do slobode: 3-koračni plan za eliminaciju kredita', 'praktični vodič', 'praksa', ARRAY['eliminacija duga','snowball metoda','avalanche metoda']),
('Zašto si nikad nije pravo vrijeme za štednju — i kako početi danas', 'motivacijski', 'mindset', ARRAY['početak štednje','financijska sloboda']),
('Investiranje za početnike u Hrvatskoj: prvi koraci', 'edukativno', 'investiranje', ARRAY['investiranje hrvatska','ETF','dionice']),
('Složena kamata: 8. čudo svijeta ili obična matematika?', 'edukativno', 'investiranje', ARRAY['složena kamata','dugoročno investiranje']),
('5 financijskih grešaka koje će ti uništiti mirovinu', 'upozorenje', 'investiranje', ARRAY['mirovina','dugoročna štednja']),
('Kako naučiti djecu o novcu — bez moraliziranja', 'obitelj', 'obitelj', ARRAY['financijska pismenost djece','obiteljske financije']),
('Tvoja prva milijunčina — realan plan ili san?', 'edukativno', 'investiranje', ARRAY['milijun eura','financijski cilj','dugoročno bogaćenje']),
('Zašto bogati ljudi razmišljaju drugačije o novcu', 'mindset', 'mindset', ARRAY['bogati mindset','financijski uspjeh']),
('5 stvari koje danas trebaš prestati raditi sa svojim novcem', 'lista', 'praksa', ARRAY['financijske greške','loše navike']),
('Kako napraviti prvi proračun koji stvarno funkcionira', 'praktični vodič', 'praksa', ARRAY['osobni proračun','budžetiranje']),
('Subscription trap: kako ti pretplate "kradu" tisuće eura', 'upozorenje', 'praksa', ARRAY['pretplate','mjesečni troškovi','optimizacija']),
('Štednja vs. investiranje: što i kada radiš', 'edukativno', 'investiranje', ARRAY['štednja','investiranje','financijska piramida']),
('Kako prestati uspoređivati svoj život s drugima na društvenim mrežama', 'samosvijest', 'psihologija', ARRAY['lifestyle inflation','društvene mreže','financijska psihologija']),
('Pasivni prihod 101: što je stvarno, a što prevara', 'edukativno', 'investiranje', ARRAY['pasivni prihod','investiranje za početnike']),
('Financijski savjetnik: trebaš li ga uopće i kako odabrati pravog', 'praktični vodič', 'investiranje', ARRAY['financijski savjetnik','planiranje']),
('Tvoja osobna financijska "slika": kako napraviti snimku', 'praktični vodič', 'praksa', ARRAY['financijska snimka','net worth']),
('Strah od novca: zašto ga imamo i kako ga prevladati', 'mindset', 'psihologija', ARRAY['strah od novca','financijska blokada']),
('Affirmation i novac: pop-psihologija ili realan alat', 'edukativno', 'psihologija', ARRAY['afirmacije','mindset']),
('5 mitova o bogatstvu koje ti je obitelj usadila', 'samosvijest', 'mindset', ARRAY['negativna uvjerenja','obiteljski mindset']),
('Velikodušnost i novac: paradoks koji obogaćuje', 'mindset', 'psihologija', ARRAY['davanje','dobročinstvo','obilje']),
('Kako se osloboditi konzumerizma — i osjećati se bolje', 'samosvijest', 'mindset', ARRAY['minimalizam','svjesna potrošnja']),
('Tvoj prvi godišnji financijski pregled: 7 pitanja koje sebi trebaš postaviti', 'praktični vodič', 'praksa', ARRAY['godišnji pregled','financijski ciljevi'])
ON CONFLICT DO NOTHING;

-- Verify
SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = 'pending') as pending FROM blog_topics;
