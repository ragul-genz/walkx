import React from 'react';
import { Shield, Lock, CheckCircle2, Mail } from 'lucide-react';
import { PageId } from '../types';

interface PrivacyPolicyPageProps {
  onNavigate: (page: PageId) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-slate-300">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-800 pb-8">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            WalkX Trust & Security
          </span>
          <span className="text-xs text-slate-400">Effective Date: October 2026</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Privacy Policy</h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          At WalkX (&quot;Walk More. Earn More. Give More.&quot;), we believe privacy is a fundamental human right. This policy outlines how our platform collects, processes, and protects your biometric motion telemetry and payment settlement identifiers.
        </p>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0c1022] border border-purple-500/20 space-y-2">
          <Lock className="w-5 h-5 text-purple-400" />
          <h4 className="text-sm font-bold text-white">No Invasive GPS Stalking</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            We only sample step frequency and accelerometer cadence. We never record or log your precise geographic home or work coordinates.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0c1022] border border-blue-500/20 space-y-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <h4 className="text-sm font-bold text-white">Zero Third-Party Ad Selling</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your walking metrics and personal contact info are never sold, rented, or brokered to commercial ad networks or data brokers.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0c1022] border border-emerald-500/20 space-y-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h4 className="text-sm font-bold text-white">100% End-to-End Encryption</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            All bank UPI VPAs and telemetry streams are encrypted in transit with TLS 1.3 and at rest with AES-256 vault partitions.
          </p>
        </div>
      </div>

      {/* Structured Policy Sections */}
      <div className="space-y-8 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            1. Information We Collect
          </h2>
          <p>
            When you interact with the WalkX platform, we collect information necessary to authenticate your profile, calculate earned rewards, and execute payments:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
            <li>
              <strong className="text-slate-200">Account Credentials:</strong> Name, verified email address, mobile number, and password hashes (stored using industry-standard bcrypt encryption).
            </li>
            <li>
              <strong className="text-slate-200">Biometric Motion Telemetry:</strong> Step counts, cadence rate, active walking duration, and estimated calories burned provided via browser motion APIs or device sensors.
            </li>
            <li>
              <strong className="text-slate-200">Payment & Settlement Information:</strong> Virtual Payment Addresses (UPI VPAs e.g., <code className="text-purple-300">user@bank</code>) required by our payment gateway partner (Razorpay) to transfer your earned cash rewards.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            2. How We Use Your Data
          </h2>
          <p>We process your data strictly for legitimate operational purposes:</p>
          <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
            <li>To convert verified physical steps into WalkX virtual reward points (standard rate: 1,000 points = ₹11 indicative reward equivalent).</li>
            <li>To execute instant cash reward payouts directly into your Indian savings account via Razorpay UPI.</li>
            <li>To route charitable pledges to accredited Section 80G non-profit foundation partners and generate digital donation receipts.</li>
            <li>To detect synthetic accelerometer simulations, automated vehicle fraud, and multi-accounting anomalies.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            3. Data Sharing & Third-Party Processors
          </h2>
          <p>
            WalkX shares limited information solely with essential infrastructure partners under strict Data Processing Agreements:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
            <li>
              <strong className="text-slate-200">Razorpay Software Pvt. Ltd.:</strong> For processing UPI cash redemptions and micro-donations in compliance with Reserve Bank of India (RBI) directives.
            </li>
            <li>
              <strong className="text-slate-200">Accredited Non-Profit Partners:</strong> To transmit aggregate funding sums and issue verified digital tax certificates for donor contributions.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            4. User Rights & Data Deletion
          </h2>
          <p>
            You retain absolute sovereignty over your movement and account records. At any point, you can:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
            <li>Export your complete historical step and transaction ledger in machine-readable CSV format.</li>
            <li>Disconnect browser and health sensors through the account profile settings.</li>
            <li>Request permanent account deletion and erasure of all associated telemetry by contacting our privacy compliance desk.</li>
          </ul>
        </section>

        <section className="p-6 rounded-2xl bg-[#0c1022] border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-purple-400" />
            Contact Data Protection Officer
          </h3>
          <p className="text-xs text-slate-400">
            If you have questions regarding this Privacy Policy or wish to exercise your statutory rights, please reach out directly:
          </p>
          <div className="text-xs text-slate-200 font-mono">
            WalkX Privacy & Compliance Division<br />
            Email: <a href="mailto:privacy@walkx.app" className="text-purple-400 hover:underline">privacy@walkx.app</a><br />
            Response SLA: Within 48 business hours
          </div>
        </section>
      </div>

      {/* Navigation Return */}
      <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-xs">
        <button
          onClick={() => onNavigate('landing')}
          className="text-purple-400 hover:text-purple-300 font-semibold"
        >
          ← Return to WalkX Home
        </button>
        <button
          onClick={() => onNavigate('terms')}
          className="text-slate-400 hover:text-white"
        >
          Read Terms and Conditions →
        </button>
      </div>
    </div>
  );
};
