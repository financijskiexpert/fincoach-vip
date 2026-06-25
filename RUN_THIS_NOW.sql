-- ============================================
-- KOMPLETNO POPRAVI VSE — zaženi v Supabase SQL Editor
-- ============================================

-- 1) GRANT dovoljenja za service_role (root cause vseh težav!)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;

-- Authenticated users (RLS še velja, ampak GRANT mora obstajati)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
GRANT INSERT, UPDATE ON public.progress TO authenticated;
GRANT INSERT ON public.leads TO authenticated;

-- Anon (za public strani)
GRANT SELECT ON public.courses TO anon;
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT ON public.coupons TO anon;
GRANT INSERT ON public.leads TO anon;

-- 2) Zagotovi da je tečaj aktiven
UPDATE courses SET is_active = true WHERE slug = 'volim-svojnovac';

-- 3) Vstavi vseh 90 lekcij (pobriši prej, da preprečimo duplikate)
DELETE FROM lessons WHERE course_id = (SELECT id FROM courses WHERE slug = 'volim-svojnovac');

INSERT INTO lessons (course_id, day_number, title, section, sort_order, duration_seconds)
SELECT c.id, v.day_number, v.title, v.section, v.day_number, 0
FROM courses c, (VALUES
  (1, 'Put prema financijskoj slobodi', '1-30'),
  (2, 'Financijske strategije za osvajanje ciljeva', '1-30'),
  (3, 'Volim svoj novac', '1-30'),
  (4, 'Volim Svoj Novac', '1-30'),
  (5, 'Dan primjene afirmacija u svakodnevnom životu', '1-30'),
  (6, 'Dan autosugestije', '1-30'),
  (7, 'Danas razmišljamo o nasljeđu', '1-30'),
  (8, 'Vaš odnos posla i novcu', '1-30'),
  (9, 'Suočavanje sa strahovima i davanje pažnje novcu', '1-30'),
  (10, 'Dan transformacije iz pasivnosti u akciju', '1-30'),
  (11, 'Dan unutarnje promjene', '1-30'),
  (12, 'Dan povezivanja uma i tijela', '1-30'),
  (13, 'Dan obiteljskih vrijednosti i financijskog blagostanja', '1-30'),
  (14, 'Dan Velikodušnosti', '1-30'),
  (15, 'Dan kreiranja jutarnje rutine', '1-30'),
  (16, 'Dan promjene perspektive', '1-30'),
  (17, 'Dan inspiracije i dobrih djela', '1-30'),
  (18, 'Dan obiteljskih financija i otvorenog razgovora', '1-30'),
  (19, 'Dan financijske iskrenosti i hrabrosti', '1-30'),
  (20, 'Dan planiranja financija', '1-30'),
  (21, 'Dan svjesnog odabira sadržaja', '1-30'),
  (22, 'Dan usvajanja navika bogatih', '1-30'),
  (23, 'Dan financijske pismenosti djece', '1-30'),
  (24, 'Dan suočavanja s dugovima', '1-30'),
  (25, 'Dan životnih navika i financijskog blagostanja', '1-30'),
  (26, 'Dan prihvaćanja promjena i preispitivanja uvjerenja', '1-30'),
  (27, 'Dan izbora svog prostora i vremena', '1-30'),
  (28, 'Dan prihvaćanja stvarnosti i proslave napretka', '1-30'),
  (29, 'Dan učenja iz teških situacija', '1-30'),
  (30, 'Dan oživljavanja strasti u svim aspektima života', '1-30'),
  (31, 'Dan vizije i hrabrosti', '31-60'),
  (32, 'Dan sustava za financijsku stabilnost', '31-60'),
  (33, 'Dan prevladavanja straha i jačanja financijske sigurnosti', '31-60'),
  (34, 'Dan dijeljenja obilja i stvaranja pozitivnog utjecaja', '31-60'),
  (35, 'Dan pretvaranja dosade u brigu o sebi', '31-60'),
  (36, 'Dan proračuna — ključ prema financijskoj kontroli i sigurnosti', '31-60'),
  (37, 'Dan organizacije financija — preduvjet za mirnu budućnost', '31-60'),
  (38, 'Dan ravnoteže — prihodi nasuprot troškova — put prema obilju', '31-60'),
  (39, 'Dan izgradnje fonda za nepredviđene situacije — štit od stresa i panike', '31-60'),
  (40, 'Dan planiranja budućnosti — ostavština koju gradimo zajedno', '31-60'),
  (41, 'Dan financijskog savjetnika — vaš partner u ostvarivanju financijskih snova', '31-60'),
  (42, 'Dan postizanja financijske slobode — strategije za održivi uspjeh', '31-60'),
  (43, 'Dan oslobađanja — recite NE kupovini na rate i živite slobodnije', '31-60'),
  (44, 'Dan financijske pismenosti — temelj za sigurnu i prosperitetnu budućnost', '31-60'),
  (45, 'Dan autentičnog zadovoljstva — pronađite sreću u onome što već imate', '31-60'),
  (46, 'Dan zaštite — osigurajte financijsku budućnost od nepredviđenih događaja', '31-60'),
  (47, 'Dan mudrog planiranja — osigurajte financijsku budućnost dok ste zdravi i aktivni', '31-60'),
  (48, 'Dan odnosa prema sebi — temelj financijske i životne sreće', '31-60'),
  (49, 'Dan istinske vrijednosti — od materijalnog bogatstva do bogatstva odnosa', '31-60'),
  (50, 'Dan vizije budućnosti — planirajte put prema ostvarenju snova', '31-60'),
  (51, 'Dan unutarnjeg mira — pronađite ravnotežu u užurbanom svijetu', '31-60'),
  (52, 'Dan Zlatne Rezerve — transformirajte život stvaranjem financijske sigurnosti', '31-60'),
  (53, 'Dan svjesnog kreiranja — izgradite financijsku budućnost kakvu želite', '31-60'),
  (54, 'Dan Hitnog Fonda — financijska sigurnosna mreža u neočekivanim situacijama', '31-60'),
  (55, 'Dan Zahvalnosti — ključ sreće, otpornosti i financijskog blagostanja', '31-60'),
  (56, 'Dan Vježbanja Zahvalnosti — otključajte obilje, sreću i dublje zadovoljstvo životom', '31-60'),
  (57, 'Dan Raspodjele Prihoda — sistem 6 kasica za financijsku slobodu', '31-60'),
  (58, 'Dan Mirovinskog Planiranja — osigurajte bezbrižnu i financijski sigurnu budućnost', '31-60'),
  (59, 'Dan Vizije Umirovljenja — osmislite idealan život u zlatnoj dobi', '31-60'),
  (60, 'Dan Zlatne Rezerve — spasonosni jastuk za bezbrižnu budućnost i nasljeđe ljubavi', '31-60'),
  (61, 'Dan Autentičnih Ciljeva — uskladite financije sa svojim istinskim željama', '61-90'),
  (62, 'Dan Svjesne Kupovine — prepoznajte emocionalne okidače i donosite pametnije odluke', '61-90'),
  (63, 'Dan Pametne Kupovine — strategije za ostvarivanje ušteda i bolje upravljanje financijama', '61-90'),
  (64, 'Dan Propitkivanja Motiva — dublje razumijevanje potreba za pametnije financijske odluke', '61-90'),
  (65, 'Dan Velikodušnosti — otvorite srce i novčanik za sreću i ispunjen život', '61-90'),
  (66, 'Dan Kvalitetnih Odnosa — okružite se ljudima koji vas inspiriraju na putu do blagostanja', '61-90'),
  (67, 'Dan Osnaživanja Kroz Davanje — pomaganje drugima obogaćuje vaš život i financije', '61-90'),
  (68, 'Dan Zaštite Obitelji — osiguranje kao ključni element financijske sigurnosti', '61-90'),
  (69, 'Dan Samopouzdanja — prepoznajte napredak i vrijednost na putu do financijskog osnaživanja', '61-90'),
  (70, 'Dan Financijske Harmonije u Vezi — zajedničkim snagama ostvarite financijske ciljeve', '61-90'),
  (71, 'Dan Samodostatnosti — otkrijte snagu i mogućnosti kada ste dovoljni sami sebi', '61-90'),
  (72, 'Dan Strpljenja i Ustrajnosti — nastavite graditi financijsku budućnost korak po korak', '61-90'),
  (73, 'Dan Usredotočenosti — vaša financijska situacija slijedi vaš način razmišljanja', '61-90'),
  (74, 'Dan Istraživanja Investicija — oslobodite se ograničenja bankovnih kamata i preuzmite kontrolu', '61-90'),
  (75, 'Dan Velikodušnosti — širite blagostanje i osjetite radost pomažući drugima', '61-90'),
  (76, 'Dan Otvorenosti i Dijeljenja — oslobodite se straha od oskudice kroz velikodušnost', '61-90'),
  (77, 'Dan Davanja kao Promjena — velikodušnost oblikuje odnos prema sebi i drugima', '61-90'),
  (78, 'Dan Dobročinstva — otkrijte značaj dobročinstva u različitim fazama života', '61-90'),
  (79, 'Dan Moćnih Pitanja — promijenite unutarnji svijet i otvorite put prema financijskom uspjehu', '61-90'),
  (80, 'Dan Bezgraničnih Snova — oslobodite se ograničenja i zamislite život ispunjen radošću', '61-90'),
  (81, 'Dan Stvaranja Osjećaja Obilja — razvijte pozitivan odnos prema novcu i manifestirajte blagostanje', '61-90'),
  (82, 'Dan Dobrotvornog Djelovanja — pomažite drugima kroz ljubav i povjerenje', '61-90'),
  (83, 'Dan Promišljenog Ulaganja — otkrijte gdje i kako uložiti i povećati svoj novac', '61-90'),
  (84, 'Dan Preispitivanja Uvjerenja — stvorite pozitivan odnos prema novcu', '61-90'),
  (85, 'Dan Ravnoteže — stvorite harmoniju između posla, života i financijskog blagostanja', '61-90'),
  (86, 'Dan Dubokog Razumijevanja — usmjerite odluke prema onome što vas zaista ispunjava', '61-90'),
  (87, 'Dan Svjesnosti o Napretku — prepoznajte i cijenite svaki korak prema financijskoj stabilnosti', '61-90'),
  (88, 'Dan Slavlja Postignuća — proslavite ciljeve kroz radost i zajedništvo', '61-90'),
  (89, 'Dan Dosljednosti — održite fokus i nastavite raditi na ostvarenju financijskih ciljeva', '61-90'),
  (90, 'Završetak Edukacije — nastavite graditi financijsku stabilnost i osobni rast', '61-90')
) AS v(day_number, title, section)
WHERE c.slug = 'volim-svojnovac';

-- 4) Vstavi nakup za adminskega userja (Brane) da ga vidi kot tečaj
INSERT INTO purchases (user_id, course_id, amount_paid, status, purchased_at)
SELECT p.id, c.id, 0, 'completed', NOW()
FROM profiles p, courses c
WHERE p.email = 'brane.recek@gmail.com'
  AND c.slug = 'volim-svojnovac'
  AND NOT EXISTS (SELECT 1 FROM purchases pu WHERE pu.user_id = p.id AND pu.course_id = c.id);

-- 5) Vstavi affiliate zapis za Brane
INSERT INTO affiliates (user_id, code, commission_percent, is_active)
SELECT p.id, 'BRANE2026', 30, true
FROM profiles p
WHERE p.email = 'brane.recek@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM affiliates a WHERE a.user_id = p.id);

-- 6) Verify
SELECT 'LESSONS' as type, COUNT(*) as count FROM lessons
UNION ALL
SELECT 'COURSES', COUNT(*) FROM courses WHERE is_active = true
UNION ALL
SELECT 'AFFILIATES', COUNT(*) FROM affiliates
UNION ALL
SELECT 'PURCHASES (brane)', COUNT(*) FROM purchases pu JOIN profiles p ON p.id = pu.user_id WHERE p.email = 'brane.recek@gmail.com';
