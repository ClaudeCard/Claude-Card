create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  global_points integer default 0 not null,
  passport_level text default 'Seed' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.site_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  site_key text not null,
  site_name text not null,
  site_points integer default 0 not null,
  site_level text default 'New Member' not null,
  joined_at timestamptz default now() not null,
  unique(user_id, site_key)
);

create table if not exists public.reward_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  site_key text not null,
  action text not null,
  global_points integer default 0 not null,
  site_points integer default 0 not null,
  description text,
  created_at timestamptz default now() not null
);

create table if not exists public.rewards_catalog (
  id uuid primary key default gen_random_uuid(),
  site_key text not null,
  reward_name text not null,
  reward_description text,
  cost_points integer not null,
  reward_type text default 'site' not null,
  active boolean default true not null,
  created_at timestamptz default now() not null
);

create index if not exists site_memberships_user_id_idx on public.site_memberships(user_id);
create index if not exists site_memberships_site_key_idx on public.site_memberships(site_key);
create index if not exists reward_transactions_user_id_created_at_idx on public.reward_transactions(user_id, created_at desc);
create index if not exists reward_transactions_site_key_idx on public.reward_transactions(site_key);
create index if not exists rewards_catalog_active_site_key_idx on public.rewards_catalog(active, site_key);

alter table public.profiles enable row level security;
alter table public.site_memberships enable row level security;
alter table public.reward_transactions enable row level security;
alter table public.rewards_catalog enable row level security;

drop policy if exists "Users can select their own profile" on public.profiles;
create policy "Users can select their own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can select their own site memberships" on public.site_memberships;
create policy "Users can select their own site memberships"
on public.site_memberships for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can select their own reward transactions" on public.reward_transactions;
create policy "Users can select their own reward transactions"
on public.reward_transactions for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Authenticated users can select active rewards" on public.rewards_catalog;
create policy "Authenticated users can select active rewards"
on public.rewards_catalog for select
to authenticated
using (active = true);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.join_site_membership(
  p_site_key text,
  p_site_name text
)
returns public.site_memberships
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_membership public.site_memberships;
  v_inserted boolean := false;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.site_memberships (user_id, site_key, site_name, site_points)
  values (v_user_id, p_site_key, p_site_name, 100)
  on conflict (user_id, site_key) do nothing
  returning * into v_membership;

  v_inserted := found;

  if v_inserted then
    update public.profiles
    set global_points = global_points + 100,
        updated_at = now()
    where id = v_user_id;

    insert into public.reward_transactions (
      user_id,
      site_key,
      action,
      global_points,
      site_points,
      description
    )
    values (
      v_user_id,
      p_site_key,
      'join_site',
      100,
      100,
      'Joined ' || p_site_name || ' and earned starter points'
    );
  else
    select *
    into v_membership
    from public.site_memberships
    where user_id = v_user_id
      and site_key = p_site_key;
  end if;

  return v_membership;
end;
$$;

create or replace function public.add_reward_transaction(
  p_site_key text,
  p_action text,
  p_global_points int,
  p_site_points int,
  p_description text
)
returns public.reward_transactions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_transaction public.reward_transactions;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.reward_transactions (
    user_id,
    site_key,
    action,
    global_points,
    site_points,
    description
  )
  values (
    v_user_id,
    p_site_key,
    p_action,
    coalesce(p_global_points, 0),
    coalesce(p_site_points, 0),
    p_description
  )
  returning * into v_transaction;

  update public.profiles
  set global_points = global_points + coalesce(p_global_points, 0),
      updated_at = now()
  where id = v_user_id;

  insert into public.site_memberships (user_id, site_key, site_name, site_points)
  values (v_user_id, p_site_key, p_site_key, coalesce(p_site_points, 0))
  on conflict (user_id, site_key) do update
  set site_points = public.site_memberships.site_points + coalesce(p_site_points, 0);

  return v_transaction;
end;
$$;

revoke execute on function public.join_site_membership(text, text) from public, anon;
revoke execute on function public.add_reward_transaction(text, text, int, int, text) from public, anon, authenticated;

grant execute on function public.join_site_membership(text, text) to authenticated;
