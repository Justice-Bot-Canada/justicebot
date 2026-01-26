-- Migration: triage, recommendations, timeline, audit, forms
-- Date: 2026-01-26

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Audit events
create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  entity_type text,
  entity_id uuid,
  actor_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Triage sessions
create table if not exists triage_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  status text default 'open',
  input jsonb not null,
  created_at timestamptz default now()
);

-- Recommendations
create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  triage_id uuid references triage_sessions(id) on delete cascade,
  recommendation_type text not null,
  payload jsonb not null,
  created_at timestamptz default now()
);

-- Case timeline steps
create table if not exists case_timeline_steps (
  id uuid primary key default gen_random_uuid(),
  case_id uuid,
  step_key text not null,
  step_label text not null,
  step_order integer not null,
  created_at timestamptz default now()
);

-- Form sources (official govt sources)
create table if not exists form_sources (
  id uuid primary key default gen_random_uuid(),
  jurisdiction text not null,
  authority text not null,
  source_url text not null,
  last_checked_at timestamptz,
  created_at timestamptz default now()
);

-- Form templates (linked to sources)
create table if not exists document_templates (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references form_sources(id) on delete set null,
  form_code text not null,
  title text not null,
  jurisdiction text not null,
  template_type text not null,
  version text,
  created_at timestamptz default now()
);
