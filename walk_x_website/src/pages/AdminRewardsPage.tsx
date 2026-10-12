import React, { useState } from 'react';
import {
  Gift,
  Plus
} from 'lucide-react';
import { RewardItem } from '../types';

interface AdminRewardsPageProps {
  rewards: RewardItem[];
  onAddReward: (reward: RewardItem) => void;
  onToggleUnlocked: (rewardId: string) => void;
  onUpdateStock: (rewardId: string, delta: number) => void;
}

export const AdminRewardsPage: React.FC<AdminRewardsPageProps> = ({
  rewards,
  onAddReward,
  onToggleUnlocked,
  onUpdateStock,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReward, setNewReward] = useState<Omit<RewardItem, 'id'>>({
    title: '',
    pointsCost: 5000,
    inrValue: 5,
    icon: '✦',
    description: '',
    category: 'cash',
    stockCount: 1000,
    unlocked: true,
  });

  const totalStock = rewards.reduce((acc, r) => acc + r.stockCount, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReward.title) return;
    onAddReward({
      ...newReward,
      id: `rew_${Date.now()}`,
    });
    setShowAddModal(false);
    setNewReward({
      title: '',
      pointsCost: 5000,
      inrValue: 5,
      icon: '✦',
      description: '',
      category: 'cash',
      stockCount: 1000,
      unlocked: true,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Economy & Redemption
            </span>
            <span className="text-xs text-slate-400">Fixed Rate: 1,000 pts = ₹11 INR</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Rewards Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure catalog offerings, payout thresholds, merchant vouchers, and inventory reserves.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center gap-1.5 active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Reward
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#0c1022]/90 border border-purple-500/20 shadow-lg">
          <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">Active Catalog Items</span>
          <span className="text-3xl font-black text-white">{rewards.length} Items</span>
          <p className="text-xs text-purple-400 mt-1">Cash, Vouchers & Merchandise</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1022]/90 border border-blue-500/20 shadow-lg">
          <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">Total Vault Reserves</span>
          <span className="text-3xl font-black text-white">{totalStock.toLocaleString()} Units</span>
          <p className="text-xs text-blue-400 mt-1">Cumulative available claim stock</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1022]/90 border border-emerald-500/20 shadow-lg">
          <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">Instant Payout Engine</span>
          <span className="text-3xl font-black text-emerald-400">Razorpay UPI</span>
          <p className="text-xs text-slate-400 mt-1">Real-time webhook settlements</p>
        </div>
      </div>

      {/* Rewards Management Table */}
      <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-400" />
            Catalog Item Inventory
          </h2>
          <span className="text-xs text-slate-400">{rewards.length} configured items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Item & Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Cost (Pts)</th>
                <th className="py-3 px-4">Value (INR)</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-right">Quick Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {rewards.map((rew) => (
                <tr key={rew.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-lg shrink-0">
                        {rew.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{rew.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{rew.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {rew.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-purple-400">{rew.pointsCost.toLocaleString()} pts</td>
                  <td className="py-3 px-4 font-bold text-white">₹{rew.inrValue}</td>
                  <td className="py-3 px-4 font-mono font-medium">{rew.stockCount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onToggleUnlocked(rew.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                        rew.unlocked
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {rew.unlocked ? 'Unlocked (Active)' : 'Locked'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateStock(rew.id, -10)}
                        className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                        title="Reduce 10"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => onUpdateStock(rew.id, 50)}
                        className="px-2 py-1 rounded-md bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 text-[10px] font-bold"
                        title="Add 50"
                      >
                        +50
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Reward Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0c1022] border border-purple-500/30 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <h3 className="text-xl font-bold text-white">Add New Catalog Reward</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reward Title</label>
                <input
                  type="text"
                  required
                  value={newReward.title}
                  onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                  placeholder="e.g. ₹20 Instant UPI Payout"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newReward.description}
                  onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                  placeholder="Details regarding redemption and fulfillment..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newReward.category}
                    onChange={(e) => setNewReward({ ...newReward, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                  >
                    <option value="cash">Instant Cash</option>
                    <option value="voucher">Brand Voucher</option>
                    <option value="merch">Merchandise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Points Cost</label>
                  <input
                    type="number"
                    value={newReward.pointsCost}
                    onChange={(e) => setNewReward({ ...newReward, pointsCost: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">INR Nominal Value</label>
                  <input
                    type="number"
                    value={newReward.inrValue}
                    onChange={(e) => setNewReward({ ...newReward, inrValue: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newReward.stockCount}
                    onChange={(e) => setNewReward({ ...newReward, stockCount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
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
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-xs shadow-lg transition-all"
                >
                  Create Reward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
