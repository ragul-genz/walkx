import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Heart,
  Compass,
  Footprints,
  ShieldCheck,
  Users,
  Medal
} from 'lucide-react';
import {
  AgeBracket,
  LeaderboardCategory,
  LeaderboardTimeframe,
  PageId,
  LeaderboardEntry
} from '../types';
import { communityService } from '../services/communityService';

interface LeaderboardsPageProps {
  onNavigate: (page: PageId) => void;
  onViewProfile?: (userId: string) => void;
  showToast: (msg: string) => void;
}

const AGE_BRACKET_OPTIONS: { id: AgeBracket; label: string; sub: string }[] = [
  { id: 'all', label: 'All Ages', sub: 'Open Global League' },
  { id: 'teens', label: 'Teens (13–19)', sub: 'Youth & Campus' },
  { id: 'young_adults', label: 'Young Adults (20–35)', sub: 'Urban Striders' },
  { id: 'prime', label: 'Prime (36–55)', sub: 'Active Professionals' },
  { id: 'golden', label: 'Golden Walkers (55+)', sub: 'Longevity & Vitality' }
];

export const LeaderboardsPage: React.FC<LeaderboardsPageProps> = ({
  onNavigate,
  onViewProfile,
  showToast
}) => {
  const [selectedAgeBracket, setSelectedAgeBracket] = useState<AgeBracket>('all');
  const [selectedCategory, setSelectedCategory] = useState<LeaderboardCategory>('steps');
  const [selectedTimeframe, setSelectedTimeframe] = useState<LeaderboardTimeframe>('this_week');

  const entries: LeaderboardEntry[] = communityService.getLeaderboard({
    ageBracket: selectedAgeBracket,
    category: selectedCategory,
    timeframe: selectedTimeframe
  });

  const topThree = entries.slice(0, 3);
  const currentUserEntry = entries.find((e) => e.isCurrentUser);

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-[#0c102a] to-indigo-950 border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
              <Trophy size={14} className="text-amber-400" />
              <span>Friendly Competitions & Leaderboards</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Community Step & Stride Leaderboards
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Celebrate consistency, high-five neighbors, and cheer on fellow striders across every age bracket with tamper-proof pedometer verification.
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#0b0e24] border border-white/10 rounded-2xl p-4 space-y-4">
          {/* Age Bracket Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users size={13} className="text-indigo-400" />
                Age-Inclusive Divisions
              </span>
              <span className="text-[11px] text-slate-500">All age groups celebrated equally</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {AGE_BRACKET_OPTIONS.map((bracket) => {
                const active = selectedAgeBracket === bracket.id;
                return (
                  <button
                    key={bracket.id}
                    onClick={() => setSelectedAgeBracket(bracket.id)}
                    className={`p-2.5 rounded-xl text-left transition-all border ${
                      active
                        ? 'bg-[#4B4DFF] text-white border-[#4B4DFF] shadow-[0_0_15px_rgba(75,77,255,0.4)]'
                        : 'bg-white/[0.03] text-slate-300 border-white/05 hover:bg-white/[0.06]'
                    }`}
                  >
                    <span className="text-xs font-bold block">{bracket.label}</span>
                    <span className={`text-[10px] block mt-0.5 ${active ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {bracket.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metric Category + Timeframe Switcher */}
          <div className="pt-3 border-t border-white/05 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Metric Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('steps')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'steps'
                    ? 'bg-gradient-to-r from-[#4B4DFF] to-[#6D3DFF] text-white'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                <Footprints size={13} />
                <span>Total Steps</span>
              </button>

              <button
                onClick={() => setSelectedCategory('streak')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'streak'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                <Flame size={13} />
                <span>Active Streak</span>
              </button>

              <button
                onClick={() => setSelectedCategory('charity')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'charity'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                <Heart size={13} />
                <span>Charity Pledges</span>
              </button>

              <button
                onClick={() => setSelectedCategory('places_explored')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'places_explored'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                <Compass size={13} />
                <span>Places Explored</span>
              </button>
            </div>

            {/* Timeframe Select */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10 shrink-0">
              <button
                onClick={() => setSelectedTimeframe('this_week')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  selectedTimeframe === 'this_week' ? 'bg-[#4B4DFF] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setSelectedTimeframe('this_month')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  selectedTimeframe === 'this_month' ? 'bg-[#4B4DFF] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setSelectedTimeframe('all_time')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  selectedTimeframe === 'all_time' ? 'bg-[#4B4DFF] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All-Time
              </button>
            </div>
          </div>
        </div>

        {/* Podium Display (Top 3) */}
        {topThree.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4 pb-2">
            {/* Rank 2 (Silver) */}
            <div className="order-2 md:order-1 bg-[#0b0e24] border border-slate-400/30 rounded-3xl p-5 text-center relative overflow-hidden shadow-xl md:h-72 flex flex-col justify-between">
              <div className="absolute top-3 left-3 text-2xl font-black text-slate-300">2nd</div>
              <div className="w-10 h-10 rounded-full bg-slate-400/20 text-slate-300 flex items-center justify-center mx-auto mb-2 border border-slate-400/40 font-bold">
                🥈
              </div>
              <div>
                <img
                  src={topThree[1].avatar}
                  alt={topThree[1].name}
                  className="w-16 h-16 rounded-2xl object-cover mx-auto border-2 border-slate-300 shadow-lg mb-2"
                />
                <h3 className="text-sm font-bold text-white truncate">{topThree[1].name}</h3>
                <p className="text-[11px] text-slate-400 truncate">@{topThree[1].username}</p>
                <p className="text-[10px] text-indigo-400 font-semibold">{topThree[1].city}</p>
              </div>
              <div className="mt-3 py-2 rounded-xl bg-white/[0.04]">
                <span className="text-base font-extrabold text-white block">
                  {selectedCategory === 'steps'
                    ? `${topThree[1].steps.toLocaleString()} steps`
                    : selectedCategory === 'streak'
                    ? `${topThree[1].streakDays} days 🔥`
                    : selectedCategory === 'charity'
                    ? `${topThree[1].charityPointsDonated.toLocaleString()} pts`
                    : `${topThree[1].placesExplored} places`}
                </span>
                <span className="text-[10px] text-slate-400">{topThree[1].badgeTitle}</span>
              </div>
            </div>

            {/* Rank 1 (Gold - Elevated) */}
            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/10 via-[#0b0e24] to-[#0b0e24] border-2 border-amber-500/50 rounded-3xl p-6 text-center relative overflow-hidden shadow-[0_0_35px_rgba(245,158,11,0.2)] md:h-80 flex flex-col justify-between">
              <div className="absolute top-3 left-3 text-3xl font-black text-amber-400">1st</div>
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto mb-2 border border-amber-500/40 text-lg font-bold">
                👑
              </div>
              <div>
                <img
                  src={topThree[0].avatar}
                  alt={topThree[0].name}
                  className="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-amber-400 shadow-2xl mb-2"
                />
                <h3 className="text-base font-extrabold text-white truncate">{topThree[0].name}</h3>
                <p className="text-xs text-slate-400 truncate">@{topThree[0].username}</p>
                <p className="text-[11px] text-amber-300 font-semibold">{topThree[0].city}</p>
              </div>
              <div className="mt-3 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30">
                <span className="text-lg font-black text-amber-300 block">
                  {selectedCategory === 'steps'
                    ? `${topThree[0].steps.toLocaleString()} steps`
                    : selectedCategory === 'streak'
                    ? `${topThree[0].streakDays} days 🔥`
                    : selectedCategory === 'charity'
                    ? `${topThree[0].charityPointsDonated.toLocaleString()} pts`
                    : `${topThree[0].placesExplored} places`}
                </span>
                <span className="text-[10px] font-bold text-amber-400">{topThree[0].badgeTitle}</span>
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="order-3 bg-[#0b0e24] border border-amber-700/30 rounded-3xl p-5 text-center relative overflow-hidden shadow-xl md:h-64 flex flex-col justify-between">
              <div className="absolute top-3 left-3 text-2xl font-black text-amber-600">3rd</div>
              <div className="w-10 h-10 rounded-full bg-amber-700/20 text-amber-600 flex items-center justify-center mx-auto mb-2 border border-amber-700/40 font-bold">
                🥉
              </div>
              <div>
                <img
                  src={topThree[2].avatar}
                  alt={topThree[2].name}
                  className="w-14 h-14 rounded-2xl object-cover mx-auto border-2 border-amber-600 shadow-lg mb-2"
                />
                <h3 className="text-sm font-bold text-white truncate">{topThree[2].name}</h3>
                <p className="text-[11px] text-slate-400 truncate">@{topThree[2].username}</p>
                <p className="text-[10px] text-indigo-400 font-semibold">{topThree[2].city}</p>
              </div>
              <div className="mt-2 py-2 rounded-xl bg-white/[0.04]">
                <span className="text-base font-extrabold text-white block">
                  {selectedCategory === 'steps'
                    ? `${topThree[2].steps.toLocaleString()} steps`
                    : selectedCategory === 'streak'
                    ? `${topThree[2].streakDays} days 🔥`
                    : selectedCategory === 'charity'
                    ? `${topThree[2].charityPointsDonated.toLocaleString()} pts`
                    : `${topThree[2].placesExplored} places`}
                </span>
                <span className="text-[10px] text-slate-400">{topThree[2].badgeTitle}</span>
              </div>
            </div>
          </div>
        )}

        {/* Current User Standing Banner */}
        {currentUserEntry && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-[#0c102a] to-slate-900 border-2 border-[#4B4DFF]/40 flex items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#4B4DFF] text-white flex items-center justify-center font-black text-lg shadow-md">
                #{currentUserEntry.rank}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Your Division Standing</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                    You
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentUserEntry.steps.toLocaleString()} steps • {currentUserEntry.streakDays}-day streak • {currentUserEntry.placesExplored} places explored
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('feed')}
              className="px-4 py-2 rounded-xl text-xs font-bold gradient-btn text-white whitespace-nowrap shadow-md"
            >
              Share Your Stride
            </button>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-[#0b0e24] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Medal size={16} className="text-[#4B4DFF]" />
              <h2 className="text-sm font-bold text-white">Full Division Standings</h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <ShieldCheck size={14} />
              <span>Hardware Pedometer Verified</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/05 bg-white/[0.02] text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Walker</th>
                  <th className="py-3 px-4">Division</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4 text-right">Metric Performance</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/05">
                {entries.map((item) => (
                  <tr
                    key={item.userId}
                    className={`hover:bg-white/[0.03] transition-colors ${
                      item.isCurrentUser ? 'bg-indigo-950/30 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-black">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-xl ${
                          item.rank === 1
                            ? 'bg-amber-500/20 text-amber-300 font-bold'
                            : item.rank === 2
                            ? 'bg-slate-400/20 text-slate-300 font-bold'
                            : item.rank === 3
                            ? 'bg-amber-700/20 text-amber-600 font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        #{item.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => onViewProfile && onViewProfile(item.userId)}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-9 h-9 rounded-xl object-cover border border-white/10 group-hover:border-[#4B4DFF]"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-white font-bold group-hover:text-[#4B4DFF] transition-colors">
                              {item.name}
                            </span>
                            {item.isVerifiedSensor && (
                              <span title="Verified Hardware Sensor">
                                <ShieldCheck size={12} className="text-emerald-400" />
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">@{item.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                        {item.badgeTitle}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{item.city}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm font-black text-white block">
                        {selectedCategory === 'steps'
                          ? item.steps.toLocaleString()
                          : selectedCategory === 'streak'
                          ? `${item.streakDays}d`
                          : selectedCategory === 'charity'
                          ? `${item.charityPointsDonated.toLocaleString()} pts`
                          : `${item.placesExplored} places`}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {selectedCategory === 'steps' ? 'Verified Steps' : selectedCategory}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          showToast(`Cheered for ${item.name}! 👟🔥`);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-all"
                      >
                        High-Five 👋
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
