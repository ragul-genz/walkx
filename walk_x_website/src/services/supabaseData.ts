import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  UserProfile,
  Transaction,
  RewardItem,
  RedemptionRecord,
  CauseItem,
  DonationRecord,
  StrideData
} from '../types';
import {
  initialUserProfile,
  weeklyStrideTelemetry,
  initialTransactions,
  initialRewards,
  initialRedemptions,
  initialCauses,
  initialDonationsList
} from '../data/demoData';

/**
 * Service Layer for Supabase Database Operations
 * Strictly uses secure RPC functions for sensitive balance and redemption updates.
 */
export const supabaseData = {
  /**
   * Fetch current authenticated user's profile
   */
  async getProfile(): Promise<UserProfile | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        if (!userId) return null;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error || !data) return null;

        return {
          id: data.id,
          name: data.full_name,
          email: data.email,
          phone: data.phone || '+91 98765 43210',
          avatarUrl: data.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          joinDate: new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          memberTier: data.points_balance > 10000 ? 'Platinum Walker' : data.points_balance > 5000 ? 'Gold Walker' : 'Silver Walker',
          totalPoints: data.points_balance,
          redeemedPoints: 0,
          donatedPoints: 0,
          stepsToday: 0,
          dailyGoal: 10000,
          streakDays: data.streak_days,
          lifetimeSteps: data.total_steps,
          caloriesBurned: Math.round(data.total_steps * 0.042),
          distanceCoveredKm: Number((data.total_steps * 0.00075).toFixed(1)),
          co2SavedKg: Number((data.total_steps * 0.00018).toFixed(1)),
          badgesEarned: 5,
        };
      } catch (err) {
        console.warn('Failed to load profile from Supabase:', err);
      }
    }

    // Demo Sandbox Profile Fallback
    const local = localStorage.getItem('walkx_demo_user');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        return {
          ...initialUserProfile,
          name: parsed.name || initialUserProfile.name,
          email: parsed.email || initialUserProfile.email,
          phone: parsed.phone || initialUserProfile.phone,
          totalPoints: parsed.pointsBalance ?? initialUserProfile.totalPoints,
          lifetimeSteps: parsed.totalSteps ?? initialUserProfile.lifetimeSteps,
          streakDays: parsed.streakDays ?? initialUserProfile.streakDays
        };
      } catch {
        // Fallback
      }
    }
    return initialUserProfile;
  },

  /**
   * Update Profile Personal Details (Full Name, Phone)
   * Note: points_balance and role are protected by RLS trigger and cannot be changed here.
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        if (!userId) return false;

        const dbUpdates: Record<string, any> = {};
        if (updates.name) dbUpdates.full_name = updates.name;
        if (updates.phone) dbUpdates.phone = updates.phone;
        if (updates.avatarUrl) dbUpdates.avatar_url = updates.avatarUrl;

        const { error } = await supabase
          .from('profiles')
          .update(dbUpdates)
          .eq('id', userId);

        return !error;
      } catch {
        return false;
      }
    }
    return true;
  },

  /**
   * Sync Daily Steps Telemetry using Secure RPC
   * Protected Server-Side: Calculates points and writes to immutable ledger.
   */
  async syncSteps(steps: number): Promise<{
    success: boolean;
    pointsEarned: number;
    newBalance?: number;
    newTotalSteps?: number;
    error?: string;
  }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('rpc_sync_steps', {
          p_steps: steps,
          p_date: new Date().toISOString().split('T')[0]
        });

        if (error) {
          return { success: false, pointsEarned: 0, error: error.message };
        }

        return {
          success: true,
          pointsEarned: data?.points_earned ?? steps,
          newBalance: data?.new_points_balance,
          newTotalSteps: data?.new_total_steps
        };
      } catch (err: any) {
        return { success: false, pointsEarned: 0, error: err.message };
      }
    }

    // Demo Sandbox simulation
    return {
      success: true,
      pointsEarned: steps
    };
  },

  /**
   * Fetch Weekly Stride Telemetry
   */
  async getActivityTelemetry(): Promise<StrideData[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        if (!userId) return weeklyStrideTelemetry;

        const { data } = await supabase
          .from('activity_records')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: true })
          .limit(7);

        if (data && data.length > 0) {
          return data.map((d: any) => ({
            day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
            steps: d.steps,
            distanceKm: Number(d.distance_km),
            calories: d.calories,
            activeMinutes: d.active_minutes
          }));
        }
      } catch {
        // Fallback
      }
    }
    return weeklyStrideTelemetry;
  },

  /**
   * Fetch Points Transaction History
   */
  async getTransactions(): Promise<Transaction[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        if (!userId) return initialTransactions;

        const { data, error } = await supabase
          .from('points_transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (!error && data && data.length > 0) {
          return data.map((t: any) => ({
            id: t.id,
            title: t.title,
            detail: t.detail || '',
            points: Math.abs(t.points),
            type: t.type,
            date: new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            category: t.category,
            status: t.status
          }));
        }
      } catch {
        // Fallback
      }
    }
    return initialTransactions;
  },

  /**
   * Fetch Rewards Catalog
   */
  async getRewards(): Promise<RewardItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('rewards')
          .select('*')
          .order('points_cost', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((r: any) => ({
            id: r.id,
            title: r.title,
            pointsCost: r.points_cost,
            inrValue: r.inr_value,
            icon: r.icon,
            description: r.description,
            category: r.category,
            stockCount: r.stock_count,
            unlocked: r.unlocked,
            partnerBrand: r.partner_brand
          }));
        }
      } catch {
        // Fallback
      }
    }
    return initialRewards;
  },

  /**
   * Redeem Reward Item via Secure RPC
   * Protected Server-Side: Verifies balance and creates redemption atomically.
   */
  async redeemReward(rewardId: string, deliveryTarget: string): Promise<{
    success: boolean;
    redemptionId?: string;
    newBalance?: number;
    error?: string;
  }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('rpc_redeem_reward', {
          p_reward_id: rewardId,
          p_delivery_target: deliveryTarget
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return {
          success: true,
          redemptionId: data?.redemption_id,
          newBalance: data?.new_points_balance
        };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Demo Sandbox simulation
    return {
      success: true,
      redemptionId: `rdm_${Date.now()}`
    };
  },

  /**
   * Fetch User's Past Redemptions
   */
  async getUserRedemptions(): Promise<RedemptionRecord[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        if (!userId) return initialRedemptions;

        const { data, error } = await supabase
          .from('redemptions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((r: any) => ({
            id: r.id,
            rewardId: r.reward_id,
            rewardTitle: r.reward_title,
            category: r.category,
            pointsSpent: r.points_spent,
            inrValue: r.inr_value,
            date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: r.status,
            voucherCode: r.voucher_code,
            deliveryTarget: r.delivery_target
          }));
        }
      } catch {
        // Fallback
      }
    }
    return initialRedemptions;
  },

  /**
   * Fetch Donation Causes
   */
  async getCauses(): Promise<CauseItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('donation_causes')
          .select('*')
          .eq('is_active', true)
          .order('raised_amount', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((c: any) => ({
            id: c.id,
            title: c.title,
            tagline: c.tagline,
            description: c.description,
            category: c.category,
            imageUrl: c.image_url,
            icon: c.icon,
            organizationName: c.organization_name,
            organizationType: c.organization_type,
            organizationLocation: c.organization_location,
            registrationNumber: c.registration_number,
            targetAmount: Number(c.target_amount),
            raisedAmount: Number(c.raised_amount),
            donorsCount: c.donors_count,
            verifiedPartner: c.verified_partner
          }));
        }
      } catch {
        // Fallback
      }
    }
    return initialCauses;
  },

  /**
   * Pledge Points Donation via Secure RPC
   * Protected Server-Side: Verifies balance and updates cause amount atomically.
   */
  async pledgeDonation(causeId: string, points: number): Promise<{
    success: boolean;
    donationId?: string;
    referenceNumber?: string;
    newBalance?: number;
    error?: string;
  }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('rpc_pledge_donation', {
          p_cause_id: causeId,
          p_points: points
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return {
          success: true,
          donationId: data?.donation_id,
          referenceNumber: data?.reference_number,
          newBalance: data?.new_points_balance
        };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Demo Sandbox simulation
    return {
      success: true,
      donationId: `dn_${Date.now()}`,
      referenceNumber: `WX-PLG-${Math.floor(1000 + Math.random() * 9000)}`
    };
  },

  /**
   * Fetch Donation History Records
   */
  async getDonationRecords(): Promise<DonationRecord[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;

        let query = supabase.from('donation_records').select('*').order('created_at', { ascending: false });
        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query;

        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            referenceNumber: d.reference_number,
            donorName: d.donor_name,
            donorEmail: d.donor_email,
            causeTitle: d.cause_title,
            causeCategory: d.cause_category,
            amountInr: Number(d.amount_inr),
            pointsEquivalent: d.points_contributed,
            contributionType: d.contribution_type,
            date: new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: d.status,
            paymentMethod: d.payment_method,
            isDemoRecord: d.is_demo_record,
            notes: d.notes
          }));
        }
      } catch {
        // Fallback
      }
    }
    return initialDonationsList;
  },

  /**
   * Withdraw Points to UPI via Secure RPC
   */
  async withdrawUpi(upiId: string, inrAmount: number): Promise<{
    success: boolean;
    newBalance?: number;
    error?: string;
  }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('rpc_withdraw_upi', {
          p_upi_id: upiId,
          p_inr_amount: inrAmount
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return {
          success: true,
          newBalance: data?.new_points_balance
        };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    return { success: true };
  }
};
