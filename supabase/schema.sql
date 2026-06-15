create extension if not exists pgcrypto;
create table if not exists public.domain_scans (id uuid primary key default gen_random_uuid(), domain text not null, score integer not null check (score between 0 and 100), grade text not null, results jsonb not null, created_at timestamptz not null default now());
create index if not exists domain_scans_domain_created_idx on public.domain_scans (domain, created_at desc);
alter table public.domain_scans enable row level security;
-- The backend uses the service role. Add authenticated-user policies when accounts are introduced.
