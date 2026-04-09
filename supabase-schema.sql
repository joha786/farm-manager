create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  username text unique not null,
  email text unique not null,
  address text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.farm_manager_state (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.farm_manager_state
add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.profiles enable row level security;
alter table public.farm_manager_state enable row level security;

drop policy if exists "Users can read their profile" on public.profiles;
drop policy if exists "Users can create their profile" on public.profiles;
drop policy if exists "Users can update their profile" on public.profiles;
drop policy if exists "Allow username lookup for login" on public.profiles;

create policy "Users can read their profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Allow username lookup for login"
on public.profiles
for select
using (true);

create policy "Users can create their profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Users can update their profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can read their farm state" on public.farm_manager_state;
drop policy if exists "Users can create their farm state" on public.farm_manager_state;
drop policy if exists "Users can update their farm state" on public.farm_manager_state;
drop policy if exists "Users can delete their farm state" on public.farm_manager_state;
drop policy if exists "Allow public farm manager state access" on public.farm_manager_state;

create policy "Users can read their farm state"
on public.farm_manager_state
for select
using (auth.uid() = user_id);

create policy "Users can create their farm state"
on public.farm_manager_state
for insert
with check (auth.uid() = user_id);

create policy "Users can update their farm state"
on public.farm_manager_state
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their farm state"
on public.farm_manager_state
for delete
using (auth.uid() = user_id);

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, username, email, address, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Farm User'),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do update set
    name = excluded.name,
    username = excluded.username,
    email = excluded.email,
    address = excluded.address,
    phone = excluded.phone,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists create_profile_after_signup on auth.users;

create trigger create_profile_after_signup
after insert on auth.users
for each row execute function public.create_profile_for_new_user();
