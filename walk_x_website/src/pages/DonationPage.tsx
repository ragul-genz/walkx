import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  Users,
  Award,
  ArrowRight,
  History,
  Building2,
  Info,
  CreditCard,
  BookOpen,
  Activity,
  UtensilsCrossed,
  Trees
} from 'lucide-react';
import { CauseItem, UserProfile } from '../types';

interface DonationPageProps {
  user: UserProfile;
  causes: CauseItem[];
  onOpenDonateModal: (cause: CauseItem, initialMode?: 'points' | 'monetary') => void;
  onNavigateHistory: () => void;
}

export const DonationPage: React.FC<DonationPageProps> = ({
  user,
  causes,
  onOpenDonateModal,
  onNavigateHistory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'All Causes', icon: Heart },
    { id: 'Education', label: 'Education', icon: BookOpen },
    { id: 'Healthcare', label: 'Healthcare', icon: Activity },
    { id: 'Food support', label: 'Food support', icon: UtensilsCrossed },
    { id: 'Environment', label: 'Environment', icon: Trees },
  ];

  const filteredCauses = causes.filter((cause) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      cause.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      cause.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cause.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cause.organizationName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* =========================================================================
          SECTION 1: HERO HEADER BANNER ("Walk for a Cause")
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#170e2b] via-[#110d24] to-[#090b1a] border border-pink-500/25 p-6 md:p-10 shadow-2xl">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1.5 shadow-sm">
                <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/30" />
                Walk for a Cause
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">
                Social Impact Stride Pool
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                Sample Causes (Dev Mode)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Turn Your Daily Steps Into <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                Tangible Social Good
              </span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Every step you take on WalkX generates community value. Pledge your earned WalkX points directly toward sample initiatives in <strong>Education</strong>, <strong>Healthcare</strong>, <strong>Food support</strong>, and <strong>Environment</strong>, or preview our prepared monetary payment integration.
            </p>
          </div>

          {/* User Impact & Ledger Access Widget */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 backdrop-blur-md shadow-lg space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Your Available Stride Pool</span>
                <span className="text-[10px] text-purple-400 font-semibold">1,000 pts = ₹11</span>
              </div>
              <div className="text-2xl font-black text-white flex items-baseline gap-2">
                <span>{user.totalPoints.toLocaleString()}</span>
                <span className="text-xs text-purple-300 font-medium">WalkX Points</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                <span>Points Donated to date:</span>
                <span className="text-pink-300 font-bold">{user.donatedPoints.toLocaleString()} pts</span>
              </div>
            </div>

            <button
              onClick={onNavigateHistory}
              className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 border border-slate-700 text-slate-100 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md group"
            >
              <History className="w-4 h-4 text-pink-400 group-hover:rotate-[-20deg] transition-transform" />
              <span>View Donation Ledger & History</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: CLEAR TRANSPARENCY & DEVELOPMENT DISCLOSURE BANNER
          ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1226]/90 border border-amber-500/30 shadow-lg text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
              Development Environment & Demonstration Guidelines
            </h4>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              <strong>Sample Causes Only:</strong> All causes and partner entities listed are sample demonstrations for design evaluation. WalkX does not invent real charities or claim fraudulent banking remittance. <strong>Points Contributions</strong> deduct points from your in-app profile. <strong>Monetary Donations</strong> are a prepared interface sandbox awaiting real payment merchant onboarding.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateHistory}
          className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-xs font-semibold whitespace-nowrap transition-all self-start md:self-auto shrink-0"
        >
          Check Demonstration Ledger
        </button>
      </div>

      {/* =========================================================================
          SECTION 3: CATEGORY FILTER TABS & SEARCH
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/25 border border-pink-500/40'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cause Search Input */}
        <div className="relative sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search causes or partners..."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: CAUSES CARDS GRID
          ========================================================================= */}
      {filteredCauses.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0c1022]/90 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No causes found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No causes matched category "{selectedCategory}" with filter "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold hover:bg-slate-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCauses.map((cause) => {
            const percent = Math.min(100, Math.round((cause.raisedAmount / cause.targetAmount) * 100));
            const targetPointsCalculated = cause.targetPoints || Math.round((cause.targetAmount / 11) * 1000);
            const raisedPointsCalculated = cause.raisedPoints || Math.round((cause.raisedAmount / 11) * 1000);

            return (
              <div
                key={cause.id}
                className="rounded-3xl bg-[#0b0f20]/95 border border-slate-800/80 hover:border-pink-500/40 shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:shadow-[0_15px_35px_rgba(236,72,153,0.1)]"
              >
                <div>
                  {/* Image Header with Category Badge */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    {cause.imageUrl ? (
                      <img
                        src={cause.imageUrl}
                        alt={cause.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-pink-950/40 to-purple-950/40 text-4xl">
                        {cause.icon}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f20] via-transparent to-black/40" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/70 backdrop-blur-md text-pink-300 border border-pink-500/30">
                        {cause.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 text-slate-950 shadow-sm">
                        Sample Cause
                      </span>
                    </div>

                    {/* Bottom Category Icon Pill */}
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-xl shadow-lg">
                        {cause.icon}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-200 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                        {cause.category} Impact
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Cause Title & Tagline */}
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-white group-hover:text-pink-300 transition-colors leading-snug">
                        {cause.title}
                      </h3>
                      <p className="text-xs text-purple-300/90 font-medium mt-1 line-clamp-2">
                        {cause.tagline}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {cause.description}
                    </p>

                    {/* Organization Details Box */}
                    <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          Partner Organization
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Sample Partner
                        </span>
                      </div>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="truncate">{cause.organizationName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex justify-between items-center pt-0.5">
                        <span>{cause.organizationLocation}</span>
                        <span className="font-mono text-[10px] text-slate-500">Reg: {cause.registrationNumber}</span>
                      </div>
                    </div>

                    {/* Donation Goal Progress Bar */}
                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between items-baseline text-xs">
                        <div>
                          <span className="text-base font-black text-white">₹{cause.raisedAmount.toLocaleString()}</span>
                          <span className="text-[11px] text-slate-400"> raised ({percent}%)</span>
                        </div>
                        <div className="text-right text-[11px] text-slate-400">
                          Goal: <span className="font-semibold text-slate-300">₹{cause.targetAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Progress Track */}
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-pink-400" />
                          <span>{cause.donorsCount} supporters</span>
                        </span>
                        <span className="font-mono text-[10px] text-purple-300">
                          ≈ {raisedPointsCalculated.toLocaleString()} / {targetPointsCalculated.toLocaleString()} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons (Dual CTAs) */}
                <div className="p-5 sm:p-6 pt-0 space-y-2">
                  <button
                    onClick={() => onOpenDonateModal(cause, 'points')}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-pink-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Heart className="w-4 h-4 fill-white/20" />
                    <span>Pledge WalkX Points</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenDonateModal(cause, 'monetary')}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 text-amber-300 hover:text-amber-200 font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span>Prepared Monetary Pledge (Sandbox)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          SECTION 5: TRANSPARENCY ASSURANCE & AUDIT LEDGER FOOTER
          ========================================================================= */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#110f29] to-[#0c1022] border border-pink-500/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white">WalkX Charity Transparency & Sandbox Integrity</h4>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              In development mode, no real charities are claimed and no bank transfers occur. Points contributions simulate community pool allocations, while the monetary UI is staged for payment provider approval.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateHistory}
          className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all shadow-md shrink-0 flex items-center gap-2"
        >
          <History className="w-4 h-4 text-pink-400" />
          <span>Open Public Audit Ledger</span>
        </button>
      </div>
    </div>
  );
};
