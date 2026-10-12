import React, { useState } from 'react';
import {
  Search,
  UserCheck,
  UserX,
  Shield,
  Download,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { AdminUser } from '../types';

interface AdminUsersPageProps {
  users: AdminUser[];
  onToggleUserStatus: (userId: string) => void;
  onUpdateRole: (userId: string, newRole: 'User' | 'Moderator' | 'Admin') => void;
  onAddUser: (user: Omit<AdminUser, 'id'>) => void;
}

export const AdminUsersPage: React.FC<AdminUsersPageProps> = ({
  users,
  onToggleUserStatus,
  onUpdateRole,
  onAddUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'User' as const,
    stepsTotal: 0,
    pointsBalance: 1000,
    joinedDate: 'Today',
    status: 'Active' as const,
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || u.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeCount = users.filter((u) => u.status === 'Active').length;
  const suspendedCount = users.filter((u) => u.status === 'Suspended').length;

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email) return;
    onAddUser(newUserData);
    setShowAddModal(false);
    setNewUserData({
      name: '',
      email: '',
      role: 'User',
      stepsTotal: 0,
      pointsBalance: 1000,
      joinedDate: 'Today',
      status: 'Active',
    });
  };

  const handleExportUsersCsv = () => {
    const headers = ['User ID', 'Name', 'Email', 'Role', 'Lifetime Steps', 'Points Balance', 'Joined Date', 'Status'];
    const rows = filteredUsers.map((u) => [
      u.id,
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.email.replace(/"/g, '""')}"`,
      u.role,
      u.stepsTotal,
      u.pointsBalance,
      `"${u.joinedDate}"`,
      u.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `walkx_users_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Identity & Access
            </span>
            <span className="text-xs text-slate-400">Total Registered: {users.length}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin User Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Audit walker accounts, configure security permissions, and freeze suspicious devices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Walker
          </button>
        </div>
      </div>

      {/* 3 Summary Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block mb-1">Active Walkers</span>
            <span className="text-2xl font-black text-white">{activeCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block mb-1">Suspended Accounts</span>
            <span className="text-2xl font-black text-rose-400">{suspendedCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <UserX className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block mb-1">Platform Role Split</span>
            <span className="text-sm font-bold text-purple-300">
              {users.filter((u) => u.role === 'Admin').length} Admins · {users.filter((u) => u.role === 'Moderator').length} Mods
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="moderator">Moderators</option>
              <option value="admin">Admins</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>

            <button
              onClick={handleExportUsersCsv}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Lifetime Steps</th>
                <th className="py-3 px-4">Wallet Balance</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No users matching selected filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-[11px] text-slate-400">{user.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => onUpdateRole(user.id, e.target.value as any)}
                        className={`text-[11px] font-semibold rounded-lg px-2 py-1 bg-slate-900 border border-slate-700 ${
                          user.role === 'Admin'
                            ? 'text-purple-400 border-purple-500/40'
                            : user.role === 'Moderator'
                            ? 'text-blue-400 border-blue-500/40'
                            : 'text-slate-300'
                        }`}
                      >
                        <option value="User">User</option>
                        <option value="Moderator">Moderator</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">{user.stepsTotal.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-purple-400">{user.pointsBalance.toLocaleString()} pts</td>
                    <td className="py-3 px-4 text-slate-400">{user.joinedDate}</td>
                    <td className="py-3 px-4">
                      {user.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : user.status === 'Pending' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                          <AlertTriangle className="w-3 h-3" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onToggleUserStatus(user.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          user.status === 'Active'
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {user.status === 'Active' ? 'Suspend' : 'Reinstate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Walker Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0c1022] border border-blue-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5">
            <h3 className="text-xl font-bold text-white">Register New Walker Account</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  placeholder="ramesh@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="User">User</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Starting Points</label>
                  <input
                    type="number"
                    value={newUserData.pointsBalance}
                    onChange={(e) => setNewUserData({ ...newUserData, pointsBalance: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-xs shadow-lg transition-all"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
