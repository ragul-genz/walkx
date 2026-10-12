import React, { useState } from 'react';
import {
  Footprints,
  Flame,
  Coins,
  Heart,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronRight,
  Plus,
  MapPin,
  Timer,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Smartphone,
  Laptop,
  Activity,
  Wallet,
  Gift,
  User,
  Settings,
  ShieldAlert,
  Calendar,
  CreditCard,
  Sliders,
  Users,
  Compass,
  Trophy,
  Zap
} from 'lucide-react';
import { UserProfile, StrideData, Transaction, CauseItem, PageId } from '../types';

export interface DashboardPageProps {
  user: UserProfile;
  weeklyData: StrideData[];
  transactions: Transaction[];
  causes: CauseItem[];
  onNavigate: (page: PageId) => void;
  onOpenStepModal: () => void;
  onOpenDonateModal: (cause?: CauseItem) => void;
  onAddQuickSteps?: (steps: number) => void;
  onResetSteps?: () => void;
  onOpenWithdrawModal?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  weeklyData,
  transactions,
  causes,
  onNavigate,
  onOpenStepModal,
  onOpenDonateModal,
  onAddQuickSteps,
  onResetSteps,
  onOpenWithdrawModal,
}) => {
  // Active selected day in the 7-day telemetry chart for inspector drilldown
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(weeklyData.length - 1);
  const selectedDayData = weeklyData[selectedDayIndex] || weeklyData[weeklyData.length - 1];

  // Calculation Metrics
  const goalPercentage = Math.min(100, Math.round((user.stepsToday / user.dailyGoal) * 100));
  const remainingSteps = Math.max(0, user.dailyGoal - user.stepsToday);
  const distanceKm = (user.stepsToday * 0.00075).toFixed(2);
  const calories = Math.round(user.stepsToday * 0.042);
  const activeMin = Math.round(user.stepsToday / 115);

  const availableInr = ((user.totalPoints / 1000) * 11).toFixed(2);
  const lifetimePoints = user.totalPoints + user.redeemedPoints + user.donatedPoints;
  const lifetimeInr = ((lifetimePoints / 1000) * 11).toFixed(2);

  const maxWeeklySteps = Math.max(...weeklyData.map((d) => d.steps), 10000);

  // SVG Circular Progress Ring calculations (radius 76, viewBox 180x180)
  const radius = 72;
  const circumference = 2 * Math.PI * radius; // ~452.38
  const strokeDashoffset = circumference - (goalPercentage / 100) * circumference;

  // Time-aware greeting
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  });

  const handleQuickAdd = (steps: number) => {
    if (onAddQuickSteps) {
      onAddQuickSteps(steps);
    } else {
      onOpenStepModal();
    }
  };

  const navMenuItems = [
    { id: 'dashboard', label: 'Overview', icon: Smartphone, page: 'dashboard' as PageId, active: true },
    { id: 'feed', label: 'Social Activity Feed', icon: Users, page: 'feed' as PageId, active: false, badge: 'Community' },
    { id: 'places', label: 'Discover Places', icon: Compass, page: 'places' as PageId, active: false },
    { id: 'leaderboards', label: 'Leaderboard & Divisions', icon: Trophy, page: 'leaderboards' as PageId, active: false },
    { id: 'challenges', label: 'Community Quests', icon: Zap, page: 'challenges' as PageId, active: false },
    { id: 'activity', label: 'Activity Telemetry', icon: Activity, page: 'activity' as PageId, active: false },
    { id: 'wallet', label: 'Points Wallet', icon: Wallet, page: 'wallet' as PageId, active: false, badge: `₹${availableInr}` },
    { id: 'rewards', label: 'Rewards Store', icon: Gift, page: 'rewards' as PageId, active: false },
    { id: 'donation', label: 'Walk for Causes', icon: Heart, page: 'donation' as PageId, active: false },
    { id: 'history', label: 'Donation Ledger', icon: ShieldCheck, page: 'donation-history' as PageId, active: false },
    { id: 'profile', label: 'Profile & Settings', icon: User, page: 'profile' as PageId, active: false },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in items-start">
      {/* =========================================================================
          DESKTOP SIDEBAR (Visible on lg+ screens)
          ========================================================================= */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 space-y-6 sticky top-28 self-start">
        {/* User Mini Profile Card in Sidebar */}
        <div className="rounded-2xl bg-[#0c1022]/90 border border-purple-500/20 p-5 shadow-xl relative overflow-hidden group">
          <div className="flex items-center gap-3.5 mb-3.5">
            <div className="relative">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-purple-400/40 shadow-md shadow-purple-500/20"
                />
              ) : (
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
              )}
              <span
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0c1022] rounded-full"
                title="Telemetry Live Active"
              />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-sm text-white truncate">{user.name}</h3>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 text-[10px] font-semibold border border-purple-500/25">
                <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                {user.memberTier.replace('⚡', '')}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Available Payout</span>
            <span className="font-bold text-emerald-400">₹{availableInr}</span>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="w-full mt-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-[11px] font-medium transition-all flex items-center justify-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5 text-purple-400" />
            Account Settings
          </button>
        </div>

        {/* Sidebar Navigation Menu */}
        <nav className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-3 shadow-xl space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Navigation Menu
          </div>
          {navMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.page)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  item.active
                    ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white border border-purple-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${item.active ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Health Sync Mode Status Badge */}
        <div className="rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-900/80 border border-purple-500/20 p-4 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-purple-300 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-purple-400" />
              Web Demo Sandbox
            </span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Desktop browsers cannot query mobile hardware sensors. Use the quick controls below to simulate activity.
          </p>
          <button
            onClick={onOpenStepModal}
            className="w-full py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Simulate Stride Steps
          </button>
        </div>
      </aside>

      {/* =========================================================================
          MAIN DASHBOARD BODY CONTENT (Responsive 1-column on mobile, right on lg)
          ========================================================================= */}
      <div className="flex-1 w-full space-y-8">
        {/* MOBILE NAVIGATION BAR (Horizontal Scrolling Pills for Mobile/Tablet) */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
          {navMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.page)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  item.active
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-slate-900/90 text-slate-300 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-200 text-[10px]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TOP WELCOME BANNER & PROFILE HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#121936] via-[#10142b] to-[#0c1024] border border-purple-500/20 p-6 md:p-8 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Sandbox Notice Banner inside Header */}
          <div className="mb-5 inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>Demo Activity Mode:</strong> Step counts & telemetry are simulated for prototype verification.
            </span>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Profile Photo with Online Indicator */}
              <div className="relative shrink-0">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-purple-400/50 shadow-xl shadow-purple-500/25"
                  />
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl">
                    {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-[#121936] rounded-full" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    {user.memberTier}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Member since {user.joinDate}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {greeting},{' '}
                  <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                    {user.name}
                  </span>
                </h1>
                <p className="text-slate-400 text-xs md:text-sm max-w-xl">
                  Every stride transforms into real financial value and social impact. Keep walking to smash today&apos;s milestone!
                </p>
              </div>
            </div>

            {/* Quick Action Button Cluster */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={onOpenStepModal}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Simulate Steps
              </button>
              {onOpenWithdrawModal ? (
                <button
                  onClick={onOpenWithdrawModal}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Coins className="w-4 h-4 text-emerald-400" />
                  Instant UPI Payout
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('wallet')}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Coins className="w-4 h-4 text-amber-400" />
                  Wallet (₹{availableInr})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 1: DAILY STEP GOAL & CIRCULAR PROGRESS RING + KEY STATS
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Circular Progress Ring Card (Takes 5 cols on lg) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#0c1022]/90 border border-purple-500/20 p-6 shadow-xl relative overflow-hidden flex flex-col items-center justify-between text-center">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Footprints className="w-4 h-4 text-purple-400" />
                Daily Step Goal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {goalPercentage}% Complete
              </span>
            </div>

            {/* SVG Circular Progress Ring */}
            <div className="relative my-2 flex items-center justify-center">
              <svg className="w-48 h-48 -rotate-90 transform" viewBox="0 0 180 180">
                {/* Background Ring */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  className="stroke-slate-800"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="stepProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                {/* Animated Value Ring */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke="url(#stepProgressGradient)"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Ring Center Metrics */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <Footprints className="w-6 h-6 text-cyan-400 mb-1" />
                <span className="text-3xl font-black text-white tracking-tight">
                  {user.stepsToday.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Goal: {user.dailyGoal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Sub-label & Motivational Milestone */}
            <div className="w-full mt-4 pt-4 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Remaining to target</span>
                <span className="font-bold text-cyan-300">
                  {remainingSteps > 0 ? `${remainingSteps.toLocaleString()} steps` : 'Target Achieved! 🎉'}
                </span>
              </div>
              <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${goalPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 text-left">
                {goalPercentage >= 100
                  ? 'Incredible! You have unlocked your daily streak bonus.'
                  : `Walk ${(remainingSteps * 0.00075).toFixed(1)} km more today to complete your daily target.`}
              </p>
            </div>
          </div>

          {/* 4 Primary Metric Cards (Takes 7 cols on lg) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Walking Distance */}
            <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 hover:border-cyan-500/40 p-5 shadow-xl transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-semibold text-slate-400">Walking Distance</span>
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-extrabold text-white tracking-tight">{distanceKm}</span>
                <span className="text-sm font-semibold text-cyan-300">km</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Calculated at 0.75m verified stride cadence.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Pace approx.</span>
                <span className="text-slate-200 font-medium">5.2 km/h</span>
              </div>
            </div>

            {/* Card 2: Estimated Calories */}
            <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 hover:border-amber-500/40 p-5 shadow-xl transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-semibold text-slate-400">Estimated Burned</span>
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Flame className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-extrabold text-white tracking-tight">{calories}</span>
                <span className="text-sm font-semibold text-amber-300">kcal</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Aerobic expenditure based on body kinematics.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Equivalent</span>
                <span className="text-amber-300 font-medium">≈ 1 healthy snack</span>
              </div>
            </div>

            {/* Card 3: Active Movement Time */}
            <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 hover:border-purple-500/40 p-5 shadow-xl transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-semibold text-slate-400">Active Duration</span>
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Timer className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-extrabold text-white tracking-tight">{activeMin}</span>
                <span className="text-sm font-semibold text-purple-300">mins</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Sustained brisk motion &gt; 100 strides/minute.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Cardio zone</span>
                <span className="text-emerald-300 font-medium">Zone 2 Aerobic</span>
              </div>
            </div>

            {/* Card 4: Daily Streak */}
            <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 hover:border-pink-500/40 p-5 shadow-xl transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-semibold text-slate-400">Daily Streak</span>
                <div className="w-9 h-9 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
                  <Flame className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-extrabold text-amber-400 tracking-tight">{user.streakDays}</span>
                <span className="text-xs text-slate-300 font-medium">Days on Fire 🔥</span>
              </div>
              <p className="text-[11px] text-slate-400">
                2 more days to unlock the 500-point booster!
              </p>
              <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Streak Shield</span>
                <span className="text-emerald-400 font-medium">Protected (1 save)</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: POINTS & RUPEE REWARDS FINANCIAL LEDGER CARDS
            ========================================================================= */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0c1022] to-[#121936] border border-blue-500/20 p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  WalkX Currency & Rewards Value
                </span>
                <span className="text-xs text-slate-400">Transparent Rule: 1,000 pts = ₹11.00 INR</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Your Walking Value Balance
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('rewards')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Gift className="w-3.5 h-3.5 text-pink-400" />
                Rewards Store
              </button>
              <button
                onClick={() => onNavigate('wallet')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5"
              >
                <Wallet className="w-3.5 h-3.5" />
                Wallet Statements
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Available Points */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Available Points</span>
              <div className="text-2xl md:text-3xl font-extrabold text-white">
                {user.totalPoints.toLocaleString()} <span className="text-xs text-blue-400 font-normal">pts</span>
              </div>
              <p className="text-[11px] text-slate-400">Ready for instant UPI or voucher claims.</p>
            </div>

            {/* 2. Indicative INR Equivalent */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Indicative Rupee Value</span>
              <div className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                ₹{availableInr} <span className="text-xs text-slate-400 font-normal">INR</span>
              </div>
              <p className="text-[11px] text-emerald-300/80">Net transferrable to Google Pay / PhonePe / Paytm.</p>
            </div>

            {/* 3. Total Lifetime Earned */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Points Earned</span>
              <div className="text-2xl md:text-3xl font-extrabold text-purple-300">
                {lifetimePoints.toLocaleString()} <span className="text-xs text-slate-400 font-normal">pts</span>
              </div>
              <p className="text-[11px] text-slate-400">Lifetime cumulative worth: ₹{lifetimeInr} INR.</p>
            </div>

            {/* 4. Donated for Causes */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Donated to Causes</span>
              <div className="text-2xl md:text-3xl font-extrabold text-pink-400">
                {user.donatedPoints.toLocaleString()} <span className="text-xs text-slate-400 font-normal">pts</span>
              </div>
              <p className="text-[11px] text-slate-400">₹{((user.donatedPoints / 1000) * 11).toFixed(2)} funded with 80G tax receipts.</p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 3: WEEKLY ACTIVITY CHART (7-DAY TELEMETRY WITH DAY DRILLDOWN)
            ========================================================================= */}
        <div className="rounded-3xl bg-[#0c1022]/90 border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Interactive Telemetry
                </span>
                <span className="text-xs text-slate-400">Click any day bar to inspect metrics</span>
              </div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                7-Day Weekly Stride History
              </h2>
            </div>

            <button
              onClick={() => onNavigate('activity')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Full Activity History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Chart Visualizer */}
          <div className="pt-2 pb-4">
            {/* Goal Dotted Reference Line Indicator */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 px-2">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t border-dashed border-purple-400" />
                Daily Target Goal: 10,000 steps
              </span>
              <span>Highest Stride: {maxWeeklySteps.toLocaleString()}</span>
            </div>

            <div className="h-52 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-2 border-b border-slate-800">
              {weeklyData.map((day, idx) => {
                const heightPercent = Math.max(12, Math.round((day.steps / maxWeeklySteps) * 100));
                const isSelected = idx === selectedDayIndex;
                const isGoalMet = day.steps >= 10000;

                return (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDayIndex(idx)}
                    className="flex-1 flex flex-col items-center gap-2 group relative focus:outline-none"
                    title={`Click to inspect ${day.day}`}
                  >
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-slate-200 text-[10px] px-2 py-1 rounded shadow-xl pointer-events-none whitespace-nowrap z-20">
                      {day.steps.toLocaleString()} steps ({day.distanceKm} km)
                    </div>

                    <div className="w-full max-w-[48px] bg-slate-800/40 rounded-t-xl h-full flex items-end justify-center overflow-hidden">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isSelected
                            ? 'bg-gradient-to-t from-purple-600 via-indigo-500 to-cyan-400 shadow-lg shadow-purple-500/40'
                            : isGoalMet
                            ? 'bg-gradient-to-t from-emerald-600/70 to-emerald-400/80 group-hover:from-purple-600 group-hover:to-cyan-400'
                            : 'bg-gradient-to-t from-slate-700 to-indigo-600/70 group-hover:from-purple-600/80 group-hover:to-blue-500/80'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <div className="flex flex-col items-center">
                      <span
                        className={`text-xs font-semibold transition-colors ${
                          isSelected ? 'text-cyan-300 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        {day.day}
                      </span>
                      {isGoalMet && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" title="Goal Met" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Telemetry Inspector Card */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                Selected Day Drilldown ({selectedDayData.day})
              </span>
              <div className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                <span>{selectedDayData.steps.toLocaleString()} steps</span>
                {selectedDayData.steps >= 10000 ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Target Exceeded
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 font-normal">
                    ({(10000 - selectedDayData.steps).toLocaleString()} under target)
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full sm:w-auto text-center">
              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 text-xs">
                <span className="text-slate-400 block text-[10px]">Distance</span>
                <span className="font-bold text-cyan-300">{selectedDayData.distanceKm} km</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 text-xs">
                <span className="text-slate-400 block text-[10px]">Calories</span>
                <span className="font-bold text-amber-300">{selectedDayData.calories} kcal</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 text-xs">
                <span className="text-slate-400 block text-[10px]">Active</span>
                <span className="font-bold text-purple-300">{selectedDayData.activeMinutes} mins</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 4: HEALTH DATA & HARDWARE INTEGRATION STATUS (CRITICAL TRANSPARENCY)
            ========================================================================= */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0c1022] to-[#141b3b] border border-cyan-500/30 p-6 md:p-8 shadow-2xl space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                Hardware Transparency & Integration Architecture
              </span>
              <span className="text-xs text-slate-400">Website MVP Policy</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Health-Data & Sensor Sync Status
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              <strong>Desktop Browser Technical Limitation:</strong> Modern desktop browsers (Chrome, Edge, Safari, Firefox) run in sandboxed environments and cannot natively access mobile device pedometer hardware, Apple HealthKit, or Google Health Connect in the background. Full automated hardware step telemetry is delivered via the WalkX Mobile Companion App.
            </p>
          </div>

          {/* 3-Card Ecosystem Sync Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Mobile App */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  WalkX Mobile App
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready (Flutter)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Native iOS & Android app runs continuous background pedometer telemetry with zero battery drain.
              </p>
              <div className="pt-2 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Pedometer Hardware Hooks Active
              </div>
            </div>

            {/* Card 2: Apple HealthKit / Google Health Connect */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  HealthKit / Connect
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Mobile OS Sync
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Connects directly to Apple Health on iPhone and Health Connect on Android via encrypted OAuth bridges.
              </p>
              <div className="pt-2 text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Encrypted Health Silo Verification
              </div>
            </div>

            {/* Card 3: Web Dashboard Demo Mode */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-purple-400" />
                  Web Dashboard Mode
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Demo Sandbox
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Allows testing step conversion, rewards redemption, and charity donations using verified demo inputs.
              </p>
              <div className="pt-2 text-[10px] text-purple-400 font-semibold flex items-center gap-1">
                <Sliders className="w-3 h-3" /> Interactive Step Simulator Ready
              </div>
            </div>
          </div>

          {/* Interactive Demo Activity Mode Controls */}
          <div className="p-5 rounded-2xl bg-[#080d1f] border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Interactive Demo Activity Mode: Fast Stride Simulator
                </h4>
                <p className="text-xs text-slate-400">
                  Simulate common walking sessions to watch balances, charts, and milestones update in real-time.
                </p>
              </div>

              {onResetSteps && (
                <button
                  onClick={onResetSteps}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium transition-all flex items-center gap-1.5 self-start sm:self-auto"
                  title="Reset daily steps to 0 for a clean demonstration"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to 0
                </button>
              )}
            </div>

            {/* Fast Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <button
                onClick={() => handleQuickAdd(500)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-purple-950/50 border border-slate-700 hover:border-purple-500/50 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-purple-300">+500 Steps</div>
                <div className="text-[10px] text-slate-400">Coffee / Quick Errand</div>
              </button>

              <button
                onClick={() => handleQuickAdd(1000)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-blue-950/50 border border-slate-700 hover:border-blue-500/50 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-cyan-300">+1,000 Steps</div>
                <div className="text-[10px] text-slate-400">Brisk Morning Walk (+₹11)</div>
              </button>

              <button
                onClick={() => handleQuickAdd(2500)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-indigo-950/50 border border-slate-700 hover:border-indigo-500/50 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-300">+2,500 Steps</div>
                <div className="text-[10px] text-slate-400">Neighborhood Stride (+₹27.50)</div>
              </button>

              <button
                onClick={() => handleQuickAdd(5000)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-emerald-950/50 border border-slate-700 hover:border-emerald-500/50 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-emerald-300">+5,000 Steps</div>
                <div className="text-[10px] text-slate-400">5K Cardio Run (+₹55)</div>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 5: RECENT TRANSACTIONS LEDGER & SHORTCUT GATEWAYS
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Ledger Transactions */}
          <div className="rounded-3xl bg-[#0c1022]/90 border border-slate-800/80 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-purple-400" />
                  Recent Ledger Transactions
                </h3>
                <p className="text-xs text-slate-400">Your latest points credits & redemptions</p>
              </div>
              <button
                onClick={() => onNavigate('wallet')}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
              >
                View Full Wallet <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/60">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="py-3.5 flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.type === 'credit'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : tx.category === 'donation'
                          ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30'
                          : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                      }`}
                    >
                      {tx.type === 'credit' ? (
                        <Footprints className="w-4 h-4" />
                      ) : tx.category === 'donation' ? (
                        <Heart className="w-4 h-4" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
                        {tx.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[180px] sm:max-w-xs">{tx.detail}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs sm:text-sm font-bold block ${
                        tx.type === 'credit' ? 'text-emerald-400' : 'text-pink-400'
                      }`}
                    >
                      {tx.type === 'credit' ? `+${tx.points.toLocaleString()}` : `-${tx.points.toLocaleString()}`} pts
                    </span>
                    <span className="text-[10px] text-slate-500">{tx.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts & Verified Causes */}
          <div className="rounded-3xl bg-[#0c1022]/90 border border-slate-800/80 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-pink-400" />
                  Ecosystem Shortcuts & Causes
                </h3>
                <p className="text-xs text-slate-400">Direct gateways to rewards & charities</p>
              </div>
              <button
                onClick={() => onNavigate('donation')}
                className="text-xs text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1"
              >
                All Programs <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2 Quick Action Feature Gateway Cards */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('rewards')}
                className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/30 hover:border-purple-500/60 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Gift className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white group-hover:text-purple-300">Rewards Marketplace</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Amazon, Flipkart & UPI Vouchers</div>
              </button>

              <button
                onClick={() => onNavigate('donation')}
                className="p-4 rounded-2xl bg-gradient-to-br from-pink-950/40 to-slate-900 border border-pink-500/30 hover:border-pink-500/60 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Heart className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white group-hover:text-pink-300">Walk for a Cause</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Sponsor meals, books & water</div>
              </button>
            </div>

            {/* Featured Active Cause */}
            {causes.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{causes[0].icon}</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{causes[0].title}</h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-cyan-400 inline" />
                        {causes[0].verifiedPartner}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenDonateModal(causes[0])}
                    className="px-3 py-1.5 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-300 font-semibold text-xs transition-all shrink-0"
                  >
                    Donate Points
                  </button>
                </div>

                <div className="space-y-1">
                  {(() => {
                    const percent = Math.min(100, Math.round((causes[0].raisedAmount / causes[0].targetAmount) * 100));
                    return (
                      <>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>₹{causes[0].raisedAmount.toLocaleString()} funded</span>
                          <span>Target: ₹{causes[0].targetAmount.toLocaleString()} ({percent}%)</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
