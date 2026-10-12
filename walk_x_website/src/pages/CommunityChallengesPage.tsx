import React, { useState } from 'react';
import {
  Trophy,
  Users,
  Clock,
  Award,
  CheckCircle2,
  ArrowRight,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CommunityChallenge, ChallengeAudience, PageId } from '../types';
import { communityService } from '../services/communityService';

interface CommunityChallengesPageProps {
  onNavigate: (page: PageId) => void;
  showToast: (msg: string) => void;
}

const AUDIENCE_FILTERS: (ChallengeAudience | 'All')[] = [
  'All',
  'All Ages',
  'Seniors & Gentle Walkers',
  'Daily Commuters',
  'Weekend Explorers',
  'Charity Champions'
];

export const CommunityChallengesPage: React.FC<CommunityChallengesPageProps> = ({
  onNavigate,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'joined' | 'explore'>('all');
  const [selectedAudience, setSelectedAudience] = useState<ChallengeAudience | 'All'>('All');
  const [challenges, setChallenges] = useState<CommunityChallenge[]>(() => communityService.getChallenges());

  const handleToggleJoin = (challenge: CommunityChallenge) => {
    const isJoinedNow = communityService.toggleJoinChallenge(challenge.id);
    setChallenges(communityService.getChallenges(activeTab));
    if (isJoinedNow) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
      showToast(`Joined the "${challenge.title}" challenge! Every stride now counts toward your badge.`);
    } else {
      showToast(`Left the challenge.`);
    }
  };

  const displayedChallenges = challenges
    .filter((c) => {
      if (activeTab === 'joined') return c.joined;
      if (activeTab === 'explore') return !c.joined;
      return true;
    })
    .filter((c) => {
      if (selectedAudience === 'All') return true;
      return c.audience === selectedAudience;
    });

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-cyan-950 via-[#0c102a] to-blue-950 border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
              <Zap size={14} className="text-cyan-400" />
              <span>Community Quests & Challenges</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Walk Together, Conquer Milestones, Earn Rewards
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Step into community goals designed for all fitness levels. Whether you are aiming for your first 5k steps or conquering 100k strides, participate with walkers worldwide.
            </p>
          </div>
        </div>

        {/* Tab & Audience Filter Bar */}
        <div className="bg-[#0b0e24] border border-white/10 rounded-2xl p-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#4B4DFF] text-white shadow-[0_0_12px_rgba(75,77,255,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                All Challenges ({challenges.length})
              </button>
              <button
                onClick={() => setActiveTab('joined')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'joined'
                    ? 'bg-[#4B4DFF] text-white shadow-[0_0_12px_rgba(75,77,255,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                My Active Quests ({challenges.filter((c) => c.joined).length})
              </button>
              <button
                onClick={() => setActiveTab('explore')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'explore'
                    ? 'bg-[#4B4DFF] text-white shadow-[0_0_12px_rgba(75,77,255,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                Discover New ({challenges.filter((c) => !c.joined).length})
              </button>
            </div>

            <span className="text-xs text-slate-400 font-medium hidden sm:block">
              {displayedChallenges.length} challenges available
            </span>
          </div>

          {/* Audience Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-white/05 pt-3">
            <span className="text-[11px] font-semibold text-slate-500 shrink-0">Age & Pace Bracket:</span>
            {AUDIENCE_FILTERS.map((aud) => {
              const active = selectedAudience === aud;
              return (
                <button
                  key={aud}
                  onClick={() => setSelectedAudience(aud)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold'
                      : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 border border-white/05'
                  }`}
                >
                  {aud}
                </button>
              );
            })}
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedChallenges.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-[#0b0e24] border border-white/10 rounded-3xl">
              <Trophy size={40} className="mx-auto text-cyan-400 mb-3 opacity-60" />
              <h3 className="text-lg font-bold text-white mb-1">No challenges match this view</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                Switch tabs or select "All" age brackets to explore ongoing quests.
              </p>
              <button
                onClick={() => {
                  setActiveTab('all');
                  setSelectedAudience('All');
                }}
                className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold text-white"
              >
                Reset Challenge Filters
              </button>
            </div>
          ) : (
            displayedChallenges.map((challenge) => {
              const progressPercent = Math.min(
                100,
                Math.round((challenge.currentSteps / challenge.goalSteps) * 100)
              );

              return (
                <div
                  key={challenge.id}
                  className="bg-[#0b0e24] border border-white/10 rounded-3xl overflow-hidden hover:border-[#4B4DFF]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl"
                >
                  {/* Banner Image */}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={challenge.bannerImage}
                      alt={challenge.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e24] via-transparent to-black/50" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {challenge.audience}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/20 backdrop-blur-md text-cyan-300 text-xs font-bold border border-cyan-500/30">
                      <Clock size={11} />
                      <span>{challenge.daysRemaining} days left</span>
                    </div>

                    <div className="absolute bottom-2 left-3 right-3">
                      <span className="text-[10px] font-semibold text-slate-300 block">
                        Organized by {challenge.organizer}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-base font-bold text-white group-hover:text-[#4B4DFF] transition-colors">
                        {challenge.title}
                      </h2>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {challenge.subtitle}
                      </p>

                      {/* Progress Bar Container */}
                      <div className="my-4 p-3 rounded-2xl bg-white/[0.03] border border-white/05 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Step Goal Progress</span>
                          <span className="font-extrabold text-cyan-400">
                            {progressPercent}%
                          </span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#4B4DFF] to-cyan-400 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                          <span>{challenge.currentSteps.toLocaleString()} steps logged</span>
                          <span className="font-semibold text-white">
                            {challenge.goalSteps.toLocaleString()} total
                          </span>
                        </div>
                      </div>

                      {/* Reward & Badge Pill */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                            <Award size={15} />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Reward</span>
                            <span className="text-xs font-bold text-white">{challenge.badgeName}</span>
                          </div>
                        </div>

                        <span className="text-xs font-extrabold text-amber-400">
                          +{challenge.rewardPoints} Pts
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Users size={13} className="text-cyan-400" />
                        <span>{challenge.participantsCount.toLocaleString()} walkers</span>
                      </div>

                      <button
                        onClick={() => handleToggleJoin(challenge)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          challenge.joined
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30'
                            : 'gradient-btn text-white shadow-md'
                        }`}
                      >
                        {challenge.joined ? (
                          <>
                            <CheckCircle2 size={13} />
                            <span>Quest Active ✓</span>
                          </>
                        ) : (
                          <>
                            <span>Join Quest</span>
                            <ArrowRight size={13} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
