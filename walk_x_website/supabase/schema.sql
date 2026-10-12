-- ==============================================================================
-- WalkX Platform — Turnkey Database Schema (Copy & Paste into Supabase SQL Editor)
-- ==============================================================================
-- Includes:
-- 1. All Tables (profiles, activity, points_transactions, rewards, redemptions, causes, donation_records, audit_logs, settings)
-- 2. Indexes & Constraints
-- 3. Row Level Security (RLS) Policies on all tables
-- 4. Automatic Triggers (handle_new_user, protect_profile_fields)
-- 5. Secure Server-Side RPC Functions (rpc_sync_steps, rpc_redeem_reward, rpc_pledge_donation, rpc_withdraw_upi, admin RPCs)
-- 6. Initial Seed Data (Rewards catalog & Verified Causes)
-- ==============================================================================

-- 1. PROFILES TABLE
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

create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_role on public.profiles(role);

-- 2. ACTIVITY RECORDS TABLE
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
create table if not exists public.points_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  detail text,
  points integer not null,
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

insert into public.system_settings (id, conversion_rate_inr_per_1000_pts, base_stride_rate, daily_step_cap, max_speed_kmh, min_redemption_points)
values (1, 11.00, 100, 25000, 25, 5000)
on conflict (id) do nothing;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) & HELPER FUNCTIONS
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

-- RLS POLICIES
drop policy if exists "Profiles select policy" on public.profiles;
create policy "Profiles select policy" on public.profiles for select using (auth.uid() = id or public.is_admin());

drop policy if exists "Profiles update policy" on public.profiles;
create policy "Profiles update policy" on public.profiles for update using (auth.uid() = id or public.is_admin());

drop policy if exists "Activity select policy" on public.activity_records;
create policy "Activity select policy" on public.activity_records for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Transactions select policy" on public.points_transactions;
create policy "Transactions select policy" on public.points_transactions for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Rewards select policy" on public.rewards;
create policy "Rewards select policy" on public.rewards for select using (unlocked = true or public.is_admin());

drop policy if exists "Rewards admin write policy" on public.rewards;
create policy "Rewards admin write policy" on public.rewards for all using (public.is_admin());

drop policy if exists "Redemptions select policy" on public.redemptions;
create policy "Redemptions select policy" on public.redemptions for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Redemptions admin update policy" on public.redemptions;
create policy "Redemptions admin update policy" on public.redemptions for update using (public.is_admin());

drop policy if exists "Causes select policy" on public.donation_causes;
create policy "Causes select policy" on public.donation_causes for select using (is_active = true or public.is_admin());

drop policy if exists "Causes admin write policy" on public.donation_causes;
create policy "Causes admin write policy" on public.donation_causes for all using (public.is_admin());

drop policy if exists "Donations select policy" on public.donation_records;
create policy "Donations select policy" on public.donation_records for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Donations admin update policy" on public.donation_records;
create policy "Donations admin update policy" on public.donation_records for update using (public.is_admin());

drop policy if exists "Audit logs select policy" on public.admin_audit_logs;
create policy "Audit logs select policy" on public.admin_audit_logs for select using (public.is_admin());

drop policy if exists "Audit logs insert policy" on public.admin_audit_logs;
create policy "Audit logs insert policy" on public.admin_audit_logs for insert with check (public.is_admin() or auth.jwt()->>'role' = 'service_role');

drop policy if exists "Settings select policy" on public.system_settings;
create policy "Settings select policy" on public.system_settings for select using (true);

drop policy if exists "Settings admin update policy" on public.system_settings;
create policy "Settings admin update policy" on public.system_settings for update using (public.is_admin());

-- ==============================================================================
-- AUTOMATIC TRIGGERS
-- ==============================================================================

-- 1. Create Profile on Signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, full_name, phone, role, points_balance, total_steps, streak_days, status
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_app_meta_data->>'role', 'user'),
    1000,
    0,
    1,
    'Active'
  )
  on conflict (id) do nothing;

  insert into public.points_transactions (
    user_id, title, detail, points, type, category, status
  ) values (
    new.id,
    'Welcome Onboarding Bonus',
    'Earned upon joining the WalkX platform',
    1000,
    'credit',
    'bonus',
    'completed'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Anti-Tamper Trigger on Profiles
create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
as $$
begin
  if (auth.jwt() ->> 'role' is distinct from 'service_role') and
     (not exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')) then
    if (NEW.points_balance is distinct from OLD.points_balance) then
      raise exception 'SECURITY EXCEPTION: Points balance cannot be modified directly. Use secure RPC endpoints.';
    end if;
    if (NEW.role is distinct from OLD.role) then
      raise exception 'SECURITY EXCEPTION: Direct role privilege escalation is forbidden.';
    end if;
    if (NEW.total_steps is distinct from OLD.total_steps) then
      raise exception 'SECURITY EXCEPTION: Total steps must be ingested through verified telemetry sync.';
    end if;
    if (NEW.status is distinct from OLD.status) then
      raise exception 'SECURITY EXCEPTION: Account status modification requires administrator approval.';
    end if;
  end if;
  NEW.updated_at = timezone('utc'::text, now());
  return NEW;
end;
$$;

drop trigger if exists on_profile_protect_fields on public.profiles;
create trigger on_profile_protect_fields
  before update on public.profiles
  for each row execute procedure public.protect_profile_fields();

-- ==============================================================================
-- SECURE SERVER-SIDE RPC FUNCTIONS (SECURITY DEFINER)
-- ==============================================================================

-- RPC: Sync verified steps
create or replace function public.rpc_sync_steps(
  p_steps integer,
  p_date date default current_date
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_user_status text;
  v_daily_cap integer;
  v_base_rate integer;
  v_existing_steps integer := 0;
  v_allowed_steps integer;
  v_points_earned integer;
  v_new_balance integer;
  v_new_total_steps integer;
  v_dist numeric(10,2);
  v_cal integer;
  v_min integer;
begin
  v_user_id := auth.uid();
  if v_user_id is null then raise exception 'Authentication required'; end if;

  select status into v_user_status from public.profiles where id = v_user_id;
  if v_user_status = 'Suspended' then raise exception 'Account suspended.'; end if;
  if p_steps <= 0 then raise exception 'Step count must be greater than 0'; end if;

  select daily_step_cap, base_stride_rate into v_daily_cap, v_base_rate
  from public.system_settings where id = 1;
  if v_daily_cap is null then v_daily_cap := 25000; end if;
  if v_base_rate is null then v_base_rate := 100; end if;

  select steps into v_existing_steps from public.activity_records
  where user_id = v_user_id and date = p_date;
  if v_existing_steps is null then v_existing_steps := 0; end if;

  v_allowed_steps := least(p_steps, greatest(0, v_daily_cap - v_existing_steps));
  v_points_earned := v_allowed_steps / v_base_rate;
  if v_points_earned < 1 and v_allowed_steps >= 100 then v_points_earned := 1; end if;
  if v_base_rate = 1 then v_points_earned := v_allowed_steps; end if;

  v_dist := round((v_allowed_steps * 0.00075)::numeric, 2);
  v_cal := round(v_allowed_steps * 0.042);
  v_min := round(v_allowed_steps / 115);

  update public.profiles
  set
    points_balance = points_balance + v_points_earned,
    total_steps = total_steps + v_allowed_steps,
    updated_at = timezone('utc'::text, now())
  where id = v_user_id
  returning points_balance, total_steps into v_new_balance, v_new_total_steps;

  insert into public.activity_records (
    user_id, date, steps, distance_km, calories, active_minutes, points_earned, synced_at
  ) values (
    v_user_id, p_date, v_existing_steps + v_allowed_steps, v_dist, v_cal, v_min, v_points_earned, timezone('utc'::text, now())
  )
  on conflict (user_id, date) do update
  set
    steps = activity_records.steps + v_allowed_steps,
    distance_km = activity_records.distance_km + v_dist,
    calories = activity_records.calories + v_cal,
    active_minutes = activity_records.active_minutes + v_min,
    points_earned = activity_records.points_earned + v_points_earned,
    synced_at = timezone('utc'::text, now());

  if v_points_earned > 0 then
    insert into public.points_transactions (
      user_id, title, detail, points, type, category, status
    ) values (
      v_user_id, 'Stride Telemetry Sync', format('Logged +%s verified steps', to_char(v_allowed_steps, 'FM999,999,999')),
      v_points_earned, 'credit', 'steps', 'completed'
    );
  end if;

  return jsonb_build_object(
    'success', true,
    'steps_synced', v_allowed_steps,
    'points_earned', v_points_earned,
    'new_points_balance', v_new_balance,
    'new_total_steps', v_new_total_steps
  );
end;
$$;

-- RPC: Redeem Reward Item
create or replace function public.rpc_redeem_reward(
  p_reward_id text,
  p_delivery_target text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_points_balance integer;
  v_reward record;
  v_redemption_id text;
  v_new_balance integer;
begin
  v_user_id := auth.uid();
  if v_user_id is null then raise exception 'Authentication required'; end if;

  select points_balance into v_points_balance from public.profiles
  where id = v_user_id and status = 'Active' for update;
  if v_points_balance is null then raise exception 'User not found or inactive'; end if;

  select * into v_reward from public.rewards where id = p_reward_id and unlocked = true for update;
  if v_reward.id is null then raise exception 'Reward not found'; end if;
  if v_reward.stock_count <= 0 then raise exception 'Out of stock'; end if;
  if v_points_balance < v_reward.points_cost then raise exception 'Insufficient points balance'; end if;

  update public.profiles set points_balance = points_balance - v_reward.points_cost, updated_at = timezone('utc'::text, now())
  where id = v_user_id returning points_balance into v_new_balance;

  update public.rewards set stock_count = stock_count - 1 where id = p_reward_id;

  v_redemption_id := 'rdm_' || floor(extract(epoch from now()) * 1000)::text;

  insert into public.redemptions (
    id, user_id, reward_id, reward_title, category, points_spent, inr_value, delivery_target, voucher_code, status
  ) values (
    v_redemption_id, v_user_id, v_reward.id, v_reward.title, v_reward.category,
    v_reward.points_cost, v_reward.inr_value, coalesce(p_delivery_target, 'Direct Account'), null, 'Pending'
  );

  insert into public.points_transactions (
    user_id, title, detail, points, type, category, reference_id, status
  ) values (
    v_user_id, 'Reward Claim: ' || v_reward.title, format('Redeemed %s (%s pts)', v_reward.title, to_char(v_reward.points_cost, 'FM999,999,999')),
    v_reward.points_cost, 'debit', 'redemption', v_redemption_id, 'completed'
  );

  return jsonb_build_object(
    'success', true,
    'redemption_id', v_redemption_id,
    'reward_title', v_reward.title,
    'points_spent', v_reward.points_cost,
    'inr_value', v_reward.inr_value,
    'status', 'Pending',
    'new_points_balance', v_new_balance
  );
end;
$$;

-- RPC: Pledge Donation
create or replace function public.rpc_pledge_donation(
  p_cause_id text,
  p_points integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_user_record record;
  v_cause record;
  v_inr_amount numeric;
  v_donation_id text;
  v_ref_num text;
  v_new_balance integer;
begin
  v_user_id := auth.uid();
  if v_user_id is null then raise exception 'Authentication required'; end if;
  if p_points <= 0 then raise exception 'Points must be greater than 0'; end if;

  select id, full_name, email, points_balance into v_user_record
  from public.profiles where id = v_user_id and status = 'Active' for update;
  if v_user_record.id is null then raise exception 'Profile not found'; end if;
  if v_user_record.points_balance < p_points then raise exception 'Insufficient points balance'; end if;

  select * into v_cause from public.donation_causes where id = p_cause_id and is_active = true for update;
  if v_cause.id is null then raise exception 'Cause not found'; end if;

  v_inr_amount := round((p_points * 0.011)::numeric, 2);

  update public.profiles set points_balance = points_balance - p_points, updated_at = timezone('utc'::text, now())
  where id = v_user_id returning points_balance into v_new_balance;

  update public.donation_causes set raised_amount = raised_amount + v_inr_amount, donors_count = donors_count + 1
  where id = p_cause_id;

  v_donation_id := 'dn_' || floor(extract(epoch from now()) * 1000)::text;
  v_ref_num := 'WX-DON-' || floor(1000 + random() * 9000)::text;

  insert into public.donation_records (
    id, reference_number, user_id, donor_name, donor_email, cause_id, cause_title, cause_category,
    points_contributed, amount_inr, contribution_type, status, payment_method, is_demo_record, notes
  ) values (
    v_donation_id, v_ref_num, v_user_id, v_user_record.full_name, v_user_record.email,
    v_cause.id, v_cause.title, v_cause.category, p_points, v_inr_amount, 'Points Contribution', 'Points Pledged',
    'WalkX Points', false, format('Direct contribution to %s', v_cause.title)
  );

  insert into public.points_transactions (
    user_id, title, detail, points, type, category, reference_id, status
  ) values (
    v_user_id, 'Points Contribution: ' || v_cause.title, format('Pledged %s pts (₹%s)', to_char(p_points, 'FM999,999,999'), v_inr_amount),
    p_points, 'debit', 'donation', v_donation_id, 'completed'
  );

  return jsonb_build_object(
    'success', true,
    'donation_id', v_donation_id,
    'reference_number', v_ref_num,
    'cause_title', v_cause.title,
    'points_contributed', p_points,
    'amount_inr', v_inr_amount,
    'new_points_balance', v_new_balance
  );
end;
$$;

-- RPC: UPI Withdrawal
create or replace function public.rpc_withdraw_upi(
  p_upi_id text,
  p_inr_amount numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_points_required integer;
  v_current_balance integer;
  v_new_balance integer;
begin
  v_user_id := auth.uid();
  if v_user_id is null then raise exception 'Authentication required'; end if;
  if p_inr_amount < 11 then raise exception 'Minimum withdrawal is ₹11'; end if;

  v_points_required := round((p_inr_amount / 11.0) * 1000)::integer;

  select points_balance into v_current_balance from public.profiles
  where id = v_user_id and status = 'Active' for update;
  if v_current_balance < v_points_required then raise exception 'Insufficient points balance'; end if;

  update public.profiles set points_balance = points_balance - v_points_required, updated_at = timezone('utc'::text, now())
  where id = v_user_id returning points_balance into v_new_balance;

  insert into public.points_transactions (
    user_id, title, detail, points, type, category, status
  ) values (
    v_user_id, format('Instant UPI Withdrawal (₹%s)', p_inr_amount), format('Disbursed to %s', p_upi_id),
    v_points_required, 'debit', 'withdrawal', 'completed'
  );

  return jsonb_build_object(
    'success', true,
    'inr_amount', p_inr_amount,
    'points_debited', v_points_required,
    'upi_id', p_upi_id,
    'new_points_balance', v_new_balance
  );
end;
$$;

-- RPC: Admin Approve Redemption
create or replace function public.rpc_admin_approve_redemption(
  p_redemption_id text,
  p_voucher_code text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid;
  v_code text;
begin
  v_actor_id := auth.uid();
  if not public.is_admin() then raise exception 'Administrative authorization required.'; end if;
  v_code := coalesce(p_voucher_code, 'WX-' || upper(substr(md5(random()::text), 1, 8)));

  update public.redemptions set status = 'Approved', voucher_code = v_code, updated_at = timezone('utc'::text, now())
  where id = p_redemption_id;

  insert into public.admin_audit_logs (
    id, actor_id, actor_name, actor_email, action, section, severity, target_entity, details
  ) values (
    'log_' || floor(extract(epoch from now()) * 1000)::text, v_actor_id, 'Admin', 'admin@walkx.app',
    'APPROVE_REDEMPTION', 'rewards', 'info', p_redemption_id, format('Approved claim %s (%s)', p_redemption_id, v_code)
  );

  return jsonb_build_object('success', true, 'status', 'Approved', 'voucher_code', v_code);
end;
$$;

-- RPC: Admin Reject Redemption
create or replace function public.rpc_admin_reject_redemption(
  p_redemption_id text,
  p_reason text default 'Fulfillment criteria not met'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid;
  v_redemption record;
begin
  v_actor_id := auth.uid();
  if not public.is_admin() then raise exception 'Administrative authorization required.'; end if;

  select * into v_redemption from public.redemptions where id = p_redemption_id;
  if v_redemption.id is null then raise exception 'Redemption not found'; end if;

  update public.redemptions set status = 'Rejected', notes = p_reason, updated_at = timezone('utc'::text, now())
  where id = p_redemption_id;

  update public.profiles set points_balance = points_balance + v_redemption.points_spent, updated_at = timezone('utc'::text, now())
  where id = v_redemption.user_id;

  insert into public.points_transactions (
    user_id, title, detail, points, type, category, status
  ) values (
    v_redemption.user_id, 'Refund: ' || v_redemption.reward_title, format('Points restored for rejected claim (%s)', p_reason),
    v_redemption.points_spent, 'credit', 'redemption', 'completed'
  );

  insert into public.admin_audit_logs (
    id, actor_id, actor_name, actor_email, action, section, severity, target_entity, details
  ) values (
    'log_' || floor(extract(epoch from now()) * 1000)::text, v_actor_id, 'Admin', 'admin@walkx.app',
    'REJECT_REDEMPTION', 'rewards', 'warning', p_redemption_id, format('Rejected %s, refunded %s pts', p_redemption_id, v_redemption.points_spent)
  );

  return jsonb_build_object('success', true, 'status', 'Rejected');
end;
$$;

-- RPC: Admin Update User Status
create or replace function public.rpc_admin_update_user_status(
  p_user_id uuid,
  p_status text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'Administrative role required.'; end if;
  update public.profiles set status = p_status, updated_at = timezone('utc'::text, now()) where id = p_user_id;

  insert into public.admin_audit_logs (
    id, actor_name, actor_email, action, section, severity, target_entity, details
  ) values (
    'log_' || floor(extract(epoch from now()) * 1000)::text, 'Admin', 'admin@walkx.app',
    'UPDATE_USER_STATUS', 'users', 'warning', p_user_id::text, format('Changed account status to %s', p_status)
  );

  return jsonb_build_object('success', true, 'status', p_status);
end;
$$;

-- RPC: Admin Update Conversion Rate
create or replace function public.rpc_admin_update_conversion_rate(
  p_rate numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'Administrative role required.'; end if;
  update public.system_settings set conversion_rate_inr_per_1000_pts = p_rate, updated_at = timezone('utc'::text, now()) where id = 1;

  insert into public.admin_audit_logs (
    id, actor_name, actor_email, action, section, severity, target_entity, details
  ) values (
    'log_' || floor(extract(epoch from now()) * 1000)::text, 'Admin', 'admin@walkx.app',
    'CALIBRATE_CONVERSION_RATE', 'points', 'critical', 'system_settings', format('Calibrated conversion rate to ₹%s / 1,000 pts', p_rate)
  );

  return jsonb_build_object('success', true, 'new_rate', p_rate);
end;
$$;

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

insert into public.rewards (id, title, points_cost, inr_value, icon, description, category, stock_count, unlocked, partner_brand)
values
  ('rw_amazon_500', '₹500 Amazon Pay Gift Card', 45000, 500, '🎁', 'Redeemable for any purchase on Amazon India. Digital code delivered instantly.', 'shopping', 150, true, 'Amazon Pay India'),
  ('rw_boat_earbuds', 'boAt Airdopes 141 ANC', 85000, 1499, '🎧', 'True wireless earbuds with 42H playtime, ENx noise cancellation, and IPX4 rating.', 'electronics', 40, true, 'boAt Lifestyle'),
  ('rw_cult_pass', '1-Month Cult.fit Pass', 65000, 999, '💪', 'Unlimited access to Cult group workouts, yoga classes, and premium strength gyms across India.', 'fitness', 75, true, 'Cult.fit'),
  ('rw_starbucks_300', '₹300 Starbucks Coffee Card', 27000, 300, '☕', 'Enjoy hand-crafted coffees, frappuccinos, and bakery items at any Starbucks India outlet.', 'giftcard', 120, true, 'Starbucks India'),
  ('rw_decathlon_1000', '₹1,000 Decathlon Sports Voucher', 90000, 1000, '👟', 'Valid on all athletic footwear, running gear, outdoor hiking apparel, and fitness accessories.', 'shopping', 50, true, 'Decathlon India'),
  ('rw_upi_cash_550', '₹550 Instant Direct UPI Cash', 50000, 550, '⚡', 'Direct credit to your linked UPI VPA (Google Pay, PhonePe, Paytm). Fully verified settlement.', 'cash', 500, true, 'WalkX Financial Reserve')
on conflict (id) do nothing;

insert into public.donation_causes (
  id, title, tagline, description, category, image_url, icon,
  organization_name, organization_type, organization_location,
  registration_number, target_amount, raised_amount, donors_count, verified_partner, is_active
) values
  (
    'cs_edu_rural',
    'Rural Girl Child STEM Education',
    'Providing laptops, digital lab kits, and code coaching to girls in government schools.',
    'Equips underserved rural schoolgirls across 14 districts with STEM kits, verified digital literacy workshops, and after-school mentorship.',
    'Education',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    '📚',
    'Vidya Shiksha Foundation (Sample)',
    'Registered Section 8 Non-Profit (Sample)',
    'Tamil Nadu, India',
    'SAMPLE-NGO-TN-2024-001',
    50000,
    18750,
    142,
    'Tamil Nadu Rural Development Trust',
    true
  ),
  (
    'cs_health_dialysis',
    'Subsidized Dialysis & Kidney Care',
    'Covering critical weekly dialysis sessions for low-income daily-wage laborers.',
    'Provides life-saving hemodialysis and kidney care medications to marginalized families who cannot afford private clinical treatments.',
    'Healthcare',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    '🏥',
    'Jeevan Care Health Trust (Sample)',
    'Public Charitable Medical Trust (Sample)',
    'Karnataka & Kerala, India',
    'SAMPLE-MED-KA-2023-089',
    75000,
    42300,
    318,
    'National Kidney Health Council',
    true
  ),
  (
    'cs_food_nourish',
    'Daily Warm Meals for Street Children',
    'Delivering balanced hygienic nutrition packs to children in urban transit slums.',
    'Distributes freshly cooked, nutritionally fortified lunches and fruit rations to street-dwelling children and homeless elder citizens.',
    'Food support',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    '🍲',
    'Annapurna Feeding Network (Sample)',
    'Registered Society NGO (Sample)',
    'Maharashtra & Delhi NCR, India',
    'SAMPLE-FOD-DL-2022-441',
    40000,
    31400,
    285,
    'All-India Food Relief Alliance',
    true
  ),
  (
    'cs_env_mangroves',
    'Coastal Mangrove & Miyawaki Forest',
    'Restoring vulnerable coastal wetlands with 10,000 salt-tolerant mangrove saplings.',
    'Prevents coastal erosion, mitigates cyclone tidal impacts, and restores biodiversity habitats through community-monitored bio-shields.',
    'Environment',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    '🌱',
    'Green Earth Bio Trust (Sample)',
    'Environmental Protection Society (Sample)',
    'West Bengal & Odisha, India',
    'SAMPLE-ENV-WB-2021-902',
    60000,
    24600,
    197,
    'Bay of Bengal Coastal Conservation',
    true
  )
on conflict (id) do nothing;
