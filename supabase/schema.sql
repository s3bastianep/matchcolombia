-- HABIBAR — Backend Supabase (opcional)
-- Ejecuta este archivo en: Supabase Dashboard → SQL Editor → New query → Run

-- ─── Perfiles de usuario ───────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  name text not null default '',
  role text not null default 'seeker',
  display_email text default '',
  auth_email text not null,
  created_at timestamptz not null default now()
);

create index if not exists profiles_username_idx on public.profiles (username);

-- ─── Registros de la app (propiedades, visitas, leads, etc.) ───────────────
create table if not exists public.app_records (
  entity_type text not null,
  id text not null,
  record jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (entity_type, id)
);

create index if not exists app_records_entity_idx on public.app_records (entity_type);
create index if not exists app_records_property_status_idx
  on public.app_records ((record->>'status'))
  where entity_type = 'property';

-- ─── Perfil automático al registrarse ──────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, name, role, display_email, auth_email)
  values (
    new.id,
    lower(trim(coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)))),
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'seeker'),
    coalesce(new.raw_user_meta_data->>'display_email', ''),
    new.email
  )
  on conflict (id) do update set
    name = excluded.name,
    role = excluded.role,
    display_email = excluded.display_email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── RPC: login por nombre de usuario (sin exponer tabla profiles) ─────────
create or replace function public.get_auth_email(p_username text)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select auth_email
  from public.profiles
  where username = lower(trim(p_username))
  limit 1;
$$;

create or replace function public.username_exists(p_username text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(
    select 1 from public.profiles where username = lower(trim(p_username))
  );
$$;

grant execute on function public.get_auth_email(text) to anon, authenticated;
grant execute on function public.username_exists(text) to anon, authenticated;

-- ─── RLS ───────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.app_records enable row level security;

-- Perfiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

-- Propiedades publicadas visibles para todos
drop policy if exists "anon_read_published_properties" on public.app_records;
create policy "anon_read_published_properties" on public.app_records
  for select to anon
  using (
    entity_type = 'property'
    and (record->>'publication_status') = 'publicada'
    and (record->>'status') = 'disponible'
  );

-- Visitas y leads desde la web pública
drop policy if exists "anon_insert_leads" on public.app_records;
create policy "anon_insert_leads" on public.app_records
  for insert to anon
  with check (entity_type in ('visit', 'inquiry', 'message'));

-- Usuarios autenticados: acceso completo (admin, propietario, inquilino)
drop policy if exists "auth_manage_records" on public.app_records;
create policy "auth_manage_records" on public.app_records
  for all to authenticated
  using (true)
  with check (true);

-- ─── Storage: fotos y documentos ───────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit)
values ('uploads', 'uploads', true, 10485760)
on conflict (id) do update set public = true, file_size_limit = 10485760;

drop policy if exists "uploads_public_read" on storage.objects;
create policy "uploads_public_read" on storage.objects
  for select using (bucket_id = 'uploads');

drop policy if exists "uploads_insert" on storage.objects;
create policy "uploads_insert" on storage.objects
  for insert with check (bucket_id = 'uploads');

drop policy if exists "uploads_update_auth" on storage.objects;
create policy "uploads_update_auth" on storage.objects
  for update to authenticated using (bucket_id = 'uploads');

-- ─── Fin ───────────────────────────────────────────────────────────────────
-- Después de ejecutar este SQL, corre: npm run seed:supabase
-- (requiere SUPABASE_SERVICE_ROLE_KEY en .env.local)
