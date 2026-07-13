-- ============================================================
-- Pakkia — 0002_data_api_grants.sql  (Data API table grants)
-- Review, then run in Supabase SQL editor. Idempotent-safe.
--
-- 0001 enables Row Level Security and defines the policies, but RLS only
-- decides *which rows* a role may see — PostgREST (the Data API) still needs
-- table-level GRANTs or every request is denied before any policy is even
-- evaluated. New Supabase projects no longer auto-expose tables created in
-- `public` (the old default), so without these grants signed-in reads such as
-- `getSessionProfile()` fail with "permission denied for table profiles",
-- which strands a just-authenticated user back on /login.
--
-- Least privilege: only the `authenticated` role (a real signed-in user) and
-- `service_role` get row CRUD; the RLS policies from 0001 remain the row-level
-- guard. `anon` is intentionally NOT granted table access — no policy exposes
-- any row to anonymous callers, and the auth pages never query these tables
-- while signed out.
-- ============================================================

grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on public.profiles      to authenticated, service_role;
grant select, insert, update, delete on public.tenants       to authenticated, service_role;
grant select, insert, update, delete on public.notifications to authenticated, service_role;
