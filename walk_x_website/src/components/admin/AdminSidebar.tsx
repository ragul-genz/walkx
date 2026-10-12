import React from 'react';
import {
  LayoutDashboard,
  Users,
  Coins,
  Gift,
  Heart,
  BarChart3,
  Settings,
  ShieldAlert,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { AdminSection } from '../../types';

interface AdminSidebarProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  onExitAdmin: () => void;
  usersCount?: number;
  pendingRedemptionsCount?: number;
  pendingDonationsCount?: number;
  auditLogsCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onSelectSection,
  onExitAdmin,
  usersCount = 12,
  pendingRedemptionsCount = 2,
  pendingDonationsCount = 1,
  auditLogsCount = 4,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const navItems: {
    id: AdminSection;
    label: string;
    sublabel: string;
    icon: any;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'overview',
      label: 'Overview Dashboard',
      sublabel: 'KPIs, Activity & Telemetry',
      icon: LayoutDashboard,
    },
    {
      id: 'users',
      label: 'User Management',
      sublabel: 'Directory, Search & Status',
      icon: Users,
      badge: usersCount,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    {
      id: 'points',
      label: 'Points Management',
      sublabel: 'Earning Rules & Rates (1k=₹11)',
      icon: Coins,
    },
    {
      id: 'rewards',
      label: 'Rewards & Redemptions',
      sublabel: 'Catalog & Approval Queue',
      icon: Gift,
      badge: pendingRedemptionsCount > 0 ? pendingRedemptionsCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'donations',
      label: 'Donation Management',
      sublabel: 'Social Causes & Ledger',
      icon: Heart,
      badge: pendingDonationsCount > 0 ? pendingDonationsCount : undefined,
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30'
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      sublabel: 'Date Filters & Real CSV',
      icon: BarChart3,
    },
    {
      id: 'settings',
      label: 'System Settings',
      sublabel: 'Policies, Anti-Cheat, Limits',
      icon: Settings,
    },
    {
      id: 'audit',
      label: 'Audit Logs',
      sublabel: 'Admin Action History',
      icon: ShieldAlert,
      badge: auditLogsCount,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
  ];

  const handleSelect = (section: AdminSection) => {
    onSelectSection(section);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#080c1d] border-r border-purple-500/20 w-72 p-4 sm:p-5 select-none overflow-y-auto scrollbar-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 pb-5 border-b border-slate-800/80">
        <div className="relative">
          <img
            src="/logo.png"
            alt="WalkX Logo"
            className="w-10 h-10 rounded-2xl object-cover shadow-[0_0_20px_rgba(168,85,247,0.35)] border border-purple-500/40"
          />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-['Outfit'] font-black text-lg text-white tracking-tight">WalkX</span>
            <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
              Admin
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block font-medium">Operations Console</span>
        </div>
      </div>

      {/* Backend Security Architecture Status Badge */}
      <div className="my-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Security Layer
          </span>
          <span className="text-emerald-400 font-mono font-semibold">Protected</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Backend JWT & RLS validation enforced on data modifications.
        </p>
      </div>

      {/* Navigation Sections */}
      <div className="space-y-1 flex-1">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Admin Modules (8)
        </div>
        {navItems.map((item) => {
          const isActive = currentSection === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full text-left p-2.5 rounded-2xl transition-all flex items-center justify-between group ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/20 border border-purple-500/40 text-white shadow-lg shadow-purple-950/40'
                  : 'hover:bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 group-hover:text-purple-300 group-hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                    {item.sublabel}
                  </div>
                </div>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ml-1.5 ${
                    item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Account & Exit */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2 mt-4">
        <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-xs text-purple-200 font-bold shrink-0">
              RA
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-white truncate">Ragul Admin</div>
              <div className="text-[9px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Root Clearance
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onExitAdmin}
          className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-semibold text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit to User View</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-20 h-[calc(100vh-5rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
