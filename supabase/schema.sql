-- Tekken Battle League schema for Supabase PostgreSQL
-- Run this in the Supabase SQL editor

create extension if not exists "pgcrypto";

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  player1_id uuid not null references players(id),
  player2_id uuid not null references players(id),
  player1_character text not null,
  player2_character text not null,
  winner_id uuid not null references players(id),
  loser_id uuid not null references players(id),
  comment text,
  created_at timestamptz not null default now(),
  constraint different_players check (player1_id <> player2_id),
  constraint winner_is_participant check (winner_id = player1_id or winner_id = player2_id),
  constraint loser_is_participant check (loser_id = player1_id or loser_id = player2_id),
  constraint winner_loser_different check (winner_id <> loser_id)
);

create index if not exists matches_created_at_idx on matches (created_at desc);
create index if not exists matches_winner_id_idx on matches (winner_id);
create index if not exists matches_loser_id_idx on matches (loser_id);
create index if not exists matches_player1_id_idx on matches (player1_id);
create index if not exists matches_player2_id_idx on matches (player2_id);

insert into players (name)
values
  ('Sumit'),
  ('Gourav'),
  ('Jay'),
  ('Shubham'),
  ('Sarvadhnaya')
on conflict (name) do nothing;
