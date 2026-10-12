-- ==============================================================================
-- WalkX Platform — Database Migration 003: Social Activity Feed, Interactions & Privacy
-- ==============================================================================
-- Enables full database support for:
-- 1. Profile Privacy & Bio Extensions (public/private accounts, bio, city)
-- 2. Social Posts (activity type, photo attachments, metrics, place tags, visibility)
-- 3. Likes, Comments, Saves, Follows, and Post Moderation Reports
-- 4. Row Level Security (RLS) enforcing public vs private account/post visibility
-- ==============================================================================

-- 1. EXTEND PROFILES FOR SOCIAL CAPABILITIES
alter table public.profiles
  add column if not exists username text unique,
  add column if not exists bio text default '',
  add column if not exists is_private boolean not null default false,
  add column if not exists city text default 'Chennai, India';

-- 2. SOCIAL POSTS TABLE
create table if not exists public.social_posts (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  caption text not null,
  photos text[] default '{}',
  activity_type text not null default 'Walking',
  metrics jsonb default '{}'::jsonb,
  place_tag jsonb default '{}'::jsonb,
  visibility text not null default 'public' check (visibility in ('public', 'followers_only', 'private')),
  likes_count integer not null default 0 check (likes_count >= 0),
  comments_count integer not null default 0 check (comments_count >= 0),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_social_posts_user on public.social_posts(user_id, created_at desc);
create index if not exists idx_social_posts_created on public.social_posts(created_at desc);
create index if not exists idx_social_posts_visibility on public.social_posts(visibility);

-- 3. POST LIKES TABLE
create table if not exists public.post_likes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id text not null references public.social_posts(id) on delete cascade,
  created_at timestamptz not null default timezone('utc'::text, now()),
  primary key (user_id, post_id)
);

create index if not exists idx_post_likes_post on public.post_likes(post_id);

-- 4. POST COMMENTS TABLE
create table if not exists public.post_comments (
  id text primary key,
  post_id text not null references public.social_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_post_comments_post on public.post_comments(post_id, created_at asc);

-- 5. POST SAVES (BOOKMARKS) TABLE
create table if not exists public.post_saves (
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id text not null references public.social_posts(id) on delete cascade,
  created_at timestamptz not null default timezone('utc'::text, now()),
  primary key (user_id, post_id)
);

create index if not exists idx_post_saves_user on public.post_saves(user_id, created_at desc);

-- 6. USER FOLLOWS TABLE
create table if not exists public.user_follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'following' check (status in ('following', 'requested')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  primary key (follower_id, following_id)
);

create index if not exists idx_user_follows_following on public.user_follows(following_id);
create index if not exists idx_user_follows_follower on public.user_follows(follower_id);

-- 7. POST REPORTS (MODERATION) TABLE
create table if not exists public.post_reports (
  id text primary key,
  post_id text not null references public.social_posts(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  details text default '',
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'dismissed', 'action_taken')),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_post_reports_status on public.post_reports(status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) FOR SOCIAL TABLES
-- ==============================================================================

alter table public.social_posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.post_saves enable row level security;
alter table public.user_follows enable row level security;
alter table public.post_reports enable row level security;

-- Helper function: Check if user follows the author
create or replace function public.is_following(p_author_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.user_follows
    where follower_id = auth.uid()
    and following_id = p_author_id
    and status = 'following'
  );
$$;

-- RLS POLICIES FOR POSTS
-- Public posts: viewable by anyone.
-- Private/Followers only: viewable only by author, verified followers, or admin.
create policy "Social posts select policy"
  on public.social_posts for select
  using (
    visibility = 'public'
    or auth.uid() = user_id
    or (visibility = 'followers_only' and public.is_following(user_id))
    or public.is_admin()
  );

create policy "Social posts insert policy"
  on public.social_posts for insert
  with check (auth.uid() = user_id);

create policy "Social posts update policy"
  on public.social_posts for update
  using (auth.uid() = user_id or public.is_admin());

create policy "Social posts delete policy"
  on public.social_posts for delete
  using (auth.uid() = user_id or public.is_admin());

-- RLS POLICIES FOR LIKES
create policy "Likes select policy" on public.post_likes for select using (true);
create policy "Likes insert policy" on public.post_likes for insert with check (auth.uid() = user_id);
create policy "Likes delete policy" on public.post_likes for delete using (auth.uid() = user_id);

-- RLS POLICIES FOR COMMENTS
create policy "Comments select policy" on public.post_comments for select using (true);
create policy "Comments insert policy" on public.post_comments for insert with check (auth.uid() = user_id);
create policy "Comments delete policy" on public.post_comments for delete using (auth.uid() = user_id or public.is_admin());

-- RLS POLICIES FOR SAVES
create policy "Saves select policy" on public.post_saves for select using (auth.uid() = user_id);
create policy "Saves insert policy" on public.post_saves for insert with check (auth.uid() = user_id);
create policy "Saves delete policy" on public.post_saves for delete using (auth.uid() = user_id);

-- RLS POLICIES FOR FOLLOWS
create policy "Follows select policy" on public.user_follows for select using (true);
create policy "Follows insert policy" on public.user_follows for insert with check (auth.uid() = follower_id);
create policy "Follows delete policy" on public.user_follows for delete using (auth.uid() = follower_id or auth.uid() = following_id);

-- RLS POLICIES FOR REPORTS
create policy "Reports insert policy" on public.post_reports for insert with check (auth.uid() = reporter_id);
create policy "Reports admin select policy" on public.post_reports for select using (public.is_admin());
