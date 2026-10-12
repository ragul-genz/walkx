import React from 'react';
import { PageId } from '../types';
import {
  LayoutDashboard,
  Users,
  Gift,
  HeartHandshake,
  BarChart3,
  LogOut
} from 'lucide-react';

interface AdminNavHeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onExitAdmin: () => void;
}

export const AdminNavHeader: React.FC<AdminNavHeaderProps> = ({
  currentPage,
  onNavigate,
  onExitAdmin
}) => {
  const adminTabs: { label: string; page: PageId; icon: any }[] = [
    { label: 'Overview Dashboard', page: 'admin-dashboard', icon: LayoutDashboard },
    { label: 'User Directory', page: 'admin-users', icon: Users },
    { label: 'Rewards Storefront', page: 'admin-rewards', icon: Gift },
    { label: 'Donation Moderation', page: 'admin-donations', icon: HeartHandshake },
    { label: 'Audit & Reports', page: 'admin-reports', icon: BarChart3 },
  ];

  return (
    <div className="bg-[#0b0f20]/90 border border-purple-500/30 rounded-2xl p-2.5 mb-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {adminTabs.map((tab) => {
            const active = currentPage === tab.page;
            const Icon = tab.icon;
            return (
              <button
                key={tab.page}
                onClick={() => onNavigate(tab.page)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  active
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon size={14} className={active ? 'text-cyan-300' : 'text-slate-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Exit Admin Button */}
        <button
          onClick={onExitAdmin}
          className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all flex items-center gap-1.5 ml-auto"
        >
          <LogOut size={13} />
          <span>Exit to User View</span>
        </button>
      </div>
    </div>
  );
};
