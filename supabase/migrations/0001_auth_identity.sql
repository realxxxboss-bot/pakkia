-- ============================================================
-- Pakkia — 0001_auth_identity.sql  (auth + identity backbone)
-- Review, then run in Supabase SQL editor. Idempotent-safe.
-- ============================================================

-- 1) ENUMS ---------------------------------------------------
do $$ begin
  create type user_role as enum ('super_admin','tenant_admin','power_user','pitch_holder');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_status as enum ('pending','active','suspended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tenant_status as enum ('trial','active','suspended');
exception when duplicate_object then null; end $$;

-- 2) updated_at helper --------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- 3) TENANTS (campsites) ------------------------------------
create table if not exists public.tenants (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  status      tenant_status not null default 'active',
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
drop trigger if exists trg_tenants_updated on public.tenants;
create trigger trg_tenants_updated before update on public.tenants
  for each row execute function public.set_updated_at();

-- 4) PROFILES (one row per auth user) -----------------------
create table if not exists public.profiles (
  id                       uuid primary key references auth.users(id) on delete cascade,
  email                    text not null,
  full_name                text,
  role                     user_role   not null default 'tenant_admin',
  status                   user_status not null default 'pending',
  tenant_id                uuid references public.tenants(id) on delete set null,
  requested_campsite_name  text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);
drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- 5) NOTIFICATIONS (realtime) -------------------------------
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  tenant_id   uuid references public.tenants(id) on delete cascade,
  type        text not null default 'info',
  title       text not null,
  body        text,
  link        text,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists idx_notifications_user on public.notifications(user_id, is_read, created_at desc);

-- 6) SIGNUP TRIGGER: 1st signup = super_admin(active),
--    every later signup = tenant_admin(pending approval) ----
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare cnt int;
begin
  select count(*) into cnt from public.profiles;
  if cnt = 0 then
    insert into public.profiles (id, email, full_name, role, status)
    values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'super_admin', 'active');
  else
    insert into public.profiles (id, email, full_name, role, status, requested_campsite_name)
    values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'tenant_admin', 'pending',
            new.raw_user_meta_data->>'campsite_name');
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 7) RLS helper functions (SECURITY DEFINER = no recursion) --
create or replace function public.auth_role() returns user_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.auth_tenant() returns uuid
language sql stable security definer set search_path = public as $$
  select tenant_id from public.profiles where id = auth.uid();
$$;

-- 8) RLS -----------------------------------------------------
alter table public.tenants        enable row level security;
alter table public.profiles       enable row level security;
alter table public.notifications  enable row level security;

-- PROFILES
drop policy if exists profiles_select_own    on public.profiles;
drop policy if exists profiles_select_super  on public.profiles;
drop policy if exists profiles_select_tenant on public.profiles;
drop policy if exists profiles_update_own    on public.profiles;
drop policy if exists profiles_update_super  on public.profiles;

create policy profiles_select_own on public.profiles
  for select using (id = auth.uid());
create policy profiles_select_super on public.profiles
  for select using (public.auth_role() = 'super_admin');
create policy profiles_select_tenant on public.profiles
  for select using (public.auth_role() = 'tenant_admin' and tenant_id = public.auth_tenant());
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_update_super on public.profiles
  for update using (public.auth_role() = 'super_admin');

-- TENANTS
drop policy if exists tenants_select_member on public.tenants;
drop policy if exists tenants_select_super  on public.tenants;
drop policy if exists tenants_all_super      on public.tenants;

create policy tenants_select_member on public.tenants
  for select using (id = public.auth_tenant());
create policy tenants_select_super on public.tenants
  for select using (public.auth_role() = 'super_admin');
create policy tenants_all_super on public.tenants
  for all using (public.auth_role() = 'super_admin')
  with check (public.auth_role() = 'super_admin');

-- NOTIFICATIONS (user reads/marks own; super admin can read all)
drop policy if exists notif_select_own   on public.notifications;
drop policy if exists notif_update_own    on public.notifications;
drop policy if exists notif_select_super  on public.notifications;

create policy notif_select_own on public.notifications
  for select using (user_id = auth.uid());
create policy notif_update_own on public.notifications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy notif_select_super on public.notifications
  for select using (public.auth_role() = 'super_admin');

-- 9) REALTIME (live notifications + live super-admin updates) -
do $$ begin alter publication supabase_realtime add table public.notifications; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.profiles;      exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.tenants;       exception when others then null; end $$;