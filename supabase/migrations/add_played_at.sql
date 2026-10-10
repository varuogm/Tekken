-- Tekken Battle League: add battle date (played_at) to existing databases
-- Run once in Supabase → SQL Editor (safe to re-run)

alter table public.matches
  add column if not exists played_at date;

update public.matches
set played_at = (created_at at time zone 'utc')::date
where played_at is null;

alter table public.matches
  alter column played_at set default (current_date);

alter table public.matches
  alter column played_at set not null;

create index if not exists matches_played_at_idx
  on public.matches (played_at desc);
