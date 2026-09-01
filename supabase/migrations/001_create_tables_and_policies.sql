-- supabase/migrations/001_create_tables_and_policies.sql

-- Enable pgcrypto for gen_random_uuid()
create extension if not exists "pgcrypto";

-- users table is provided by Supabase auth schema (auth.users)

-- profiles
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  display_name text,
  email text,
  avatar_path text,
  education_level text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- user_preferences
create table if not exists user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  theme text,
  default_note_color text,
  default_subject_id uuid,
  dashboard_preferences jsonb,
  study_preferences jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- subjects
create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  description text,
  accent text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- notes
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  subject_id uuid,
  title text,
  color text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint notes_user_fk foreign key (user_id) references auth.users (id) on delete cascade,
  constraint notes_subject_fk foreign key (subject_id) references subjects (id) on delete set null
);

-- note_blocks
create table if not exists note_blocks (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null,
  user_id uuid not null,
  block_type text not null,
  content jsonb,
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint nb_note_fk foreign key (note_id) references notes (id) on delete cascade
);

-- research
create table if not exists research (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  subject_id uuid,
  title text,
  description text,
  content jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint research_user_fk foreign key (user_id) references auth.users (id) on delete cascade,
  constraint research_subject_fk foreign key (subject_id) references subjects (id) on delete set null
);

-- sources
create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  research_id uuid not null,
  title text,
  url text,
  publication text,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint sources_research_fk foreign key (research_id) references research (id) on delete cascade
);

-- work_projects
create table if not exists work_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  subject_id uuid,
  title text,
  description text,
  content jsonb,
  status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint wp_subject_fk foreign key (subject_id) references subjects (id) on delete set null
);

-- formulas
create table if not exists formulas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  subject_id uuid,
  name text,
  formula text,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- calendar_events
create table if not exists calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  subject_id uuid,
  title text,
  event_type text,
  date date,
  time time,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- reminders
create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text,
  description text,
  due_at timestamptz,
  completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- study_sessions
create table if not exists study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  subject_id uuid,
  started_at timestamptz,
  ended_at timestamptz,
  duration int,
  created_at timestamptz default now()
);

-- favorites
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  item_type text,
  item_id uuid,
  created_at timestamptz default now()
);

-- Foreign keys where appropriate
alter table user_preferences add constraint up_user_fk foreign key (user_id) references auth.users (id) on delete cascade;
alter table subjects add constraint subjects_user_fk foreign key (user_id) references auth.users (id) on delete cascade;
alter table note_blocks add constraint nb_user_fk foreign key (user_id) references auth.users (id) on delete cascade;
alter table sources add constraint sources_user_fk foreign key (user_id) references auth.users (id) on delete cascade;
alter table work_projects add constraint wp_user_fk foreign key (user_id) references auth.users (id) on delete cascade;
alter table formulas add constraint formulas_user_fk foreign key (user_id) references auth.users (id) on delete cascade;
alter table calendar_events add constraint ce_user_fk foreign key (user_id) references auth.users (id) on delete cascade;
alter table reminders add constraint reminders_user_fk foreign key (user_id) references auth.users (id) on delete cascade;
alter table study_sessions add constraint ss_user_fk foreign key (user_id) references auth.users (id) on delete cascade;
alter table favorites add constraint favorites_user_fk foreign key (user_id) references auth.users (id) on delete cascade;

-- Enable Row Level Security and policies

-- profiles RLS
alter table profiles enable row level security;
create policy profiles_select_own on profiles for select using (user_id = auth.uid());
create policy profiles_insert_own on profiles for insert with check (user_id = auth.uid());
create policy profiles_update_own on profiles for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy profiles_delete_own on profiles for delete using (user_id = auth.uid());

-- user_preferences RLS
alter table user_preferences enable row level security;
create policy up_select_own on user_preferences for select using (user_id = auth.uid());
create policy up_insert_own on user_preferences for insert with check (user_id = auth.uid());
create policy up_update_own on user_preferences for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy up_delete_own on user_preferences for delete using (user_id = auth.uid());

-- subjects RLS
alter table subjects enable row level security;
create policy subjects_select_own on subjects for select using (user_id = auth.uid());
create policy subjects_insert_own on subjects for insert with check (user_id = auth.uid());
create policy subjects_update_own on subjects for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy subjects_delete_own on subjects for delete using (user_id = auth.uid());

-- notes RLS
alter table notes enable row level security;
create policy notes_select_own on notes for select using (user_id = auth.uid());
create policy notes_insert_own on notes for insert with check (user_id = auth.uid());
create policy notes_update_own on notes for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy notes_delete_own on notes for delete using (user_id = auth.uid());

-- note_blocks RLS (ensure the note belongs to the user as well)
alter table note_blocks enable row level security;
create policy nb_select_own on note_blocks for select using (user_id = auth.uid());
create policy nb_insert_own on note_blocks for insert with check (user_id = auth.uid());
create policy nb_update_own on note_blocks for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy nb_delete_own on note_blocks for delete using (user_id = auth.uid());

-- research & sources RLS
alter table research enable row level security;
create policy research_select_own on research for select using (user_id = auth.uid());
create policy research_insert_own on research for insert with check (user_id = auth.uid());
create policy research_update_own on research for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy research_delete_own on research for delete using (user_id = auth.uid());

alter table sources enable row level security;
create policy sources_select_own on sources for select using (user_id = auth.uid());
create policy sources_insert_own on sources for insert with check (user_id = auth.uid());
create policy sources_update_own on sources for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy sources_delete_own on sources for delete using (user_id = auth.uid());

-- other tables RLS: work_projects, formulas, calendar_events, reminders, study_sessions, favorites
alter table work_projects enable row level security;
create policy wp_select_own on work_projects for select using (user_id = auth.uid());
create policy wp_insert_own on work_projects for insert with check (user_id = auth.uid());
create policy wp_update_own on work_projects for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy wp_delete_own on work_projects for delete using (user_id = auth.uid());

alter table formulas enable row level security;
create policy formulas_select_own on formulas for select using (user_id = auth.uid());
create policy formulas_insert_own on formulas for insert with check (user_id = auth.uid());
create policy formulas_update_own on formulas for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy formulas_delete_own on formulas for delete using (user_id = auth.uid());

alter table calendar_events enable row level security;
create policy ce_select_own on calendar_events for select using (user_id = auth.uid());
create policy ce_insert_own on calendar_events for insert with check (user_id = auth.uid());
create policy ce_update_own on calendar_events for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy ce_delete_own on calendar_events for delete using (user_id = auth.uid());

alter table reminders enable row level security;
create policy reminders_select_own on reminders for select using (user_id = auth.uid());
create policy reminders_insert_own on reminders for insert with check (user_id = auth.uid());
create policy reminders_update_own on reminders for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy reminders_delete_own on reminders for delete using (user_id = auth.uid());

alter table study_sessions enable row level security;
create policy ss_select_own on study_sessions for select using (user_id = auth.uid());
create policy ss_insert_own on study_sessions for insert with check (user_id = auth.uid());
create policy ss_update_own on study_sessions for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy ss_delete_own on study_sessions for delete using (user_id = auth.uid());

alter table favorites enable row level security;
create policy fav_select_own on favorites for select using (user_id = auth.uid());
create policy fav_insert_own on favorites for insert with check (user_id = auth.uid());
create policy fav_update_own on favorites for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy fav_delete_own on favorites for delete using (user_id = auth.uid());

-- Indexes
create index if not exists idx_notes_user_id on notes (user_id);
create index if not exists idx_note_blocks_note_id on note_blocks (note_id);
create index if not exists idx_research_user_id on research (user_id);
