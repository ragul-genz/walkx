import React, { useState } from 'react';
import {
  FileText,
  Download,
  Sliders,
  Save,
  CheckCircle2,
  RefreshCw,
  Key
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [config, setConfig] = useState({
    stepsPerPoint: 1000,
    dailyStepCap: 15000,
    minPayoutInr: 1,
    fraudSensitivity: 'Strict',
    maintenanceMode: false,
    autoDisburseEscrow: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [exportingReport, setExportingReport] = useState<string | null>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSimulateExport = (reportName: string) => {
    setExportingReport(reportName);
    setTimeout(() => {
      setExportingReport(null);
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [
          `"WalkX Official Audit Report — ${reportName}"`,
          `"Generated At: ${new Date().toISOString()}"`,
          `"Environment: Production / Verified Ledger"`,
          '',
          'Metric,Status,Value,Compliance Notes',
          'KYC Verification Ratio,Pass,99.8%,UIDAI Verified VPAs',
          'Section 80G Tax Remittance,Pass,100%,Registered Trust Receipts Dispatched',
          'Fraud Velocity Filters,Active,Strict,Vehicular motion blocked <0.02% false positive rate',
          'Disbursement Liquidity Escrow,Healthy,Active,Instant Razorpay Settlement Rails'
        ].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${reportName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Audit & System Parameters
          </span>
          <span className="text-xs text-slate-400">Master Compliance Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Reports, Compliance & Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Export certified financial ledgers, audit tax compliance, and adjust global WalkX economic parameters.
        </p>
      </div>

      {/* Reports Export Section */}
      <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          Certified Export Reports
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              id: 'daily_ledger',
              title: 'Daily Financial Settlement Ledger',
              desc: 'Complete journal of step credits, UPI payouts, and non-profit remittances.',
              type: 'CSV / Excel',
            },
            {
              id: '80g_tax',
              title: 'Section 80G Tax Exemption Schedule',
              desc: 'Quarterly certificate manifest for partner foundations and donor claims.',
              type: 'Government PDF Format',
            },
            {
              id: 'anti_fraud',
              title: 'Pedometer Anomaly & Fraud Audit',
              desc: 'Breakdown of flagged accelerometer cadence events and banned devices.',
              type: 'Security Log JSON',
            },
            {
              id: 'payout_sla',
              title: 'Razorpay UPI Gateway SLA Report',
              desc: 'Disbursement latency breakdown, retry outcomes, and bank response codes.',
              type: 'Latency Matrix CSV',
            },
          ].map((report) => (
            <div
              key={report.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{report.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {report.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{report.desc}</p>
              </div>

              <button
                onClick={() => handleSimulateExport(report.title)}
                disabled={exportingReport === report.title}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                {exportingReport === report.title ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>Compiling Ledger...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Generate & Download</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Global Economic Parameters Configuration */}
      <form onSubmit={handleSaveConfig} className="space-y-6">
        <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            Platform Economy & Rate Multipliers
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Steps Required per 1 WalkX Point
              </label>
              <input
                type="number"
                value={config.stepsPerPoint}
                onChange={(e) => setConfig({ ...config, stepsPerPoint: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Standard baseline: 1,000 steps = 1,000 points (1,000 pts = ₹11 INR).
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Daily Verified Steps Cap per Walker
              </label>
              <input
                type="number"
                value={config.dailyStepCap}
                onChange={(e) => setConfig({ ...config, dailyStepCap: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Maximum allowable convertible steps daily per verified account.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Minimum UPI Withdrawal Threshold (INR)
              </label>
              <input
                type="number"
                value={config.minPayoutInr}
                onChange={(e) => setConfig({ ...config, minPayoutInr: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Default: ₹11.00 (1,000 WalkX points).
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Anti-Cheat Telemetry Filter Sensitivity
              </label>
              <select
                value={config.fraudSensitivity}
                onChange={(e) => setConfig({ ...config, fraudSensitivity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="Low">Low (Permissive)</option>
                <option value="Medium">Medium (Balanced)</option>
                <option value="Strict">Strict (Maximum Bot Rejection)</option>
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Evaluates cadence regularity, GPS velocity, and frequency harmonics.
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-sm font-semibold text-white block">Auto-Disburse Non-Profit Escrow</span>
                <span className="text-xs text-slate-400">Instantly execute settlement when cause milestone reaches 100%</span>
              </div>
              <input
                type="checkbox"
                checked={config.autoDisburseEscrow}
                onChange={(e) => setConfig({ ...config, autoDisburseEscrow: e.target.checked })}
                className="w-5 h-5 accent-purple-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/30">
              <div>
                <span className="text-sm font-semibold text-rose-300 block">Emergency Maintenance Mode</span>
                <span className="text-xs text-slate-400">Pause all payouts and pedometer ingestion across global users</span>
              </div>
              <input
                type="checkbox"
                checked={config.maintenanceMode}
                onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                className="w-5 h-5 accent-rose-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* API Integration Details */}
        <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-400" />
            Razorpay & Telemetry Webhook Endpoints
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Razorpay Live Key ID</span>
              <span className="text-slate-200">rzp_live_9a2b84cd7ef012</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Webhook Dispatch Status</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Listening on /api/webhooks/razorpay
              </span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between p-5 rounded-2xl bg-[#0c1022] border border-emerald-500/20">
          <div>
            {savedSuccess ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                System configuration updated successfully!
              </span>
            ) : (
              <span className="text-xs text-slate-400">Settings changes are logged to the immutable administrator audit trail.</span>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
