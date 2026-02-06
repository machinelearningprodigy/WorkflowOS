-- Workflows Table
-- Stores the high-level metadata for automation workflows
create table public.workflows (
  id uuid default uuid_generate_v4() primary key,
  -- Link to profile instead of direct auth.users for consistency with our app model
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  name text not null,
  description text,
  is_active boolean default false,
  
  -- The visual definition of the workflow (nodes, edges, viewport)
  -- We store this as JSONB to allow flexibility for the React Flow graph structure
  definition jsonb default '{}'::jsonb,
  
  -- Execution settings
  execution_plan jsonb default '[]'::jsonb, -- Compiled linear execution steps for faster processing
  retry_policy jsonb default '{"max_retries": 3, "backoff": "exponential"}'::jsonb,
  
  -- Timestamps
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_run_at timestamp with time zone
);

-- RLS for Workflows
alter table public.workflows enable row level security;
create policy "Users can view own workflows" on public.workflows for select using (auth.uid() = user_id);
create policy "Users can update own workflows" on public.workflows for update using (auth.uid() = user_id);
create policy "Users can insert own workflows" on public.workflows for insert with check (auth.uid() = user_id);
create policy "Users can delete own workflows" on public.workflows for delete using (auth.uid() = user_id);


-- Workflow Runs Table
-- Logs every execution instance of a workflow
create table public.workflow_runs (
  id uuid default uuid_generate_v4() primary key,
  workflow_id uuid references public.workflows(id) on delete cascade not null,
  
  status text not null check (status in ('pending', 'running', 'completed', 'failed', 'cancelled')),
  trigger_type text not null, -- 'manual', 'webhook', 'schedule'
  
  -- Inputs and Outputs
  input_data jsonb default '{}'::jsonb,
  output_data jsonb default '{}'::jsonb,
  error_details jsonb, -- Stores error message, stack trace, etc.
  
  -- Performance metrics
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  duration_ms integer, -- Calculated duration in milliseconds
  
  -- Execution metadata
  metadata jsonb default '{}'::jsonb -- Stores user_agent, ip, or execution context
);

-- RLS for Workflow Runs
alter table public.workflow_runs enable row level security;
create policy "Users can view runs of own workflows" on public.workflow_runs for select using (
  exists (select 1 from public.workflows where id = workflow_runs.workflow_id and user_id = auth.uid())
);
-- Runs are usually created by the system/worker, but if a user triggers one manually via API, they might need insert
create policy "Users can execute own workflows" on public.workflow_runs for insert with check (
  exists (select 1 from public.workflows where id = workflow_runs.workflow_id and user_id = auth.uid())
);


-- Workflow Run Steps (Logs)
-- Detailed logs for every step inside a workflow run
create table public.workflow_run_steps (
  id uuid default uuid_generate_v4() primary key,
  run_id uuid references public.workflow_runs(id) on delete cascade not null,
  node_id text not null, -- The ID of the node in the React Flow graph
  node_type text not null, -- 'action', 'trigger', 'condition', 'loop'
  
  status text not null check (status in ('pending', 'running', 'completed', 'failed', 'skipped')),
  
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  duration_ms integer,
  
  input_context jsonb, -- The data available to this step at runtime
  output_context jsonb, -- The result produced by this step
  error_message text
);

-- RLS for Run Steps
alter table public.workflow_run_steps enable row level security;
create policy "Users can view steps of own runs" on public.workflow_run_steps for select using (
  exists (
    select 1 from public.workflow_runs 
    join public.workflows on workflow_runs.workflow_id = workflows.id
    where workflow_runs.id = workflow_run_steps.run_id 
    and workflows.user_id = auth.uid()
  )
);


-- Triggers Table
-- Defines how workflows are auto-triggered (Webhooks, Schedules, Events)
create table public.workflow_triggers (
  id uuid default uuid_generate_v4() primary key,
  workflow_id uuid references public.workflows(id) on delete cascade not null,
  
  type text not null check (type in ('webhook', 'schedule', 'event')),
  config jsonb not null default '{}'::jsonb, 
  -- For webhooks: { "method": "POST", "path": "/uuid" }
  -- For schedule: { "cron": "0 0 * * *" }
  
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Triggers
alter table public.workflow_triggers enable row level security;
create policy "Users can view triggers of own workflows" on public.workflow_triggers for select using (
  exists (select 1 from public.workflows where id = workflow_triggers.workflow_id and user_id = auth.uid())
);
create policy "Users can manage triggers of own workflows" on public.workflow_triggers for all using (
  exists (select 1 from public.workflows where id = workflow_triggers.workflow_id and user_id = auth.uid())
);


-- Templates Table
-- Public templates that can be cloned
create table public.workflow_templates (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  category text, -- 'Marketing', 'DevOps', 'Productivity'
  
  definition jsonb not null, -- The workflow structure
  tags text[],
  author_name text,
  
  is_public boolean default true,
  clones_count integer default 0,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Templates
alter table public.workflow_templates enable row level security;
create policy "Everyone can view public templates" on public.workflow_templates for select using (is_public = true);


-- Indexes for Performance
create index workflows_user_id_idx on public.workflows(user_id);
create index workflow_runs_workflow_id_idx on public.workflow_runs(workflow_id);
create index workflow_runs_status_idx on public.workflow_runs(status);
create index workflow_runs_started_at_idx on public.workflow_runs(started_at desc);
create index run_steps_run_id_idx on public.workflow_run_steps(run_id);
create index triggers_workflow_id_idx on public.workflow_triggers(workflow_id);

-- Updated_at Trigger
create trigger update_workflows_updated_at
  before update on public.workflows
  for each row execute procedure update_updated_at_column();

create trigger update_workflow_triggers_updated_at
  before update on public.workflow_triggers
  for each row execute procedure update_updated_at_column();
