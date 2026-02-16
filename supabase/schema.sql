-- ============================================================
-- LocalWell Supabase Schema
-- Run this in your Supabase SQL Editor to create all tables
-- ============================================================

-- ─── Profiles (extends Supabase auth.users) ─────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  city text default 'Birmingham, AL',
  bio text,
  health_stack jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'username', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Spots ──────────────────────────────────────────────────
create table public.spots (
  id bigint generated always as identity primary key,
  name text not null,
  type text not null,
  address text,
  rating numeric(2,1) default 0,
  reviews_count int default 0,
  price text,
  tags text[] default '{}',
  trending int default 0,
  img text,
  lat numeric(9,6),
  lng numeric(9,6),
  verified boolean default false,
  hours text,
  description text,
  created_at timestamptz default now()
);

alter table public.spots enable row level security;

create policy "Spots are viewable by everyone"
  on public.spots for select
  using (true);

-- ─── Trends ─────────────────────────────────────────────────
create table public.trends (
  id bigint generated always as identity primary key,
  name text not null,
  category text not null,
  rating numeric(2,1) default 0,
  spots_count int default 0,
  badge text,
  hot boolean default false,
  img text,
  description text,
  rise text,
  difficulty text,
  cost text,
  created_at timestamptz default now()
);

alter table public.trends enable row level security;

create policy "Trends are viewable by everyone"
  on public.trends for select
  using (true);

-- ─── Feed Posts ─────────────────────────────────────────────
create table public.feed_posts (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  spot_name text,
  img text,
  trend text,
  likes_count int default 0,
  comments_count int default 0,
  created_at timestamptz default now()
);

alter table public.feed_posts enable row level security;

create policy "Feed posts are viewable by everyone"
  on public.feed_posts for select
  using (true);

create policy "Authenticated users can create posts"
  on public.feed_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on public.feed_posts for update
  using (auth.uid() = user_id);

create policy "Users can delete own posts"
  on public.feed_posts for delete
  using (auth.uid() = user_id);

-- ─── Reviews ────────────────────────────────────────────────
create table public.reviews (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  spot_id bigint references public.spots(id) on delete cascade not null,
  rating int check (rating >= 1 and rating <= 5) not null,
  content text,
  created_at timestamptz default now()
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using (true);

create policy "Authenticated users can create reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

-- ─── Follows ────────────────────────────────────────────────
create table public.follows (
  follower_id uuid references public.profiles(id) on delete cascade,
  following_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, following_id)
);

alter table public.follows enable row level security;

create policy "Follows are viewable by everyone"
  on public.follows for select
  using (true);

create policy "Authenticated users can follow"
  on public.follows for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on public.follows for delete
  using (auth.uid() = follower_id);
