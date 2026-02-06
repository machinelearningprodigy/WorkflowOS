-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
-- Secure table for storing user data that extends the default auth.users table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  first_name text,
  last_name text,
  full_name text generated always as (
    trim(both from coalesce(first_name, '') || ' ' || coalesce(last_name, ''))
  ) stored,
  avatar_url text,
  billing_address jsonb,
  payment_method jsonb,
  is_admin boolean default false,
  
  -- Metadata and Settings
  settings jsonb default '{}'::jsonb,
  last_seen_at timestamp with time zone,
  
  -- Timestamps
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null

  -- Constraints
  -- constraint username_length check (char_length(full_name) >= 3) -- Optional: ensure name length
);

-- RLS POLICIES FOR PROFILES
alter table public.profiles enable row level security;

-- Policy: Users can view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );

-- Policy: Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Policy: Users can insert their own profile (usually handled by trigger, but safe to allow)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

-- Policy: Admins can view all profiles (optional, requires is_admin column logic validation)
-- create policy "Admins can view all profiles"
--   on public.profiles for select
--   using ( is_admin = true );


-- TRIGGERS FOR NEW USER SIGNUP
-- This function automatically creates a profile entry when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name', -- Fallback or extract if available
    '', 
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- UPDATED_AT TIMESTAMP HANDLING
-- Function to automatically update the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Trigger application
create trigger update_profiles_updated_at
    before update on public.profiles
    for each row
    execute procedure update_updated_at_column();


-- SECURITY & PERFORMANCE INDEXING
-- Index for faster lookups by email (though unique constraint already creates one, explicit naming is good)
create index if not exists profiles_email_idx on public.profiles (email);

-- Index for sorting/filtering by creation date
create index if not exists profiles_created_at_idx on public.profiles (created_at);

-- Index for searching users by name (useful for admin dashboards or team invites later)
create index if not exists profiles_full_name_idx on public.profiles using gin(to_tsvector('english', full_name));

-- JSONB indexing for settings if we query inside it frequently
create index if not exists profiles_settings_idx on public.profiles using gin (settings);

-- COMMENTS & DOCUMENTATION
comment on table public.profiles is 'Extends the internal auth.users table with application-specific user data.';
comment on column public.profiles.id is 'References the internal Supabase Auth user ID.';
comment on column public.profiles.settings is 'Stores user preferences and UI configuration state.';
