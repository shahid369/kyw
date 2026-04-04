-- ============================================================
-- KYW — Know Your Women: Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  partner_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can delete own profile"
  on profiles for delete
  using (auth.uid() = id);

-- ============================================================
-- CYCLES TABLE
-- ============================================================
create table if not exists cycles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  start_date date not null,
  end_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists cycles_user_id_idx on cycles(user_id);
create index if not exists cycles_start_date_idx on cycles(start_date desc);

-- RLS
alter table cycles enable row level security;

create policy "Users can view own cycles"
  on cycles for select
  using (auth.uid() = user_id);

create policy "Users can insert own cycles"
  on cycles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own cycles"
  on cycles for update
  using (auth.uid() = user_id);

create policy "Users can delete own cycles"
  on cycles for delete
  using (auth.uid() = user_id);

-- ============================================================
-- SYMPTOMS TABLE
-- ============================================================
create table if not exists symptoms (
  id uuid primary key default uuid_generate_v4(),
  cycle_id uuid not null references cycles(id) on delete cascade,
  date date not null,
  type text not null,  -- cramps, mood, headache, bloating, fatigue, flow_light, flow_medium, flow_heavy
  severity integer not null check (severity >= 1 and severity <= 5),
  created_at timestamptz default now()
);

create index if not exists symptoms_cycle_id_idx on symptoms(cycle_id);
create index if not exists symptoms_date_idx on symptoms(date desc);

-- RLS: derive user_id through cycles
alter table symptoms enable row level security;

create policy "Users can view own symptoms"
  on symptoms for select
  using (
    exists (
      select 1 from cycles
      where cycles.id = symptoms.cycle_id
        and cycles.user_id = auth.uid()
    )
  );

create policy "Users can insert own symptoms"
  on symptoms for insert
  with check (
    exists (
      select 1 from cycles
      where cycles.id = symptoms.cycle_id
        and cycles.user_id = auth.uid()
    )
  );

create policy "Users can delete own symptoms"
  on symptoms for delete
  using (
    exists (
      select 1 from cycles
      where cycles.id = symptoms.cycle_id
        and cycles.user_id = auth.uid()
    )
  );

-- ============================================================
-- AUTO-CREATE PROFILE TRIGGER
-- Ensures a profile row always exists as soon as a user is
-- created in auth.users, preventing FK violations on cycles.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, partner_name)
  values (new.id, '', '')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
