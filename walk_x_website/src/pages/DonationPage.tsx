import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  Users,
  Award,
  ArrowRight,
  History,
  Coins
} from 'lucide-react';
import { CauseItem, UserProfile } from '../types';

interface DonationPageProps {
  user: UserProfile;
  causes: CauseItem[];
  onOpenDonateModal: (cause: CauseItem) => void;
  onNavigateHistory: () => void;
}

export const DonationPage: React.FC<DonationPageProps> = ({
  user,
  causes,
  onOpenDonateModal,
  onNavigateHistory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCauses = causes.filter((cause) => {
    if (selectedCategory === 'all') return true;
    return cause.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#18112e] via-[#120f26] to-[#0d0d1e] border border-pink-500/20 p-6 md:p-8 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-pink-400" />
                Give More Pillar
              </span>
              <span className="text-xs text-slate-400">100% Non-Profit Remittance</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Turn Your Strides Into <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Social Impact</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              Every step you take has intrinsic value. Donate earned WalkX points or contribute directly via UPI to sponsor underprivileged education, senior citizen healthcare, and clean rural water.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Your Giving Pool</span>
              <span className="text-white font-bold">{user.totalPoints.toLocaleString()} pts</span>
            </div>
            <button
              onClick={onNavigateHistory}
              className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all shrink-0"
            >
              <History className="w-4 h-4 text-pink-400" />
              View Donation Ledger
            </button>
          </div>
        </div>
      </div>

      {/* 3 Impact Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#0c1022]/90 border border-pink-500/20 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">₹5,42,680+</div>
            <div className="text-xs text-slate-400">Total Donated by WalkX Walkers</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1022]/90 border border-purple-500/20 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">1,840+</div>
            <div className="text-xs text-slate-400">Underprivileged Lives Touched</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1022]/90 border border-blue-500/20 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">100% Verified</div>
            <div className="text-xs text-slate-400">Certified Non-Profit Partners</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['all', 'education', 'healthcare', 'elderly', 'community'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/25'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat === 'all' ? 'All Causes' : cat}
          </button>
        ))}
      </div>

      {/* Causes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCauses.map((cause) => {
          const percent = Math.min(100, Math.round((cause.raisedAmount / cause.targetAmount) * 100));

          return (
            <div
              key={cause.id}
              className="rounded-3xl bg-[#0c1022]/90 border border-slate-800/80 hover:border-pink-500/30 p-6 md:p-7 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                {/* Category & Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pink-500/15 text-pink-300 border border-pink-500/30">
                    {cause.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{cause.verifiedPartner}</span>
                  </div>
                </div>

                {/* Title & Tagline */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-950/40 to-purple-950/40 border border-pink-500/20 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                    {cause.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors">
                      {cause.title}
                    </h3>
                    <p className="text-xs text-purple-300/80 font-medium mt-0.5">
                      {cause.tagline}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {cause.description}
                </p>

                {/* Progress Bar & Amounts */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-baseline text-xs">
                    <div>
                      <span className="text-base font-extrabold text-white">₹{cause.raisedAmount.toLocaleString()}</span>
                      <span className="text-slate-400 text-[11px]"> raised</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">
                      Goal: ₹{cause.targetAmount.toLocaleString()} ({percent}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-pink-400" /> {cause.donorsCount} active supporters
                    </span>
                    <span>100% Tax Compliant</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  onClick={() => onOpenDonateModal(cause)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-pink-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Heart className="w-4 h-4 fill-white/20" />
                  <span>Support this Cause with WalkX</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assurance Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#121028] to-[#0c1022] border border-pink-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-amber-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white">WalkX Charity Transparency Pledge</h4>
            <p className="text-xs text-slate-400">
              Every point pledged is transferred directly with zero platform deductions. Receipts and audit logs are recorded permanently.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateHistory}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all shrink-0"
        >
          Check Public Audit Records
        </button>
      </div>
    </div>
  );
};
