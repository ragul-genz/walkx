export type PageId =
  | 'landing'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'dashboard'
  | 'activity'
  | 'feed'
  | 'places'
  | 'leaderboards'
  | 'challenges'
  | 'user-profile'
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
  lifetimeSteps?: number;
  caloriesBurned?: number;
  distanceCoveredKm?: number;
  co2SavedKg?: number;
  badgesEarned?: number;
  role?: string;
  username?: string;
  bio?: string;
  isPrivate?: boolean;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  city?: string;
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
  category: 'steps' | 'reward' | 'donation' | 'bonus' | 'withdrawal' | 'redemption';
  status: 'completed' | 'processing' | 'failed' | 'pending' | 'cancelled';
}

export interface RewardItem {
  id: string;
  title: string;
  pointsCost: number;
  inrValue: number;
  icon: string;
  description: string;
  category: 'cash' | 'voucher' | 'merch' | 'shopping' | 'electronics' | 'fitness' | 'travel' | 'giftcard';
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
  category: 'cash' | 'voucher' | 'merch' | 'shopping' | 'electronics' | 'fitness' | 'travel' | 'giftcard';
  pointsSpent: number;
  inrValue: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Fulfilled';
  redemptionCode?: string;
  voucherCode?: string;
  deliveryTarget: string;
  statusNote?: string;
  notes?: string;
}

export interface PointsConfig {
  pointsToInrRate: number;
  stepToPointsRate: number;
  minWithdrawalInr: number;
}

export type CauseCategory = 'Education' | 'Healthcare' | 'Food support' | 'Environment';

export interface CauseItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: CauseCategory;
  imageUrl?: string;
  icon: string;
  organizationName: string;
  organizationType: string;
  organizationLocation: string;
  registrationNumber: string;
  sampleDisclaimer?: string;
  raisedAmount: number;
  targetAmount: number;
  targetPoints?: number;
  raisedPoints?: number;
  donorsCount: number;
  verifiedPartner: string;
}

export interface DonationRecord {
  id: string;
  referenceNumber: string;
  donorName: string;
  donorEmail: string;
  causeTitle: string;
  causeCategory?: CauseCategory;
  amountInr: number;
  pointsEquivalent: number;
  contributionType: 'Points Contribution' | 'Monetary Pledge' | 'Corporate Match';
  date: string;
  status: 'Verified' | 'Pending Review' | 'Flagged' | 'Points Pledged' | 'Points Pledged (Demo)' | 'Monetary Pledge (Prepared Integration)' | 'Completed' | 'Failed';
  paymentMethod: string;
  isDemoRecord: boolean;
  notes?: string;
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
  avatar?: string;
  kycStatus?: string;
  phone?: string;
}

export interface AdminReportMetric {
  title: string;
  currentValue: string;
  previousValue: string;
  growthPercent: number;
  trend: 'up' | 'down';
}

export type AdminSection =
  | 'overview'
  | 'users'
  | 'points'
  | 'rewards'
  | 'donations'
  | 'reports'
  | 'settings'
  | 'audit';

// ==========================================
// SOCIAL ACTIVITY FEED TYPES
// ==========================================

export type ActivityType =
  | 'Walking'
  | 'Morning Stride'
  | 'Sunset Walk'
  | 'Power Walk'
  | 'Hiking'
  | 'Jogging'
  | 'Nature Trail'
  | 'Charity Walk';

export type PostVisibility = 'public' | 'followers_only' | 'private';

export type ReportReason =
  | 'Spam or Bot Activity'
  | 'False Step / Activity Telemetry'
  | 'Inappropriate Media'
  | 'Harassment or Hate Speech'
  | 'Other Policy Violation';

export interface SocialComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userBadge?: string;
  isPrivateAccount?: boolean;
  caption: string;
  photos: string[];
  activityType: ActivityType;
  metrics?: {
    steps?: number;
    distanceKm?: number;
    durationMinutes?: number;
    pointsEarned?: number;
  };
  placeTag?: {
    name: string;
    city?: string;
  };
  visibility: PostVisibility;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  comments: SocialComment[];
  isSaved: boolean;
  isReported?: boolean;
  createdAt: string;
}

export interface SocialUserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  isPrivate: boolean;
  city: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  lifetimeSteps: number;
  totalPoints: number;
  isFollowing: boolean;
  followStatus: 'none' | 'following' | 'requested';
  badgeTitle: string;
  joinDate: string;
}

// ==========================================
// PLACES DISCOVERY TYPES
// ==========================================

export type PlaceSuitability =
  | 'All Ages'
  | 'Senior Friendly'
  | 'Stroller & Family'
  | 'Pet Friendly'
  | 'Brisk Walkers';

export type PlaceDifficulty = 'Gentle & Flat' | 'Moderate' | 'Challenging Incline';

export interface WalkingPlace {
  id: string;
  title: string;
  category: 'Urban Park' | 'Waterfront Promenade' | 'Nature Trail' | 'Historic Walk' | 'Neighborhood Loop';
  location: string;
  city: string;
  distanceKm: number;
  estimatedSteps: number;
  durationMinutes: number;
  difficulty: PlaceDifficulty;
  suitability: PlaceSuitability[];
  rating: number;
  reviewsCount: number;
  checkInsCount: number;
  hasShade: boolean;
  hasBenches: boolean;
  hasRestrooms: boolean;
  hasWaterFountains: boolean;
  isWheelchairAccessible: boolean;
  imageUrl: string;
  gallery: string[];
  description: string;
  tips: string;
  popularTime: string;
  isCheckedIn?: boolean;
}

// ==========================================
// LEADERBOARDS & COMPETITIONS TYPES
// ==========================================

export type AgeBracket = 'all' | 'teens' | 'young_adults' | 'prime' | 'golden';
export type LeaderboardTimeframe = 'this_week' | 'this_month' | 'all_time';
export type LeaderboardCategory = 'steps' | 'streak' | 'charity' | 'places_explored';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  username: string;
  avatar: string;
  badgeTitle: string;
  ageBracket: AgeBracket;
  city: string;
  steps: number;
  streakDays: number;
  charityPointsDonated: number;
  placesExplored: number;
  isVerifiedSensor: boolean;
  isCurrentUser?: boolean;
}

// ==========================================
// COMMUNITY CHALLENGES TYPES
// ==========================================

export type ChallengeAudience =
  | 'All Ages'
  | 'Seniors & Gentle Walkers'
  | 'Daily Commuters'
  | 'Weekend Explorers'
  | 'Charity Champions';

export interface CommunityChallenge {
  id: string;
  title: string;
  subtitle: string;
  audience: ChallengeAudience;
  goalSteps: number;
  currentSteps: number;
  daysRemaining: number;
  totalDays: number;
  participantsCount: number;
  joined: boolean;
  rewardPoints: number;
  badgeName: string;
  badgeIcon: string;
  bannerImage: string;
  description: string;
  organizer: string;
  category: 'distance' | 'streak' | 'places' | 'charity';
}



