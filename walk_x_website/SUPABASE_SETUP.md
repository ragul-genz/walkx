# WalkX Platform — Supabase Integration & Configuration Guide

This guide details how to configure a live **Supabase** backend for the WalkX website, execute database migrations, enforce Row Level Security (RLS) policies, and configure server-side RPC functions.

---

## 🚀 Quick Turnkey Setup (5 Minutes)

### Step 1: Create a Supabase Project
1. Navigate to [https://supabase.com](https://supabase.com) and log in.
2. Click **New Project** and enter:
   - **Name**: `walkx-production`
   - **Database Password**: Choose a strong password.
   - **Region**: Choose the closest region (e.g. `ap-south-1` for Mumbai / India).
3. Wait for the database provisioning to complete (typically ~1-2 minutes).

---

### Step 2: Run Database Schema Migrations
1. In your Supabase Dashboard, open the **SQL Editor** from the left navigation bar.
2. Click **New Query**.
3. Open and copy the entire contents of [`walk_x_website/supabase/schema.sql`](./supabase/schema.sql).
4. Paste it into the SQL Editor and click **Run**.
5. Verify that all 9 tables, indexes, triggers, and RPC functions were created successfully:
   - `profiles`
   - `activity_records`
   - `points_transactions`
   - `rewards`
   - `redemptions`
   - `donation_causes`
   - `donation_records`
   - `admin_audit_logs`
   - `system_settings`

---

### Step 3: Configure Authentication Settings
In the Supabase Dashboard, go to **Authentication** -> **URL Configuration**:
1. **Site URL**:
   - For local development: `http://localhost:5174`
   - For production: `https://your-domain.walkx.app`
2. **Redirect URLs**: Add:
   - `http://localhost:5174/`
   - `http://localhost:5174/#login`
   - `http://localhost:5174/#reset-password`
   - `http://localhost:5174/#dashboard`

#### Email Confirmation Policy:
In **Authentication** -> **Providers** -> **Email**:
- **Enable Email Provider**: Toggle **ON**.
- **Confirm email**:
  - *Development / Testing*: Toggle **OFF** if you want instant login upon signup without waiting for email delivery.
  - *Production*: Toggle **ON** to require email verification.

---

### Step 4: Configure Local Environment Variables
1. In your Supabase Dashboard, go to **Project Settings** -> **API**.
2. Copy your **Project URL** and **Project API Key (`anon` / `public`)**.
3. In `walk_x_website`, create or update `.env`:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Restart your Vite development server (`npm run dev`).
5. Open `http://localhost:5174/`. Notice the **`🟢 Supabase Live`** badge in the navbar indicating successful backend connection!

---

### Step 5: Designate an Administrator Account
By default, new signups receive the `'user'` role. To grant administrative access:
1. Register an account with your desired admin email (e.g. `admin@walkx.app`).
2. In Supabase Dashboard, go to **SQL Editor** and execute:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@walkx.app';
```

3. Log in through the **Admin Portal** (`http://localhost:5174/#admin-login`) to access all 8 admin modules.

---

## 🔒 Security Architecture & Anti-Tampering Enforcement

### 1. Zero Direct Client Updates to Points Balance
Users cannot change their points balance by altering browser JavaScript or sending manual `UPDATE` queries.
- **RLS Policy & Trigger Protection**:
  The `protect_profile_fields` trigger intercepts all `UPDATE` queries on `public.profiles`. If a non-admin client attempts to alter `points_balance`, `total_steps`, or `role`, the database aborts the transaction with:
  ```
  SECURITY EXCEPTION: Points balance cannot be modified directly. Use secure RPC endpoints.
  ```

### 2. Atomic Server-Side RPC Functions (`SECURITY DEFINER`)
Sensitive financial and redemption operations are executed exclusively through stored procedures:
- `rpc_sync_steps(p_steps integer, p_date date)`:
  Enforces the 25,000 daily step anti-cheat cap, calculates points (100 steps = 1 pt), increments profile points and total steps atomically, and inserts a ledger entry into `points_transactions`.
- `rpc_redeem_reward(p_reward_id text, p_delivery_target text)`:
  Checks that the user's balance is sufficient, locks the record (`FOR UPDATE`), decrements inventory, creates a `Pending` redemption, and logs the debit.
- `rpc_pledge_donation(p_cause_id text, p_points integer)`:
  Verifies balance, deducts points, increments cause funding and donor count, and writes to `donation_records`.
- `rpc_admin_approve_redemption(p_redemption_id text, p_voucher_code text)`:
  Enforces `is_admin()` check. Regular users receive `UNAUTHORIZED: Administrative authorization required.`

---

## 📊 Feature Status & Integration Readiness

| Feature | Backend Status | Implementation Details |
| :--- | :--- | :--- |
| **User Registration & Login** | ✅ **Live Supabase Auth** | Supported with email/password, session persistence, and profile sync. |
| **Email Verification** | ✅ **Live Supabase Auth** | Fully supported via Supabase SMTP / redirect flows. |
| **Password Reset** | ✅ **Live Supabase Auth** | Password reset email trigger + new password submission. |
| **User Profiles** | ✅ **Live Database** | `profiles` table extending `auth.users` with points balance and stats. |
| **Activity Telemetry** | ✅ **Live Database** | `activity_records` table with anti-cheat caps. |
| **Points Ledger** | ✅ **Live Database** | `points_transactions` immutable credit/debit audit trail. |
| **Rewards & Redemptions** | ✅ **Live Database** | `rewards` catalog & `redemptions` queue with approval workflow. |
| **Donation Management** | ✅ **Live Database** | `donation_causes` & `donation_records` ledger. |
| **Row Level Security** | ✅ **Enforced** | Strict policies on all 9 tables. |
| **Physical Pedometer Sensors** | 🟡 *Prepared Integration* | Currently simulated via telemetry sync. Requires Google Health Connect / Apple HealthKit mobile SDK bridge in native Flutter app. |
| **Banking Monetary Payouts** | 🟡 *Prepared Integration* | Points deduction is verified in DB. Production fiat disbursements require linking a RazorpayX / Cashfree Payouts API webhook. |
