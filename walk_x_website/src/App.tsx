import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  PageId,
  UserProfile,
  StrideData,
  Transaction,
  RewardItem,
  RedemptionRecord,
  CauseItem,
  DonationRecord
} from './types';
import {
  initialUserProfile,
  weeklyStrideTelemetry,
  initialTransactions,
  initialRewards,
  initialRedemptions,
  initialCauses,
  initialDonationsList
} from './data/demoData';

// Backend Services & Supabase Integration
import { supabaseData } from './services/supabaseData';
import { getCurrentAuthUser, logoutUser, isSupabaseConfigured, supabase } from './services/supabaseAuth';

// Shared Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Modal } from './components/Modal';
import { DonationModal } from './components/DonationModal';

// User & Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ActivityPage } from './pages/ActivityPage';
import { WalletPage } from './pages/WalletPage';
import { RewardsPage } from './pages/RewardsPage';
import { DonationPage } from './pages/DonationPage';
import { DonationHistoryPage } from './pages/DonationHistoryPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { SocialFeedPage } from './pages/SocialFeedPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { PlacesDiscoveryPage } from './pages/PlacesDiscoveryPage';
import { ExplorePage } from './pages/ExplorePage';
import { LeaderboardsPage } from './pages/LeaderboardsPage';
import { CommunityChallengesPage } from './pages/CommunityChallengesPage';

// Admin Pages
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Legal Pages
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';

// Icons for Modals
import {
  Footprints,
  CheckCircle2,
  CreditCard,
  Sparkles
} from 'lucide-react';

// Supported valid Page IDs
const validPages: PageId[] = [
  'landing',
  'login',
  'register',
  'forgot-password',
  'dashboard',
  'activity',
  'feed',
  'places',
  'explore',
  'leaderboards',
  'challenges',
  'user-profile',
  'wallet',
  'rewards',
  'donation',
  'donation-history',
  'profile',
  'admin-login',
  'admin-dashboard',
  'admin-users',
  'admin-rewards',
  'admin-donations',
  'admin-reports',
  'privacy',
  'terms'
];

const getInitialPage = (): PageId => {
  try {
    const hash = window.location.hash.replace('#', '').replace(/^\//, '').trim();
    if (hash === 'admin') return 'admin-dashboard';
    if (hash === 'reset-password') return 'forgot-password';
    if (hash && validPages.includes(hash as PageId)) return hash as PageId;
    const path = window.location.pathname.replace(/^\//, '').trim();
    if (path === 'admin') return 'admin-dashboard';
    if (path === 'reset-password') return 'forgot-password';
    if (path && validPages.includes(path as PageId)) return path as PageId;
  } catch {
    // fallback
  }
  return 'landing';
};

export const App: React.FC = () => {
  // Navigation & Role State with URL sync
  const [currentPage, setCurrentPageRaw] = useState<PageId>(getInitialPage);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const init = getInitialPage();
    return init.startsWith('admin-') && init !== 'admin-login';
  });

  const setCurrentPage = (page: PageId) => {
    setCurrentPageRaw(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync with browser back/forward buttons
  React.useEffect(() => {
    const handleLocationChange = () => {
      const target = getInitialPage();
      setCurrentPageRaw(target);
      if (target.startsWith('admin-') && target !== 'admin-login') {
        setIsAdmin(true);
      }
    };
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Core Reactive Data State
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [weeklyData, setWeeklyData] = useState<StrideData[]>(weeklyStrideTelemetry);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [rewards, setRewards] = useState<RewardItem[]>(initialRewards);
  const [redemptions, setRedemptions] = useState<RedemptionRecord[]>(initialRedemptions);
  const [causes, setCauses] = useState<CauseItem[]>(initialCauses);
  const [donations, setDonations] = useState<DonationRecord[]>(initialDonationsList);

  // Social Feed & Walker Profile Navigation State
  const [viewingProfileId, setViewingProfileId] = useState<string>('usr_arjun');

  const handleViewUserProfile = (targetUserId: string) => {
    setViewingProfileId(targetUserId);
    setCurrentPage('user-profile');
  };

  // Global Toast Alert State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#3b82f6', '#38bdf8', '#10b981'],
      });
    } catch {
      // Ignore if unavailable
    }
  };

  // Session Recovery & Backend Database Hydration
  React.useEffect(() => {
    let isMounted = true;

    const hydrateData = async () => {
      try {
        const authInfo = await getCurrentAuthUser();
        if (isMounted && authInfo.profile) {
          setUser((prev) => ({
            ...prev,
            id: authInfo.profile?.id || prev.id,
            name: authInfo.profile?.name || prev.name,
            email: authInfo.profile?.email || prev.email,
            phone: authInfo.profile?.phone || prev.phone,
            totalPoints: authInfo.profile?.totalPoints ?? prev.totalPoints,
            lifetimeSteps: authInfo.profile?.lifetimeSteps ?? prev.lifetimeSteps,
            streakDays: authInfo.profile?.streakDays ?? prev.streakDays
          }));
        }

        const [dbRewards, dbCauses, dbTransactions, dbRedemptions, dbDonations, dbTelemetry] = await Promise.all([
          supabaseData.getRewards(),
          supabaseData.getCauses(),
          supabaseData.getTransactions(),
          supabaseData.getUserRedemptions(),
          supabaseData.getDonationRecords(),
          supabaseData.getActivityTelemetry()
        ]);

        if (isMounted) {
          if (dbRewards.length > 0) setRewards(dbRewards);
          if (dbCauses.length > 0) setCauses(dbCauses);
          if (dbTransactions.length > 0) setTransactions(dbTransactions);
          if (dbRedemptions.length > 0) setRedemptions(dbRedemptions);
          if (dbDonations.length > 0) setDonations(dbDonations);
          if (dbTelemetry.length > 0) setWeeklyData(dbTelemetry);
        }
      } catch (err) {
        console.warn('Hydration fallback:', err);
      }
    };

    hydrateData();

    if (isSupabaseConfigured && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          const authInfo = await getCurrentAuthUser();
          if (isMounted && authInfo.profile) {
            setUser((prev) => ({
              ...prev,
              id: authInfo.profile?.id || prev.id,
              name: authInfo.profile?.name || prev.name,
              email: authInfo.profile?.email || prev.email,
              phone: authInfo.profile?.phone || prev.phone,
              totalPoints: authInfo.profile?.totalPoints ?? prev.totalPoints,
              lifetimeSteps: authInfo.profile?.lifetimeSteps ?? prev.lifetimeSteps,
              streakDays: authInfo.profile?.streakDays ?? prev.streakDays
            }));
          }
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) setUser(initialUserProfile);
        }
      });

      return () => {
        isMounted = false;
        authListener.subscription.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Modals State
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [stepModalValue, setStepModalValue] = useState(1000);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawUpiId, setWithdrawUpiId] = useState('priya.sharma@okhdfcbank');
  const [withdrawInr, setWithdrawInr] = useState(11);

  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [activeDonationCause, setActiveDonationCause] = useState<CauseItem | null>(null);
  const [donationInitialMode, setDonationInitialMode] = useState<'points' | 'monetary'>('points');

  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [activeRedeemItem, setActiveRedeemItem] = useState<RewardItem | null>(null);

  // Handlers: Step Simulation & Database Telemetry Sync
  const handleAddSteps = async (stepsToAdd: number) => {
    const result = await supabaseData.syncSteps(stepsToAdd);

    const updatedToday = user.stepsToday + stepsToAdd;
    const updatedPoints = result.newBalance !== undefined ? result.newBalance : user.totalPoints + stepsToAdd;
    const updatedLifetime = result.newTotalSteps !== undefined ? result.newTotalSteps : (user.lifetimeSteps || 0) + stepsToAdd;

    setUser((prev) => ({
      ...prev,
      stepsToday: updatedToday,
      totalPoints: updatedPoints,
      lifetimeSteps: updatedLifetime
    }));

    setWeeklyData((prev) => {
      const copy = [...prev];
      const last = { ...copy[copy.length - 1] };
      last.steps += stepsToAdd;
      last.distanceKm = Number((last.distanceKm + stepsToAdd * 0.00075).toFixed(2));
      last.calories += Math.round(stepsToAdd * 0.042);
      last.activeMinutes += Math.round(stepsToAdd / 115);
      copy[copy.length - 1] = last;
      return copy;
    });

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title: 'Stride Telemetry Sync',
      detail: `Added +${stepsToAdd.toLocaleString()} verified steps`,
      points: result.pointsEarned || stepsToAdd,
      type: 'credit',
      date: 'Just now',
      category: 'steps',
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    if (stepsToAdd >= 1000) {
      triggerCelebration();
    }
    showToast(`Logged +${stepsToAdd.toLocaleString()} steps (+${(result.pointsEarned || stepsToAdd).toLocaleString()} WalkX Points added)!`);
    setIsStepModalOpen(false);
  };

  const handleResetSteps = () => {
    setUser((prev) => ({
      ...prev,
      stepsToday: 0,
    }));

    setWeeklyData((prev) => {
      const copy = [...prev];
      const last = { ...copy[copy.length - 1] };
      last.steps = 0;
      last.distanceKm = 0;
      last.calories = 0;
      last.activeMinutes = 0;
      copy[copy.length - 1] = last;
      return copy;
    });

    showToast('Daily steps reset to 0 for demo verification.');
  };

  // Handlers: UPI Withdrawal
  const handleConfirmWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const pointsRequired = Math.round((withdrawInr / 11) * 1000);

    if (user.totalPoints < pointsRequired) {
      showToast(`Insufficient balance: You need ${pointsRequired.toLocaleString()} WalkX Points to withdraw ₹${withdrawInr}.`);
      return;
    }

    const res = await supabaseData.withdrawUpi(withdrawUpiId, withdrawInr);
    if (!res.success && res.error) {
      showToast(`Withdrawal error: ${res.error}`);
      return;
    }

    const updatedPoints = res.newBalance !== undefined ? res.newBalance : user.totalPoints - pointsRequired;

    setUser((prev) => ({
      ...prev,
      totalPoints: updatedPoints,
      redeemedPoints: prev.redeemedPoints + pointsRequired,
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title: `₹${withdrawInr} Instant UPI Transfer`,
      detail: `Direct payout to ${withdrawUpiId} via Razorpay`,
      points: pointsRequired,
      type: 'debit',
      date: 'Just now',
      category: 'reward',
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    setIsWithdrawModalOpen(false);
    triggerCelebration();
    showToast(`₹${withdrawInr} transferred to ${withdrawUpiId} in 0.8s!`);
  };

  // Handlers: Donate
  const handleOpenDonate = (cause?: CauseItem, initialMode: 'points' | 'monetary' = 'points') => {
    setActiveDonationCause(cause || causes[0]);
    setDonationInitialMode(initialMode);
    setIsDonateModalOpen(true);
  };

  const handleConfirmPointsDonation = async (cause: CauseItem, pointsAmt: number, inrValue: number) => {
    if (user.totalPoints < pointsAmt) {
      showToast(`Insufficient balance: You have ${user.totalPoints.toLocaleString()} points.`);
      return;
    }

    const res = await supabaseData.pledgeDonation(cause.id, pointsAmt);
    if (!res.success && res.error) {
      showToast(`Donation error: ${res.error}`);
      return;
    }

    const updatedPoints = res.newBalance !== undefined ? res.newBalance : user.totalPoints - pointsAmt;

    setUser((prev) => ({
      ...prev,
      totalPoints: updatedPoints,
      donatedPoints: prev.donatedPoints + pointsAmt,
    }));

    // Update Cause funding
    setCauses((prev) =>
      prev.map((c) =>
        c.id === cause.id
          ? {
              ...c,
              raisedAmount: c.raisedAmount + inrValue,
              raisedPoints: (c.raisedPoints || 0) + pointsAmt,
              donorsCount: c.donorsCount + 1,
            }
          : c
      )
    );

    // New Donation Record (Transparent Sample Record)
    const refNum = res.referenceNumber || `WX-PTS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonation: DonationRecord = {
      id: res.donationId || `dn_${Date.now()}`,
      referenceNumber: refNum,
      donorName: user.name,
      donorEmail: user.email,
      causeTitle: cause.title,
      causeCategory: cause.category,
      amountInr: inrValue,
      pointsEquivalent: pointsAmt,
      contributionType: 'Points Contribution',
      date: 'Just now',
      status: isSupabaseConfigured ? 'Points Pledged' : 'Points Pledged (Demo)',
      paymentMethod: 'WalkX Points',
      isDemoRecord: !isSupabaseConfigured,
      notes: `Points pledged to ${cause.title}`
    };
    setDonations((prev) => [newDonation, ...prev]);

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title: `Points Contribution: ${cause.title}`,
      detail: `Sponsorship to ${cause.category} (${refNum})`,
      points: pointsAmt,
      type: 'debit',
      date: 'Just now',
      category: 'donation',
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    triggerCelebration();
    showToast(`Thank you! Pledged ${pointsAmt.toLocaleString()} pts to ${cause.title}!`);
  };

  const handleConfirmMonetaryPledge = (
    cause: CauseItem,
    inrAmount: number,
    donorName: string,
    donorEmail: string,
    paymentMethod: string
  ) => {
    // Update Cause funding
    setCauses((prev) =>
      prev.map((c) =>
        c.id === cause.id
          ? {
              ...c,
              raisedAmount: c.raisedAmount + inrAmount,
              donorsCount: c.donorsCount + 1,
            }
          : c
      )
    );

    const refNum = `WX-PLG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonation: DonationRecord = {
      id: `dn_${Date.now()}`,
      referenceNumber: refNum,
      donorName,
      donorEmail,
      causeTitle: cause.title,
      causeCategory: cause.category,
      amountInr: inrAmount,
      pointsEquivalent: Math.round((inrAmount / 11) * 1000),
      contributionType: 'Monetary Pledge',
      date: 'Just now',
      status: 'Monetary Pledge (Prepared Integration)',
      paymentMethod,
      isDemoRecord: true,
      notes: 'Prepared payment UI demonstration. Awaiting real payment provider integration.'
    };
    setDonations((prev) => [newDonation, ...prev]);

    triggerCelebration();
    showToast(`Monetary pledge of ₹${inrAmount} logged (Prepared Integration Sandbox)!`);
  };

  // Handlers: Redeem Reward
  const _handleOpenRedeem = (reward: RewardItem) => {
    setActiveRedeemItem(reward);
    setIsRedeemModalOpen(true);
  };

  const handleConfirmRedeem = async (rewardToRedeem?: RewardItem, customDeliveryTarget?: string) => {
    const item = rewardToRedeem || activeRedeemItem;
    if (!item) return;
    if (user.totalPoints < item.pointsCost) {
      showToast('Insufficient points to unlock this item.');
      return;
    }

    const target = customDeliveryTarget || (item.category === 'cash' ? user.phone || '9876543210@upi' : user.email);

    const res = await supabaseData.redeemReward(item.id, target);
    if (!res.success && res.error) {
      showToast(`Redemption error: ${res.error}`);
      return;
    }

    const updatedPoints = res.newBalance !== undefined ? res.newBalance : user.totalPoints - item.pointsCost;

    setUser((prev) => ({
      ...prev,
      totalPoints: updatedPoints,
      redeemedPoints: prev.redeemedPoints + item.pointsCost,
    }));

    setRewards((prev) =>
      prev.map((r) =>
        r.id === item.id ? { ...r, stockCount: Math.max(0, r.stockCount - 1) } : r
      )
    );

    const isInstantCash = item.category === 'cash';
    const newRedemption: RedemptionRecord = {
      id: res.redemptionId || `rdm_${Date.now()}`,
      rewardId: item.id,
      rewardTitle: item.title,
      category: item.category,
      pointsSpent: item.pointsCost,
      inrValue: item.inrValue,
      date: 'Just now',
      status: isInstantCash ? 'Approved' : 'Pending',
      redemptionCode: isInstantCash
        ? undefined
        : `WLKX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      deliveryTarget: target,
      statusNote: isInstantCash
        ? 'Approved by compliance system. Dispatched via Razorpay Payouts.'
        : `Voucher digital code generated and delivered to ${target}.`
    };

    setRedemptions((prev) => [newRedemption, ...prev]);

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title: `Redeemed: ${item.title}`,
      detail: `${item.category.toUpperCase()} claim processed (${target})`,
      points: item.pointsCost,
      type: 'debit',
      date: 'Just now',
      category: 'reward',
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    setIsRedeemModalOpen(false);
    triggerCelebration();
    showToast(`Reward unlocked: "${item.title}"! Delivery to ${target}.`);
  };

  // Determine if on admin page
  const isAdminPage =
    currentPage.startsWith('admin-') && currentPage !== 'admin-login';

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 right-5 z-50 animate-bounce">
          <div className="p-3.5 px-5 rounded-2xl bg-[#0e1329] border border-purple-500/40 text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isAdmin={isAdmin}
        onToggleAdmin={(val) => setIsAdmin(val)}
        userName={user.name}
      />

      {/* Page Body Container */}
      <main className={`flex-1 w-full mx-auto ${isAdminPage ? 'max-w-[1600px] px-0 py-0' : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-8'}`}>

        {/* Dynamic Page Switcher */}
        {(() => {
          switch (currentPage) {
            case 'landing':
              return (
                <LandingPage
                  onNavigate={setCurrentPage}
                  onOpenStepModal={() => setIsStepModalOpen(true)}
                />
              );

            case 'login':
              return (
                <LoginPage
                  onNavigate={setCurrentPage}
                  onLoginSuccess={async (name, email) => {
                    const authInfo = await getCurrentAuthUser();
                    if (authInfo.profile) {
                      setUser((prev) => ({
                        ...prev,
                        id: authInfo.profile?.id || prev.id,
                        name: authInfo.profile?.name || name,
                        email: authInfo.profile?.email || email,
                        phone: authInfo.profile?.phone || prev.phone,
                        totalPoints: authInfo.profile?.totalPoints ?? prev.totalPoints,
                        lifetimeSteps: authInfo.profile?.lifetimeSteps ?? prev.lifetimeSteps,
                        streakDays: authInfo.profile?.streakDays ?? prev.streakDays
                      }));
                    } else {
                      setUser((prev) => ({ ...prev, name, email }));
                    }
                    showToast(`Welcome back, ${name}!`);
                    setCurrentPage('dashboard');
                  }}
                />
              );

            case 'register':
              return (
                <RegisterPage
                  onNavigate={setCurrentPage}
                  onRegisterSuccess={async (name, email) => {
                    const authInfo = await getCurrentAuthUser();
                    if (authInfo.profile) {
                      setUser((prev) => ({
                        ...prev,
                        id: authInfo.profile?.id || prev.id,
                        name: authInfo.profile?.name || name,
                        email: authInfo.profile?.email || email,
                        phone: authInfo.profile?.phone || prev.phone,
                        totalPoints: authInfo.profile?.totalPoints ?? 1000,
                        lifetimeSteps: authInfo.profile?.lifetimeSteps ?? 0,
                        streakDays: authInfo.profile?.streakDays ?? 1
                      }));
                    } else {
                      setUser((prev) => ({ ...prev, name, email, totalPoints: 1000 }));
                    }
                    showToast(`Welcome to WalkX, ${name}!`);
                    setCurrentPage('dashboard');
                  }}
                />
              );

            case 'forgot-password':
              return <ForgotPasswordPage onNavigate={setCurrentPage} />;

            case 'dashboard':
              return (
                <DashboardPage
                  user={user}
                  weeklyData={weeklyData}
                  transactions={transactions}
                  causes={causes}
                  onNavigate={setCurrentPage}
                  onOpenStepModal={() => setIsStepModalOpen(true)}
                  onOpenDonateModal={handleOpenDonate}
                  onAddQuickSteps={handleAddSteps}
                  onResetSteps={handleResetSteps}
                  onOpenWithdrawModal={() => setIsWithdrawModalOpen(true)}
                />
              );

            case 'activity':
              return (
                <ActivityPage
                  user={user}
                  weeklyData={weeklyData}
                  onAddSteps={handleAddSteps}
                />
              );

            case 'feed':
              return (
                <SocialFeedPage
                  user={user}
                  onViewProfile={handleViewUserProfile}
                  showToast={showToast}
                />
              );

            case 'user-profile':
              return (
                <UserProfilePage
                  userId={viewingProfileId}
                  currentUser={user}
                  onBack={() => setCurrentPage('feed')}
                  onViewProfile={handleViewUserProfile}
                  onNavigate={setCurrentPage}
                  showToast={showToast}
                />
              );

            case 'places':
              return (
                <PlacesDiscoveryPage
                  onNavigate={setCurrentPage}
                  showToast={showToast}
                />
              );

            case 'explore':
              return (
                <ExplorePage
                  user={user}
                  onNavigate={setCurrentPage}
                  onViewProfile={handleViewUserProfile}
                  showToast={showToast}
                />
              );

            case 'leaderboards':
              return (
                <LeaderboardsPage
                  onNavigate={setCurrentPage}
                  onViewProfile={handleViewUserProfile}
                  showToast={showToast}
                />
              );

            case 'challenges':
              return (
                <CommunityChallengesPage
                  onNavigate={setCurrentPage}
                  showToast={showToast}
                />
              );

            case 'wallet':
              return (
                <WalletPage
                  user={user}
                  transactions={transactions}
                  onOpenWithdrawModal={() => setIsWithdrawModalOpen(true)}
                  onNavigateRewards={() => setCurrentPage('rewards')}
                  onNavigateDonations={() => setCurrentPage('donation')}
                />
              );

            case 'rewards':
              return (
                <RewardsPage
                  user={user}
                  rewards={rewards}
                  redemptions={redemptions}
                  onRedeemReward={handleConfirmRedeem}
                />
              );

            case 'donation':
              return (
                <DonationPage
                  user={user}
                  causes={causes}
                  onOpenDonateModal={handleOpenDonate}
                  onNavigateHistory={() => setCurrentPage('donation-history')}
                />
              );

            case 'donation-history':
              return (
                <DonationHistoryPage
                  user={user}
                  donations={donations}
                  onNavigateDonation={() => setCurrentPage('donation')}
                />
              );

            case 'profile':
              return (
                <ProfileSettingsPage
                  user={user}
                  onUpdateUser={async (updated) => {
                    setUser((prev) => ({ ...prev, ...updated }));
                    await supabaseData.updateProfile(updated);
                    showToast('Profile preferences updated.');
                  }}
                  onLogout={async () => {
                    await logoutUser();
                    setUser(initialUserProfile);
                    showToast('Signed out successfully.');
                    setCurrentPage('landing');
                  }}
                />
              );

            case 'admin-login':
              return (
                <AdminLoginPage
                  onNavigate={setCurrentPage}
                  onAdminLoginSuccess={() => {
                    setIsAdmin(true);
                    showToast('Executive Admin clearance verified.');
                    setCurrentPage('admin-dashboard');
                  }}
                />
              );

            case 'admin-dashboard':
              return (
                <AdminDashboardPage
                  initialSection="overview"
                  onNavigate={setCurrentPage}
                  onExitAdmin={() => {
                    setIsAdmin(false);
                    setCurrentPage('dashboard');
                  }}
                />
              );

            case 'admin-users':
              return (
                <AdminDashboardPage
                  initialSection="users"
                  onNavigate={setCurrentPage}
                  onExitAdmin={() => {
                    setIsAdmin(false);
                    setCurrentPage('dashboard');
                  }}
                />
              );

            case 'admin-rewards':
              return (
                <AdminDashboardPage
                  initialSection="rewards"
                  onNavigate={setCurrentPage}
                  onExitAdmin={() => {
                    setIsAdmin(false);
                    setCurrentPage('dashboard');
                  }}
                />
              );

            case 'admin-donations':
              return (
                <AdminDashboardPage
                  initialSection="donations"
                  onNavigate={setCurrentPage}
                  onExitAdmin={() => {
                    setIsAdmin(false);
                    setCurrentPage('dashboard');
                  }}
                />
              );

            case 'admin-reports':
              return (
                <AdminDashboardPage
                  initialSection="reports"
                  onNavigate={setCurrentPage}
                  onExitAdmin={() => {
                    setIsAdmin(false);
                    setCurrentPage('dashboard');
                  }}
                />
              );

            case 'privacy':
              return <PrivacyPolicyPage onNavigate={setCurrentPage} />;

            case 'terms':
              return <TermsConditionsPage onNavigate={setCurrentPage} />;

            default:
              return (
                <LandingPage
                  onNavigate={setCurrentPage}
                  onOpenStepModal={() => setIsStepModalOpen(true)}
                />
              );
          }
        })()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={setCurrentPage} />

      {/* MODAL 1: Simulate Steps */}
      <Modal
        isOpen={isStepModalOpen}
        onClose={() => setIsStepModalOpen(false)}
        title="Simulate Movement Telemetry"
        subtitle="Simulate verified pedometer sensor increments to test real-time conversion."
      >
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-2.5">
            {[500, 1000, 2500, 5000].map((amt) => (
              <button
                key={amt}
                onClick={() => setStepModalValue(amt)}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                  stepModalValue === amt
                    ? 'bg-purple-600/30 border-purple-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                +{amt.toLocaleString()} Steps
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Custom Steps:</span>
              <span className="text-purple-400 font-bold">{stepModalValue.toLocaleString()} steps</span>
            </div>
            <input
              type="range"
              min="200"
              max="10000"
              step="100"
              value={stepModalValue}
              onChange={(e) => setStepModalValue(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Points added: +{stepModalValue}</span>
              <span>INR value: ≈ ₹{(stepModalValue / 1000).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => handleAddSteps(stepModalValue)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Footprints className="w-4 h-4" />
            Add to Live Stride Balance
          </button>
        </div>
      </Modal>

      {/* MODAL 2: Withdraw to UPI */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="Instant UPI Cash Payout"
        subtitle="Transfer funds directly to your Indian Virtual Payment Address via Razorpay."
      >
        <form onSubmit={handleConfirmWithdrawal} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target UPI ID (VPA)
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={withdrawUpiId}
                onChange={(e) => setWithdrawUpiId(e.target.value)}
                placeholder="name@okaxis"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Payout Amount
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[11, 55, 110, 550].map((amt) => {
                const reqPts = Math.round((amt / 11) * 1000);
                const canAfford = user.totalPoints >= reqPts;

                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setWithdrawInr(amt)}
                    disabled={!canAfford}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      withdrawInr === amt
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                        : canAfford
                        ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                        : 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    ₹{amt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-emerald-300 space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Points to Deduct:</span>
              <span>{Math.round((withdrawInr / 11) * 1000).toLocaleString()} pts</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Transfer Method:</span>
              <span>Direct Bank UPI (Instant)</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            Execute Instant Razorpay Payout
          </button>
        </form>
      </Modal>

      {/* MODAL 3: Donate to Cause (Points & Prepared Monetary Sandbox) */}
      <DonationModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        cause={activeDonationCause}
        user={user}
        initialMode={donationInitialMode}
        onConfirmPointsDonation={handleConfirmPointsDonation}
        onConfirmMonetaryPledge={handleConfirmMonetaryPledge}
        onNavigateHistory={() => setCurrentPage('donation-history')}
      />

      {/* MODAL 4: Redeem Reward */}
      <Modal
        isOpen={isRedeemModalOpen}
        onClose={() => setIsRedeemModalOpen(false)}
        title="Confirm Reward Redemption"
        subtitle={activeRedeemItem ? activeRedeemItem.title : ''}
      >
        {activeRedeemItem && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <span className="text-3xl">{activeRedeemItem.icon}</span>
              <div>
                <h4 className="text-sm font-bold text-white">{activeRedeemItem.title}</h4>
                <p className="text-xs text-slate-400">{activeRedeemItem.description}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs text-purple-300 space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span>Cost:</span>
                <span>{activeRedeemItem.pointsCost.toLocaleString()} pts</span>
              </div>
              <div className="flex justify-between">
                <span>Equivalent Monetary Value:</span>
                <span className="text-white font-bold">₹{activeRedeemItem.inrValue} INR</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Remaining Balance After:</span>
                <span>{(user.totalPoints - activeRedeemItem.pointsCost).toLocaleString()} pts</span>
              </div>
            </div>

            <button
              onClick={() => handleConfirmRedeem()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Confirm and Unlock Reward
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default App;
