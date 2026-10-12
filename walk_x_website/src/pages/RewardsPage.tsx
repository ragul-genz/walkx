import React, { useState } from 'react';
import {
  Coins,
  Lock,
  ArrowRight,
  Info,
  Gift,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  Search,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { RewardItem, UserProfile, RedemptionRecord } from '../types';

interface RewardsPageProps {
  user: UserProfile;
  rewards: RewardItem[];
  redemptions?: RedemptionRecord[];
  onRedeemReward: (reward: RewardItem, deliveryTarget?: string) => void;
}

export const RewardsPage: React.FC<RewardsPageProps> = ({
  user,
  rewards,
  redemptions = [],
  onRedeemReward,
}) => {
  // Main Page View Mode: Catalogue vs History
  const [activeTab, setActiveTab] = useState<'catalogue' | 'history'>('catalogue');

  // Catalogue Filters
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cash' | 'voucher' | 'merch'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // History Filter
  const [historyStatusFilter, setHistoryStatusFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected' | 'Completed'>('all');

  // In-page Redemption Confirmation Modal State
  const [selectedRewardForModal, setSelectedRewardForModal] = useState<RewardItem | null>(null);
  const [deliveryTarget, setDeliveryTarget] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [modalError, setModalError] = useState('');

  // Copy to clipboard state
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => {
      setCopiedCodeId(null);
    }, 2500);
  };

  // Filtered catalogue
  const filteredRewards = rewards.filter((rew) => {
    const matchesCategory = selectedCategory === 'all' || rew.category === selectedCategory;
    const matchesSearch =
      rew.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rew.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rew.partnerBrand && rew.partnerBrand.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filtered redemptions
  const filteredRedemptions = redemptions.filter((r) => {
    if (historyStatusFilter === 'all') return true;
    return r.status === historyStatusFilter;
  });

  const handleOpenModal = (reward: RewardItem) => {
    setSelectedRewardForModal(reward);
    setDeliveryTarget(reward.category === 'cash' ? user.phone || '9876543210@upi' : user.email);
    setAgreedToTerms(false);
    setModalError('');
  };

  const handleConfirmRedemption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRewardForModal) return;

    if (!deliveryTarget.trim()) {
      setModalError(
        selectedRewardForModal.category === 'cash'
          ? 'Please enter a valid UPI VPA ID (e.g., name@okhdfcbank).'
          : 'Please enter a valid delivery email address.'
      );
      return;
    }

    if (!agreedToTerms) {
      setModalError('Please accept the non-refundable redemption terms to proceed.');
      return;
    }

    onRedeemReward(selectedRewardForModal, deliveryTarget.trim());
    setSelectedRewardForModal(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* =========================================================================
          PAGE HEADER & WALLET BALANCE SUMMARY
          ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Rewards Marketplace
            </span>
            <span className="text-xs text-slate-400">Fixed Valuation: 1,000 pts = ₹11.00 INR</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Redeem WalkX Points</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Redeem your daily verified steps for direct UPI payouts, e-commerce brand gift cards, and athletic gear.
          </p>
        </div>

        {/* Read-Only Balance Badge */}
        <div className="p-4 rounded-2xl bg-[#0c1022] border border-purple-500/30 flex items-center gap-3.5 self-start md:self-auto shadow-xl">
          <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Available Balance
            </div>
            <div className="text-xl font-black text-white">
              {user.totalPoints.toLocaleString()} <span className="text-xs text-purple-300 font-normal">pts</span>
            </div>
            <div className="text-xs font-semibold text-emerald-400">
              ≈ ₹{(user.totalPoints / 1000).toFixed(2)} INR
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN TABS: REWARDS CATALOGUE VS REDEMPTION HISTORY
          ========================================================================= */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('catalogue')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'catalogue'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Reward Catalogue</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
            {rewards.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Redemption History & Status</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
            {redemptions.length}
          </span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: REWARDS CATALOGUE
          ========================================================================= */}
      {activeTab === 'catalogue' && (
        <div className="space-y-6">
          {/* Category Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'All Rewards' },
                { id: 'cash', label: '⚡ Instant UPI Cash' },
                { id: 'voucher', label: '🎟 Brand Gift Cards' },
                { id: 'merch', label: '👕 WalkX Apparel' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === tab.id
                      ? 'bg-purple-600/30 text-white border border-purple-500/50 shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search rewards or brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => {
              const canAfford = user.totalPoints >= reward.pointsCost;
              const pointsNeeded = Math.max(0, reward.pointsCost - user.totalPoints);
              const progressPercent = Math.min(100, Math.round((user.totalPoints / reward.pointsCost) * 100));

              // Check streak eligibility
              const streakRequired = reward.minStreakDays || 0;
              const meetsStreak = user.streakDays >= streakRequired;
              const isEligible = canAfford && meetsStreak;

              return (
                <div
                  key={reward.id}
                  className={`rounded-3xl bg-[#0c1022]/90 border transition-all duration-300 flex flex-col justify-between p-6 shadow-xl relative overflow-hidden group ${
                    isEligible
                      ? 'border-purple-500/30 hover:border-purple-500/60 hover:shadow-purple-500/10'
                      : 'border-slate-800/80 hover:border-slate-700 opacity-90'
                  }`}
                >
                  <div>
                    {/* Header: Category & Partner Brand */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {reward.category === 'cash' ? 'UPI Payout' : reward.category}
                        </span>
                        {reward.partnerBrand && (
                          <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                            {reward.partnerBrand}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">
                        Quota: <strong className="text-slate-200">{reward.stockCount}</strong>
                      </span>
                    </div>

                    {/* Icon & Title */}
                    <div className="space-y-3 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-900/40 to-blue-900/40 border border-purple-500/20 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">
                        {reward.icon}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                          {reward.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {reward.description}
                        </p>
                      </div>
                    </div>

                    {/* Eligibility Requirements Box */}
                    <div className="mb-4 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1">
                      <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                        Eligibility Requirement:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {meetsStreak ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                        <span className={meetsStreak ? 'text-slate-300' : 'text-amber-300 font-medium'}>
                          {reward.eligibility || 'Open to all verified walkers'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cost & Action Box */}
                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white">{reward.pointsCost.toLocaleString()}</span>
                        <span className="text-xs text-slate-400 font-medium">pts</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">
                        Indicative: ₹{reward.inrValue} INR
                      </span>
                    </div>

                    {/* Progress bar if cannot afford */}
                    {!canAfford && (
                      <div className="space-y-1">
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full rounded-full" style={{ width: `${progressPercent}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>{progressPercent}% unlocked</span>
                          <span>Need {pointsNeeded.toLocaleString()} more pts</span>
                        </div>
                      </div>
                    )}

                    {/* Redeem CTA Button */}
                    <button
                      onClick={() => handleOpenModal(reward)}
                      disabled={!isEligible}
                      className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                        isEligible
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-600/20 active:scale-95'
                          : 'bg-slate-800/80 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {isEligible ? (
                        <>
                          <span>Redeem Voucher</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      ) : !meetsStreak ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Requires {streakRequired}-Day Streak</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Walk {pointsNeeded.toLocaleString()} more steps</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explainer / Compliance Footer */}
          <div className="rounded-2xl bg-gradient-to-r from-[#10142b] to-[#0c1022] border border-slate-800 p-6 md:p-8 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-400" />
              How WalkX Rewards & Vouchers Work
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">1</span>
                  Loyalty Points Valuation
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Every 1,000 WalkX points equals ₹11.00 indicative reward value. Points have no cash surrender value outside approved partner redemptions.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">2</span>
                  Digital Voucher Codes
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Brand gift cards (Amazon, Flipkart, Decathlon) are delivered instantly with secure cryptographic codes to your registered email.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">3</span>
                  Instant UPI Payouts
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Cash transfer redemptions are routed directly to your NPCI UPI address via Razorpay without hidden processing charges.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: REDEMPTION HISTORY & STATUS (PENDING, APPROVED, REJECTED, COMPLETED)
          ========================================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Redemption History Ledger
                <span className="text-xs text-slate-400 font-normal">({filteredRedemptions.length} records)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Track status across Pending review, Approved dispatch, Rejected refunds, and Completed vouchers.
              </p>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(['all', 'Pending', 'Approved', 'Completed', 'Rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setHistoryStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    historyStatusFilter === st
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {st === 'all' ? 'All Statuses' : st}
                </button>
              ))}
            </div>
          </div>

          {/* History Records Table / Cards */}
          <div className="rounded-3xl bg-[#0c1022]/90 border border-slate-800/80 p-6 shadow-xl">
            {filteredRedemptions.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Gift className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-300">No Redemptions Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You have not redeemed any items matching this filter yet. Browse the catalogue to unlock your first reward!
                </p>
                <button
                  onClick={() => setActiveTab('catalogue')}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold text-xs transition-all"
                >
                  Browse Catalogue
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {filteredRedemptions.map((item) => (
                  <div key={item.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                          {item.rewardTitle}
                        </h4>
                        <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ID: {item.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Delivered to: <strong className="text-slate-300 font-mono">{item.deliveryTarget}</strong>
                      </p>
                      {item.statusNote && (
                        <p className="text-[11px] text-slate-500 italic">
                          {item.statusNote}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-5">
                      {/* Points Spent */}
                      <div className="text-left md:text-right">
                        <span className="text-sm font-black text-white block">
                          {item.pointsSpent.toLocaleString()} pts
                        </span>
                        <span className="text-[11px] text-emerald-400 font-semibold">
                          ₹{item.inrValue} INR
                        </span>
                        <span className="text-[10px] text-slate-500 block">{item.date}</span>
                      </div>

                      {/* Status Badge */}
                      <div className="text-right">
                        {item.status === 'Completed' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                              Completed
                            </span>
                            {item.redemptionCode && (
                              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg">
                                <span className="font-mono text-xs font-bold text-cyan-300">{item.redemptionCode}</span>
                                <button
                                  onClick={() => handleCopyCode(item.id, item.redemptionCode!)}
                                  className="text-slate-400 hover:text-white transition-colors"
                                  title="Copy Code"
                                >
                                  {copiedCodeId === item.id ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        ) : item.status === 'Approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                            Approved
                          </span>
                        ) : item.status === 'Pending' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            Pending Review
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-300 border border-red-500/30">
                            <XCircle className="w-3.5 h-3.5 text-red-400" />
                            Rejected (Refunded)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          REDEMPTION CONFIRMATION MODAL
          ========================================================================= */}
      {selectedRewardForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0c1022] border border-purple-500/30 p-6 md:p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                  Confirm Redemption
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedRewardForModal.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedRewardForModal.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedRewardForModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-xs"
              >
                ✕
              </button>
            </div>

            {/* Error Message */}
            {modalError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Points Deduction Preview */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/20 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Current Available Balance:</span>
                <span className="font-bold text-white">{user.totalPoints.toLocaleString()} pts</span>
              </div>
              <div className="flex justify-between text-purple-300 font-semibold">
                <span>Points to Deduct:</span>
                <span>-{selectedRewardForModal.pointsCost.toLocaleString()} pts</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-300">
                <span>Remaining Balance After:</span>
                <span className="font-bold text-white">
                  {(user.totalPoints - selectedRewardForModal.pointsCost).toLocaleString()} pts
                </span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Indicative Reward Value:</span>
                <span>₹{selectedRewardForModal.inrValue} INR</span>
              </div>
            </div>

            {/* Delivery Target Input */}
            <form onSubmit={handleConfirmRedemption} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  {selectedRewardForModal.category === 'cash'
                    ? 'Enter UPI ID (VPA) for Instant Bank Payout:'
                    : 'Enter Destination Email for Voucher Delivery:'}
                </label>
                <input
                  type={selectedRewardForModal.category === 'cash' ? 'text' : 'email'}
                  value={deliveryTarget}
                  onChange={(e) => setDeliveryTarget(e.target.value)}
                  placeholder={
                    selectedRewardForModal.category === 'cash'
                      ? 'e.g., yourname@okhdfcbank or 9876543210@paytm'
                      : 'e.g., yourname@gmail.com'
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Agreement Checkbox */}
              <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <span>
                  I understand that WalkX points are non-refundable once voucher codes or UPI transfers are initiated, and this redemption is subject to merchant terms.
                </span>
              </label>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRewardForModal(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  Confirm & Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
