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
  DonationRecord,
  AdminUser,
  AdminReportMetric,
} from './types';
import {
  initialUserProfile,
  weeklyStrideTelemetry,
  initialTransactions,
  initialRewards,
  initialRedemptions,
  initialCauses,
  initialDonationsList,
  initialAdminUsers,
  adminKpiMetrics,
} from './data/demoData';

// Shared Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Modal } from './components/Modal';
import { DonationModal } from './components/DonationModal';
import { AdminNavHeader } from './components/AdminNavHeader';

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

// Admin Pages
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminRewardsPage } from './pages/AdminRewardsPage';
import { AdminDonationsPage } from './pages/AdminDonationsPage';
import { AdminReportsPage } from './pages/AdminReportsPage';

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
    if (hash && validPages.includes(hash as PageId)) return hash as PageId;
    const path = window.location.pathname.replace(/^\//, '').trim();
    if (path === 'admin') return 'admin-dashboard';
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
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdminUsers);
  const [metrics] = useState<AdminReportMetric[]>(adminKpiMetrics);

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

  // Handlers: Step Simulation
  const handleAddSteps = (stepsToAdd: number) => {
    const updatedToday = user.stepsToday + stepsToAdd;
    const updatedPoints = user.totalPoints + stepsToAdd;

    setUser((prev) => ({
      ...prev,
      stepsToday: updatedToday,
      totalPoints: updatedPoints,
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
      points: stepsToAdd,
      type: 'credit',
      date: 'Just now',
      category: 'steps',
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    if (stepsToAdd >= 1000) {
      triggerCelebration();
    }
    showToast(`Logged +${stepsToAdd.toLocaleString()} steps (+${stepsToAdd.toLocaleString()} WalkX Points added)!`);
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
  const handleConfirmWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const pointsRequired = Math.round((withdrawInr / 11) * 1000);

    if (user.totalPoints < pointsRequired) {
      showToast(`Insufficient balance: You need ${pointsRequired.toLocaleString()} WalkX Points to withdraw ₹${withdrawInr}.`);
      return;
    }

    setUser((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints - pointsRequired,
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

  const handleConfirmPointsDonation = (cause: CauseItem, pointsAmt: number, inrValue: number) => {
    if (user.totalPoints < pointsAmt) {
      showToast(`Insufficient balance: You have ${user.totalPoints.toLocaleString()} points.`);
      return;
    }

    setUser((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints - pointsAmt,
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
    const refNum = `WX-PTS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonation: DonationRecord = {
      id: `dn_${Date.now()}`,
      referenceNumber: refNum,
      donorName: user.name,
      donorEmail: user.email,
      causeTitle: cause.title,
      causeCategory: cause.category,
      amountInr: inrValue,
      pointsEquivalent: pointsAmt,
      contributionType: 'Points Contribution',
      date: 'Just now',
      status: 'Points Pledged (Demo)',
      paymentMethod: 'WalkX Points',
      isDemoRecord: true,
      notes: 'Simulated points deduction from active walker pool. No real bank transfer.'
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

  const handleConfirmRedeem = (rewardToRedeem?: RewardItem, customDeliveryTarget?: string) => {
    const item = rewardToRedeem || activeRedeemItem;
    if (!item) return;
    if (user.totalPoints < item.pointsCost) {
      showToast('Insufficient points to unlock this item.');
      return;
    }

    const target = customDeliveryTarget || (item.category === 'cash' ? user.phone || '9876543210@upi' : user.email);
    const isInstantCash = item.category === 'cash';

    const newRedemption: RedemptionRecord = {
      id: `rdm_${Date.now()}`,
      rewardId: item.id,
      rewardTitle: item.title,
      category: item.category,
      pointsSpent: item.pointsCost,
      inrValue: item.inrValue,
      date: 'Just now',
      status: isInstantCash ? 'Approved' : 'Completed',
      redemptionCode: isInstantCash
        ? undefined
        : `WLKX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      deliveryTarget: target,
      statusNote: isInstantCash
        ? 'Approved by compliance system. Dispatched via Razorpay Payouts.'
        : `Voucher digital code generated and delivered to ${target}.`
    };

    setRedemptions((prev) => [newRedemption, ...prev]);

    setUser((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints - item.pointsCost,
      redeemedPoints: prev.redeemedPoints + item.pointsCost,
    }));

    setRewards((prev) =>
      prev.map((r) =>
        r.id === item.id ? { ...r, stockCount: Math.max(0, r.stockCount - 1) } : r
      )
    );

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

  // Admin Handlers
  const handleToggleUserStatus = (userId: string) => {
    setAdminUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
          : u
      )
    );
    showToast('Walker account status updated.');
  };

  const handleUpdateRole = (userId: string, newRole: 'User' | 'Moderator' | 'Admin') => {
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    showToast(`User role elevated to ${newRole}.`);
  };

  const handleAddAdminUser = (newUser: Omit<AdminUser, 'id'>) => {
    const created: AdminUser = {
      ...newUser,
      id: `adm_u${Date.now()}`,
    };
    setAdminUsers((prev) => [created, ...prev]);
    showToast(`Added walker "${newUser.name}".`);
  };

  const handleAddReward = (newReward: RewardItem) => {
    setRewards((prev) => [newReward, ...prev]);
    showToast(`Added new reward: "${newReward.title}".`);
  };

  const handleToggleRewardUnlocked = (rewardId: string) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, unlocked: !r.unlocked } : r))
    );
    showToast('Reward availability updated.');
  };

  const handleUpdateRewardStock = (rewardId: string, delta: number) => {
    setRewards((prev) =>
      prev.map((r) =>
        r.id === rewardId ? { ...r, stockCount: Math.max(0, r.stockCount + delta) } : r
      )
    );
    showToast('Stock quantity updated.');
  };

  const handleAddCause = (newCause: CauseItem) => {
    setCauses((prev) => [newCause, ...prev]);
    showToast(`Cause "${newCause.title}" published.`);
  };

  const handleUpdateDonationStatus = (
    donationId: string,
    newStatus: 'Verified' | 'Pending Review' | 'Flagged'
  ) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === donationId ? { ...d, status: newStatus } : d))
    );
    showToast(`Pledge status updated to ${newStatus}.`);
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Subheader Bar (Visible on Admin Pages) */}
        {isAdminPage && (
          <AdminNavHeader
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            onExitAdmin={() => {
              setIsAdmin(false);
              setCurrentPage('dashboard');
            }}
          />
        )}

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
                  onLoginSuccess={(name, email) => {
                    setUser((prev) => ({ ...prev, name, email }));
                    showToast(`Welcome back, ${name}!`);
                    setCurrentPage('dashboard');
                  }}
                />
              );

            case 'register':
              return (
                <RegisterPage
                  onNavigate={setCurrentPage}
                  onRegisterSuccess={(name, email) => {
                    setUser((prev) => ({ ...prev, name, email }));
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
                  onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
                  onLogout={() => setCurrentPage('landing')}
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
                  metrics={metrics}
                  onNavigate={setCurrentPage}
                />
              );

            case 'admin-users':
              return (
                <AdminUsersPage
                  users={adminUsers}
                  onToggleUserStatus={handleToggleUserStatus}
                  onUpdateRole={handleUpdateRole}
                  onAddUser={handleAddAdminUser}
                />
              );

            case 'admin-rewards':
              return (
                <AdminRewardsPage
                  rewards={rewards}
                  onAddReward={handleAddReward}
                  onToggleUnlocked={handleToggleRewardUnlocked}
                  onUpdateStock={handleUpdateRewardStock}
                />
              );

            case 'admin-donations':
              return (
                <AdminDonationsPage
                  causes={causes}
                  donations={donations}
                  onAddCause={handleAddCause}
                  onUpdateDonationStatus={handleUpdateDonationStatus}
                />
              );

            case 'admin-reports':
              return <AdminReportsPage />;

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
