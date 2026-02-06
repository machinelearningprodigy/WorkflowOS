-- INTEGRATION PROVIDERS (System Catalog)
-- Lists all supported services (e.g. Google Drive, Slack, Notion) available in the platform
create table if not exists public.integration_providers (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null, -- e.g. 'google-calendar', 'slack', 'notion'
  name text not null, -- e.g. 'Google Calendar'
  description text,
  logo_url text,
  docs_url text,
  
  -- Auth definition
  auth_type text check (auth_type in ('oauth2', 'api_key', 'basic')),
  default_scopes text[], -- Default scopes required for this provider
  
  is_active boolean default true,
  is_beta boolean default false,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Providers
alter table public.integration_providers enable row level security;
-- Public/Authenticated users can view available providers
drop policy if exists "Users can view active providers" on public.integration_providers;
create policy "Users can view active providers" 
  on public.integration_providers for select 
  using (is_active = true);


-- CONNECTIONS (User Credentials)
-- Stores the actual authenticated sessions/credentials for a user's integration
create table if not exists public.connections (
  id uuid default uuid_generate_v4() primary key,
  
  -- Link to User
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Link to Provider
  provider_slug text references public.integration_providers(slug) on delete restrict not null,
  
  -- Friendly name (e.g. "Work Gmail", "Private Notion")
  display_name text not null,
  
  -- Credentials (Encrypted at App Layer)
  -- IMPORTANT: These columns store sensitive data. The application MUST encrypt these values before inserting.
  access_token text,
  refresh_token text,
  api_key text,
  
  -- Token Management
  expires_at timestamp with time zone,
  scopes text[], -- The actual scopes granted by the user in this session
  token_type text, -- 'Bearer', etc.
  
  -- Account Metadata (Fetched from the provider)
  -- Stores info like account_email, avatar_url, workspace_id, etc.
  account_id text, -- The provider's unique ID for this user/account
  client_id text, -- For custom OAuth credentials
  client_secret text, -- For custom OAuth credentials
  profile_data jsonb default '{}'::jsonb,
  
  -- Status
  status text check (status in ('connected', 'disconnected', 'expired', 'error')) default 'connected',
  last_used_at timestamp with time zone,
  error_message text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Connections
alter table public.connections enable row level security;

drop policy if exists "Users can view own connections" on public.connections;
create policy "Users can view own connections" 
  on public.connections for select 
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own connections" on public.connections;
create policy "Users can insert own connections" 
  on public.connections for insert 
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own connections" on public.connections;
create policy "Users can update own connections" 
  on public.connections for update 
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own connections" on public.connections;
create policy "Users can delete own connections" 
  on public.connections for delete 
  using (auth.uid() = user_id);


-- INDEXES
create index if not exists connections_user_id_idx on public.connections(user_id);
create index if not exists connections_provider_slug_idx on public.connections(provider_slug);
create index if not exists connections_status_idx on public.connections(status);

-- UNIQUE CONSTRAINT for upserts
-- Note: alter table add constraint doesn't have IF NOT EXISTS in all Postgres versions.
-- We wrap it in a DO block to be safe.
do $$
begin
    if not exists (select 1 from pg_constraint where conname = 'connections_user_provider_account_key') then
        alter table public.connections add constraint connections_user_provider_account_key unique (user_id, provider_slug, account_id);
    end if;
end $$;

-- SEED PROVIDERS
insert into public.integration_providers (slug, name, description, auth_type)
values 
  ('gmail', 'Gmail', 'Send and receive emails via Google.', 'oauth2'),
  ('slack', 'Slack', 'Send messages to Slack channels.', 'oauth2'),
  ('google-sheets', 'Google Sheets', 'Read and write rows in spreadsheets.', 'oauth2'),
  ('notion', 'Notion', 'Connect your Notion workspace.', 'oauth2'),
  ('discord', 'Discord', 'Send messages to Discord via webhooks.', 'oauth2'),
  ('stripe', 'Stripe', 'Process payments and manage customers.', 'api_key'),
  ('twilio', 'Twilio', 'Send SMS and WhatsApp messages.', 'api_key'),
  ('github', 'GitHub', 'Automate your development workflow.', 'oauth2'),
  ('google-drive', 'Google Drive', 'Manage your cloud storage files.', 'oauth2'),
  ('openai', 'OpenAI', 'Integrate AI models into your workflows.', 'api_key')
on conflict (slug) do update set 
  name = excluded.name,
  description = excluded.description,
  auth_type = excluded.auth_type;

-- TRIGGERS
-- Auto-update updated_at timestamp
drop trigger if exists update_integration_providers_updated_at on public.integration_providers;
create trigger update_integration_providers_updated_at
  before update on public.integration_providers
  for each row execute procedure update_updated_at_column();

drop trigger if exists update_connections_updated_at on public.connections;
create trigger update_connections_updated_at
  before update on public.connections
  for each row execute procedure update_updated_at_column();

-- MIGRATIONS (Ensure columns exist for existing tables)
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'connections' and column_name = 'client_id') then
        alter table public.connections add column client_id text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'connections' and column_name = 'client_secret') then
        alter table public.connections add column client_secret text;
    end if;
end $$;

-- Reload PostgREST schema cache
notify pgrst, 'reload schema';
