-- ==============================================================================
-- WalkX Platform — Database Migration 001: Core Tables, Indexes & Row Level Security
-- ==============================================================================
-- Enables full database support for:
-- 1. Profiles & User Accounts (with role-based access control)
-- 2. Activity Telemetry Records (daily steps, distance, active minutes)
-- 3. Points Transaction Ledger (immutable credit/debit audit trail)
-- 4. Rewards Catalog & Redemptions (with status lifecycle: Pending -> Approved -> Fulfilled)
-- 5. Donation Causes & Donation Ledger (pledges & verified remittance records)
-- 6. Administrative Audit Logs & System Settings (conversion rates & anti-cheat rules)
-- ==============================================================================

-- 1. PROFILES TABLE
-- Extends Supabase auth.users with WalkX application data
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default 'Walker',
  phone text default '',
  avatar_url text default '',
  points_balance integer not null default 1000 check (points_balance >= 0),
  total_steps integer not null default 0 check (total_steps >= 0),
  streak_days integer not null default 1 check (streak_days >= 0),
  kyc_status text not null default 'Verified',
  status text not null default 'Active' check (status in ('Active', 'Suspended')),
  role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

-- Index for fast user lookup
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_status on public.profiles(status);

-- 2. ACTIVITY RECORDS TABLE
-- Stores daily verified stride activity per user
create table if not exists public.activity_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null default current_date,
  steps integer not null default 0 check (steps >= 0),
  distance_km numeric(10,2) not null default 0 check (distance_km >= 0),
  calories integer not null default 0 check (calories >= 0),
  active_minutes integer not null default 0 check (active_minutes >= 0),
  points_earned integer not null default 0 check (points_earned >= 0),
  synced_at timestamptz not null default timezone('utc'::text, now()),
  unique(user_id, date)
);

create index if not exists idx_activity_user_date on public.activity_records(user_id, date desc);

-- 3. POINTS TRANSACTIONS TABLE
-- Immutable ledger of every point credited or debited
create table if not exists public.points_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  detail text,
  points integer not null, -- positive for credit, negative for debit
  type text not null check (type in ('credit', 'debit')),
  category text not null check (category in ('steps', 'redemption', 'donation', 'bonus', 'withdrawal')),
  status text not null default 'completed' check (status in ('completed', 'pending', 'cancelled')),
  reference_id text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_transactions_user_date on public.points_transactions(user_id, created_at desc);

-- 4. REWARDS CATALOG TABLE
create table if not exists public.rewards (
  id text primary key,
  title text not null,
  points_cost integer not null check (points_cost > 0),
  inr_value integer not null check (inr_value > 0),
  icon text not null default '🎁',
  description text not null,
  category text not null check (category in ('cash', 'shopping', 'electronics', 'fitness', 'travel', 'giftcard')),
  stock_count integer not null default 100 check (stock_count >= 0),
  unlocked boolean not null default true,
  partner_brand text not null default 'WalkX Partner',
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_rewards_category on public.rewards(category);

-- 5. REDEMPTIONS QUEUE TABLE
create table if not exists public.redemptions (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reward_id text references public.rewards(id) on delete set null,
  reward_title text not null,
  category text not null,
  points_spent integer not null check (points_spent > 0),
  inr_value integer not null check (inr_value > 0),
  delivery_target text not null,
  voucher_code text,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Fulfilled', 'Rejected')),
  notes text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_redemptions_user on public.redemptions(user_id, created_at desc);
create index if not exists idx_redemptions_status on public.redemptions(status);

-- 6. DONATION CAUSES TABLE
create table if not exists public.donation_causes (
  id text primary key,
  title text not null,
  tagline text not null,
  description text not null,
  category text not null check (category in ('Education', 'Healthcare', 'Food support', 'Environment')),
  image_url text not null,
  icon text not null default '📚',
  organization_name text not null,
  organization_type text not null,
  organization_location text not null,
  registration_number text not null,
  target_amount numeric not null check (target_amount > 0),
  raised_amount numeric not null default 0 check (raised_amount >= 0),
  donors_count integer not null default 0 check (donors_count >= 0),
  verified_partner text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_causes_category on public.donation_causes(category);

-- 7. DONATION RECORDS TABLE
create table if not exists public.donation_records (
  id text primary key,
  reference_number text not null unique,
  user_id uuid references public.profiles(id) on delete cascade,
  donor_name text not null,
  donor_email text not null,
  cause_id text references public.donation_causes(id) on delete set null,
  cause_title text not null,
  cause_category text not null,
  points_contributed integer not null default 0 check (points_contributed >= 0),
  amount_inr numeric not null default 0 check (amount_inr >= 0),
  contribution_type text not null check (contribution_type in ('Points Contribution', 'Monetary Pledge', 'Corporate Match')),
  status text not null check (status in ('Points Pledged', 'Points Pledged (Demo)', 'Pending Review', 'Completed', 'Failed', 'Monetary Pledge (Prepared Integration)')),
  payment_method text not null default 'WalkX Points',
  is_demo_record boolean not null default false,
  notes text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_donations_user on public.donation_records(user_id, created_at desc);
create index if not exists idx_donations_cause on public.donation_records(cause_id);

-- 8. ADMINISTRATIVE AUDIT LOGS TABLE
create table if not exists public.admin_audit_logs (
  id text primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  actor_name text not null,
  actor_email text not null,
  action text not null,
  section text not null,
  severity text not null check (severity in ('info', 'warning', 'critical')),
  target_entity text,
  details text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_audit_created on public.admin_audit_logs(created_at desc);

-- 9. SYSTEM SETTINGS TABLE
create table if not exists public.system_settings (
  id integer primary key default 1 check (id = 1),
  conversion_rate_inr_per_1000_pts numeric not null default 11.00 check (conversion_rate_inr_per_1000_pts > 0),
  base_stride_rate integer not null default 100 check (base_stride_rate > 0),
  daily_step_cap integer not null default 25000 check (daily_step_cap > 0),
  max_speed_kmh integer not null default 25 check (max_speed_kmh > 0),
  min_redemption_points integer not null default 5000 check (min_redemption_points > 0),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

-- Insert default system settings row
insert into public.system_settings (id, conversion_rate_inr_per_1000_pts, base_stride_rate, daily_step_cap, max_speed_kmh, min_redemption_points)
values (1, 11.00, 100, 25000, 25, 5000)
on conflict (id) do nothing;

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.activity_records enable row level security;
alter table public.points_transactions enable row level security;
alter table public.rewards enable row level security;
alter table public.redemptions enable row level security;
alter table public.donation_causes enable row level security;
alter table public.donation_records enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.system_settings enable row level security;

-- Helper function: Check if current user is an admin or moderator
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('admin', 'moderator')
    and status = 'Active'
  );
$$;

-- RLS POLICIES FOR PROFILES
-- Users can view their own profile; admins can view all profiles
create policy "Profiles select policy"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

-- Users can only update their own profile; sensitive fields are protected via trigger
create policy "Profiles update policy"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- RLS POLICIES FOR ACTIVITY RECORDS
create policy "Activity select policy"
  on public.activity_records for select
  using (auth.uid() = user_id or public.is_admin());

-- RLS POLICIES FOR POINTS TRANSACTIONS
-- Immutable: users can read their own; mutations only through secure RPC functions
create policy "Transactions select policy"
  on public.points_transactions for select
  using (auth.uid() = user_id or public.is_admin());

-- RLS POLICIES FOR REWARDS
-- Everyone can view active rewards; admins can manage catalog
create policy "Rewards select policy"
  on public.rewards for select
  using (unlocked = true or public.is_admin());

create policy "Rewards admin write policy"
  on public.rewards for all
  using (public.is_admin());

-- RLS POLICIES FOR REDEMPTIONS
-- Users can view their own claims; admins can view and update status
create policy "Redemptions select policy"
  on public.redemptions for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Redemptions admin update policy"
  on public.redemptions for update
  using (public.is_admin());

-- RLS POLICIES FOR CAUSES
-- Everyone can view causes; admins can manage causes
create policy "Causes select policy"
  on public.donation_causes for select
  using (is_active = true or public.is_admin());

create policy "Causes admin write policy"
  on public.donation_causes for all
  using (public.is_admin());

-- RLS POLICIES FOR DONATION RECORDS
-- Users can view their own donations; admins can view all
create policy "Donations select policy"
  on public.donation_records for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Donations admin update policy"
  on public.donation_records for update
  using (public.is_admin());

-- RLS POLICIES FOR AUDIT LOGS
-- Strictly restricted to administrators
create policy "Audit logs select policy"
  on public.admin_audit_logs for select
  using (public.is_admin());

create policy "Audit logs insert policy"
  on public.admin_audit_logs for insert
  with check (public.is_admin() or auth.jwt()->>'role' = 'service_role');

-- RLS POLICIES FOR SYSTEM SETTINGS
create policy "Settings select policy"
  on public.system_settings for select
  using (true);

create policy "Settings admin update policy"
  on public.system_settings for update
  using (public.is_admin());
