-- Zaženi v Supabase SQL Editor da vidiš dejanske GRANT-e
SELECT grantee, privilege_type, table_name
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('affiliates', 'purchases', 'notes', 'lessons', 'profiles', 'leads', 'affiliate_conversions', 'progress')
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY table_name, grantee, privilege_type;
