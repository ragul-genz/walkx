import React, { useState } from 'react';
import {
  Footprints,
  Flame,
  Clock,
  Compass,
  CheckCircle2,
  Plus,
  RefreshCw,
  Sparkles,
  Zap,
  Smartphone
} from 'lucide-react';
import { StrideData, UserProfile } from '../types';

interface ActivityPageProps {
  user: UserProfile;
  weeklyData: StrideData[];
  onAddSteps: (steps: number) => void;
}

export const ActivityPage: React.FC<ActivityPageProps> = ({
  user,
  weeklyData,
  onAddSteps,
}) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'today'>('7d');
  const [customSteps, setCustomSteps] = useState(1000);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const totalWeekSteps = weeklyData.reduce((acc, curr) => acc + curr.steps, 0);
  const totalWeekDistance = weeklyData.reduce((acc, curr) => acc + curr.distanceKm, 0).toFixed(1);
  const totalWeekCalories = weeklyData.reduce((acc, curr) => acc + curr.calories, 0);
  const totalWeekMinutes = weeklyData.reduce((acc, curr) => acc + curr.activeMinutes, 0);

  const handleSyncSimulate = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Biometric Telemetry
            </span>
            <span className="text-xs text-slate-400">Pedometer Hardware Sync</span>
            <span className="hidden sm:inline text-xs text-purple-300/80">• Goal: {user.dailyGoal.toLocaleString()} steps</span>
            <span className="hidden sm:inline text-xs text-emerald-400 font-semibold">• {user.streakDays}-day Streak 🔥</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Walking Activity & Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor real-time cadence, caloric consumption, and step conversion milestones.
          </p>
        </div>

        {/* Timeframe Switcher & Hardware Sync */}
        <div className="flex items-center gap-3">
          <div className="flex bg-[#0c1022] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setTimeframe('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeframe === 'today'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeframe === '7d'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeframe === '30d'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly
            </button>
          </div>

          <button
            onClick={handleSyncSimulate}
            disabled={syncing}
            className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : syncSuccess ? 'Synced!' : 'Sync Sensors'}
          </button>
        </div>
      </div>

      {/* Primary 4 Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl bg-[#0c1022]/90 border border-purple-500/20 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-semibold text-slate-400">Total 7-Day Steps</span>
            <Footprints className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">{totalWeekSteps.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Avg. {Math.round(totalWeekSteps / 7).toLocaleString()} steps / day
          </p>
        </div>

        <div className="rounded-2xl bg-[#0c1022]/90 border border-blue-500/20 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-semibold text-slate-400">Distance Traveled</span>
            <Compass className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">{totalWeekDistance} km</div>
          <p className="text-[11px] text-slate-400">Equivalent to ~35 city blocks</p>
        </div>

        <div className="rounded-2xl bg-[#0c1022]/90 border border-amber-500/20 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-semibold text-slate-400">Calories Burned</span>
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mb-1">{totalWeekCalories.toLocaleString()} kcal</div>
          <p className="text-[11px] text-slate-400">Active metabolic expenditure</p>
        </div>

        <div className="rounded-2xl bg-[#0c1022]/90 border border-emerald-500/20 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-semibold text-slate-400">Active Duration</span>
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">{Math.floor(totalWeekMinutes / 60)}h {totalWeekMinutes % 60}m</div>
          <p className="text-[11px] text-slate-400">Continuous brisk movement</p>
        </div>
      </div>

      {/* Simulator Section & Sensor Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Step Simulator Box */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0c1022]/90 border border-purple-500/30 p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Live WalkX Stride Simulator
                </h3>
                <p className="text-xs text-slate-400">
                  Test your real-time step ledger accumulation and observe instant point conversions.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Interactive Playground
              </span>
            </div>

            {/* Quick Increment Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[500, 1000, 2500, 5000].map((stepAmt) => (
                <button
                  key={stepAmt}
                  onClick={() => onAddSteps(stepAmt)}
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-purple-900/30 border border-slate-800 hover:border-purple-500/40 text-slate-200 hover:text-white font-semibold text-sm transition-all flex flex-col items-center gap-1 group active:scale-95"
                >
                  <span className="text-xs text-purple-400 group-hover:scale-110 transition-transform">+{stepAmt.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-normal">Steps</span>
                </button>
              ))}
            </div>

            {/* Custom Range Slider */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Custom Step Increment:</span>
                <span className="text-purple-400 font-bold">{customSteps.toLocaleString()} steps (+{customSteps} pts)</span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={customSteps}
                onChange={(e) => setCustomSteps(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between items-center pt-1">
                <span className="text-[11px] text-slate-400">Est. ₹{(customSteps / 1000).toFixed(2)} Value</span>
                <button
                  onClick={() => onAddSteps(customSteps)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add to Today&apos;s Stride
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Status Cards */}
        <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              Connected Sensors
            </h3>
            <p className="text-xs text-slate-400">
              WalkX aggregates verified motion data from modern web APIs and operating system health repositories.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Device Accelerometer</p>
                    <p className="text-[10px] text-slate-400">High-resolution motion sensor</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">WalkX Pedometer Engine</p>
                    <p className="text-[10px] text-slate-400">Anti-shake fraud verification</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Verified</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/30 text-[11px] text-purple-300">
            <strong>Data Integrity:</strong> Steps flagged with vehicular acceleration or synthetic cadence patterns are filtered automatically before conversion.
          </div>
        </div>
      </div>

      {/* Detailed Daily Breakdown Table */}
      <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 shadow-xl space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">Daily Telemetry Log</h3>
          <p className="text-xs text-slate-400">Detailed biometric session breakdown for the current period</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-4">Step Count</th>
                <th className="py-3 px-4">Distance</th>
                <th className="py-3 px-4">Calories</th>
                <th className="py-3 px-4">Active Time</th>
                <th className="py-3 px-4">WalkX Reward</th>
                <th className="py-3 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {weeklyData.map((d, index) => {
                const isCurrent = index === weeklyData.length - 1;
                return (
                  <tr key={d.day} className={`hover:bg-slate-800/30 transition-colors ${isCurrent ? 'bg-purple-900/10' : ''}`}>
                    <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                      {d.day}
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Today
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{d.steps.toLocaleString()}</td>
                    <td className="py-3 px-4">{d.distanceKm} km</td>
                    <td className="py-3 px-4 text-amber-300">{d.calories} kcal</td>
                    <td className="py-3 px-4">{d.activeMinutes} mins</td>
                    <td className="py-3 px-4 font-semibold text-emerald-400">+{d.steps} pts</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
