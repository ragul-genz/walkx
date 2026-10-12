export type PageId =
  | 'landing'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'dashboard'
  | 'activity'
  | 'wallet'
  | 'rewards'
  | 'donation'
  | 'donation-history'
  | 'profile'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-rewards'
  | 'admin-donations'
  | 'admin-reports'
  | 'privacy'
  | 'terms';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  memberTier: string;
  joinDate: string;
  stepsToday: number;
  dailyGoal: number;
  streakDays: number;
  totalPoints: number;
  redeemedPoints: number;
  donatedPoints: number;
}

export interface StrideData {
  day: string;
  steps: number;
  distanceKm: number;
  calories: number;
  activeMinutes: number;
}

export interface Transaction {
  id: string;
  title: string;
  detail: string;
  points: number;
  type: 'credit' | 'debit';
  date: string;
  category: 'steps' | 'reward' | 'donation' | 'bonus';
  status: 'completed' | 'processing' | 'failed';
}

export interface RewardItem {
  id: string;
  title: string;
  pointsCost: number;
  inrValue: number;
  icon: string;
  description: string;
  category: 'cash' | 'voucher' | 'merch';
  stockCount: number;
  unlocked: boolean;
  eligibility?: string;
  minStreakDays?: number;
  partnerBrand?: string;
}

export interface RedemptionRecord {
  id: string;
  rewardId: string;
  rewardTitle: string;
  category: 'cash' | 'voucher' | 'merch';
  pointsSpent: number;
  inrValue: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  redemptionCode?: string;
  deliveryTarget: string;
  statusNote?: string;
}

export interface PointsConfig {
  pointsToInrRate: number;
  stepToPointsRate: number;
  minWithdrawalInr: number;
}

export interface CauseItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'Education' | 'Healthcare' | 'Elderly' | 'Community' | 'Environment';
  icon: string;
  raisedAmount: number;
  targetAmount: number;
  donorsCount: number;
  verifiedPartner: string;
}

export interface DonationRecord {
  id: string;
  referenceNumber: string;
  donorName: string;
  donorEmail: string;
  causeTitle: string;
  amountInr: number;
  pointsEquivalent: number;
  date: string;
  status: 'Verified' | 'Pending Review' | 'Flagged';
  paymentMethod: 'WalkX Points' | 'Razorpay UPI' | 'Card';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Moderator' | 'Admin';
  stepsTotal: number;
  pointsBalance: number;
  joinedDate: string;
  status: 'Active' | 'Suspended' | 'Pending';
}

export interface AdminReportMetric {
  title: string;
  currentValue: string;
  previousValue: string;
  growthPercent: number;
  trend: 'up' | 'down';
}
