create extension if not exists "pgcrypto";

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  manager_name text not null,
  manager_email text not null,
  invite_code text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  name text not null,
  email text not null,
  is_manager boolean not null default false,
  red_score integer not null default 0,
  yellow_score integer not null default 0,
  green_score integer not null default 0,
  blue_score integer not null default 0,
  x_coord numeric not null default 0,
  y_coord numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete cascade,
  question_id integer not null,
  answer_value integer not null,
  color text not null check (color in ('Red', 'Yellow', 'Green', 'Blue')),
  created_at timestamptz not null default now()
);

create index if not exists participants_team_id_idx on public.participants(team_id);
create index if not exists responses_participant_id_idx on public.responses(participant_id);
