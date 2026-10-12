import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  FileText,
  Coins,
  Settings,
  ShieldAlert,
  Search,
  Download,
  Plus,
  X,
  RefreshCw,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Menu,
  SlidersHorizontal
} from 'lucide-react';
import {
  AdminUser,
  RewardItem,
  RedemptionRecord,
  CauseItem,
  DonationRecord,
  AdminSection,
  PageId
} from '../types';
import {
  adminService,
  ExtendedPointsConfig,
  SystemSettings,
  AdminAuditLogItem
} from '../services/adminService';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { ConfirmDialog } from '../components/admin/ConfirmDialog';

interface AdminDashboardPageProps {
  initialSection?: AdminSection;
  onNavigate?: (page: PageId) => void;
  onExitAdmin: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  initialSection = 'overview',
  onExitAdmin
}) => {
  const [currentSection, setCurrentSection] = useState<AdminSection>(initialSection);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data States loaded via adminService
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionRecord[]>([]);
  const [causes, setCauses] = useState<CauseItem[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLogItem[]>([]);

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    variant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Section 2: Users State
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userPage, setUserPage] = useState(1);
  const usersPerPage = 5;
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUserDrawer, setSelectedUserDrawer] = useState<AdminUser | null>(null);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'User' as const,
    stepsTotal: 0,
    pointsBalance: 1000,
    joinedDate: 'Today',
    status: 'Active' as const,
  });

  // Section 3: Points Simulator & Form State
  const [pointsForm, setPointsForm] = useState<ExtendedPointsConfig | null>(null);
  const [simSteps, setSimSteps] = useState(10000);

  // Section 4: Rewards State
  const [rewardTab, setRewardTab] = useState<'catalog' | 'redemptions'>('catalog');
  const [showAddRewardModal, setShowAddRewardModal] = useState(false);
  const [newRewardData, setNewRewardData] = useState<Omit<RewardItem, 'id'>>({
    title: '',
    pointsCost: 50000,
    inrValue: 550,
    icon: '🎁',
    description: '',
    category: 'cash',
    stockCount: 100,
    unlocked: true,
    partnerBrand: 'WalkX Partner'
  });
  const [redemptionStatusFilter, setRedemptionStatusFilter] = useState<string>('all');

  // Section 5: Donations State
  const [donationTab, setDonationTab] = useState<'causes' | 'records'>('causes');
  const [showAddCauseModal, setShowAddCauseModal] = useState(false);
  const [newCauseData, setNewCauseData] = useState<Omit<CauseItem, 'id' | 'raisedAmount' | 'donorsCount'>>({
    title: '',
    tagline: '',
    description: '',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    icon: '📚',
    organizationName: '',
    organizationType: 'Registered Non-Profit (Sample)',
    organizationLocation: 'Tamil Nadu, India',
    registrationNumber: 'SAMPLE-NGO-TN-2024',
    targetAmount: 50000,
    verifiedPartner: '',
  });

  // Section 6: Reports State
  const [reportDateRange, setReportDateRange] = useState<'7d' | '30d' | 'quarter' | 'year'>('30d');
  const [exportingReportType, setExportingReportType] = useState<string | null>(null);

  // Section 7: Settings Form State
  const [settingsForm, setSettingsForm] = useState<SystemSettings | null>(null);

  // Section 8: Audit Search & Filter
  const [auditSearch, setAuditSearch] = useState('');
  const [auditSectionFilter, setAuditSectionFilter] = useState<string>('all');
  const [auditSeverityFilter, setAuditSeverityFilter] = useState<string>('all');
  const [selectedAuditLog, setSelectedAuditLog] = useState<AdminAuditLogItem | null>(null);

  // Toast feedback helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial Data Fetch via adminService
  const loadData = async () => {
    const u = await adminService.getUsers();
    setUsers(u);
    const r = await adminService.getRewards();
    setRewards(r);
    const rdm = await adminService.getRedemptions();
    setRedemptions(rdm);
    const c = await adminService.getCauses();
    setCauses(c);
    const d = await adminService.getDonationRecords();
    setDonations(d);
    const p = await adminService.getPointsConfig();
    setPointsForm(p);
    const s = await adminService.getSettings();
    setSettingsForm(s);
    const a = await adminService.getAuditLogs();
    setAuditLogs(a);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentSection(initialSection);
  }, [initialSection]);

  // Section 2: User Handlers
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.id.toLowerCase().includes(userSearch.toLowerCase());
    const matchStatus = userStatusFilter === 'all' || u.status === userStatusFilter;
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchSearch && matchStatus && matchRole;
  });

  const totalUserPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((userPage - 1) * usersPerPage, userPage * usersPerPage);

  const handleToggleUserStatus = (user: AdminUser) => {
    const targetStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    setConfirmDialog({
      isOpen: true,
      title: `${targetStatus === 'Suspended' ? 'Suspend' : 'Reactivate'} Walker Account`,
      message: `Are you sure you want to change the status of ${user.name} (${user.email}) to "${targetStatus}"? This will immediately affect in-app points access.`,
      confirmLabel: `${targetStatus} Account`,
      variant: targetStatus === 'Suspended' ? 'danger' : 'primary',
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        await adminService.updateUserStatus(user.id, targetStatus);
        await loadData();
        showToast(`Walker account "${user.name}" is now ${targetStatus}.`);
      }
    });
  };

  const handleUpdateRole = async (userId: string, newRole: 'User' | 'Moderator' | 'Admin') => {
    await adminService.updateUserRole(userId, newRole);
    await loadData();
    showToast(`Role updated to ${newRole}.`);
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email) return;
    await adminService.createUser(newUserData);
    await loadData();
    setShowAddUserModal(false);
    setNewUserData({
      name: '',
      email: '',
      role: 'User',
      stepsTotal: 0,
      pointsBalance: 1000,
      joinedDate: 'Today',
      status: 'Active',
    });
    showToast(`Created walker account for ${newUserData.name}.`);
  };

  // Section 3: Points Handlers
  const handleSavePointsConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pointsForm) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Points Policy & Rate Calibration',
      message: `You are about to calibrate the WalkX Points Economy. 1,000 points will convert to ₹${pointsForm.pointsToInrRate} INR, with a daily cap of ${pointsForm.dailyStepPointsCap.toLocaleString()} points. This will be recorded permanently in the administrative audit logs.`,
      confirmLabel: 'Save & Publish Rules',
      variant: 'warning',
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        await adminService.updatePointsConfig(pointsForm);
        await loadData();
        showToast('Points earning rules and conversion rates updated successfully!');
      }
    });
  };

  // Section 4: Rewards Handlers
  const handleAddRewardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewardData.title) return;
    await adminService.createReward(newRewardData);
    await loadData();
    setShowAddRewardModal(false);
    setNewRewardData({
      title: '',
      pointsCost: 50000,
      inrValue: 550,
      icon: '🎁',
      description: '',
      category: 'cash',
      stockCount: 100,
      unlocked: true,
      partnerBrand: 'WalkX Partner'
    });
    showToast(`Reward "${newRewardData.title}" created successfully.`);
  };

  const handleToggleRewardLock = async (reward: RewardItem) => {
    await adminService.toggleRewardUnlocked(reward.id);
    await loadData();
    showToast(`Reward availability updated.`);
  };

  const handleAdjustStock = async (rewardId: string, delta: number) => {
    await adminService.updateRewardStock(rewardId, delta);
    await loadData();
    showToast(`Inventory updated.`);
  };

  const handleUpdateRedemption = (redemption: RedemptionRecord, newStatus: RedemptionRecord['status']) => {
    setConfirmDialog({
      isOpen: true,
      title: `Confirm Redemption ${newStatus}`,
      message: `Are you sure you want to mark redemption #${redemption.id} (${redemption.rewardTitle}) as "${newStatus}"?`,
      confirmLabel: `Mark as ${newStatus}`,
      variant: newStatus === 'Rejected' ? 'danger' : 'primary',
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        await adminService.updateRedemptionStatus(
          redemption.id,
          newStatus,
          newStatus === 'Approved' ? 'Approved by admin compliance officer' : undefined
        );
        await loadData();
        showToast(`Redemption #${redemption.id} marked as ${newStatus}.`);
      }
    });
  };

  // Section 5: Donations Handlers
  const handleAddCauseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCauseData.title || !newCauseData.organizationName) return;
    await adminService.createCause({
      ...newCauseData,
      verifiedPartner: `${newCauseData.organizationName} (Sample Partner)`,
    });
    await loadData();
    setShowAddCauseModal(false);
    showToast(`Social cause "${newCauseData.title}" published.`);
  };

  const handleUpdateDonation = async (donationId: string, status: DonationRecord['status']) => {
    await adminService.updateDonationStatus(donationId, status);
    await loadData();
    showToast(`Pledge status updated to ${status}.`);
  };

  // Section 6: Reports Handlers
  const handleExportCsv = async (reportType: 'users' | 'points' | 'redemptions' | 'donations' | 'audit') => {
    setExportingReportType(reportType);
    try {
      const filename = await adminService.exportCsvReport(reportType);
      showToast(`Downloaded CSV: ${filename}`);
    } finally {
      setExportingReportType(null);
    }
  };

  // Section 7: Settings Handlers
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Update System Thresholds & Policies',
      message: 'Confirm applying these security policies, anti-cheat limits, and alert thresholds across the WalkX ecosystem.',
      confirmLabel: 'Save System Settings',
      variant: 'primary',
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        await adminService.updateSettings(settingsForm);
        await loadData();
        showToast('System configuration saved and applied.');
      }
    });
  };

  // Section 8: Audit Filter
  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      (log.targetEntity && log.targetEntity.toLowerCase().includes(auditSearch.toLowerCase()));
    const matchSection = auditSectionFilter === 'all' || log.section.toLowerCase() === auditSectionFilter.toLowerCase();
    const matchSeverity = auditSeverityFilter === 'all' || log.severity === auditSeverityFilter;
    return matchSearch && matchSection && matchSeverity;
  });

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-5 z-50 animate-bounce">
          <div className="p-3.5 px-5 rounded-2xl bg-[#0e1329] border border-purple-500/40 text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Top Banner: Backend Security Architecture Disclosure */}
      <div className="bg-[#0b0f24] border-b border-purple-500/20 px-4 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Backend Authorization Active:</strong> Client role checks are presentation only. All mutations require verified backend session validation.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-400">
            <span className="font-mono text-purple-300">Server Time: 2026-10-12 (UTC+5:30)</span>
            <button
              onClick={onExitAdmin}
              className="text-rose-400 hover:text-rose-300 font-semibold"
            >
              Exit to User View
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Console Container */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Desktop & Mobile Sidebar */}
        <AdminSidebar
          currentSection={currentSection}
          onSelectSection={(sec) => setCurrentSection(sec)}
          onExitAdmin={onExitAdmin}
          usersCount={users.length}
          pendingRedemptionsCount={redemptions.filter((r) => r.status === 'Pending').length}
          pendingDonationsCount={donations.filter((d) => d.status === 'Pending Review').length}
          auditLogsCount={auditLogs.length}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content Area */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Bar with Mobile Menu Toggle & Title */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                aria-label="Toggle admin sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">
                    Module / {currentSection}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white capitalize font-['Outfit'] tracking-tight">
                  {currentSection === 'overview' && 'Overview Dashboard'}
                  {currentSection === 'users' && 'User Management Directory'}
                  {currentSection === 'points' && 'Points Economy & Earning Rules'}
                  {currentSection === 'rewards' && 'Rewards Catalog & Redemptions'}
                  {currentSection === 'donations' && 'Social Causes & Donation Moderation'}
                  {currentSection === 'reports' && 'Reports, Analytics & CSV Center'}
                  {currentSection === 'settings' && 'System Settings & Fraud Policies'}
                  {currentSection === 'audit' && 'Administrative Audit Ledger'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => loadData()}
                title="Refresh All Modules"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* =========================================================================
              SECTION 1: OVERVIEW DASHBOARD
              ========================================================================= */}
          {currentSection === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* 5 Primary KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-4 rounded-2xl bg-[#0c1022]/90 border border-purple-500/20 shadow-lg space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Registered</span>
                  <div className="text-2xl font-black text-white">{users.length.toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {users.filter((u) => u.status === 'Active').length} Active Walkers
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0c1022]/90 border border-blue-500/20 shadow-lg space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Activity Volume</span>
                  <div className="text-2xl font-black text-white">4.82M km</div>
                  <span className="text-[10px] text-cyan-400 font-semibold">+18.5% Stride Velocity</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0c1022]/90 border border-amber-500/20 shadow-lg space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Points In Circulation</span>
                  <div className="text-2xl font-black text-amber-300">
                    {(users.reduce((acc, u) => acc + u.pointsBalance, 0) / 1000).toFixed(1)}k pts
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ≈ ₹{((users.reduce((acc, u) => acc + u.pointsBalance, 0) / 1000) * 11).toFixed(0)} INR
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0c1022]/90 border border-emerald-500/20 shadow-lg space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Redemptions Settled</span>
                  <div className="text-2xl font-black text-emerald-400">
                    ₹{redemptions.reduce((acc, r) => acc + r.inrValue, 0).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400">{redemptions.length} processed claims</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0c1022]/90 border border-pink-500/20 shadow-lg space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Donations Remitted</span>
                  <div className="text-2xl font-black text-pink-400">
                    ₹{causes.reduce((acc, c) => acc + c.raisedAmount, 0).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-pink-300 font-semibold">{causes.length} Verified Causes</span>
                </div>
              </div>

              {/* Visual Telemetry Chart & Allocation */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0c1022]/90 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        7-Day Activity & Points Telemetry
                      </h3>
                      <p className="text-xs text-slate-400">Step ingestion velocity vs points issuance</p>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      Normal Cadence
                    </span>
                  </div>

                  {/* Visual Bar Chart */}
                  <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-slate-800 pb-2">
                    {[
                      { day: 'Mon', steps: 42000, points: 420 },
                      { day: 'Tue', steps: 58000, points: 580 },
                      { day: 'Wed', steps: 71000, points: 710 },
                      { day: 'Thu', steps: 65000, points: 650 },
                      { day: 'Fri', steps: 89000, points: 890 },
                      { day: 'Sat', steps: 112000, points: 1120 },
                      { day: 'Sun', steps: 94000, points: 940 },
                    ].map((d) => (
                      <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full flex items-end justify-center gap-1 h-32">
                          <div
                            className="w-1/2 bg-gradient-to-t from-purple-600 to-blue-500 rounded-t-lg transition-all"
                            style={{ height: `${(d.steps / 112000) * 100}%` }}
                            title={`${d.steps.toLocaleString()} steps`}
                          />
                          <div
                            className="w-1/2 bg-gradient-to-t from-pink-600 to-purple-500 rounded-t-lg transition-all"
                            style={{ height: `${(d.points / 1120) * 85}%` }}
                            title={`${d.points} points issued`}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">{d.day}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Steps Telemetry
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Points Issued
                      </span>
                    </div>
                    <span>Weekly Peak: 112,000 steps</span>
                  </div>
                </div>

                {/* Quick Shortcuts & Alert Center */}
                <div className="p-6 rounded-3xl bg-[#0c1022]/90 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      Pending Moderation Triggers
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setCurrentSection('rewards');
                          setRewardTab('redemptions');
                        }}
                        className="w-full p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 text-left transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-amber-300">
                            {redemptions.filter((r) => r.status === 'Pending').length} Pending Redemptions
                          </div>
                          <div className="text-[10px] text-slate-400">Awaiting payout compliance review</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-amber-400" />
                      </button>

                      <button
                        onClick={() => {
                          setCurrentSection('donations');
                          setDonationTab('records');
                        }}
                        className="w-full p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 hover:border-pink-500/40 text-left transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-pink-300">
                            {donations.filter((d) => d.status === 'Pending Review').length} Donation Audits
                          </div>
                          <div className="text-[10px] text-slate-400">Inspect pledge entries</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-pink-400" />
                      </button>

                      <button
                        onClick={() => setCurrentSection('points')}
                        className="w-full p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 text-left transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-purple-300">Conversion Policy</div>
                          <div className="text-[10px] text-slate-400">Active rule: 1,000 pts = ₹11.00</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-purple-400" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleExportCsv('users')}
                      className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Master Users Directory CSV</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 2: USER MANAGEMENT
              ========================================================================= */}
          {currentSection === 'users' && (
            <div className="space-y-6 animate-fade-in">
              {/* Controls Header */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative min-w-[220px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => {
                        setUserSearch(e.target.value);
                        setUserPage(1);
                      }}
                      placeholder="Search name, email, ID..."
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <select
                    value={userStatusFilter}
                    onChange={(e) => {
                      setUserStatusFilter(e.target.value);
                      setUserPage(1);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending">Pending</option>
                  </select>

                  <select
                    value={userRoleFilter}
                    onChange={(e) => {
                      setUserRoleFilter(e.target.value);
                      setUserPage(1);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="User">User</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => handleExportCsv('users')}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-600/20 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Walker</span>
                  </button>
                </div>
              </div>

              {/* Users Data Table */}
              <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800 p-5 shadow-xl space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-3.5">Walker Account</th>
                        <th className="py-3 px-3.5">Role</th>
                        <th className="py-3 px-3.5">Status</th>
                        <th className="py-3 px-3.5">Steps Logged</th>
                        <th className="py-3 px-3.5">Points Balance</th>
                        <th className="py-3 px-3.5">Joined</th>
                        <th className="py-3 px-3.5 text-right">Administrative Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200">
                      {paginatedUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-xs">
                                {u.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-semibold text-white block">{u.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{u.email}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3.5">
                            <select
                              value={u.role}
                              onChange={(e) => handleUpdateRole(u.id, e.target.value as any)}
                              className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] font-semibold text-slate-200 focus:outline-none focus:border-purple-500"
                            >
                              <option value="User">User</option>
                              <option value="Moderator">Moderator</option>
                              <option value="Admin">Admin</option>
                            </select>
                          </td>

                          <td className="py-3 px-3.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                u.status === 'Active'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  u.status === 'Active' ? 'bg-emerald-400' : 'bg-rose-400'
                                }`}
                              />
                              {u.status}
                            </span>
                          </td>

                          <td className="py-3 px-3.5 font-mono text-slate-200">
                            {u.stepsTotal.toLocaleString()}
                          </td>

                          <td className="py-3 px-3.5 font-bold text-purple-300 font-mono">
                            {u.pointsBalance.toLocaleString()} pts
                          </td>

                          <td className="py-3 px-3.5 text-slate-500 text-[11px]">
                            {u.joinedDate}
                          </td>

                          <td className="py-3 px-3.5 text-right space-x-2">
                            <button
                              onClick={() => setSelectedUserDrawer(u)}
                              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-all"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                                u.status === 'Active'
                                  ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30'
                                  : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {u.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <span>
                    Showing {(userPage - 1) * usersPerPage + 1} to{' '}
                    {Math.min(userPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} walkers
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                      disabled={userPage === 1}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-mono px-2">
                      {userPage} / {totalUserPages}
                    </span>
                    <button
                      onClick={() => setUserPage((p) => Math.min(totalUserPages, p + 1))}
                      disabled={userPage === totalUserPages}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-40"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add User Modal */}
              {showAddUserModal && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                  onClick={() => setShowAddUserModal(false)}
                >
                  <div
                    className="w-full max-w-md bg-[#0c1022] border border-purple-500/30 rounded-3xl p-6 shadow-2xl space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-bold text-white">Create New Walker Account</h3>
                    <form onSubmit={handleAddUserSubmit} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newUserData.name}
                          onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                          placeholder="e.g. Senthil Kumar"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={newUserData.email}
                          onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                          placeholder="senthil@example.com"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Account Role</label>
                          <select
                            value={newUserData.role}
                            onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                          >
                            <option value="User">User</option>
                            <option value="Moderator">Moderator</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Initial Points</label>
                          <input
                            type="number"
                            value={newUserData.pointsBalance}
                            onChange={(e) => setNewUserData({ ...newUserData, pointsBalance: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddUserModal(false)}
                          className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg"
                        >
                          Create Walker
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* User Drawer / Modal */}
              {selectedUserDrawer && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                  onClick={() => setSelectedUserDrawer(null)}
                >
                  <div
                    className="w-full max-w-lg bg-[#0c1022] border border-purple-500/30 rounded-3xl p-6 shadow-2xl space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] text-purple-400 font-mono uppercase font-bold">Walker ID: {selectedUserDrawer.id}</span>
                        <h3 className="text-xl font-bold text-white mt-0.5">{selectedUserDrawer.name}</h3>
                        <p className="text-xs text-slate-400">{selectedUserDrawer.email}</p>
                      </div>
                      <button
                        onClick={() => setSelectedUserDrawer(null)}
                        className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Points Balance</span>
                        <span className="text-lg font-bold text-purple-300 font-mono">
                          {selectedUserDrawer.pointsBalance.toLocaleString()} pts
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          ≈ ₹{((selectedUserDrawer.pointsBalance / 1000) * 11).toFixed(2)} INR
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Lifetime Strides</span>
                        <span className="text-lg font-bold text-white font-mono">
                          {selectedUserDrawer.stepsTotal.toLocaleString()} steps
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {(selectedUserDrawer.stepsTotal * 0.00075).toFixed(1)} km walked
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                      <div className="flex justify-between text-slate-400">
                        <span>Account Role:</span>
                        <span className="text-white font-semibold">{selectedUserDrawer.role}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Account Status:</span>
                        <span className={selectedUserDrawer.status === 'Active' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {selectedUserDrawer.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Registration Date:</span>
                        <span className="text-slate-200">{selectedUserDrawer.joinedDate}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedUserDrawer(null)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
                    >
                      Close Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              SECTION 3: POINTS MANAGEMENT (EARNING RULES & CONVERSION RATES)
              ========================================================================= */}
          {currentSection === 'points' && pointsForm && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <form onSubmit={handleSavePointsConfig} className="space-y-6">
                {/* Indicative Rate Settings Card */}
                <div className="p-6 rounded-3xl bg-[#0c1022]/90 border border-purple-500/30 shadow-xl space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Indicative Reward Conversion Rule</h3>
                      <p className="text-xs text-slate-400">
                        Calibrate the monetary equivalent rate. Standard rule: <strong>1,000 points = ₹11.00 INR</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Rupee Equivalent per 1,000 pts (INR)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          max="100"
                          value={pointsForm.pointsToInrRate}
                          onChange={(e) => setPointsForm({ ...pointsForm, pointsToInrRate: Number(e.target.value) })}
                          className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <span className="text-[10px] text-purple-300 mt-1 block">Active: 1,000 pts = ₹{pointsForm.pointsToInrRate}</span>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Minimum Withdrawal Floor (INR)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                        <input
                          type="number"
                          value={pointsForm.minWithdrawalInr}
                          onChange={(e) => setPointsForm({ ...pointsForm, minWithdrawalInr: Number(e.target.value) })}
                          className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Requires {Math.round((pointsForm.minWithdrawalInr / pointsForm.pointsToInrRate) * 1000).toLocaleString()} pts
                      </span>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Max Daily Withdrawal Cap (INR)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                        <input
                          type="number"
                          value={pointsForm.maxDailyWithdrawalInr}
                          onChange={(e) => setPointsForm({ ...pointsForm, maxDailyWithdrawalInr: Number(e.target.value) })}
                          className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">Anti-fraud velocity ceiling</span>
                    </div>
                  </div>
                </div>

                {/* Stride Earning Rules Card */}
                <div className="p-6 rounded-3xl bg-[#0c1022]/90 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center">
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Step Earning Rules & Streak Bonuses</h3>
                      <p className="text-xs text-slate-400">Controls how sensor steps convert to credited points</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Daily Step Points Cap</label>
                      <input
                        type="number"
                        step="1000"
                        value={pointsForm.dailyStepPointsCap}
                        onChange={(e) => setPointsForm({ ...pointsForm, dailyStepPointsCap: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">Maximum 15,000 pts/day</span>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">5-Day Streak Multiplier</label>
                      <input
                        type="number"
                        step="0.05"
                        value={pointsForm.streakMultiplier5Day}
                        onChange={(e) => setPointsForm({ ...pointsForm, streakMultiplier5Day: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">e.g. 1.2x on 5-day streak</span>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">10-Day Streak Milestone</label>
                      <input
                        type="number"
                        step="0.05"
                        value={pointsForm.streakMultiplier10Day}
                        onChange={(e) => setPointsForm({ ...pointsForm, streakMultiplier10Day: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">e.g. 1.5x milestone bonus</span>
                    </div>
                  </div>
                </div>

                {/* Live Economics Simulator */}
                <div className="p-6 rounded-3xl bg-slate-950 border border-purple-500/20 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        Live Conversion Economics Simulator
                      </h4>
                      <p className="text-xs text-slate-400">Test how walker steps translate into points and INR</p>
                    </div>
                    <span className="font-mono text-xs text-purple-300 font-bold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                      {simSteps.toLocaleString()} Steps
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1000"
                    max="30000"
                    step="500"
                    value={simSteps}
                    onChange={(e) => setSimSteps(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />

                  <div className="grid grid-cols-3 gap-3 text-center text-xs pt-1">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Capped Points Credited</span>
                      <span className="text-base font-extrabold text-white">
                        {Math.min(simSteps, pointsForm.dailyStepPointsCap).toLocaleString()} pts
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Indicative INR Value</span>
                      <span className="text-base font-extrabold text-emerald-400">
                        ₹{(((Math.min(simSteps, pointsForm.dailyStepPointsCap) / 1000) * pointsForm.pointsToInrRate)).toFixed(2)} INR
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">10-Day Streak Bonus</span>
                      <span className="text-base font-extrabold text-purple-300">
                        ₹{(((Math.min(simSteps, pointsForm.dailyStepPointsCap) * pointsForm.streakMultiplier10Day / 1000) * pointsForm.pointsToInrRate)).toFixed(2)} INR
                      </span>
                    </div>
                  </div>
                </div>

                {/* Save Rules Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Points Policy & Log to Audit</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =========================================================================
              SECTION 4: REWARDS MANAGEMENT
              ========================================================================= */}
          {currentSection === 'rewards' && (
            <div className="space-y-6 animate-fade-in">
              {/* Sub tabs */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900 border border-slate-800">
                  <button
                    onClick={() => setRewardTab('catalog')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      rewardTab === 'catalog'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Rewards Catalog ({rewards.length})
                  </button>
                  <button
                    onClick={() => setRewardTab('redemptions')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      rewardTab === 'redemptions'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Redemptions Review Queue</span>
                    {redemptions.filter((r) => r.status === 'Pending').length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-extrabold">
                        {redemptions.filter((r) => r.status === 'Pending').length}
                      </span>
                    )}
                  </button>
                </div>

                {rewardTab === 'catalog' && (
                  <button
                    onClick={() => setShowAddRewardModal(true)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Reward</span>
                  </button>
                )}
              </div>

              {/* Sub-tab 1: Catalog */}
              {rewardTab === 'catalog' && (
                <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800 p-5 shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                          <th className="py-3 px-3.5">Offering Title</th>
                          <th className="py-3 px-3.5">Brand & Category</th>
                          <th className="py-3 px-3.5">Points Cost</th>
                          <th className="py-3 px-3.5">INR Value</th>
                          <th className="py-3 px-3.5">Stock</th>
                          <th className="py-3 px-3.5">Availability</th>
                          <th className="py-3 px-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-200">
                        {rewards.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-3.5">
                              <div className="flex items-center gap-2.5">
                                <span className="text-xl">{r.icon}</span>
                                <div>
                                  <span className="font-semibold text-white block">{r.title}</span>
                                  <span className="text-[10px] text-slate-400 line-clamp-1">{r.description}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3.5">
                              <span className="text-slate-300 font-semibold">{r.partnerBrand || 'WalkX'}</span>
                              <span className="block text-[10px] uppercase font-bold text-purple-400">{r.category}</span>
                            </td>
                            <td className="py-3 px-3.5 font-bold text-purple-300 font-mono">
                              {r.pointsCost.toLocaleString()} pts
                            </td>
                            <td className="py-3 px-3.5 font-bold text-white">
                              ₹{r.inrValue} INR
                            </td>
                            <td className="py-3 px-3.5">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleAdjustStock(r.id, -10)}
                                  className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
                                >
                                  -
                                </button>
                                <span className="font-mono px-1 font-bold">{r.stockCount}</span>
                                <button
                                  onClick={() => handleAdjustStock(r.id, 10)}
                                  className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-3.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  r.unlocked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                }`}
                              >
                                {r.unlocked ? 'Unlocked' : 'Locked'}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 text-right">
                              <button
                                onClick={() => handleToggleRewardLock(r)}
                                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold"
                              >
                                {r.unlocked ? 'Lock' : 'Unlock'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Redemptions Queue */}
              {rewardTab === 'redemptions' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Filter Status:</span>
                    {['all', 'Pending', 'Approved', 'Completed', 'Rejected'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setRedemptionStatusFilter(st)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                          redemptionStatusFilter === st
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {st === 'all' ? 'All Redemptions' : st}
                      </button>
                    ))}
                  </div>

                  <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800 p-5 shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                            <th className="py-3 px-3.5">Redemption Ref</th>
                            <th className="py-3 px-3.5">Reward Title</th>
                            <th className="py-3 px-3.5">Points & Value</th>
                            <th className="py-3 px-3.5">Delivery Target</th>
                            <th className="py-3 px-3.5">Status</th>
                            <th className="py-3 px-3.5 text-right">Fulfillment Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-200">
                          {redemptions
                            .filter((r) => redemptionStatusFilter === 'all' || r.status === redemptionStatusFilter)
                            .map((r) => (
                              <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="py-3 px-3.5">
                                  <span className="font-mono font-bold text-purple-300 block">{r.id}</span>
                                  <span className="text-[10px] text-slate-500">{r.date}</span>
                                </td>
                                <td className="py-3 px-3.5 font-semibold text-white">{r.rewardTitle}</td>
                                <td className="py-3 px-3.5">
                                  <span className="text-purple-300 font-bold block">{r.pointsSpent.toLocaleString()} pts</span>
                                  <span className="text-slate-400 text-[10px]">₹{r.inrValue} INR</span>
                                </td>
                                <td className="py-3 px-3.5 font-mono text-[11px] text-slate-300">{r.deliveryTarget}</td>
                                <td className="py-3 px-3.5">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                      r.status === 'Completed'
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : r.status === 'Approved'
                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        : r.status === 'Pending'
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                    }`}
                                  >
                                    {r.status}
                                  </span>
                                </td>
                                <td className="py-3 px-3.5 text-right space-x-1.5">
                                  {r.status === 'Pending' && (
                                    <>
                                      <button
                                        onClick={() => handleUpdateRedemption(r, 'Approved')}
                                        className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleUpdateRedemption(r, 'Rejected')}
                                        className="px-2.5 py-1 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white text-[11px] font-semibold border border-rose-500/40"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  {r.status === 'Approved' && (
                                    <button
                                      onClick={() => handleUpdateRedemption(r, 'Completed')}
                                      className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold"
                                    >
                                      Mark Dispatched
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Reward Modal */}
              {showAddRewardModal && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                  onClick={() => setShowAddRewardModal(false)}
                >
                  <div
                    className="w-full max-w-md bg-[#0c1022] border border-purple-500/30 rounded-3xl p-6 shadow-2xl space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-bold text-white">Create New Catalog Offering</h3>
                    <form onSubmit={handleAddRewardSubmit} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Reward Title</label>
                        <input
                          type="text"
                          required
                          value={newRewardData.title}
                          onChange={(e) => setNewRewardData({ ...newRewardData, title: e.target.value })}
                          placeholder="e.g. Amazon Pay ₹250 Voucher"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Points Cost</label>
                          <input
                            type="number"
                            required
                            value={newRewardData.pointsCost}
                            onChange={(e) => setNewRewardData({ ...newRewardData, pointsCost: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">INR Nominal Value</label>
                          <input
                            type="number"
                            required
                            value={newRewardData.inrValue}
                            onChange={(e) => setNewRewardData({ ...newRewardData, inrValue: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Category</label>
                          <select
                            value={newRewardData.category}
                            onChange={(e) => setNewRewardData({ ...newRewardData, category: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                          >
                            <option value="cash">Instant Cash</option>
                            <option value="voucher">Digital Voucher</option>
                            <option value="merch">Merchandise</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Stock Quantity</label>
                          <input
                            type="number"
                            value={newRewardData.stockCount}
                            onChange={(e) => setNewRewardData({ ...newRewardData, stockCount: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={newRewardData.description}
                          onChange={(e) => setNewRewardData({ ...newRewardData, description: e.target.value })}
                          placeholder="Fulfillment terms and partner brand notes..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddRewardModal(false)}
                          className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg"
                        >
                          Create Reward
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              SECTION 5: DONATION MANAGEMENT
              ========================================================================= */}
          {currentSection === 'donations' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900 border border-slate-800">
                  <button
                    onClick={() => setDonationTab('causes')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      donationTab === 'causes'
                        ? 'bg-pink-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Social Causes ({causes.length})
                  </button>
                  <button
                    onClick={() => setDonationTab('records')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      donationTab === 'records'
                        ? 'bg-pink-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Pledges & Donation Ledger ({donations.length})
                  </button>
                </div>

                {donationTab === 'causes' && (
                  <button
                    onClick={() => setShowAddCauseModal(true)}
                    className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-pink-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Cause</span>
                  </button>
                )}
              </div>

              {/* Sub-tab 1: Causes */}
              {donationTab === 'causes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {causes.map((c) => {
                    const percent = Math.min(100, Math.round((c.raisedAmount / c.targetAmount) * 100));

                    return (
                      <div key={c.id} className="p-5 rounded-3xl bg-[#0c1022]/90 border border-slate-800 shadow-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-pink-500/15 text-pink-300 border border-pink-500/30">
                            {c.category}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">Reg: {c.registrationNumber}</span>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{c.icon}</span>
                          <div>
                            <h4 className="text-sm font-bold text-white line-clamp-1">{c.title}</h4>
                            <p className="text-[11px] text-slate-400">{c.organizationName}</p>
                          </div>
                        </div>

                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-white font-bold">₹{c.raisedAmount.toLocaleString()}</span>
                            <span className="text-slate-400 text-[11px]">Goal: ₹{c.targetAmount.toLocaleString()} ({percent}%)</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                          <div className="text-[10px] text-slate-500 pt-0.5">
                            {c.donorsCount} supporters • {c.organizationLocation}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Sub-tab 2: Records Queue */}
              {donationTab === 'records' && (
                <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800 p-5 shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                          <th className="py-3 px-3.5">Ref Code</th>
                          <th className="py-3 px-3.5">Target Cause</th>
                          <th className="py-3 px-3.5">Donor Account</th>
                          <th className="py-3 px-3.5">Contribution Type</th>
                          <th className="py-3 px-3.5">Value (INR)</th>
                          <th className="py-3 px-3.5">Audit Status</th>
                          <th className="py-3 px-3.5 text-right">Moderator Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-200">
                        {donations.map((d) => (
                          <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-3.5 font-mono font-bold text-pink-300">{d.referenceNumber}</td>
                            <td className="py-3 px-3.5 font-semibold text-white max-w-xs truncate">{d.causeTitle}</td>
                            <td className="py-3 px-3.5">
                              <div>{d.donorName}</div>
                              <div className="text-[10px] text-slate-500">{d.donorEmail}</div>
                            </td>
                            <td className="py-3 px-3.5">
                              <span className="text-purple-300 font-semibold">{d.contributionType}</span>
                            </td>
                            <td className="py-3 px-3.5 font-bold text-white">₹{d.amountInr.toFixed(2)}</td>
                            <td className="py-3 px-3.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  d.status.includes('Pledged') || d.status === 'Verified'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}
                              >
                                {d.status}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 text-right space-x-1.5">
                              <button
                                onClick={() => handleUpdateDonation(d.id, 'Verified')}
                                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold"
                              >
                                Verify
                              </button>
                              <button
                                onClick={() => handleUpdateDonation(d.id, 'Flagged')}
                                className="px-2.5 py-1 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white text-[11px] font-semibold border border-rose-500/30"
                              >
                                Flag
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Add Cause Modal */}
              {showAddCauseModal && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                  onClick={() => setShowAddCauseModal(false)}
                >
                  <div
                    className="w-full max-w-lg bg-[#0c1022] border border-pink-500/30 rounded-3xl p-6 shadow-2xl space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-bold text-white">Publish New Verified Social Cause</h3>
                    <form onSubmit={handleAddCauseSubmit} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Cause Title</label>
                        <input
                          type="text"
                          required
                          value={newCauseData.title}
                          onChange={(e) => setNewCauseData({ ...newCauseData, title: e.target.value })}
                          placeholder="e.g. Clean River & Afforestation Campaign"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Category</label>
                          <select
                            value={newCauseData.category}
                            onChange={(e) => setNewCauseData({ ...newCauseData, category: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                          >
                            <option value="Education">Education</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Food support">Food support</option>
                            <option value="Environment">Environment</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Goal Target (INR)</label>
                          <input
                            type="number"
                            required
                            value={newCauseData.targetAmount}
                            onChange={(e) => setNewCauseData({ ...newCauseData, targetAmount: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Partner NGO Name</label>
                          <input
                            type="text"
                            required
                            value={newCauseData.organizationName}
                            onChange={(e) => setNewCauseData({ ...newCauseData, organizationName: e.target.value })}
                            placeholder="e.g. Vanam Foundation"
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Registration ID</label>
                          <input
                            type="text"
                            required
                            value={newCauseData.registrationNumber}
                            onChange={(e) => setNewCauseData({ ...newCauseData, registrationNumber: e.target.value })}
                            placeholder="SAMPLE-NGO-TN-2024"
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Mission Description</label>
                        <textarea
                          rows={2}
                          value={newCauseData.description}
                          onChange={(e) => setNewCauseData({ ...newCauseData, description: e.target.value })}
                          placeholder="How walker strides support this cause..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddCauseModal(false)}
                          className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold shadow-lg"
                        >
                          Publish Cause
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              SECTION 6: REPORTS & REAL CSV EXPORT
              ========================================================================= */}
          {currentSection === 'reports' && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              {/* Date Filter Bar */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#0c1022]/90 border border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-slate-300 font-semibold">Report Date Filter:</span>
                  {[
                    { id: '7d', label: 'Last 7 Days' },
                    { id: '30d', label: 'Last 30 Days' },
                    { id: 'quarter', label: 'This Quarter' },
                    { id: 'year', label: 'Fiscal 2026' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setReportDateRange(d.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                        reportDateRange === d.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-emerald-400 font-mono">Ledger Verified</span>
              </div>

              {/* Real CSV Export Cards Center */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    type: 'users' as const,
                    title: 'Walkers Master Directory CSV',
                    desc: 'Complete list of all registered walkers, roles, steps, and points balances.',
                    filename: 'walkx_users_report.csv',
                    color: 'border-purple-500/30 text-purple-400',
                  },
                  {
                    type: 'points' as const,
                    title: 'Points Economy & Policy CSV',
                    desc: 'Active earning limits, 1k=₹11 conversion parameters, and payout caps.',
                    filename: 'walkx_points_report.csv',
                    color: 'border-amber-500/30 text-amber-400',
                  },
                  {
                    type: 'redemptions' as const,
                    title: 'Redemptions Settlement Audit CSV',
                    desc: 'Every UPI cash and voucher claim with fulfillment dates and recipient targets.',
                    filename: 'walkx_redemptions_report.csv',
                    color: 'border-blue-500/30 text-blue-400',
                  },
                  {
                    type: 'donations' as const,
                    title: 'Social Causes & Donations CSV',
                    desc: 'Detailed log of points contributions and prepared monetary pledges.',
                    filename: 'walkx_donations_report.csv',
                    color: 'border-pink-500/30 text-pink-400',
                  },
                ].map((item) => (
                  <div
                    key={item.type}
                    className={`p-5 rounded-3xl bg-[#0c1022]/90 border ${item.color} shadow-xl flex flex-col justify-between space-y-4`}
                  >
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center justify-between">
                        <span>{item.title}</span>
                        <FileText className="w-5 h-5 text-slate-400" />
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>

                    <button
                      onClick={() => handleExportCsv(item.type)}
                      disabled={exportingReportType === item.type}
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
                    >
                      <Download className="w-4 h-4 text-purple-400" />
                      <span>{exportingReportType === item.type ? 'Generating CSV...' : `Download ${item.filename}`}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 7: SETTINGS (POLICIES, LIMITS & NOTIFICATIONS)
              ========================================================================= */}
          {currentSection === 'settings' && settingsForm && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Anti Cheat & System Thresholds */}
                <div className="p-6 rounded-3xl bg-[#0c1022]/90 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Anti-Cheat & GPS Spoofing Filters</h3>
                      <p className="text-xs text-slate-400">Protects points economy against vehicular speed & auto-clickers</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Vehicular Speed Cutoff (km/h)
                      </label>
                      <input
                        type="number"
                        value={settingsForm.antiCheatSpeedThresholdKmh}
                        onChange={(e) => setSettingsForm({ ...settingsForm, antiCheatSpeedThresholdKmh: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">Strides above this speed will be discarded</span>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Max Cadence Ceiling (steps/min)
                      </label>
                      <input
                        type="number"
                        value={settingsForm.antiCheatMaxCadence}
                        onChange={(e) => setSettingsForm({ ...settingsForm, antiCheatMaxCadence: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">Maximum human running sprint cadence</span>
                    </div>
                  </div>
                </div>

                {/* Platform Policies & Notifications */}
                <div className="p-6 rounded-3xl bg-[#0c1022]/90 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Platform Governance & Notification Alerts</h3>
                      <p className="text-xs text-slate-400">Manage compliance thresholds and emergency toggles</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Support & Compliance Email</label>
                      <input
                        type="email"
                        value={settingsForm.contactSupportEmail}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactSupportEmail: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">High-Value Payout Alert Threshold (INR)</label>
                      <input
                        type="number"
                        value={settingsForm.emailAlertThresholdInr}
                        onChange={(e) => setSettingsForm({ ...settingsForm, emailAlertThresholdInr: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Emergency Toggle Switches */}
                  <div className="pt-2 space-y-3">
                    <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-white block">Allow Points Redemptions to Bank/UPI</span>
                        <span className="text-[10px] text-slate-400">Permits users to unlock real cash & voucher rewards</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.allowPointsWithdrawal}
                        onChange={(e) => setSettingsForm({ ...settingsForm, allowPointsWithdrawal: e.target.checked })}
                        className="w-4 h-4 accent-purple-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/30 cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-rose-300 block">Emergency Maintenance Mode</span>
                        <span className="text-[10px] text-slate-400">Freezes all points transactions and displays maintenance notice</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.maintenanceMode}
                        onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceMode: e.target.checked })}
                        className="w-4 h-4 accent-rose-500"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Platform Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =========================================================================
              SECTION 8: AUDIT LOGS
              ========================================================================= */}
          {currentSection === 'audit' && (
            <div className="space-y-6 animate-fade-in">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative min-w-[220px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      placeholder="Search action, actor, target..."
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <select
                    value={auditSectionFilter}
                    onChange={(e) => setAuditSectionFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200"
                  >
                    <option value="all">All Sections</option>
                    <option value="Users">Users</option>
                    <option value="Points">Points</option>
                    <option value="Rewards">Rewards</option>
                    <option value="Donations">Donations</option>
                    <option value="Settings">Settings</option>
                    <option value="Security">Security</option>
                  </select>

                  <select
                    value={auditSeverityFilter}
                    onChange={(e) => setAuditSeverityFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200"
                  >
                    <option value="all">All Severities</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <button
                  onClick={() => handleExportCsv('audit')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5 text-purple-400" />
                  <span>Export Audit Logs CSV</span>
                </button>
              </div>

              {/* Audit Table */}
              <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800 p-5 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-3.5">Timestamp</th>
                        <th className="py-3 px-3.5">Admin Actor</th>
                        <th className="py-3 px-3.5">Section</th>
                        <th className="py-3 px-3.5">Action Executed</th>
                        <th className="py-3 px-3.5">Target Entity</th>
                        <th className="py-3 px-3.5">Severity</th>
                        <th className="py-3 px-3.5 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200">
                      {filteredAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-3.5 font-mono text-[11px] text-slate-400">{log.timestamp}</td>
                          <td className="py-3 px-3.5">
                            <span className="font-semibold text-white block">{log.actor.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{log.actor.email}</span>
                          </td>
                          <td className="py-3 px-3.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/25">
                              {log.section}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 font-semibold text-white">{log.action}</td>
                          <td className="py-3 px-3.5 text-slate-300 font-mono text-[11px]">{log.targetEntity || '-'}</td>
                          <td className="py-3 px-3.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                log.severity === 'critical'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : log.severity === 'warning'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-blue-500/20 text-blue-300'
                              }`}
                            >
                              {log.severity}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-right">
                            <button
                              onClick={() => setSelectedAuditLog(log)}
                              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Audit Log Modal */}
              {selectedAuditLog && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                  onClick={() => setSelectedAuditLog(null)}
                >
                  <div
                    className="w-full max-w-lg bg-[#0c1022] border border-purple-500/30 rounded-3xl p-6 shadow-2xl space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Log ID: {selectedAuditLog.id}</span>
                        <h3 className="text-lg font-bold text-white mt-0.5">{selectedAuditLog.action}</h3>
                        <p className="text-xs text-slate-400">{selectedAuditLog.timestamp}</p>
                      </div>
                      <button
                        onClick={() => setSelectedAuditLog(null)}
                        className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                        <div className="flex justify-between text-slate-400">
                          <span>Admin Actor:</span>
                          <span className="text-white font-semibold">
                            {selectedAuditLog.actor.name} ({selectedAuditLog.actor.email})
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Target Entity:</span>
                          <span className="text-purple-300 font-mono">{selectedAuditLog.targetEntity || 'System'}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>IP Origin:</span>
                          <span className="text-slate-300 font-mono">{selectedAuditLog.ipAddress || '106.51.24.89'}</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-300 leading-relaxed font-mono text-[11px]">
                        {selectedAuditLog.details}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedAuditLog(null)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
                    >
                      Close Entry
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
