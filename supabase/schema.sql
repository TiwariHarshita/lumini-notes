-- Run this entire file inside Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text default '',
  event_date date not null,
  start_time time,
  end_time time,
  color text default 'plum',
  created_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '',
  content text not null default '',
  color text not null default 'cream',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;
alter table public.notes enable row level security;

drop policy if exists "Users can read own events" on public.events;
drop policy if exists "Users can insert own events" on public.events;
drop policy if exists "Users can update own events" on public.events;
drop policy if exists "Users can delete own events" on public.events;

create policy "Users can read own events"
on public.events for select
using (auth.uid() = user_id);

create policy "Users can insert own events"
on public.events for insert
with check (auth.uid() = user_id);

create policy "Users can update own events"
on public.events for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own events"
on public.events for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read own notes" on public.notes;
drop policy if exists "Users can insert own notes" on public.notes;
drop policy if exists "Users can update own notes" on public.notes;
drop policy if exists "Users can delete own notes" on public.notes;

create policy "Users can read own notes"
on public.notes for select
using (auth.uid() = user_id);

create policy "Users can insert own notes"
on public.notes for insert
with check (auth.uid() = user_id);

create policy "Users can update own notes"
on public.notes for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own notes"
on public.notes for delete
using (auth.uid() = user_id);

create index if not exists events_user_date_idx on public.events(user_id, event_date);
create index if not exists notes_user_updated_idx on public.notes(user_id, updated_at desc);
