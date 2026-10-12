import React, { useState } from 'react';
import {
  Heart,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building
} from 'lucide-react';
import { CauseItem, DonationRecord } from '../types';

interface AdminDonationsPageProps {
  causes: CauseItem[];
  donations: DonationRecord[];
  onAddCause: (cause: CauseItem) => void;
  onUpdateDonationStatus: (donationId: string, newStatus: 'Verified' | 'Pending Review' | 'Flagged') => void;
}

export const AdminDonationsPage: React.FC<AdminDonationsPageProps> = ({
  causes,
  donations,
  onAddCause,
  onUpdateDonationStatus,
}) => {
  const [showAddCauseModal, setShowAddCauseModal] = useState(false);
  const [newCause, setNewCause] = useState<Omit<CauseItem, 'id' | 'raisedAmount' | 'donorsCount'>>({
    title: '',
    tagline: '',
    description: '',
    category: 'Education',
    icon: '📚',
    organizationName: '',
    organizationType: 'Registered Non-Profit (Sample)',
    organizationLocation: 'Tamil Nadu, India',
    registrationNumber: 'SAMPLE-NGO-TN-2024',
    targetAmount: 50000,
    verifiedPartner: '',
  });

  const totalRaised = causes.reduce((acc, c) => acc + c.raisedAmount, 0);
  const pendingCount = donations.filter((d) => d.status === 'Pending Review').length;

  const handleCreateCause = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCause.title || !newCause.verifiedPartner) return;
    const org = newCause.organizationName || newCause.verifiedPartner;
    onAddCause({
      ...newCause,
      id: `cause_${Date.now()}`,
      organizationName: org,
      verifiedPartner: `${org} (Sample Partner)`,
      raisedAmount: 0,
      donorsCount: 0,
    });
    setShowAddCauseModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
              Social Impact Audit
            </span>
            <span className="text-xs text-slate-400">Total Causes: {causes.length}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Donations & Causes</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage NGO partnerships, monitor donation pledges, and approve bank disbursements.
          </p>
        </div>

        <button
          onClick={() => setShowAddCauseModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-pink-600/20 transition-all flex items-center gap-1.5 active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Cause
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#0c1022]/90 border border-pink-500/20 shadow-lg">
          <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">Total Pledged Capital</span>
          <span className="text-3xl font-black text-white">₹{totalRaised.toLocaleString()}</span>
          <p className="text-xs text-pink-400 mt-1">100% remitted to NGO escrow accounts</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1022]/90 border border-amber-500/20 shadow-lg">
          <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">Pending Moderation Queue</span>
          <span className="text-3xl font-black text-amber-400">{pendingCount} Pledges</span>
          <p className="text-xs text-slate-400 mt-1">Awaiting UPI receipt verification</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1022]/90 border border-blue-500/20 shadow-lg">
          <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">Verified NGO Partners</span>
          <span className="text-3xl font-black text-blue-400">12 Certified</span>
          <p className="text-xs text-slate-400 mt-1">Section 80G tax exemption qualified</p>
        </div>
      </div>

      {/* Donation Moderation Queue Table */}
      <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" />
            Live Moderation & Verification Queue
          </h2>
          <span className="text-xs text-slate-400">{donations.length} total entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Ref Number</th>
                <th className="py-3 px-4">Cause Target</th>
                <th className="py-3 px-4">Donor Info</th>
                <th className="py-3 px-4">Pledge (INR)</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Audit Status</th>
                <th className="py-3 px-4 text-right">Moderator Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {donations.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-pink-300">
                    {item.referenceNumber}
                    <span className="block text-[10px] text-slate-500">{item.date}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">{item.causeTitle}</td>
                  <td className="py-3 px-4">
                    <div>{item.donorName}</div>
                    <div className="text-[10px] text-slate-500">{item.donorEmail}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-white">₹{item.amountInr}</td>
                  <td className="py-3 px-4 text-slate-300">{item.paymentMethod}</td>
                  <td className="py-3 px-4">
                    {item.status === 'Verified' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    ) : item.status === 'Pending Review' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                        <AlertTriangle className="w-3 h-3" /> Flagged
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {item.status !== 'Verified' && (
                        <button
                          onClick={() => onUpdateDonationStatus(item.id, 'Verified')}
                          className="px-2 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold"
                        >
                          Approve
                        </button>
                      )}
                      {item.status !== 'Flagged' && (
                        <button
                          onClick={() => onUpdateDonationStatus(item.id, 'Flagged')}
                          className="px-2 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-semibold"
                        >
                          Flag
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Causes Directory */}
      <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-400" />
          Partner Causes Portfolio
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {causes.map((cause) => {
            const percent = Math.min(100, Math.round((cause.raisedAmount / cause.targetAmount) * 100));

            return (
              <div key={cause.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cause.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{cause.title}</h4>
                      <p className="text-[11px] text-slate-400">{cause.verifiedPartner}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                    {cause.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-pink-500 h-full rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>₹{cause.raisedAmount.toLocaleString()} funded</span>
                    <span>Target: ₹{cause.targetAmount.toLocaleString()} ({percent}%)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Cause Modal */}
      {showAddCauseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0c1022] border border-pink-500/30 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <h3 className="text-xl font-bold text-white">Create New Verified Social Cause</h3>
            <form onSubmit={handleCreateCause} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cause Title</label>
                <input
                  type="text"
                  required
                  value={newCause.title}
                  onChange={(e) => setNewCause({ ...newCause, title: e.target.value })}
                  placeholder="e.g. Rural Girl Child Digital Literacy"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  value={newCause.tagline}
                  onChange={(e) => setNewCause({ ...newCause, tagline: e.target.value })}
                  placeholder="e.g. Provide refurbished tablets and internet connectivity"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Partner Foundation</label>
                  <input
                    type="text"
                    required
                    value={newCause.verifiedPartner}
                    onChange={(e) => setNewCause({ ...newCause, verifiedPartner: e.target.value })}
                    placeholder="e.g. Shiksha Trust"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fundraising Target (INR)</label>
                  <input
                    type="number"
                    value={newCause.targetAmount}
                    onChange={(e) => setNewCause({ ...newCause, targetAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={newCause.category}
                  onChange={(e) => setNewCause({ ...newCause, category: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-pink-500"
                >
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Food support">Food support</option>
                  <option value="Environment">Environment</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCauseModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold text-xs shadow-lg transition-all"
                >
                  Publish Cause
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
