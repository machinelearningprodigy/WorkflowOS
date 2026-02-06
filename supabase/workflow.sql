-- Organizations Table (Core for multi-tenancy)
create table if not exists public.organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  logo_url text,
  billing_plan text default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Organization Members
create table if not exists public.organization_members (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text check (role in ('owner', 'admin', 'member')) default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(organization_id, user_id)
);

-- Workflows Table
create table if not exists public.workflows (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- We add organization_id and status via idempotent ALTERs below to handle existing tables
  name text not null,
  description text,
  is_active boolean default false,
  
  definition jsonb default '{"nodes": [], "edges": []}'::jsonb,
  execution_plan jsonb default '[]'::jsonb,
  retry_policy jsonb default '{"max_retries": 3, "backoff": "exponential"}'::jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_run_at timestamp with time zone
);

-- Idempotent Updates for Workflows
do $$
begin
    -- Add status column
    if not exists (select 1 from information_schema.columns where table_name = 'workflows' and column_name = 'status') then
        alter table public.workflows add column status text check (status in ('draft', 'active', 'paused')) default 'draft';
    end if;

    -- Add organization_id column
    if not exists (select 1 from information_schema.columns where table_name = 'workflows' and column_name = 'organization_id') then
        alter table public.workflows add column organization_id uuid references public.organizations(id) on delete set null;
    end if;
end $$;


-- Workflow Runs Table
create table if not exists public.workflow_runs (
  id uuid default uuid_generate_v4() primary key,
  workflow_id uuid references public.workflows(id) on delete cascade not null,
  
  status text not null check (status in ('pending', 'running', 'completed', 'failed', 'cancelled')),
  trigger_type text not null, 
  
  input_data jsonb default '{}'::jsonb,
  output_data jsonb default '{}'::jsonb,
  error_details jsonb,
  
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  duration_ms integer, 
  
  metadata jsonb default '{}'::jsonb
);

-- Idempotent Updates for Workflow Runs
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'workflow_runs' and column_name = 'organization_id') then
        alter table public.workflow_runs add column organization_id uuid references public.organizations(id) on delete set null;
    end if;
end $$;


-- Workflow Run Steps
create table if not exists public.workflow_run_steps (
  id uuid default uuid_generate_v4() primary key,
  run_id uuid references public.workflow_runs(id) on delete cascade not null,
  
  node_id text not null, 
  node_type text not null,
  
  status text not null check (status in ('pending', 'running', 'completed', 'failed', 'skipped')),
  
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  duration_ms integer,
  
  input_context jsonb,
  output_context jsonb,
  error_message text
);

-- Idempotent Updates for Workflow Run Steps
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'workflow_run_steps' and column_name = 'connection_id') then
        alter table public.workflow_run_steps add column connection_id uuid references public.connections(id) on delete set null;
    end if;
end $$;


-- Triggers
create table if not exists public.workflow_triggers (
  id uuid default uuid_generate_v4() primary key,
  workflow_id uuid references public.workflows(id) on delete cascade not null,
  type text not null check (type in ('webhook', 'schedule', 'event')),
  config jsonb not null default '{}'::jsonb, 
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Templates
create table if not exists public.workflow_templates (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  category text,
  definition jsonb not null,
  tags text[],
  author_name text,
  is_public boolean default true,
  clones_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS & Policies
alter table public.organizations enable row level security;
alter table public.workflows enable row level security;
alter table public.workflow_runs enable row level security;
alter table public.workflow_run_steps enable row level security;
alter table public.workflow_triggers enable row level security;
alter table public.workflow_templates enable row level security;

-- Drop existing policies to avoid conflict before recreating
drop policy if exists "Members can view own organizations" on public.organizations;
create policy "Members can view own organizations" on public.organizations
  for select using (
    exists (
      select 1 from public.organization_members 
      where organization_id = public.organizations.id 
      and user_id = auth.uid()
    )
  );

drop policy if exists "Users can view own/org workflows" on public.workflows;
create policy "Users can view own/org workflows" on public.workflows for select 
  using (auth.uid() = user_id or organization_id in (select organization_id from public.organization_members where user_id = auth.uid()));

drop policy if exists "Users can modify own/org workflows" on public.workflows;
create policy "Users can modify own/org workflows" on public.workflows for all
  using (auth.uid() = user_id or organization_id in (select organization_id from public.organization_members where user_id = auth.uid() and role in ('owner', 'admin')));

-- Indexes (Idempotent)
create index if not exists workflows_user_id_idx on public.workflows(user_id);
create index if not exists workflows_org_id_idx on public.workflows(organization_id);
create index if not exists workflow_runs_workflow_id_idx on public.workflow_runs(workflow_id);
create index if not exists workflow_runs_status_idx on public.workflow_runs(status);
create index if not exists workflow_run_steps_connection_id_idx on public.workflow_run_steps(connection_id);

-- Triggers
-- Safely drop before creating or replace
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists update_workflows_updated_at on public.workflows;
create trigger update_workflows_updated_at
  before update on public.workflows
  for each row execute procedure update_updated_at_column();
