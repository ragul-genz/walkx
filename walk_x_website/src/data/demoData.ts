import {
  UserProfile,
  StrideData,
  Transaction,
  RewardItem,
  RedemptionRecord,
  PointsConfig,
  CauseItem,
  DonationRecord,
  AdminUser,
  AdminReportMetric
} from '../types';

export const pointsSystemConfig: PointsConfig = {
  pointsToInrRate: 11, // Fixed business rule: 1,000 points = ₹11 indicative reward equivalent
  stepToPointsRate: 1000, // Configurable by admin: 1,000 steps = 1,000 points
  minWithdrawalInr: 11, // Minimum withdrawal threshold starts at ₹11 (1,000 points)
};

export const initialUserProfile: UserProfile = {
  id: 'usr_84920',
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  phone: '+91 98765 43210',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  memberTier: 'WalkX Elite Pioneer ⚡',
  joinDate: 'March 2026',
  stepsToday: 6420,
  dailyGoal: 10000,
  streakDays: 5,
  totalPoints: 6420,
  redeemedPoints: 0,
  donatedPoints: 1000,
};

export const weeklyStrideTelemetry: StrideData[] = [
  { day: 'Mon', steps: 5200, distanceKm: 3.9, calories: 230, activeMinutes: 42 },
  { day: 'Tue', steps: 7800, distanceKm: 5.8, calories: 345, activeMinutes: 58 },
  { day: 'Wed', steps: 4300, distanceKm: 3.2, calories: 190, activeMinutes: 35 },
  { day: 'Thu', steps: 9100, distanceKm: 6.8, calories: 410, activeMinutes: 72 },
  { day: 'Fri', steps: 7600, distanceKm: 5.7, calories: 335, activeMinutes: 60 },
  { day: 'Sat', steps: 8140, distanceKm: 6.1, calories: 360, activeMinutes: 65 },
  { day: 'Sun', steps: 6420, distanceKm: 4.8, calories: 285, activeMinutes: 48 },
];

export const initialTransactions: Transaction[] = [
  {
    id: 'tx_9921',
    title: 'Daily Stride Reward',
    detail: 'Today · Verified pedometer milestone',
    points: 1240,
    type: 'credit',
    date: 'Just now',
    category: 'steps',
    status: 'completed'
  },
  {
    id: 'tx_9920',
    title: 'Charity Micro-Donation',
    detail: "Transferred support to Children's Education",
    points: 1000,
    type: 'debit',
    date: 'Yesterday, 4:15 PM',
    category: 'donation',
    status: 'completed'
  },
  {
    id: 'tx_9919',
    title: 'Streak Milestone Bonus',
    detail: '5-Day Continuous Walking Challenge',
    points: 500,
    type: 'credit',
    date: '08 Oct 2026',
    category: 'bonus',
    status: 'completed'
  },
  {
    id: 'tx_9918',
    title: 'Daily Stride Reward',
    detail: '07 Oct 2026 · Goal exceeded (9,100 steps)',
    points: 1820,
    type: 'credit',
    date: '07 Oct 2026',
    category: 'steps',
    status: 'completed'
  },
  {
    id: 'tx_9917',
    title: 'Welcome Pioneer Bonus',
    detail: 'Onboarding credit for WalkX Web signup',
    points: 2000,
    type: 'credit',
    date: '01 Oct 2026',
    category: 'bonus',
    status: 'completed'
  }
];

export const initialRewards: RewardItem[] = [
  {
    id: 'rew_1',
    title: '₹11 Instant UPI Cash Payout',
    pointsCost: 1000,
    inrValue: 11,
    icon: '⚡',
    description: 'Direct instant test transfer to any verified UPI ID (Google Pay, PhonePe, Paytm).',
    category: 'cash',
    stockCount: 9999,
    unlocked: true,
    eligibility: 'Open to all walkers with verified UPI ID',
    minStreakDays: 1,
    partnerBrand: 'UPI / NPCI'
  },
  {
    id: 'rew_2',
    title: '₹55 Instant UPI Cash Payout',
    pointsCost: 5000,
    inrValue: 55,
    icon: '💳',
    description: 'Instant micro-redemption credited directly to your savings account VPA.',
    category: 'cash',
    stockCount: 9999,
    unlocked: true,
    eligibility: 'Requires 2-day walking streak',
    minStreakDays: 2,
    partnerBrand: 'UPI / NPCI'
  },
  {
    id: 'rew_3',
    title: '₹110 Instant UPI Cash Payout',
    pointsCost: 10000,
    inrValue: 110,
    icon: '💰',
    description: 'Milestone cash reward processed via automated Razorpay Payouts.',
    category: 'cash',
    stockCount: 5000,
    unlocked: true,
    eligibility: 'Requires 3-day walking streak',
    minStreakDays: 3,
    partnerBrand: 'UPI / NPCI'
  },
  {
    id: 'rew_4',
    title: '₹550 Milestone Payout',
    pointsCost: 50000,
    inrValue: 550,
    icon: '🏦',
    description: 'Discretionary bulk cash withdrawal for dedicated long-distance walkers.',
    category: 'cash',
    stockCount: 1000,
    unlocked: false,
    eligibility: 'Requires 5-day walking streak and Pioneer Tier',
    minStreakDays: 5,
    partnerBrand: 'UPI / NPCI'
  },
  {
    id: 'rew_5',
    title: 'Amazon Pay ₹1,100 Gift Card',
    pointsCost: 100000,
    inrValue: 1100,
    icon: '📦',
    description: 'Amazon Pay voucher balance redeemable across millions of products and bill payments.',
    category: 'voucher',
    stockCount: 250,
    unlocked: false,
    eligibility: 'Verified email delivery address',
    minStreakDays: 3,
    partnerBrand: 'Amazon'
  },
  {
    id: 'rew_6',
    title: 'Flipkart ₹2,750 Shopping Voucher',
    pointsCost: 250000,
    inrValue: 2750,
    icon: '🛒',
    description: 'Flat ₹2,750 instant voucher code for electronics, fashion, and everyday essentials.',
    category: 'voucher',
    stockCount: 180,
    unlocked: false,
    eligibility: 'Elite Pioneer Tier required',
    minStreakDays: 5,
    partnerBrand: 'Flipkart'
  },
  {
    id: 'rew_7',
    title: 'Decathlon ₹5,500 Sports Gear Voucher',
    pointsCost: 500000,
    inrValue: 5500,
    icon: '👟',
    description: 'In-store & online discount code for professional running shoes and athletic apparel.',
    category: 'voucher',
    stockCount: 80,
    unlocked: false,
    eligibility: '5-Day Streak + Verified Phone',
    minStreakDays: 5,
    partnerBrand: 'Decathlon'
  },
  {
    id: 'rew_8',
    title: 'Cult.fit 1-Month Fitness Pass',
    pointsCost: 300000,
    inrValue: 3300,
    icon: '🏋️',
    description: 'Unlimited access to live yoga, HIIT, and guided workouts with top trainers.',
    category: 'voucher',
    stockCount: 50,
    unlocked: false,
    eligibility: 'Valid for all registered walkers',
    partnerBrand: 'Cult.fit'
  },
  {
    id: 'rew_9',
    title: 'WalkX Official Pro Stride Jersey',
    pointsCost: 35000,
    inrValue: 800,
    icon: '👕',
    description: 'High-performance breathable dry-fit athletic shirt with reflective night-walk logo.',
    category: 'merch',
    stockCount: 45,
    unlocked: false,
    eligibility: 'WalkX Pioneer Member exclusive',
    partnerBrand: 'WalkX Athletics'
  }
];

export const initialRedemptions: RedemptionRecord[] = [
  {
    id: 'rdm_8819',
    rewardId: 'rew_5',
    rewardTitle: 'Amazon Pay ₹1,100 Gift Card',
    category: 'voucher',
    pointsSpent: 100000,
    inrValue: 1100,
    date: '10 Oct 2026',
    status: 'Completed',
    redemptionCode: 'AMZN-9921-WLKX-4412',
    deliveryTarget: 'priya.sharma@example.com',
    statusNote: 'Delivered via Amazon Incentives API. Valid for 1 year.'
  },
  {
    id: 'rdm_8818',
    rewardId: 'rew_4',
    rewardTitle: '₹550 Milestone UPI Payout',
    category: 'cash',
    pointsSpent: 50000,
    inrValue: 550,
    date: '08 Oct 2026',
    status: 'Approved',
    deliveryTarget: 'priya.sharma@okhdfcbank',
    statusNote: 'Approved by compliance system. Dispatched via Razorpay Payouts batch #9281.'
  },
  {
    id: 'rdm_8817',
    rewardId: 'rew_7',
    rewardTitle: 'Decathlon ₹5,500 Sports Gear Voucher',
    category: 'voucher',
    pointsSpent: 500000,
    inrValue: 5500,
    date: '11 Oct 2026',
    status: 'Pending',
    deliveryTarget: 'priya.sharma@example.com',
    statusNote: 'In verification queue. Voucher code allocation in progress.'
  },
  {
    id: 'rdm_8816',
    rewardId: 'rew_8',
    rewardTitle: 'Cult.fit 1-Month Fitness Pass',
    category: 'voucher',
    pointsSpent: 300000,
    inrValue: 3300,
    date: '03 Oct 2026',
    status: 'Rejected',
    deliveryTarget: 'priya.sharma@example.com',
    statusNote: 'Campaign quota reached. 300,000 points refunded back to wallet.'
  }
];

export const initialCauses: CauseItem[] = [
  {
    id: 'cause_edu',
    title: "Children's Primary Education",
    tagline: 'Empower young minds with essential books, tuition, and school kits.',
    description: 'Every 1,000 steps converts to foundational learning resources for underprivileged children in rural and urban schools.',
    category: 'Education',
    icon: '📚',
    raisedAmount: 76500,
    targetAmount: 100000,
    donorsCount: 428,
    verifiedPartner: 'Pratham Shiksha Foundation'
  },
  {
    id: 'cause_health',
    title: 'Universal Healthcare Support',
    tagline: 'Deliver vital medicines and diagnostic screening to needy families.',
    description: 'Provides critical health checkups, medicine subsidies, and mobile clinic visits for elderly and underprivileged citizens.',
    category: 'Healthcare',
    icon: '✚',
    raisedAmount: 54200,
    targetAmount: 80000,
    donorsCount: 312,
    verifiedPartner: 'Sanjeevani Medical Trust'
  },
  {
    id: 'cause_elder',
    title: 'Dignified Elderly Care',
    tagline: 'Provide warm meals, medical supervision, and companionship.',
    description: 'Assists abandoned seniors with clean shelters, nutritious dietary meals, and routine medical checkups.',
    category: 'Elderly',
    icon: '♡',
    raisedAmount: 39800,
    targetAmount: 60000,
    donorsCount: 205,
    verifiedPartner: 'Aastha Senior Living Care'
  },
  {
    id: 'cause_comm',
    title: 'Community Clean Drinking Water',
    tagline: 'Install automated water purification plants in neglected zones.',
    description: 'Ensures safe, fluorosis-free hygienic drinking water supplies for villages and daily-wage colonies.',
    category: 'Community',
    icon: '✿',
    raisedAmount: 62400,
    targetAmount: 90000,
    donorsCount: 389,
    verifiedPartner: 'Jal Swaraj Mission'
  }
];

export const initialDonationsList: DonationRecord[] = [
  {
    id: 'dn_101',
    referenceNumber: 'WX-DN-8491',
    donorName: 'Priya Sharma',
    donorEmail: 'priya.sharma@example.com',
    causeTitle: "Children's Primary Education",
    amountInr: 100,
    pointsEquivalent: 1000,
    date: '10 Oct 2026, 02:40 PM',
    status: 'Verified',
    paymentMethod: 'WalkX Points'
  },
  {
    id: 'dn_102',
    referenceNumber: 'WX-DN-8490',
    donorName: 'Rahul Mehra',
    donorEmail: 'rahul.m@example.com',
    causeTitle: 'Universal Healthcare Support',
    amountInr: 500,
    pointsEquivalent: 5000,
    date: '09 Oct 2026, 11:15 AM',
    status: 'Verified',
    paymentMethod: 'Razorpay UPI'
  },
  {
    id: 'dn_103',
    referenceNumber: 'WX-DN-8489',
    donorName: 'Vikramaditya Roy',
    donorEmail: 'vikram.roy@example.com',
    causeTitle: 'Community Clean Drinking Water',
    amountInr: 250,
    pointsEquivalent: 2500,
    date: '08 Oct 2026, 06:20 PM',
    status: 'Pending Review',
    paymentMethod: 'Razorpay UPI'
  },
  {
    id: 'dn_104',
    referenceNumber: 'WX-DN-8488',
    donorName: 'Ananya Deshmukh',
    donorEmail: 'ananya.d@example.com',
    causeTitle: 'Dignified Elderly Care',
    amountInr: 300,
    pointsEquivalent: 3000,
    date: '07 Oct 2026, 09:30 AM',
    status: 'Verified',
    paymentMethod: 'WalkX Points'
  }
];

export const initialAdminUsers: AdminUser[] = [
  {
    id: 'adm_u1',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    role: 'User',
    stepsTotal: 46200,
    pointsBalance: 5420,
    joinedDate: '01 Mar 2026',
    status: 'Active'
  },
  {
    id: 'adm_u2',
    name: 'Rahul Mehra',
    email: 'rahul.m@example.com',
    role: 'User',
    stepsTotal: 124800,
    pointsBalance: 14200,
    joinedDate: '15 Feb 2026',
    status: 'Active'
  },
  {
    id: 'adm_u3',
    name: 'Karthik Raja',
    email: 'karthik.admin@walkx.app',
    role: 'Admin',
    stepsTotal: 88500,
    pointsBalance: 8850,
    joinedDate: '01 Jan 2026',
    status: 'Active'
  },
  {
    id: 'adm_u4',
    name: 'Vikramaditya Roy',
    email: 'vikram.roy@example.com',
    role: 'User',
    stepsTotal: 34100,
    pointsBalance: 3200,
    joinedDate: '20 Mar 2026',
    status: 'Pending'
  },
  {
    id: 'adm_u5',
    name: 'Sneha Kulkarni',
    email: 'sneha.k@example.com',
    role: 'Moderator',
    stepsTotal: 67900,
    pointsBalance: 7100,
    joinedDate: '10 Feb 2026',
    status: 'Active'
  }
];

export const adminKpiMetrics: AdminReportMetric[] = [
  {
    title: 'Registered Walkers',
    currentValue: '12,458',
    previousValue: '5,300',
    growthPercent: 135,
    trend: 'up'
  },
  {
    title: 'Cumulative Stride Volume',
    currentValue: '2.4M Steps',
    previousValue: '1.8M Steps',
    growthPercent: 31,
    trend: 'up'
  },
  {
    title: 'Total Charity Donations',
    currentValue: '₹5,42,680',
    previousValue: '₹4,60,000',
    growthPercent: 18,
    trend: 'up'
  },
  {
    title: 'Payout Processing Ratio',
    currentValue: '99.4%',
    previousValue: '98.2%',
    growthPercent: 1.2,
    trend: 'up'
  }
];
