import React from 'react';
import { PageId } from '../types';
import { Shield, Sparkles, Mail, MapPin, Clock, HeartHandshake, FileText } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#05070f] border-t border-white/[0.08] text-slate-400 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* About WalkX Column */}
          <div className="lg:col-span-2 space-y-4">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => onNavigate('landing')}
            >
              <img
                src="/logo.png"
                alt="WalkX Logo"
                className="w-10 h-10 rounded-2xl object-cover border border-white/10"
              />
              <span className="font-['Outfit'] font-black text-2xl tracking-tight gradient-logo-text">
                WalkX
              </span>
            </div>
            <p className="text-white font-semibold text-sm">
              Walk More. Earn More. Give More.
            </p>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              WalkX is an ethical fitness-technology platform engineered to empower personal wellness. We transform ordinary pedestrian motion into real UPI cash disbursements, partner rewards, and transparent charity pledges without subscriptions or intrusive GPS surveillance.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Zero Battery Drain Pedometer
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-bold">
                <HeartHandshake size={12} className="text-pink-400" />
                Section 80G Certified
              </span>
            </div>
          </div>

          {/* User Wellness Suite */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Platform Pages
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-cyan-400 transition-colors">
                  Landing Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-cyan-400 transition-colors">
                  Live Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('activity')} className="hover:text-cyan-400 transition-colors">
                  Cadence & Activity
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wallet')} className="hover:text-cyan-400 transition-colors">
                  UPI Points Wallet
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rewards')} className="hover:text-cyan-400 transition-colors">
                  Rewards Store
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('donation')} className="hover:text-cyan-400 transition-colors">
                  Walk for a Cause
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile')} className="hover:text-cyan-400 transition-colors">
                  User Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <FileText size={13} className="text-cyan-400" />
              <span>Legal & Trust</span>
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Terms & Conditions</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">
                  No-GPS Tracking Guarantee
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  Fair Play & Anti-Fraud Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('donation-history')} className="hover:text-white transition-colors">
                  Public Donation Audit Log
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-login')} className="hover:text-purple-400 transition-colors flex items-center gap-1">
                  <Shield size={12} />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Mail size={13} className="text-purple-400" />
              <span>Contact & Help</span>
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
              <div className="flex items-start gap-2">
                <Mail size={14} className="text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-300 font-semibold">User Support Email</span>
                  <a href="mailto:support@walkx.app" className="hover:text-cyan-300 underline underline-offset-2">
                    support@walkx.app
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-300 font-semibold">Support Hours</span>
                  <span>Monday – Saturday, 9am – 7pm IST</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-300 font-semibold">Engineering Hub</span>
                  <span>Chennai, Tamil Nadu, India</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('register')}
                  className="w-full py-2 px-3 rounded-xl gradient-btn text-white font-bold text-xs text-center"
                >
                  Create Free Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-12 mt-12 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 WalkX Platform. All rights reserved. Made in Tamil Nadu for healthy global walkers.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-300">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => onNavigate('terms')} className="hover:text-slate-300">Terms of Service</button>
            <span>•</span>
            <button onClick={() => onNavigate('login')} className="hover:text-slate-300">Walker Login</button>
            <span>•</span>
            <span className="flex items-center gap-1 text-purple-400 font-semibold">
              <Sparkles size={12} />
              Walk More. Earn More. Give More.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
