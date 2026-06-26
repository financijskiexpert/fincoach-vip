-- KRITIČEN POPRAVEK: service_role je izgubil dovoljenja za vse tabele
-- To je razlog, zakaj admin panel kaže 0 lekcij, checkout ne najde tečaja, itd.

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Zagotovi tudi za prihodnje tabele
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;

-- Anon vloga (za public-facing brez login - npr. blog, course listing)
GRANT SELECT ON public.courses TO anon;
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT ON public.coupons TO anon;
GRANT SELECT ON public.affiliates TO anon;

-- Authenticated vloga (RLS še vedno velja)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
GRANT INSERT, UPDATE ON public.progress TO authenticated;
GRANT INSERT ON public.leads TO authenticated;
