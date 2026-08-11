-- DerivLens — initial schema
-- Run via: npx supabase db push   (or paste into the Supabase SQL editor)

create extension if not exists "pgcrypto";

-- ── profiles ──────────────────────────────────────────────────────
-- One row per auth.users row, created automatically on signup.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.profiles enable row level security;

create policy "profiles are self-readable"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles are self-updatable"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── deriv_connections ─────────────────────────────────────────────
-- One row per linked Deriv login (a user may link several accounts:
-- demo + real, multi-currency, etc). Tokens are stored encrypted at
-- the application layer (ENCRYPTION_KEY) — never store Deriv tokens
-- in plaintext even though RLS restricts row access.
create table if not exists public.deriv_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  deriv_loginid text not null,
  currency text not null,
  is_virtual boolean not null default true,
  access_token_encrypted text not null,
  scopes text[] not null default '{}',
  connected_at timestamptz not null default now(),
  last_used_at timestamptz,
  revoked_at timestamptz,
  unique (user_id, deriv_loginid)
);

alter table public.deriv_connections enable row level security;

create policy "connections are owner-only"
  on public.deriv_connections for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists deriv_connections_user_id_idx
  on public.deriv_connections (user_id)
  where revoked_at is null;

-- ── digit_sessions ────────────────────────────────────────────────
-- A saved analyzer session: which symbol/contract was being watched,
-- summary stats snapshot, so a user can review past sessions.
create table if not exists public.digit_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  connection_id uuid references public.deriv_connections (id) on delete set null,
  symbol text not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  tick_count integer not null default 0,
  summary jsonb not null default '{}'::jsonb,
  deleted_at timestamptz
);

alter table public.digit_sessions enable row level security;

create policy "sessions are owner-only"
  on public.digit_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists digit_sessions_user_id_started_at_idx
  on public.digit_sessions (user_id, started_at desc);

-- ── updated_at trigger helper ─────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
