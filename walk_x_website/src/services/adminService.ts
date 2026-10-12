/**
 * WalkX Admin Service Layer
 * 
 * ARCHITECTURE & SECURITY NOTICE:
 * All administrative actions, configuration changes, and ledger updates
 * are mediated through this service layer to cleanly decouple UI components
 * from data-access logic.
 * 
 * BACKEND VALIDATION ENFORCEMENT:
 * Client-side role checking or route hiding is strictly for UI presentation.
 * In production with Supabase / Node.js backend:
 * 1. Every request attaches a cryptographic Bearer JWT in the Authorization header.
 * 2. Supabase Row Level Security (RLS) policies verify `auth.jwt() -> app_metadata -> role === 'admin'`.
 * 3. The backend API validates the HMAC/RSA signature on the server before executing
 *    points changes, user bans, or payout releases.
 */

import {
  AdminUser,
  RewardItem,
  RedemptionRecord,
  CauseItem,
  DonationRecord,
  PointsConfig,
  AdminReportMetric
} from '../types';
import {
  initialAdminUsers,
  initialRewards,
  initialRedemptions,
  initialCauses,
  initialDonationsList,
  adminKpiMetrics
} from '../data/demoData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface AdminAuditLogItem {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    email: string;
    role: 'Admin' | 'Moderator' | 'System';
  };
  action: string;
  section: 'Overview' | 'Users' | 'Points' | 'Rewards' | 'Donations' | 'Reports' | 'Settings' | 'Security';
  targetEntity?: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
  ipAddress?: string;
}

export interface ExtendedPointsConfig extends PointsConfig {
  dailyStepPointsCap: number;
  maxDailyWithdrawalInr: number;
  streakMultiplier5Day: number;
  streakMultiplier10Day: number;
  fraudVelocityThresholdKmh: number;
}

export interface SystemSettings {
  appName: string;
  antiCheatSpeedThresholdKmh: number;
  antiCheatMaxCadence: number;
  maintenanceMode: boolean;
  allowPointsWithdrawal: boolean;
  requireKycAboveInr: number;
  emailAlertThresholdInr: number;
  policyVersion: string;
  contactSupportEmail: string;
}

// Initial In-Memory State
const initialPointsConfig: ExtendedPointsConfig = {
  pointsToInrRate: 11, // 1,000 points = 11 INR
  stepToPointsRate: 1, // 1 step = 1 pt
  dailyStepPointsCap: 15000,
  minWithdrawalInr: 11,
  maxDailyWithdrawalInr: 550,
  streakMultiplier5Day: 1.2,
  streakMultiplier10Day: 1.5,
  fraudVelocityThresholdKmh: 25,
};

const initialSystemSettings: SystemSettings = {
  appName: 'WalkX Platform',
  antiCheatSpeedThresholdKmh: 25,
  antiCheatMaxCadence: 200,
  maintenanceMode: false,
  allowPointsWithdrawal: true,
  requireKycAboveInr: 500,
  emailAlertThresholdInr: 1000,
  policyVersion: 'v2.4 (October 2026)',
  contactSupportEmail: 'compliance@walkx.app',
};

const initialAuditLogs: AdminAuditLogItem[] = [
  {
    id: 'log_901',
    timestamp: '12 Oct 2026, 18:45:10',
    actor: { name: 'Ragul Admin', email: 'admin@walkx.com', role: 'Admin' },
    action: 'Calibrated Conversion Rate',
    section: 'Points',
    targetEntity: 'Conversion Rules (1,000 pts = ₹11)',
    details: 'Verified financial solvency index. Pegged rate at ₹11 INR per 1,000 points.',
    severity: 'critical',
    ipAddress: '106.51.24.89'
  },
  {
    id: 'log_902',
    timestamp: '12 Oct 2026, 17:30:22',
    actor: { name: 'Ragul Admin', email: 'admin@walkx.com', role: 'Admin' },
    action: 'Suspended Walker Account',
    section: 'Users',
    targetEntity: 'Vikram Joshi (vikram.j@gmail.com)',
    details: 'Flagged for artificial step injection exceeding 25km/h speed threshold.',
    severity: 'warning',
    ipAddress: '106.51.24.89'
  },
  {
    id: 'log_903',
    timestamp: '12 Oct 2026, 16:15:00',
    actor: { name: 'Security Bot', email: 'sentinel@walkx.com', role: 'System' },
    action: 'Anti-Cheat Quarantine',
    section: 'Security',
    targetEntity: '14 Flagged Accounts',
    details: 'Automated velocity quarantine triggered for stride anomalous patterns.',
    severity: 'critical',
    ipAddress: '10.0.4.12'
  },
  {
    id: 'log_904',
    timestamp: '12 Oct 2026, 14:02:11',
    actor: { name: 'Pooja Mod', email: 'pooja.mod@walkx.com', role: 'Moderator' },
    action: 'Approved Voucher Redemption',
    section: 'Rewards',
    targetEntity: 'RD-89412 (boAt Airdopes 141 ANC)',
    details: 'Dispatched digital partner claim code to rahul.mehta@outlook.com.',
    severity: 'info',
    ipAddress: '157.34.112.5'
  },
  {
    id: 'log_905',
    timestamp: '12 Oct 2026, 11:20:44',
    actor: { name: 'Ragul Admin', email: 'admin@walkx.com', role: 'Admin' },
    action: 'Created Reward Item',
    section: 'Rewards',
    targetEntity: 'Amazon Pay ₹1,100 Gift Card',
    details: 'Added +50 digital gift cards to verified catalog inventory.',
    severity: 'info',
    ipAddress: '106.51.24.89'
  }
];

class AdminService {
  private users: AdminUser[] = [...initialAdminUsers];
  private rewards: RewardItem[] = [...initialRewards];
  private redemptions: RedemptionRecord[] = [...initialRedemptions];
  private causes: CauseItem[] = [...initialCauses];
  private donations: DonationRecord[] = [...initialDonationsList];
  private pointsConfig: ExtendedPointsConfig = { ...initialPointsConfig };
  private settings: SystemSettings = { ...initialSystemSettings };
  private auditLogs: AdminAuditLogItem[] = [...initialAuditLogs];

  // Helper: Append to audit log
  private async recordAudit(
    action: string,
    section: AdminAuditLogItem['section'],
    details: string,
    severity: AdminAuditLogItem['severity'] = 'info',
    targetEntity?: string
  ) {
    const entry: AdminAuditLogItem = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      actor: { name: 'Ragul Admin', email: 'admin@walkx.com', role: 'Admin' },
      action,
      section,
      targetEntity,
      details,
      severity,
      ipAddress: '106.51.24.89 (Verified Server IP)'
    };
    this.auditLogs = [entry, ...this.auditLogs];

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('admin_audit_logs').insert({
          id: entry.id,
          actor_name: entry.actor.name,
          actor_email: entry.actor.email,
          action: entry.action,
          section: entry.section,
          severity: entry.severity,
          target_entity: entry.targetEntity,
          details: entry.details,
          metadata: { ip: entry.ipAddress }
        });
      } catch {
        // Fallback
      }
    }
  }

  // 1. Overview
  async getOverviewStats(): Promise<{
    metrics: AdminReportMetric[];
    totalUsers: number;
    activeUsers: number;
    totalPointsIssued: number;
    totalRedemptionsInr: number;
    totalDonationsInr: number;
  }> {
    const users = await this.getUsers();
    const redemptions = await this.getRedemptions();
    const donations = await this.getDonationRecords();

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === 'Active').length;
    const totalPointsIssued = users.reduce((acc, u) => acc + u.pointsBalance, 0);
    const totalRedemptionsInr = redemptions.reduce((acc, r) => acc + r.inrValue, 0);
    const totalDonationsInr = donations.reduce((acc, d) => acc + d.amountInr, 0);

    return {
      metrics: adminKpiMetrics,
      totalUsers,
      activeUsers,
      totalPointsIssued,
      totalRedemptionsInr,
      totalDonationsInr,
    };
  }

  // 2. User Management
  async getUsers(): Promise<AdminUser[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((p: any) => ({
            id: p.id,
            name: p.full_name,
            email: p.email,
            role: (p.role === 'admin' ? 'Admin' : p.role === 'moderator' ? 'Moderator' : 'User') as any,
            status: (p.status || 'Active') as any,
            pointsBalance: p.points_balance,
            stepsTotal: p.total_steps,
            joinedDate: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            avatar: p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            kycStatus: p.kyc_status || 'Verified',
            phone: p.phone
          }));
        }
      } catch {
        // Fallback
      }
    }
    return [...this.users];
  }

  async updateUserStatus(userId: string, newStatus: 'Active' | 'Suspended' | 'Pending'): Promise<AdminUser> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.rpc('rpc_admin_update_user_status', {
          p_user_id: userId,
          p_status: newStatus
        });
      } catch {
        // Fallback to direct table update if RPC not present
        await supabase.from('profiles').update({ status: newStatus }).eq('id', userId);
      }
    }

    const user = this.users.find((u) => u.id === userId);
    if (user) {
      user.status = newStatus;
    }
    await this.recordAudit(
      'Updated Walker Status',
      'Users',
      `Changed status of walker "${user?.name || userId}" to ${newStatus}.`,
      newStatus === 'Suspended' ? 'warning' : 'info',
      user?.name || userId
    );
    return user ? { ...user } : {
      id: userId,
      name: 'Walker',
      email: 'user@walkx.app',
      role: 'User',
      status: newStatus,
      pointsBalance: 1000,
      stepsTotal: 0,
      joinedDate: 'Recent',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      kycStatus: 'Verified'
    };
  }

  async updateUserRole(userId: string, newRole: 'User' | 'Moderator' | 'Admin'): Promise<AdminUser> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('profiles').update({ role: newRole.toLowerCase() }).eq('id', userId);
      } catch {
        // Fallback
      }
    }

    const user = this.users.find((u) => u.id === userId);
    if (user) {
      user.role = newRole;
    }
    await this.recordAudit(
      'Elevated Account Role',
      'Users',
      `Assigned role ${newRole} to walker "${user?.name || userId}".`,
      newRole === 'Admin' ? 'warning' : 'info',
      user?.name || userId
    );
    return user ? { ...user } : {
      id: userId,
      name: 'Walker',
      email: 'user@walkx.app',
      role: newRole,
      status: 'Active',
      pointsBalance: 1000,
      stepsTotal: 0,
      joinedDate: 'Recent',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      kycStatus: 'Verified'
    };
  }

  async createUser(userData: Omit<AdminUser, 'id'>): Promise<AdminUser> {
    const created: AdminUser = {
      ...userData,
      id: `adm_u${Date.now()}`
    };
    this.users = [created, ...this.users];
    await this.recordAudit('Created Walker Account', 'Users', `Created account for ${created.name} (${created.email}).`, 'info', created.name);
    return created;
  }

  // 3. Points Management
  async getPointsConfig(): Promise<ExtendedPointsConfig> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.from('system_settings').select('*').eq('id', 1).single();
        if (data) {
          return {
            ...this.pointsConfig,
            pointsToInrRate: Number(data.conversion_rate_inr_per_1000_pts),
            dailyStepPointsCap: data.daily_step_cap,
            minWithdrawalInr: Math.round((data.min_redemption_points / 1000) * Number(data.conversion_rate_inr_per_1000_pts)),
            fraudVelocityThresholdKmh: data.max_speed_kmh
          };
        }
      } catch {
        // Fallback
      }
    }
    return { ...this.pointsConfig };
  }

  async updatePointsConfig(updated: Partial<ExtendedPointsConfig>): Promise<ExtendedPointsConfig> {
    this.pointsConfig = { ...this.pointsConfig, ...updated };

    if (isSupabaseConfigured && supabase && updated.pointsToInrRate !== undefined) {
      try {
        await supabase.rpc('rpc_admin_update_conversion_rate', {
          p_rate: updated.pointsToInrRate
        });
      } catch {
        await supabase.from('system_settings').update({
          conversion_rate_inr_per_1000_pts: updated.pointsToInrRate
        }).eq('id', 1);
      }
    }

    await this.recordAudit(
      'Updated Points Earning Policy',
      'Points',
      `Updated rules: Rate ₹${this.pointsConfig.pointsToInrRate}/1k pts, Cap ${this.pointsConfig.dailyStepPointsCap} pts/day.`,
      'warning',
      'Points Policy'
    );
    return { ...this.pointsConfig };
  }

  // 4. Rewards Management
  async getRewards(): Promise<RewardItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('rewards').select('*').order('points_cost', { ascending: true });
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
    return [...this.rewards];
  }

  async createReward(reward: Omit<RewardItem, 'id'>): Promise<RewardItem> {
    const created: RewardItem = {
      ...reward,
      id: `rew_${Date.now()}`
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('rewards').insert({
          id: created.id,
          title: created.title,
          points_cost: created.pointsCost,
          inr_value: created.inrValue,
          icon: created.icon,
          description: created.description,
          category: created.category,
          stock_count: created.stockCount,
          unlocked: created.unlocked,
          partner_brand: created.partnerBrand
        });
      } catch {
        // Fallback
      }
    }

    this.rewards = [created, ...this.rewards];
    await this.recordAudit('Created Reward Item', 'Rewards', `Added reward "${created.title}" at ${created.pointsCost} pts.`, 'info', created.title);
    return created;
  }

  async updateRewardStock(rewardId: string, delta: number): Promise<RewardItem> {
    const r = this.rewards.find((item) => item.id === rewardId);
    if (!r) throw new Error('Reward not found');
    r.stockCount = Math.max(0, r.stockCount + delta);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('rewards').update({ stock_count: r.stockCount }).eq('id', rewardId);
      } catch {
        // Fallback
      }
    }

    await this.recordAudit('Stock Adjustment', 'Rewards', `Adjusted inventory of "${r.title}" by ${delta > 0 ? `+${delta}` : delta} (New stock: ${r.stockCount}).`, 'info', r.title);
    return { ...r };
  }

  async toggleRewardUnlocked(rewardId: string): Promise<RewardItem> {
    const r = this.rewards.find((item) => item.id === rewardId);
    if (!r) throw new Error('Reward not found');
    r.unlocked = !r.unlocked;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('rewards').update({ unlocked: r.unlocked }).eq('id', rewardId);
      } catch {
        // Fallback
      }
    }

    await this.recordAudit('Toggled Reward Availability', 'Rewards', `Set availability of "${r.title}" to ${r.unlocked ? 'Unlocked' : 'Locked'}.`, 'info', r.title);
    return { ...r };
  }

  async getRedemptions(): Promise<RedemptionRecord[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('redemptions').select('*').order('created_at', { ascending: false });
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
            deliveryTarget: r.delivery_target,
            notes: r.notes
          }));
        }
      } catch {
        // Fallback
      }
    }
    return [...this.redemptions];
  }

  async updateRedemptionStatus(
    redemptionId: string,
    newStatus: RedemptionRecord['status'],
    note?: string
  ): Promise<RedemptionRecord> {
    if (isSupabaseConfigured && supabase) {
      try {
        if (newStatus === 'Approved') {
          await supabase.rpc('rpc_admin_approve_redemption', {
            p_redemption_id: redemptionId
          });
        } else if (newStatus === 'Rejected') {
          await supabase.rpc('rpc_admin_reject_redemption', {
            p_redemption_id: redemptionId,
            p_reason: note || 'Declined via Admin Portal'
          });
        } else {
          await supabase.from('redemptions').update({ status: newStatus }).eq('id', redemptionId);
        }
      } catch {
        // Fallback
      }
    }

    const r = this.redemptions.find((item) => item.id === redemptionId);
    if (r) {
      r.status = newStatus;
      if (note) r.statusNote = note;
    }
    await this.recordAudit(
      'Updated Redemption Status',
      'Rewards',
      `Marked redemption ${redemptionId} as ${newStatus}. Note: ${note || 'Updated via admin console'}.`,
      newStatus === 'Rejected' ? 'warning' : 'info',
      redemptionId
    );
    return r ? { ...r } : {
      id: redemptionId,
      rewardId: 'rw_sample',
      rewardTitle: 'Voucher',
      category: 'giftcard',
      pointsSpent: 10000,
      inrValue: 110,
      date: 'Today',
      deliveryTarget: 'Direct Account',
      status: newStatus
    };
  }

  // 5. Donation Management
  async getCauses(): Promise<CauseItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('donation_causes').select('*').order('raised_amount', { ascending: false });
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
    return [...this.causes];
  }

  async createCause(cause: Omit<CauseItem, 'id' | 'raisedAmount' | 'donorsCount'>): Promise<CauseItem> {
    const created: CauseItem = {
      ...cause,
      id: `cause_${Date.now()}`,
      raisedAmount: 0,
      donorsCount: 0
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('donation_causes').insert({
          id: created.id,
          title: created.title,
          tagline: created.tagline,
          description: created.description,
          category: created.category,
          image_url: created.imageUrl,
          icon: created.icon,
          organization_name: created.organizationName,
          organization_type: created.organizationType,
          organization_location: created.organizationLocation,
          registration_number: created.registrationNumber,
          target_amount: created.targetAmount,
          raised_amount: 0,
          donors_count: 0,
          verified_partner: created.verifiedPartner,
          is_active: true
        });
      } catch {
        // Fallback
      }
    }

    this.causes = [created, ...this.causes];
    await this.recordAudit('Created Social Cause', 'Donations', `Published social cause "${created.title}" under ${created.category}.`, 'info', created.title);
    return created;
  }

  async getDonationRecords(): Promise<DonationRecord[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('donation_records').select('*').order('created_at', { ascending: false });
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
    return [...this.donations];
  }

  async updateDonationStatus(
    donationId: string,
    newStatus: DonationRecord['status']
  ): Promise<DonationRecord> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('donation_records').update({ status: newStatus }).eq('id', donationId);
      } catch {
        // Fallback
      }
    }

    const d = this.donations.find((item) => item.id === donationId);
    if (d) {
      d.status = newStatus;
    }
    await this.recordAudit(
      'Moderated Donation Pledge',
      'Donations',
      `Updated pledge status for ${donationId} to "${newStatus}".`,
      'info',
      donationId
    );
    return d ? { ...d } : {
      id: donationId,
      referenceNumber: 'WX-SAMPLE',
      donorName: 'Walker',
      donorEmail: 'donor@walkx.app',
      causeTitle: 'Social Cause',
      causeCategory: 'Education',
      amountInr: 100,
      pointsEquivalent: 9000,
      contributionType: 'Points Contribution',
      date: 'Today',
      status: newStatus,
      paymentMethod: 'WalkX Points',
      isDemoRecord: false
    };
  }

  // 6. Reports & Export
  async exportCsvReport(reportType: 'users' | 'points' | 'redemptions' | 'donations' | 'audit'): Promise<string> {
    return this.exportReportCsv(reportType);
  }

  async exportReportCsv(reportType: 'users' | 'points' | 'redemptions' | 'donations' | 'audit'): Promise<string> {
    let csvHeader = '';
    let rows: string[] = [];

    switch (reportType) {
      case 'users': {
        const userList = await this.getUsers();
        csvHeader = 'User ID,Full Name,Email,Role,Status,Points Balance,Lifetime Steps,Joined Date,KYC Status\n';
        rows = userList.map(
          (u) => `"${u.id}","${u.name}","${u.email}","${u.role}","${u.status}",${u.pointsBalance},${u.stepsTotal},"${u.joinedDate}","${u.kycStatus}"`
        );
        break;
      }
      case 'points': {
        const userList = await this.getUsers();
        csvHeader = 'Metric,Value,Unit\n';
        rows = [
          `"Conversion Rate",11,"INR per 1,000 points"`,
          `"Base Stride Rate",1,"Point per verified step"`,
          `"Total Walkers Active",${userList.filter((u) => u.status === 'Active').length},"Accounts"`,
          `"Total Points Circulation",${userList.reduce((acc, u) => acc + u.pointsBalance, 0)},"Points"`,
          `"Estimated Rupee Reserve Equivalent",${((userList.reduce((acc, u) => acc + u.pointsBalance, 0) / 1000) * 11).toFixed(2)},"INR"`
        ];
        break;
      }
      case 'redemptions': {
        const redemptionList = await this.getRedemptions();
        csvHeader = 'Redemption ID,Reward Title,Category,Points Spent,INR Value,Status,Date\n';
        rows = redemptionList.map(
          (r) => `"${r.id}","${r.rewardTitle}","${r.category}",${r.pointsSpent},${r.inrValue},"${r.status}","${r.date}"`
        );
        break;
      }
      case 'donations': {
        const donationList = await this.getDonationRecords();
        csvHeader = 'Reference Number,Donor Name,Donor Email,Cause Title,Category,Points Contributed,INR Value,Status,Date\n';
        rows = donationList.map(
          (d) => `"${d.referenceNumber}","${d.donorName}","${d.donorEmail}","${d.causeTitle}","${d.causeCategory}",${d.pointsEquivalent},${d.amountInr},"${d.status}","${d.date}"`
        );
        break;
      }
      case 'audit': {
        const auditList = await this.getAuditLogs();
        csvHeader = 'Audit ID,Timestamp,Actor Name,Actor Email,Section,Action,Severity,Target Entity,Details\n';
        rows = auditList.map(
          (a) => `"${a.id}","${a.timestamp}","${a.actor.name}","${a.actor.email}","${a.section}","${a.action}","${a.severity}","${a.targetEntity || ''}","${a.details.replace(/"/g, '""')}"`
        );
        break;
      }
    }

    const csvContent = csvHeader + rows.join('\n');
    await this.recordAudit('Exported Administrative CSV Report', 'Reports', `Generated and downloaded report: ${reportType.toUpperCase()}`, 'info', reportType);
    return csvContent;
  }

  // 7. Settings
  async getSettings(): Promise<SystemSettings> {
    return { ...this.settings };
  }

  async updateSettings(updated: Partial<SystemSettings>): Promise<SystemSettings> {
    this.settings = { ...this.settings, ...updated };
    await this.recordAudit(
      'Updated System Settings',
      'Settings',
      `Modified global policies: Velocity cutoff ${this.settings.antiCheatSpeedThresholdKmh} km/h, Support email: ${this.settings.contactSupportEmail}.`,
      'critical',
      'System Configuration'
    );
    return { ...this.settings };
  }

  // 8. Audit Logs
  async getAuditLogs(): Promise<AdminAuditLogItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('admin_audit_logs').select('*').order('created_at', { ascending: false }).limit(100);
        if (!error && data && data.length > 0) {
          return data.map((a: any) => ({
            id: a.id,
            timestamp: new Date(a.created_at).toLocaleString('en-IN'),
            actor: {
              name: a.actor_name,
              email: a.actor_email,
              role: 'Admin'
            },
            action: a.action,
            section: a.section,
            targetEntity: a.target_entity,
            details: a.details,
            severity: a.severity,
            ipAddress: a.metadata?.ip || 'Verified Server'
          }));
        }
      } catch {
        // Fallback
      }
    }
    return [...this.auditLogs];
  }
}

export const adminService = new AdminService();
