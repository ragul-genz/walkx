import React, { useState } from 'react';
import {
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard,
  Calculator,
  Search,
  Info,
  Footprints,
  Gift,
  Heart
} from 'lucide-react';
import { UserProfile, Transaction } from '../types';

interface WalletPageProps {
  user: UserProfile;
  transactions: Transaction[];
  onOpenWithdrawModal: () => void;
  onNavigateRewards: () => void;
  onNavigateDonations: () => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({
  user,
  transactions,
  onOpenWithdrawModal,
  onNavigateRewards,
  onNavigateDonations,
}) => {
  // Filters & Search
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Calculator State
  const [calcPoints, setCalcPoints] = useState<number>(user.totalPoints || 10000);

  // Business Rules & Equivalents
  // Fixed business rule: 1,000 points = ₹11 indicative reward equivalent
  const inrEquivalent = ((user.totalPoints / 1000) * 11).toFixed(2);
  const lifetimeEarned = user.totalPoints + user.redeemedPoints + user.donatedPoints;
  const lifetimeInrEquivalent = ((lifetimeEarned / 1000) * 11).toFixed(2);
  const redeemedInrEquivalent = ((user.redeemedPoints / 1000) * 11).toFixed(2);
  const donatedInrEquivalent = ((user.donatedPoints / 1000) * 11).toFixed(2);

  // Calculator outputs
  const calcInrValue = ((calcPoints / 1000) * 11).toFixed(2);
  const calcRequiredSteps = calcPoints; // Current admin rate: 1 step = 1 point

  // Filtered transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesCategory = filterCategory === 'all' || tx.category === filterCategory;
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesSearch =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  const handleExportCsv = () => {
    const headers = ['Transaction ID', 'Title', 'Detail', 'Category', 'Points Delta', 'Type', 'Status', 'Timestamp'];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      `"${tx.title.replace(/"/g, '""')}"`,
      `"${tx.detail.replace(/"/g, '""')}"`,
      tx.category,
      tx.type === 'credit' ? `+${tx.points}` : `-${tx.points}`,
      tx.type,
      tx.status,
      `"${tx.date}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `walkx_statement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* =========================================================================
          PAGE HEADER & CALL TO ACTION
          ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Verified Virtual Balance
            </span>
            <span className="text-xs text-slate-400">Fixed Valuation Rule: 1,000 pts = ₹11.00 INR</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Points Wallet & Ledger</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Monitor your available points balance, track lifetime earned strides, audit debit and credit records, and calculate indicative reward valuations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onNavigateRewards}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center gap-1.5"
          >
            <Gift className="w-3.5 h-3.5 text-purple-400" />
            Rewards Store
          </button>
          <button
            onClick={onNavigateDonations}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            Sponsor Causes
          </button>
          <button
            onClick={onOpenWithdrawModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <CreditCard className="w-4 h-4" />
            Withdraw to UPI
          </button>
        </div>
      </div>

      {/* =========================================================================
          IMPORTANT VALUATION & REGULATORY COMPLIANCE BANNER
          ========================================================================= */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0c1024] to-blue-950/40 border border-purple-500/30 p-4 md:p-5 flex items-start gap-3.5 shadow-lg">
        <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-300">
          <div className="font-bold text-white flex items-center gap-2">
            <span>Points Valuation & Policy Disclosure</span>
            <span className="px-2 py-0.2 rounded-full text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Read-Only Ledger
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            WalkX points represent loyalty activity units earned exclusively through verified physical movement. <strong>Business Rule: 1,000 points = ₹11 indicative reward equivalent.</strong> The step-to-points earning rate is configurable by platform administrators and maintained separately from redemption values. Points do not constitute bank deposits, guaranteed cash reserves, or currency, and may only be redeemed for approved store vouchers or discretionary UPI transfers subject to verification.
          </p>
        </div>
      </div>

      {/* =========================================================================
          BALANCES GRID: AVAILABLE, TOTAL EARNED, REDEEMED, DONATED
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Available Points */}
        <div className="rounded-2xl bg-[#0c1022]/95 border border-emerald-500/30 p-5 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Points</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1 mb-2">
            <div className="text-3xl font-black text-white tracking-tight">
              {user.totalPoints.toLocaleString()} <span className="text-xs text-slate-400 font-normal">pts</span>
            </div>
            <div className="text-sm font-extrabold text-emerald-400 flex items-center gap-1">
              ≈ ₹{inrEquivalent} INR <span className="text-[10px] text-slate-400 font-normal">(Indicative)</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            Available for immediate voucher claims or UPI transfer.
          </p>
        </div>

        {/* Card 2: Total Earned Points (Lifetime) */}
        <div className="rounded-2xl bg-[#0c1022]/95 border border-purple-500/30 p-5 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Earned Points</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1 mb-2">
            <div className="text-3xl font-black text-white tracking-tight">
              {lifetimeEarned.toLocaleString()} <span className="text-xs text-slate-400 font-normal">pts</span>
            </div>
            <div className="text-sm font-extrabold text-purple-300 flex items-center gap-1">
              ≈ ₹{lifetimeInrEquivalent} INR <span className="text-[10px] text-slate-400 font-normal">(Lifetime value)</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            Cumulative points earned from daily strides and milestones.
          </p>
        </div>

        {/* Card 3: Redeemed Points */}
        <div className="rounded-2xl bg-[#0c1022]/95 border border-blue-500/30 p-5 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Redeemed Points</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Gift className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1 mb-2">
            <div className="text-3xl font-black text-white tracking-tight">
              {user.redeemedPoints.toLocaleString()} <span className="text-xs text-slate-400 font-normal">pts</span>
            </div>
            <div className="text-sm font-extrabold text-blue-300 flex items-center gap-1">
              ≈ ₹{redeemedInrEquivalent} INR <span className="text-[10px] text-slate-400 font-normal">(Claimed)</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            Dispatched via UPI cash transfers and brand gift cards.
          </p>
        </div>

        {/* Card 4: Donated Points */}
        <div className="rounded-2xl bg-[#0c1022]/95 border border-pink-500/30 p-5 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Donated Points</span>
            <div className="w-9 h-9 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1 mb-2">
            <div className="text-3xl font-black text-white tracking-tight">
              {user.donatedPoints.toLocaleString()} <span className="text-xs text-slate-400 font-normal">pts</span>
            </div>
            <div className="text-sm font-extrabold text-pink-300 flex items-center gap-1">
              ≈ ₹{donatedInrEquivalent} INR <span className="text-[10px] text-slate-400 font-normal">(80G certified)</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            Sponsored directly to verified NGO community programs.
          </p>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE REWARD EQUIVALENT CALCULATOR
          ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0c1022] via-[#101633] to-[#080c1f] border border-cyan-500/30 p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                Interactive Reward Calculator
              </span>
              <span className="text-xs text-slate-400">Simulate conversions before redeeming</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Reward Equivalent Calculator
            </h2>
          </div>

          <button
            onClick={() => setCalcPoints(user.totalPoints)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-medium transition-all self-start sm:self-auto"
          >
            Use My Balance ({user.totalPoints.toLocaleString()} pts)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Enter Points to Calculate:
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="1000000"
                  step="500"
                  value={calcPoints}
                  onChange={(e) => setCalcPoints(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-4 pr-20 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white font-bold text-lg focus:outline-none focus:border-cyan-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 uppercase">
                  Points
                </span>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-1.5">
                Quick Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {[1000, 5000, 10000, 25000, 50000, 100000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setCalcPoints(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      calcPoints === preset
                        ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {preset.toLocaleString()} pts
                  </button>
                ))}
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-1 pt-1">
              <input
                type="range"
                min="0"
                max="200000"
                step="1000"
                value={calcPoints}
                onChange={(e) => setCalcPoints(parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 pts</span>
                <span>50,000 pts</span>
                <span>100,000 pts</span>
                <span>200,000 pts</span>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 p-6 space-y-4 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Calculated Reward Value
            </span>

            <div className="space-y-1">
              <div className="text-4xl font-black text-emerald-400 tracking-tight">
                ₹{calcInrValue} <span className="text-sm font-semibold text-slate-300">INR</span>
              </div>
              <p className="text-xs text-slate-400">
                Based on fixed rule: 1,000 points = ₹11.00 indicative reward.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Footprints className="w-3.5 h-3.5 text-cyan-400" />
                  Estimated Strides Needed:
                </span>
                <span className="font-bold text-white">{calcRequiredSteps.toLocaleString()} steps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Eligible Redemptions:</span>
                <span className="font-bold text-cyan-300">
                  {calcPoints >= 100000
                    ? 'Amazon ₹1,100 / Cult.fit ₹3,300'
                    : calcPoints >= 50000
                    ? '₹550 Milestone Payout / Decathlon'
                    : calcPoints >= 10000
                    ? '₹110 Instant UPI Cash'
                    : calcPoints >= 5000
                    ? '₹55 Instant UPI Cash'
                    : calcPoints >= 1000
                    ? '₹11 Instant UPI Cash'
                    : 'Keep walking to reach 1,000 pts (₹11)'}
                </span>
              </div>
            </div>

            <button
              onClick={onNavigateRewards}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Gift className="w-3.5 h-3.5 text-black" />
              Claim Available Rewards
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TRANSACTION HISTORY WITH SEARCH, CATEGORY, TYPE FILTERS & CSV EXPORT
          ========================================================================= */}
      <div className="rounded-3xl bg-[#0c1022]/90 border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-purple-400" />
              Transaction Ledger History
              <span className="text-xs text-slate-400 font-normal">({filteredTransactions.length} records found)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Immutable audit ledger documenting step credits, UPI disbursements, and charity micro-donations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 w-44 sm:w-56"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Categories</option>
              <option value="steps">Steps Credits</option>
              <option value="reward">Rewards / Withdrawals</option>
              <option value="donation">Charity Donations</option>
              <option value="bonus">Welcome Bonuses</option>
            </select>

            {/* Credit / Debit Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Types</option>
              <option value="credit">Credits (+)</option>
              <option value="debit">Debits (-)</option>
            </select>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
              title="Download Statement as CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Transaction / Detail</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Points Delta</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No transactions match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{tx.title}</div>
                      <div className="text-[11px] text-slate-400">{tx.detail}</div>
                      <div className="text-[9px] text-slate-500 font-mono mt-0.5">{tx.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                          tx.type === 'credit' ? 'text-emerald-400' : 'text-pink-400'
                        }`}
                      >
                        {tx.type === 'credit' ? (
                          <>
                            <ArrowDownLeft className="w-3 h-3" /> Credit
                          </>
                        ) : (
                          <>
                            <ArrowUpRight className="w-3 h-3" /> Debit
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-sm">
                      <span className={tx.type === 'credit' ? 'text-emerald-400' : 'text-pink-400'}>
                        {tx.type === 'credit' ? `+${tx.points.toLocaleString()}` : `-${tx.points.toLocaleString()}`} pts
                      </span>
                      <div className="text-[10px] text-slate-400 font-normal">
                        ≈ ₹{((tx.points / 1000) * 11).toFixed(2)} INR
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {tx.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      ) : tx.status === 'processing' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                          <Clock className="w-3 h-3" /> Processing
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-red-400 font-medium">
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 text-[11px]">
                      {tx.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
