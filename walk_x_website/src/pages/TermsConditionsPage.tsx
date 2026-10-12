import React from 'react';
import { Scale, AlertOctagon } from 'lucide-react';
import { PageId } from '../types';

interface TermsConditionsPageProps {
  onNavigate: (page: PageId) => void;
}

export const TermsConditionsPage: React.FC<TermsConditionsPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-slate-300">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-800 pb-8">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-blue-400" />
            Legal Agreement
          </span>
          <span className="text-xs text-slate-400">Last Revised: October 2026</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Terms and Conditions</h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Please review these Terms and Conditions carefully before using WalkX (&quot;Walk More. Earn More. Give More.&quot;). By creating an account or syncing motion sensors, you agree to be bound by these provisions.
        </p>
      </div>

      {/* Fair Play Notice Alert */}
      <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-4 text-amber-200">
        <AlertOctagon className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <strong className="text-sm font-bold block text-amber-300">Strict Fair-Play & Anti-Cheat Policy</strong>
          <span>
            WalkX enforces hardware-level machine learning to detect mechanical phone shakers, vehicular travel, and emulated cadence patterns. Accounts found attempting synthetic step generation will be permanently terminated and all points balances will be permanently forfeited.
          </span>
        </div>
      </div>

      {/* Detailed Provisions */}
      <div className="space-y-8 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            1. User Eligibility & Account Registration
          </h2>
          <p>
            To use WalkX, you must be at least 18 years of age or possess legal parental consent. You agree to provide accurate, truthful details during registration and maintain custody of your authentication credentials. Only one registered account is permitted per individual and physical device.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            2. Step Conversion & Point Economics
          </h2>
          <p>
            WalkX rewards verified human bipedal movement. The standard conversion standard is established as follows:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
            <li>
              <strong className="text-slate-200">Baseline Rate:</strong> 1,000 WalkX Points = ₹11.00 INR indicative reward equivalent. Step-to-points earning rate is separately configurable by administrators.
            </li>
            <li>
              <strong className="text-slate-200">Daily Quota:</strong> To preserve platform longevity and prevent physical strain, convertible daily steps are capped at 15,000 steps per user account per calendar day.
            </li>
            <li>
              <strong className="text-slate-200">Sensor Verification:</strong> Steps are validated through device accelerometer harmonics. Steps logged during motorized transport (cars, trains, motorbikes) are automatically discarded.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            3. UPI Cash Redemptions & Payouts
          </h2>
          <p>
            Cash rewards are disbursed via our authorized payment infrastructure partner, Razorpay:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
            <li>The minimum withdrawal threshold is 1,000 WalkX points (equivalent to ₹11.00 INR).</li>
            <li>Payouts are transmitted directly to valid Indian Virtual Payment Addresses (UPI VPAs). WalkX does not charge any hidden withdrawal fees or platform deduction fees.</li>
            <li>Users are solely responsible for ensuring the accuracy of their registered UPI ID. Payouts executed to incorrect VPAs provided by the user cannot be recalled.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            4. Social Impact Pledges & Charity Remittances
          </h2>
          <p>
            Users may choose to allocate their earned points toward featured accredited non-profit foundations:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
            <li>Charitable donations made through the platform are non-refundable and irrevocable once confirmed.</li>
            <li>WalkX passes 100% of donated capital to designated foundation partners with zero administrative retention.</li>
            <li>Digital donation receipts are recorded on the platform ledger and are eligible under relevant statutory provisions including Section 80G of the Indian Income Tax Act.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            5. Health & Medical Disclaimer
          </h2>
          <p className="text-slate-400">
            WalkX is a movement motivation and lifestyle wellness platform. It is <strong className="text-slate-200">not a certified medical device</strong> and should never be construed as medical diagnosis, treatment, or therapeutic guidance. Consult a qualified medical practitioner before initiating any intense walking or physical fitness regime. If you experience dizziness, shortness of breath, or chest discomfort while walking, discontinue activity immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            6. Intellectual Property & Brand Rights
          </h2>
          <p>
            All original graphics, software code, branding assets, the WalkX orbital logo, and the signature tagline &quot;Walk More. Earn More. Give More.&quot; are the exclusive intellectual property of WalkX. Unauthorized reproduction, modification, or reverse engineering is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            7. Governing Law & Jurisdiction
          </h2>
          <p>
            These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any legal dispute or claim arising under these terms shall be subject to the exclusive jurisdiction of the competent courts in India.
          </p>
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
          onClick={() => onNavigate('privacy')}
          className="text-slate-400 hover:text-white"
        >
          Read Privacy Policy →
        </button>
      </div>
    </div>
  );
};
