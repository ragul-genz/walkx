-- ==============================================================================
-- WalkX Platform — Database Migration 002: Secure Server Functions & Triggers
-- ==============================================================================
-- CRITICAL SECURITY REQUIREMENT:
-- Move all sensitive operations to secure server-side functions (SECURITY DEFINER).
-- Prevent users from changing their points balance, approving their own redemptions,
-- or modifying donation payment status.
-- ==============================================================================

-- 1. TRIGGER: AUTOMATIC PROFILE CREATION ON SIGNUP
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    phone,
    role,
    points_balance,
    total_steps,
    streak_days,
    status
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_app_meta_data->>'role', 'user'),
    1000, -- Initial 1,000 points onboarding welcome bonus
    0,
    1,
    'Active'
  )
  on conflict (id) do nothing;

  -- Create welcome points transaction in ledger
  insert into public.points_transactions (
    user_id,
    title,
    detail,
    points,
    type,
    category,
    status
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

-- Attach trigger to auth.users table
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. TRIGGER: PREVENT DIRECT TAMPERING OF SENSITIVE PROFILE FIELDS
create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
as $$
begin
  -- If not executed by service_role or verified admin:
  if (auth.jwt() ->> 'role' is distinct from 'service_role') and
     (not exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')) then
    -- Protect points balance
    if (NEW.points_balance is distinct from OLD.points_balance) then
      raise exception 'SECURITY EXCEPTION: Points balance cannot be modified directly. Use secure RPC endpoints.';
    end if;

    -- Protect user role privilege escalation
    if (NEW.role is distinct from OLD.role) then
      raise exception 'SECURITY EXCEPTION: Direct role privilege escalation is forbidden.';
    end if;

    -- Protect total steps from arbitrary increment
    if (NEW.total_steps is distinct from OLD.total_steps) then
      raise exception 'SECURITY EXCEPTION: Total steps must be ingested through verified telemetry sync.';
    end if;

    -- Protect account status
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

-- 3. SECURE RPC: SYNC STEPS TELEMETRY & ISSUE POINTS
-- Validates steps, enforces daily cap anti-cheat, updates profile points atomically,
-- writes activity record, and writes transaction ledger row.
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
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  -- Verify user is Active
  select status into v_user_status from public.profiles where id = v_user_id;
  if v_user_status = 'Suspended' then
    raise exception 'Account suspended: Stride ingestion paused.';
  end if;

  if p_steps <= 0 then
    raise exception 'Step count must be greater than 0';
  end if;

  -- Fetch settings
  select daily_step_cap, base_stride_rate
  into v_daily_cap, v_base_rate
  from public.system_settings where id = 1;

  if v_daily_cap is null then v_daily_cap := 25000; end if;
  if v_base_rate is null then v_base_rate := 100; end if;

  -- Check existing activity for the date
  select steps into v_existing_steps
  from public.activity_records
  where user_id = v_user_id and date = p_date;

  if v_existing_steps is null then v_existing_steps := 0; end if;

  -- Cap daily steps to avoid anti-cheat violations
  v_allowed_steps := least(p_steps, greatest(0, v_daily_cap - v_existing_steps));

  -- 1 Point earned per 100 steps (or 1:1 if configured)
  v_points_earned := v_allowed_steps / v_base_rate;
  if v_points_earned < 1 and v_allowed_steps >= 100 then
    v_points_earned := 1;
  end if;

  -- In local / demo mode 1:1 step to point mapping is supported if v_base_rate = 1
  -- Standard WalkX: 1 point per 100 steps or direct points earned
  if v_base_rate = 1 then
    v_points_earned := v_allowed_steps;
  end if;

  v_dist := round((v_allowed_steps * 0.00075)::numeric, 2);
  v_cal := round(v_allowed_steps * 0.042);
  v_min := round(v_allowed_steps / 115);

  -- Atomic update on profiles table bypassing direct client lock
  update public.profiles
  set
    points_balance = points_balance + v_points_earned,
    total_steps = total_steps + v_allowed_steps,
    updated_at = timezone('utc'::text, now())
  where id = v_user_id
  returning points_balance, total_steps into v_new_balance, v_new_total_steps;

  -- Upsert activity record
  insert into public.activity_records (
    user_id,
    date,
    steps,
    distance_km,
    calories,
    active_minutes,
    points_earned,
    synced_at
  ) values (
    v_user_id,
    p_date,
    v_existing_steps + v_allowed_steps,
    v_dist,
    v_cal,
    v_min,
    v_points_earned,
    timezone('utc'::text, now())
  )
  on conflict (user_id, date) do update
  set
    steps = activity_records.steps + v_allowed_steps,
    distance_km = activity_records.distance_km + v_dist,
    calories = activity_records.calories + v_cal,
    active_minutes = activity_records.active_minutes + v_min,
    points_earned = activity_records.points_earned + v_points_earned,
    synced_at = timezone('utc'::text, now());

  -- Record points transaction ledger
  if v_points_earned > 0 then
    insert into public.points_transactions (
      user_id,
      title,
      detail,
      points,
      type,
      category,
      status
    ) values (
      v_user_id,
      'Stride Telemetry Sync',
      format('Logged +%s verified steps', to_char(v_allowed_steps, 'FM999,999,999')),
      v_points_earned,
      'credit',
      'steps',
      'completed'
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

-- 4. SECURE RPC: REDEEM REWARD
-- Verifies points balance, atomically deducts points, decrements stock, creates redemption request
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
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  -- Lock and fetch user points
  select points_balance into v_points_balance
  from public.profiles
  where id = v_user_id and status = 'Active'
  for update;

  if v_points_balance is null then
    raise exception 'User profile not found or inactive';
  end if;

  -- Lock and fetch reward
  select * into v_reward
  from public.rewards
  where id = p_reward_id and unlocked = true
  for update;

  if v_reward.id is null then
    raise exception 'Reward item not found or unavailable';
  end if;

  if v_reward.stock_count <= 0 then
    raise exception 'Item out of stock';
  end if;

  if v_points_balance < v_reward.points_cost then
    raise exception 'Insufficient WalkX Points: Required % pts, available % pts', v_reward.points_cost, v_points_balance;
  end if;

  -- Deduct points from profile
  update public.profiles
  set
    points_balance = points_balance - v_reward.points_cost,
    updated_at = timezone('utc'::text, now())
  where id = v_user_id
  returning points_balance into v_new_balance;

  -- Decrement reward stock
  update public.rewards
  set stock_count = stock_count - 1
  where id = p_reward_id;

  -- Generate redemption ID
  v_redemption_id := 'rdm_' || floor(extract(epoch from now()) * 1000)::text;

  -- Create redemption record
  insert into public.redemptions (
    id,
    user_id,
    reward_id,
    reward_title,
    category,
    points_spent,
    inr_value,
    delivery_target,
    voucher_code,
    status
  ) values (
    v_redemption_id,
    v_user_id,
    v_reward.id,
    v_reward.title,
    v_reward.category,
    v_reward.points_cost,
    v_reward.inr_value,
    coalesce(p_delivery_target, 'Direct Account'),
    null,
    'Pending'
  );

  -- Record debit transaction in ledger
  insert into public.points_transactions (
    user_id,
    title,
    detail,
    points,
    type,
    category,
    reference_id,
    status
  ) values (
    v_user_id,
    'Reward Claim: ' || v_reward.title,
    format('Redeemed %s (%s pts)', v_reward.title, to_char(v_reward.points_cost, 'FM999,999,999')),
    v_reward.points_cost,
    'debit',
    'redemption',
    v_redemption_id,
    'completed'
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

-- 5. SECURE RPC: PLEDGE DONATION TO CHARITABLE CAUSE
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
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_points <= 0 then
    raise exception 'Points contributed must be greater than 0';
  end if;

  -- Lock user profile
  select id, full_name, email, points_balance into v_user_record
  from public.profiles
  where id = v_user_id and status = 'Active'
  for update;

  if v_user_record.id is null then
    raise exception 'User profile not found or inactive';
  end if;

  if v_user_record.points_balance < p_points then
    raise exception 'Insufficient balance: You have % pts, attempted to pledge % pts', v_user_record.points_balance, p_points;
  end if;

  -- Lock cause
  select * into v_cause
  from public.donation_causes
  where id = p_cause_id and is_active = true
  for update;

  if v_cause.id is null then
    raise exception 'Social cause not found or inactive';
  end if;

  -- Rupee equivalent (1,000 pts = ₹11 => ₹0.011 per pt)
  v_inr_amount := round((p_points * 0.011)::numeric, 2);

  -- Deduct points from user profile
  update public.profiles
  set
    points_balance = points_balance - p_points,
    updated_at = timezone('utc'::text, now())
  where id = v_user_id
  returning points_balance into v_new_balance;

  -- Increment cause funding and donors count
  update public.donation_causes
  set
    raised_amount = raised_amount + v_inr_amount,
    donors_count = donors_count + 1
  where id = p_cause_id;

  v_donation_id := 'dn_' || floor(extract(epoch from now()) * 1000)::text;
  v_ref_num := 'WX-DON-' || floor(1000 + random() * 9000)::text;

  -- Create donation record
  insert into public.donation_records (
    id,
    reference_number,
    user_id,
    donor_name,
    donor_email,
    cause_id,
    cause_title,
    cause_category,
    points_contributed,
    amount_inr,
    contribution_type,
    status,
    payment_method,
    is_demo_record,
    notes
  ) values (
    v_donation_id,
    v_ref_num,
    v_user_id,
    v_user_record.full_name,
    v_user_record.email,
    v_cause.id,
    v_cause.title,
    v_cause.category,
    p_points,
    v_inr_amount,
    'Points Contribution',
    'Points Pledged',
    'WalkX Points',
    false,
    format('Direct contribution to %s (%s)', v_cause.title, v_cause.organization_name)
  );

  -- Log transaction ledger
  insert into public.points_transactions (
    user_id,
    title,
    detail,
    points,
    type,
    category,
    reference_id,
    status
  ) values (
    v_user_id,
    'Points Contribution: ' || v_cause.title,
    format('Pledged %s pts (₹%s) to %s', to_char(p_points, 'FM999,999,999'), v_inr_amount, v_cause.category),
    p_points,
    'debit',
    'donation',
    v_donation_id,
    'completed'
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

-- 6. SECURE RPC: UPI WITHDRAWAL (CASH CONVERSION)
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
  v_tx_id text;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_inr_amount < 11 then
    raise exception 'Minimum withdrawal is ₹11 (1,000 pts)';
  end if;

  -- 1,000 pts = ₹11
  v_points_required := round((p_inr_amount / 11.0) * 1000)::integer;

  select points_balance into v_current_balance
  from public.profiles
  where id = v_user_id and status = 'Active'
  for update;

  if v_current_balance < v_points_required then
    raise exception 'Insufficient balance: % pts required, % pts available', v_points_required, v_current_balance;
  end if;

  update public.profiles
  set
    points_balance = points_balance - v_points_required,
    updated_at = timezone('utc'::text, now())
  where id = v_user_id
  returning points_balance into v_new_balance;

  v_tx_id := 'tx_' || floor(extract(epoch from now()) * 1000)::text;

  insert into public.points_transactions (
    user_id,
    title,
    detail,
    points,
    type,
    category,
    status
  ) values (
    v_user_id,
    format('Instant UPI Withdrawal (₹%s)', p_inr_amount),
    format('Disbursed to %s', p_upi_id),
    v_points_required,
    'debit',
    'withdrawal',
    'completed'
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

-- 7. SECURE ADMIN RPC: APPROVE REDEMPTION
-- Enforces admin role check. Regular users CANNOT execute this!
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
  v_actor_name text;
  v_actor_email text;
  v_code text;
begin
  v_actor_id := auth.uid();
  if not public.is_admin() then
    raise exception 'UNAUTHORIZED: Administrative authorization required to approve redemptions.';
  end if;

  select full_name, email into v_actor_name, v_actor_email
  from public.profiles where id = v_actor_id;

  v_code := coalesce(p_voucher_code, 'WX-' || upper(substr(md5(random()::text), 1, 8)));

  update public.redemptions
  set
    status = 'Approved',
    voucher_code = v_code,
    updated_at = timezone('utc'::text, now())
  where id = p_redemption_id;

  -- Create audit log
  insert into public.admin_audit_logs (
    id,
    actor_id,
    actor_name,
    actor_email,
    action,
    section,
    severity,
    target_entity,
    details
  ) values (
    'log_' || floor(extract(epoch from now()) * 1000)::text,
    v_actor_id,
    coalesce(v_actor_name, 'Admin'),
    coalesce(v_actor_email, 'admin@walkx.app'),
    'APPROVE_REDEMPTION',
    'rewards',
    'info',
    p_redemption_id,
    format('Approved redemption claim %s with voucher code %s', p_redemption_id, v_code)
  );

  return jsonb_build_object('success', true, 'status', 'Approved', 'voucher_code', v_code);
end;
$$;

-- 8. SECURE ADMIN RPC: REJECT REDEMPTION WITH POINTS REFUND
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
  v_actor_name text;
  v_actor_email text;
  v_redemption record;
begin
  v_actor_id := auth.uid();
  if not public.is_admin() then
    raise exception 'UNAUTHORIZED: Administrative authorization required.';
  end if;

  select full_name, email into v_actor_name, v_actor_email
  from public.profiles where id = v_actor_id;

  select * into v_redemption from public.redemptions where id = p_redemption_id;
  if v_redemption.id is null then
    raise exception 'Redemption record not found';
  end if;

  update public.redemptions
  set
    status = 'Rejected',
    notes = p_reason,
    updated_at = timezone('utc'::text, now())
  where id = p_redemption_id;

  -- Refund points to user
  update public.profiles
  set
    points_balance = points_balance + v_redemption.points_spent,
    updated_at = timezone('utc'::text, now())
  where id = v_redemption.user_id;

  -- Log refund in points transactions
  insert into public.points_transactions (
    user_id,
    title,
    detail,
    points,
    type,
    category,
    status
  ) values (
    v_redemption.user_id,
    'Refund: ' || v_redemption.reward_title,
    format('Points restored for rejected claim (%s)', p_reason),
    v_redemption.points_spent,
    'credit',
    'redemption',
    'completed'
  );

  -- Admin audit log
  insert into public.admin_audit_logs (
    id,
    actor_id,
    actor_name,
    actor_email,
    action,
    section,
    severity,
    target_entity,
    details
  ) values (
    'log_' || floor(extract(epoch from now()) * 1000)::text,
    v_actor_id,
    coalesce(v_actor_name, 'Admin'),
    coalesce(v_actor_email, 'admin@walkx.app'),
    'REJECT_REDEMPTION',
    'rewards',
    'warning',
    p_redemption_id,
    format('Rejected redemption %s and refunded %s points. Reason: %s', p_redemption_id, v_redemption.points_spent, p_reason)
  );

  return jsonb_build_object('success', true, 'status', 'Rejected');
end;
$$;

-- 9. SECURE ADMIN RPC: UPDATE USER STATUS (SUSPEND/ACTIVATE)
create or replace function public.rpc_admin_update_user_status(
  p_user_id uuid,
  p_status text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid;
  v_actor_name text;
  v_actor_email text;
begin
  v_actor_id := auth.uid();
  if not public.is_admin() then
    raise exception 'UNAUTHORIZED: Administrative role required.';
  end if;

  select full_name, email into v_actor_name, v_actor_email
  from public.profiles where id = v_actor_id;

  update public.profiles
  set status = p_status, updated_at = timezone('utc'::text, now())
  where id = p_user_id;

  insert into public.admin_audit_logs (
    id,
    actor_id,
    actor_name,
    actor_email,
    action,
    section,
    severity,
    target_entity,
    details
  ) values (
    'log_' || floor(extract(epoch from now()) * 1000)::text,
    v_actor_id,
    coalesce(v_actor_name, 'Admin'),
    coalesce(v_actor_email, 'admin@walkx.app'),
    'UPDATE_USER_STATUS',
    'users',
    'warning',
    p_user_id::text,
    format('Changed account status of %s to %s', p_user_id, p_status)
  );

  return jsonb_build_object('success', true, 'status', p_status);
end;
$$;

-- 10. SECURE ADMIN RPC: UPDATE CONVERSION RATE
create or replace function public.rpc_admin_update_conversion_rate(
  p_rate numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid;
  v_actor_name text;
  v_actor_email text;
begin
  v_actor_id := auth.uid();
  if not public.is_admin() then
    raise exception 'UNAUTHORIZED: Administrative role required.';
  end if;

  select full_name, email into v_actor_name, v_actor_email
  from public.profiles where id = v_actor_id;

  update public.system_settings
  set
    conversion_rate_inr_per_1000_pts = p_rate,
    updated_at = timezone('utc'::text, now())
  where id = 1;

  insert into public.admin_audit_logs (
    id,
    actor_id,
    actor_name,
    actor_email,
    action,
    section,
    severity,
    target_entity,
    details
  ) values (
    'log_' || floor(extract(epoch from now()) * 1000)::text,
    v_actor_id,
    coalesce(v_actor_name, 'Admin'),
    coalesce(v_actor_email, 'admin@walkx.app'),
    'CALIBRATE_CONVERSION_RATE',
    'points',
    'critical',
    'system_settings',
    format('Calibrated points conversion rate to ₹%s per 1,000 points', p_rate)
  );

  return jsonb_build_object('success', true, 'new_rate', p_rate);
end;
$$;
