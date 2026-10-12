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
    id: 'cause_edu_1',
    title: '[Sample] Rural Student STEM & Digital Literacy Kits',
    tagline: 'Bridge the rural digital divide with solar-powered learning kits and books.',
    description: 'Empowers underprivileged government school children with solar tablets, science kits, and interactive textbooks. Your daily steps convert directly into learning resources for village students.',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
    icon: '📚',
    organizationName: 'Vidya Vikas Education Trust',
    organizationType: 'Registered Educational NGO (Sample Partner)',
    organizationLocation: 'Coimbatore, Tamil Nadu',
    registrationNumber: 'SAMPLE-NGO-TN-2024-ED',
    sampleDisclaimer: 'Sample non-profit partner for evaluation. Not an active financial recipient.',
    raisedAmount: 68500,
    targetAmount: 100000,
    targetPoints: 9090909,
    raisedPoints: 6227273,
    donorsCount: 428,
    verifiedPartner: 'Vidya Vikas Education Trust (Sample Partner)'
  },
  {
    id: 'cause_health_1',
    title: '[Sample] Mobile Health & Senior Citizen Diagnostic Clinic',
    tagline: 'Deliver vital diagnostics, cardiac checks, and medicines to isolated doorsteps.',
    description: 'Deploys mobile medical vans providing free blood glucose screening, vision checkups, hypertension care, and essential subsidized medicine to elderly villagers without transportation access.',
    category: 'Healthcare',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=900&q=80',
    icon: '✚',
    organizationName: 'Arogya Seva Mission',
    organizationType: 'Community Health Collective (Sample Partner)',
    organizationLocation: 'Madurai, Tamil Nadu',
    registrationNumber: 'SAMPLE-NGO-TN-2024-HC',
    sampleDisclaimer: 'Sample non-profit partner for evaluation. Not an active financial recipient.',
    raisedAmount: 54200,
    targetAmount: 80000,
    targetPoints: 7272727,
    raisedPoints: 4927273,
    donorsCount: 312,
    verifiedPartner: 'Arogya Seva Mission (Sample Partner)'
  },
  {
    id: 'cause_food_1',
    title: '[Sample] Daily Midday Meal & Child Nutrition Support Drive',
    tagline: 'Provide hot, nutrient-dense balanced lunches to daily-wage families and children.',
    description: 'Serves hygienic, freshly cooked warm lunches rich in protein, lentils, seasonal vegetables, and fortified milk to children and daily-wage families facing food insecurity.',
    category: 'Food support',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80',
    icon: '🍲',
    organizationName: 'Annapurna Community Kitchen',
    organizationType: 'Food Relief Network (Sample Partner)',
    organizationLocation: 'Chennai, Tamil Nadu',
    registrationNumber: 'SAMPLE-NGO-TN-2024-FD',
    sampleDisclaimer: 'Sample non-profit partner for evaluation. Not an active financial recipient.',
    raisedAmount: 48600,
    targetAmount: 75000,
    targetPoints: 6818182,
    raisedPoints: 4418182,
    donorsCount: 380,
    verifiedPartner: 'Annapurna Community Kitchen (Sample Partner)'
  },
  {
    id: 'cause_env_1',
    title: '[Sample] Native Tree Plantation & Urban Forest Restoration',
    tagline: 'Plant indigenous saplings and restore community groundwater recharge pits.',
    description: 'Fosters biodiversity corridors and cleans community air by planting native trees (Neem, Peepal, Tamarind) and building eco-friendly rainwater harvesting trenches in degraded zones.',
    category: 'Environment',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80',
    icon: '🌱',
    organizationName: 'Pasumai Green Earth Initiative',
    organizationType: 'Environmental Trust (Sample Partner)',
    organizationLocation: 'Tirunelveli, Tamil Nadu',
    registrationNumber: 'SAMPLE-NGO-TN-2024-EV',
    sampleDisclaimer: 'Sample non-profit partner for evaluation. Not an active financial recipient.',
    raisedAmount: 62400,
    targetAmount: 90000,
    targetPoints: 8181818,
    raisedPoints: 5672727,
    donorsCount: 415,
    verifiedPartner: 'Pasumai Green Earth Initiative (Sample Partner)'
  },
  {
    id: 'cause_edu_2',
    title: '[Sample] Girls STEM Scholarship & Mentorship Lab',
    tagline: 'Empower first-generation female students to pursue coding and robotics.',
    description: 'Provides computers, coding laboratory access, and college mentorship support for ambitious female students from vulnerable socio-economic backgrounds.',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=80',
    icon: '💻',
    organizationName: 'Shiksha Tech Collaborative',
    organizationType: 'Educational Foundation (Sample Partner)',
    organizationLocation: 'Bengaluru, Karnataka',
    registrationNumber: 'SAMPLE-NGO-KA-2024-ST',
    sampleDisclaimer: 'Sample non-profit partner for evaluation. Not an active financial recipient.',
    raisedAmount: 36800,
    targetAmount: 60000,
    targetPoints: 5454545,
    raisedPoints: 3345455,
    donorsCount: 240,
    verifiedPartner: 'Shiksha Tech Collaborative (Sample Partner)'
  },
  {
    id: 'cause_env_2',
    title: '[Sample] Coastal Wetland & Marine Plastic Cleanup Drive',
    tagline: 'Remove coastal plastic waste and plant salinity-tolerant mangroves.',
    description: 'Conducts weekly beach and backwater cleanup drives removing plastic waste, while reforesting coastal mangrove buffers to safeguard fishing settlements against sea surges.',
    category: 'Environment',
    imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=900&q=80',
    icon: '🌊',
    organizationName: 'Kadal Neer Protection Guild',
    organizationType: 'Marine Ecology Society (Sample Partner)',
    organizationLocation: 'Tuticorin, Tamil Nadu',
    registrationNumber: 'SAMPLE-NGO-TN-2024-MG',
    sampleDisclaimer: 'Sample non-profit partner for evaluation. Not an active financial recipient.',
    raisedAmount: 29500,
    targetAmount: 50000,
    targetPoints: 4545455,
    raisedPoints: 2681818,
    donorsCount: 185,
    verifiedPartner: 'Kadal Neer Protection Guild (Sample Partner)'
  }
];

export const initialDonationsList: DonationRecord[] = [
  {
    id: 'dn_101',
    referenceNumber: 'WX-PTS-8491',
    donorName: 'Priya Sharma',
    donorEmail: 'priya.sharma@example.com',
    causeTitle: '[Sample] Rural Student STEM & Digital Literacy Kits',
    causeCategory: 'Education',
    amountInr: 55,
    pointsEquivalent: 5000,
    contributionType: 'Points Contribution',
    date: '12 Oct 2026, 02:40 PM',
    status: 'Points Pledged (Demo)',
    paymentMethod: 'WalkX Points',
    isDemoRecord: true,
    notes: 'Simulated points deduction from active walker pool. No real bank transfer.'
  },
  {
    id: 'dn_102',
    referenceNumber: 'WX-PLG-8490',
    donorName: 'Rahul Mehra',
    donorEmail: 'rahul.m@example.com',
    causeTitle: '[Sample] Mobile Health & Senior Citizen Diagnostic Clinic',
    causeCategory: 'Healthcare',
    amountInr: 500,
    pointsEquivalent: 45455,
    contributionType: 'Monetary Pledge',
    date: '11 Oct 2026, 11:15 AM',
    status: 'Monetary Pledge (Prepared Integration)',
    paymentMethod: 'Prepared UPI (Sandbox)',
    isDemoRecord: true,
    notes: 'Prepared payment UI demonstration. Awaiting real payment provider integration.'
  },
  {
    id: 'dn_103',
    referenceNumber: 'WX-PTS-8489',
    donorName: 'Vikramaditya Roy',
    donorEmail: 'vikram.roy@example.com',
    causeTitle: '[Sample] Daily Midday Meal & Child Nutrition Support Drive',
    causeCategory: 'Food support',
    amountInr: 27.50,
    pointsEquivalent: 2500,
    contributionType: 'Points Contribution',
    date: '10 Oct 2026, 06:20 PM',
    status: 'Points Pledged (Demo)',
    paymentMethod: 'WalkX Points',
    isDemoRecord: true,
    notes: 'Simulated points deduction from active walker pool. No real bank transfer.'
  },
  {
    id: 'dn_104',
    referenceNumber: 'WX-PTS-8488',
    donorName: 'Ananya Deshmukh',
    donorEmail: 'ananya.d@example.com',
    causeTitle: '[Sample] Native Tree Plantation & Urban Forest Restoration',
    causeCategory: 'Environment',
    amountInr: 110,
    pointsEquivalent: 10000,
    contributionType: 'Points Contribution',
    date: '09 Oct 2026, 09:30 AM',
    status: 'Points Pledged (Demo)',
    paymentMethod: 'WalkX Points',
    isDemoRecord: true,
    notes: 'Simulated points deduction from active walker pool. No real bank transfer.'
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
