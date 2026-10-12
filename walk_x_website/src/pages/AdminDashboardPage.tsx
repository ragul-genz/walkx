import React from 'react';
import {
  Users,
  Heart,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Gift,
  ArrowRight,
  Activity,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { AdminReportMetric, PageId } from '../types';

interface AdminDashboardPageProps {
  metrics: AdminReportMetric[];
  onNavigate: (page: PageId) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  metrics,
  onNavigate,
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Platform Health Indicators */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Admin Console
            </span>
            <span className="text-xs text-slate-400">Master Operations Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">WalkX Platform Administration</h1>
          <p className="text-sm text-slate-400 mt-1">
            Global telemetry verification, payout gateways, and non-profit grant audits.
          </p>
        </div>

        {/* Live operational badge */}
        <div className="flex items-center gap-3 bg-[#0c1022] p-2 px-3 rounded-2xl border border-slate-800 self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="text-xs">
            <span className="text-slate-300 font-semibold block">All Systems Operational</span>
            <span className="text-[10px] text-slate-500">Razorpay Payouts: 99.98% SLA</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-5 shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase text-slate-400">{metric.title}</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +{metric.growthPercent}%
              </span>
            </div>

            <div className="text-3xl font-black text-white tracking-tight mb-2">
              {metric.currentValue}
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Prev: {metric.previousValue}</span>
              <span className="text-purple-400 font-medium">30-day window</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('admin-users')}
          className="p-5 rounded-2xl bg-gradient-to-br from-[#111630] to-[#0c1022] border border-blue-500/20 hover:border-blue-500/40 text-left transition-all group shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm group-hover:text-blue-300">User Management</h3>
          <p className="text-xs text-slate-400 mt-1">Review walker accounts, ban fraudulent devices, inspect KYC.</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 mt-3">
            Open Directory <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>

        <button
          onClick={() => onNavigate('admin-rewards')}
          className="p-5 rounded-2xl bg-gradient-to-br from-[#111630] to-[#0c1022] border border-purple-500/20 hover:border-purple-500/40 text-left transition-all group shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-105 transition-transform">
            <Gift className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm group-hover:text-purple-300">Rewards & Inventory</h3>
          <p className="text-xs text-slate-400 mt-1">Configure conversion ratios, UPI cash batches, and voucher codes.</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 mt-3">
            Manage Catalogue <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>

        <button
          onClick={() => onNavigate('admin-donations')}
          className="p-5 rounded-2xl bg-gradient-to-br from-[#111630] to-[#0c1022] border border-pink-500/20 hover:border-pink-500/40 text-left transition-all group shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-3 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm group-hover:text-pink-300">Donations & Causes</h3>
          <p className="text-xs text-slate-400 mt-1">Verify NGO disbursements, escrow payouts, and tax receipts.</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-pink-400 mt-3">
            Audit Causes <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>

        <button
          onClick={() => onNavigate('admin-reports')}
          className="p-5 rounded-2xl bg-gradient-to-br from-[#111630] to-[#0c1022] border border-emerald-500/20 hover:border-emerald-500/40 text-left transition-all group shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm group-hover:text-emerald-300">Reports & Compliance</h3>
          <p className="text-xs text-slate-400 mt-1">Export financial ledgers, audit logs, and fraud prevention stats.</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-3">
            Generate Reports <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>

      {/* Main Operations Section: Throughput & Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Engine Status */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Live Telemetry Verification Pipeline
              </h2>
              <p className="text-xs text-slate-400">Pedometer validation throughput vs machine-learning anti-fraud filters</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Low Latency · 42ms
            </span>
          </div>

          {/* Graphical Representation */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold">Today&apos;s Step Ingestion Throughput</span>
              <span className="text-purple-400 font-mono">1,842,900 steps / hr</span>
            </div>

            {/* Custom SVG Wave Graph */}
            <div className="h-32 w-full flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradAudit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,80 Q75,30 150,60 T300,40 T450,20 T600,50 L600,120 L0,120 Z"
                  fill="url(#gradAudit)"
                />
                <path
                  d="M0,80 Q75,30 150,60 T300,40 T450,20 T600,50"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="3"
                />
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">Verified Sessions</span>
                <span className="font-bold text-emerald-400">99.82%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Filtered Bots</span>
                <span className="font-bold text-amber-400">0.18%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Active Gateways</span>
                <span className="font-bold text-blue-400">Razorpay Auto</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time System Event Stream */}
        <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Recent Security Log
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Live Stream</span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'UPI Payout Batch Dispatched',
                desc: '₹14,500 settled across 82 users via Razorpay VPA',
                time: '2 mins ago',
                icon: CheckCircle2,
                color: 'text-emerald-400'
              },
              {
                title: 'Non-Profit Grant Released',
                desc: '₹25,000 sent to Pratham Shiksha Foundation',
                time: '18 mins ago',
                icon: Heart,
                color: 'text-pink-400'
              },
              {
                title: 'Synthetic Motion Flagged',
                desc: 'Device ID #84920 flagged for unhuman step cadence',
                time: '42 mins ago',
                icon: AlertTriangle,
                color: 'text-amber-400'
              },
              {
                title: 'Role Elevation Executed',
                desc: 'User sneha.k elevated to Moderator by Master Admin',
                time: '2 hours ago',
                icon: ShieldCheck,
                color: 'text-blue-400'
              }
            ].map((event, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold flex items-center gap-1.5 ${event.color}`}>
                    <event.icon className="w-3.5 h-3.5" />
                    {event.title}
                  </span>
                  <span className="text-[10px] text-slate-500">{event.time}</span>
                </div>
                <p className="text-[11px] text-slate-400">{event.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
