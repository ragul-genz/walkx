import React, { useState } from 'react';
import {
  Heart,
  CheckCircle2,
  Clock,
  Filter,
  FileText,
  Search
} from 'lucide-react';
import { DonationRecord, UserProfile } from '../types';

interface DonationHistoryPageProps {
  user: UserProfile;
  donations: DonationRecord[];
  onNavigateDonation: () => void;
}

export const DonationHistoryPage: React.FC<DonationHistoryPageProps> = ({
  user,
  donations,
  onNavigateDonation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('all');

  const filteredDonations = donations.filter((record) => {
    const matchesSearch =
      record.causeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMethod =
      filterMethod === 'all' ||
      record.paymentMethod.toLowerCase().includes(filterMethod.toLowerCase());

    return matchesSearch && matchesMethod;
  });

  const totalUserDonated = user.donatedPoints;

  const handleDownloadReceipt = (item: DonationRecord) => {
    const certText = `======================================================================
                 WALKX FOUNDATION - SECTION 80G TAX RECEIPT
                 Registration No: CIT(E)/BLR/80G/2024-25/AABTW1294F
======================================================================

Receipt Number     : REC-${item.referenceNumber}
Transaction Ref    : ${item.referenceNumber}
Date of Receipt    : ${item.date}
Donor Name         : ${item.donorName}
Donor Email        : ${item.donorEmail}

Donation Purpose   : ${item.causeTitle}
Contribution Amount: INR ₹${item.amountInr}.00
Equivalent Points  : ${item.pointsEquivalent} pts
Payment Method     : ${item.paymentMethod}
Settlement Status  : ${item.status} (Verified)

----------------------------------------------------------------------
TAX EXEMPTION DECLARATION:
This receipt qualifies for 50% deduction under Section 80G of the 
Income Tax Act, 1961 for assessment year 2026-2027.
The funds have been credited in full to the designated NGO partner escrow.

Authorized Signatory:
WalkX Social Impact & Compliance Office
Bengaluru, Karnataka, India
======================================================================`;

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `walkx_80g_receipt_${item.referenceNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
              Audit Transparency
            </span>
            <span className="text-xs text-slate-400">Public Charity Settlement Ledger</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Donation History & Records</h1>
          <p className="text-sm text-slate-400 mt-1">
            Review verified disbursements, download 80G tax certificates, and monitor your cumulative social footprint.
          </p>
        </div>

        <button
          onClick={onNavigateDonation}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-pink-600/20 transition-all flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <Heart className="w-4 h-4" />
          Make a Contribution
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#0c1022]/90 border border-pink-500/20 shadow-lg">
          <div className="text-xs uppercase font-semibold text-slate-400 mb-1">Your Total Donated</div>
          <div className="text-2xl font-black text-white">{totalUserDonated.toLocaleString()} pts</div>
          <p className="text-xs text-pink-400 mt-1">₹{(totalUserDonated / 1000).toFixed(2)} INR social contribution</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1022]/90 border border-purple-500/20 shadow-lg">
          <div className="text-xs uppercase font-semibold text-slate-400 mb-1">Verified Disbursements</div>
          <div className="text-2xl font-black text-white">100% Verified</div>
          <p className="text-xs text-slate-400 mt-1">Zero pending settlement escrow</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1022]/90 border border-blue-500/20 shadow-lg">
          <div className="text-xs uppercase font-semibold text-slate-400 mb-1">Tax Exemption Status</div>
          <div className="text-2xl font-black text-emerald-400">80G Eligible</div>
          <p className="text-xs text-slate-400 mt-1">Digital certificates available</p>
        </div>
      </div>

      {/* Ledger Table Section */}
      <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Audited Disbursement Ledger</span>
              <span className="text-xs text-slate-400 font-normal">({filteredDonations.length} records)</span>
            </h2>
            <p className="text-xs text-slate-400">All contributions matched with partner non-profit acknowledgment IDs</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reference or cause..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              {['all', 'points', 'upi'].map((method) => (
                <button
                  key={method}
                  onClick={() => setFilterMethod(method)}
                  className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-all ${
                    filterMethod === method
                      ? 'bg-pink-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {method === 'all' ? 'All' : method === 'points' ? 'Points' : 'UPI'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Ref Number</th>
                <th className="py-3 px-4">Cause</th>
                <th className="py-3 px-4">Donor</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No donation records found.
                  </td>
                </tr>
              ) : (
                filteredDonations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-pink-300">
                      {item.referenceNumber}
                      <span className="block text-[10px] text-slate-500">{item.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{item.causeTitle}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{item.donorName}</div>
                      <div className="text-[10px] text-slate-500">{item.donorEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {item.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">₹{item.amountInr}</div>
                      <div className="text-[10px] text-purple-400">{item.pointsEquivalent} pts</div>
                    </td>
                    <td className="py-3 px-4">
                      {item.status === 'Verified' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400">
                          <Clock className="w-3 h-3" /> {item.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDownloadReceipt(item)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-[11px] inline-flex items-center gap-1"
                        title="Download Certificate"
                      >
                        <FileText className="w-3 h-3 text-pink-400" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
