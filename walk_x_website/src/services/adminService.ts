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
    action: 'Points Rate Calibration',
    section: 'Points',
    targetEntity: 'Conversion Rules',
    details: 'Calibrated base indicative reward rate: 1,000 pts = ₹11.00 INR.',
    severity: 'info',
    ipAddress: '106.51.24.89'
  },
  {
    id: 'log_902',
    timestamp: '12 Oct 2026, 16:30:22',
    actor: { name: 'Ragul Admin', email: 'admin@walkx.com', role: 'Admin' },
    action: 'Published Social Cause',
    section: 'Donations',
    targetEntity: 'Vidya Vikas Education Trust',
    details: 'Verified sample NGO partnership and published rural education kit campaign.',
    severity: 'info',
    ipAddress: '106.51.24.89'
  },
  {
    id: 'log_903',
    timestamp: '11 Oct 2026, 14:15:00',
    actor: { name: 'Security Monitor', email: 'system@walkx.com', role: 'System' },
    action: 'Anti-Cheat Velocity Guard',
    section: 'Security',
    targetEntity: 'Session Telemetry Filter',
    details: 'Flagged vehicular step stride simulation (>35 km/h) for review.',
    severity: 'warning',
    ipAddress: '127.0.0.1'
  },
  {
    id: 'log_904',
    timestamp: '10 Oct 2026, 11:20:45',
    actor: { name: 'Ragul Admin', email: 'admin@walkx.com', role: 'Admin' },
    action: 'Voucher Inventory Restock',
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
  private recordAudit(
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
    const totalUsers = this.users.length;
    const activeUsers = this.users.filter((u) => u.status === 'Active').length;
    const totalPointsIssued = this.users.reduce((acc, u) => acc + u.pointsBalance, 0);
    const totalRedemptionsInr = this.redemptions.reduce((acc, r) => acc + r.inrValue, 0);
    const totalDonationsInr = this.donations.reduce((acc, d) => acc + d.amountInr, 0);

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
    return [...this.users];
  }

  async updateUserStatus(userId: string, newStatus: 'Active' | 'Suspended' | 'Pending'): Promise<AdminUser> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    user.status = newStatus;
    this.recordAudit(
      'Updated Walker Status',
      'Users',
      `Changed status of walker "${user.name}" (${user.email}) to ${newStatus}.`,
      newStatus === 'Suspended' ? 'warning' : 'info',
      user.name
    );
    return { ...user };
  }

  async updateUserRole(userId: string, newRole: 'User' | 'Moderator' | 'Admin'): Promise<AdminUser> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    user.role = newRole;
    this.recordAudit(
      'Elevated Account Role',
      'Users',
      `Assigned role ${newRole} to walker "${user.name}".`,
      newRole === 'Admin' ? 'warning' : 'info',
      user.name
    );
    return { ...user };
  }

  async createUser(userData: Omit<AdminUser, 'id'>): Promise<AdminUser> {
    const created: AdminUser = {
      ...userData,
      id: `adm_u${Date.now()}`
    };
    this.users = [created, ...this.users];
    this.recordAudit('Created Walker Account', 'Users', `Created account for ${created.name} (${created.email}).`, 'info', created.name);
    return created;
  }

  // 3. Points Management
  async getPointsConfig(): Promise<ExtendedPointsConfig> {
    return { ...this.pointsConfig };
  }

  async updatePointsConfig(updated: Partial<ExtendedPointsConfig>): Promise<ExtendedPointsConfig> {
    this.pointsConfig = { ...this.pointsConfig, ...updated };
    this.recordAudit(
      'Updated Points Earning Policy',
      'Points',
      `Updated rules: Rate ₹${this.pointsConfig.pointsToInrRate}/1k pts, Cap ${this.pointsConfig.dailyStepPointsCap} pts/day, Min withdrawal ₹${this.pointsConfig.minWithdrawalInr}.`,
      'warning',
      'Points Policy'
    );
    return { ...this.pointsConfig };
  }

  // 4. Rewards Management
  async getRewards(): Promise<RewardItem[]> {
    return [...this.rewards];
  }

  async createReward(reward: Omit<RewardItem, 'id'>): Promise<RewardItem> {
    const created: RewardItem = {
      ...reward,
      id: `rew_${Date.now()}`
    };
    this.rewards = [created, ...this.rewards];
    this.recordAudit('Created Reward Item', 'Rewards', `Added reward "${created.title}" at ${created.pointsCost} pts.`, 'info', created.title);
    return created;
  }

  async updateRewardStock(rewardId: string, delta: number): Promise<RewardItem> {
    const r = this.rewards.find((item) => item.id === rewardId);
    if (!r) throw new Error('Reward not found');
    r.stockCount = Math.max(0, r.stockCount + delta);
    this.recordAudit('Stock Adjustment', 'Rewards', `Adjusted inventory of "${r.title}" by ${delta > 0 ? `+${delta}` : delta} (New stock: ${r.stockCount}).`, 'info', r.title);
    return { ...r };
  }

  async toggleRewardUnlocked(rewardId: string): Promise<RewardItem> {
    const r = this.rewards.find((item) => item.id === rewardId);
    if (!r) throw new Error('Reward not found');
    r.unlocked = !r.unlocked;
    this.recordAudit('Toggled Reward Availability', 'Rewards', `Set availability of "${r.title}" to ${r.unlocked ? 'Unlocked' : 'Locked'}.`, 'info', r.title);
    return { ...r };
  }

  async getRedemptions(): Promise<RedemptionRecord[]> {
    return [...this.redemptions];
  }

  async updateRedemptionStatus(
    redemptionId: string,
    newStatus: RedemptionRecord['status'],
    note?: string
  ): Promise<RedemptionRecord> {
    const r = this.redemptions.find((item) => item.id === redemptionId);
    if (!r) throw new Error('Redemption record not found');
    r.status = newStatus;
    if (note) r.statusNote = note;
    this.recordAudit(
      'Updated Redemption Status',
      'Rewards',
      `Marked redemption ${r.id} (${r.rewardTitle}) as ${newStatus}. Note: ${note || 'Updated via admin console'}.`,
      newStatus === 'Rejected' ? 'warning' : 'info',
      r.id
    );
    return { ...r };
  }

  // 5. Donation Management
  async getCauses(): Promise<CauseItem[]> {
    return [...this.causes];
  }

  async createCause(cause: Omit<CauseItem, 'id' | 'raisedAmount' | 'donorsCount'>): Promise<CauseItem> {
    const created: CauseItem = {
      ...cause,
      id: `cause_${Date.now()}`,
      raisedAmount: 0,
      donorsCount: 0
    };
    this.causes = [created, ...this.causes];
    this.recordAudit('Created Social Cause', 'Donations', `Published social cause "${created.title}" under ${created.category}.`, 'info', created.title);
    return created;
  }

  async getDonationRecords(): Promise<DonationRecord[]> {
    return [...this.donations];
  }

  async updateDonationStatus(
    donationId: string,
    newStatus: DonationRecord['status']
  ): Promise<DonationRecord> {
    const d = this.donations.find((item) => item.id === donationId);
    if (!d) throw new Error('Donation record not found');
    d.status = newStatus;
    this.recordAudit(
      'Moderated Donation Pledge',
      'Donations',
      `Updated audit status of pledge ${d.referenceNumber} to ${newStatus}.`,
      newStatus === 'Flagged' ? 'warning' : 'info',
      d.referenceNumber
    );
    return { ...d };
  }

  // 6. Reports & Export
  async exportCsvReport(reportType: 'users' | 'points' | 'redemptions' | 'donations' | 'audit'): Promise<string> {
    let rows: string[][] = [];
    let filename = `walkx_${reportType}_report_${new Date().toISOString().slice(0, 10)}.csv`;

    switch (reportType) {
      case 'users':
        rows = [
          ['ID', 'Name', 'Email', 'Role', 'Status', 'Total Steps', 'Points Balance', 'Joined Date'],
          ...this.users.map((u) => [
            u.id,
            `"${u.name}"`,
            u.email,
            u.role,
            u.status,
            u.stepsTotal.toString(),
            u.pointsBalance.toString(),
            u.joinedDate
          ])
        ];
        break;

      case 'points':
        rows = [
          ['Metric / Parameter', 'Configured Value', 'Unit', 'Audit Notes'],
          ['Indicative Conversion Rate', `₹${this.pointsConfig.pointsToInrRate}`, 'per 1000 pts', 'Verified indicative rule'],
          ['Daily Step Points Cap', this.pointsConfig.dailyStepPointsCap.toString(), 'points/day', 'Velocity limit'],
          ['Min Withdrawal', `₹${this.pointsConfig.minWithdrawalInr}`, 'INR', 'Razorpay Payout floor'],
          ['Max Daily Withdrawal', `₹${this.pointsConfig.maxDailyWithdrawalInr}`, 'INR', 'Daily cap'],
          ['5-Day Streak Multiplier', `${this.pointsConfig.streakMultiplier5Day}x`, 'Multiplier', 'Walker retention bonus'],
          ['10-Day Streak Multiplier', `${this.pointsConfig.streakMultiplier10Day}x`, 'Multiplier', 'Walker milestone bonus']
        ];
        break;

      case 'redemptions':
        rows = [
          ['Redemption ID', 'Reward Title', 'Category', 'Points Spent', 'INR Value', 'Date', 'Status', 'Delivery Target', 'Status Note'],
          ...this.redemptions.map((r) => [
            r.id,
            `"${r.rewardTitle}"`,
            r.category,
            r.pointsSpent.toString(),
            r.inrValue.toString(),
            r.date,
            r.status,
            `"${r.deliveryTarget}"`,
            `"${r.statusNote || ''}"`
          ])
        ];
        break;

      case 'donations':
        rows = [
          ['Reference ID', 'Cause Title', 'Donor Name', 'Donor Email', 'Category', 'Contribution Type', 'Points', 'Amount INR', 'Status', 'Date'],
          ...this.donations.map((d) => [
            d.referenceNumber,
            `"${d.causeTitle}"`,
            `"${d.donorName}"`,
            d.donorEmail,
            d.causeCategory || 'Social Impact',
            d.contributionType,
            d.pointsEquivalent?.toString() || '0',
            d.amountInr.toString(),
            d.status,
            d.date
          ])
        ];
        break;

      case 'audit':
        rows = [
          ['Log ID', 'Timestamp', 'Actor Name', 'Actor Email', 'Section', 'Action', 'Target', 'Severity', 'Details'],
          ...this.auditLogs.map((l) => [
            l.id,
            l.timestamp,
            `"${l.actor.name}"`,
            l.actor.email,
            l.section,
            `"${l.action}"`,
            `"${l.targetEntity || ''}"`,
            l.severity,
            `"${l.details}"`
          ])
        ];
        break;
    }

    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.recordAudit('Exported CSV Report', 'Reports', `Generated and downloaded ${filename}.`, 'info', filename);
    return filename;
  }

  // 7. System Settings
  async getSettings(): Promise<SystemSettings> {
    return { ...this.settings };
  }

  async updateSettings(updated: Partial<SystemSettings>): Promise<SystemSettings> {
    this.settings = { ...this.settings, ...updated };
    this.recordAudit('Updated System Settings', 'Settings', 'Modified platform thresholds, anti-cheat limits, and notification triggers.', 'warning', 'System Config');
    return { ...this.settings };
  }

  // 8. Audit Logs
  async getAuditLogs(): Promise<AdminAuditLogItem[]> {
    return [...this.auditLogs];
  }
}

export const adminService = new AdminService();
