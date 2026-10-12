import React, { useState } from 'react';
import { PageId } from '../types';
import {
  Shield,
  User,
  ArrowRight,
  ArrowLeft,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Lock,
  Loader2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { adminLogin, DEMO_CREDENTIALS } from '../services/supabaseAuth';

interface AdminLoginPageProps {
  onNavigate: (page: PageId) => void;
  onAdminLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onNavigate,
  onAdminLoginSuccess
}) => {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [mfaCode, setMfaCode] = useState('849201');

  // UI & Validation state
  const [errors, setErrors] = useState<{ email?: string; secret?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: { email?: string; secret?: string } = {};

    const cleanEmail = adminEmail.trim();
    if (!cleanEmail) {
      newErrors.email = 'Admin identifier or email is required.';
    } else if (!cleanEmail.includes('@')) {
      newErrors.email = 'Please provide a valid administrative email.';
    }

    if (!adminSecret) {
      newErrors.secret = 'Master security passphrase is required.';
    } else if (adminSecret.length < 6) {
      newErrors.secret = 'Security passphrase must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuickFillDemo = () => {
    setAdminEmail(DEMO_CREDENTIALS.admin.email);
    setAdminSecret(DEMO_CREDENTIALS.admin.secretKey);
    setMfaCode('849201');
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage(null);

    try {
      const res = await adminLogin(adminEmail, adminSecret);

      if (!res.success) {
        setErrors({ general: res.error || 'Administrative authentication denied.' });
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Administrative security clearance verified! Initializing Executive Console...');

      setTimeout(() => {
        onAdminLoginSuccess();
        onNavigate('admin-dashboard');
      }, 700);
    } catch (err: any) {
      setErrors({ general: err.message || 'An unexpected authorization exception occurred.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
            <Shield size={32} />
          </div>
          <h2 className="font-['Outfit'] font-black text-2xl sm:text-3xl text-white">
            Separate Administrative Console
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Restricted authorization portal for WalkX system operators, moderators, and financial auditors.
          </p>
        </div>

        {/* Security Architecture Notice (Per instructions: Never treat client-side role check as secure admin authorization) */}
        <div className="mb-5 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 leading-relaxed shadow-lg">
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={17} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block mb-0.5">
                Security Architecture Notice
              </span>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                Client-side role checks are strictly for UI routing and <strong>never</strong> a substitute for true server-side admin authorization. In production Supabase, admin privileges are secured via PostgreSQL Row Level Security (RLS) policies and verified JWT claims (<code className="bg-black/30 px-1 py-0.5 rounded text-amber-300">app_metadata.role === &apos;admin&apos;</code>).
              </p>
            </div>
          </div>
        </div>

        {/* Demo Sandbox Quickfill Pill */}
        <div className="mb-4 p-3 rounded-2xl bg-[#0e1633] border border-cyan-500/30 text-xs text-cyan-300 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Info size={15} className="text-cyan-400 shrink-0" />
            <span className="text-[11.5px] text-slate-300">
              Demo Sandbox: <strong className="text-white">admin@walkx.app</strong> / <strong className="text-white">AdminSecret2026!</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleQuickFillDemo}
            className="px-2.5 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/40 text-[10.5px] font-bold text-cyan-200 whitespace-nowrap transition-all cursor-pointer"
          >
            Auto Fill
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-[#0b0e22] border border-cyan-500/30 rounded-3xl p-7 sm:p-8 shadow-2xl purple-glow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* General Error Banner */}
          {errors.general && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Admin Email */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Staff Administrator Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => {
                    setAdminEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="admin@walkx.app"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                    errors.email ? 'border-rose-500 focus:border-rose-400' : 'border-white/10 focus:border-cyan-400'
                  }`}
                />
              </div>
              {errors.email && (
                <span className="text-[11px] text-rose-400 font-medium block mt-1">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Security Passphrase */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Master Passphrase
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={adminSecret}
                  onChange={(e) => {
                    setAdminSecret(e.target.value);
                    if (errors.secret) setErrors((prev) => ({ ...prev, secret: undefined }));
                  }}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl bg-white/[0.04] border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                    errors.secret ? 'border-rose-500 focus:border-rose-400' : 'border-white/10 focus:border-cyan-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={showSecret ? 'Hide passphrase' : 'Show passphrase'}
                >
                  {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.secret && (
                <span className="text-[11px] text-rose-400 font-medium block mt-1">
                  {errors.secret}
                </span>
              )}
            </div>

            {/* Simulated MFA / Hardware Security Key Token */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Hardware Token / TOTP 2FA</span>
                <span className="text-[10px] text-cyan-400 font-mono">Simulated OTP</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="6-digit token"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono placeholder-slate-500 text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 mt-4 shadow-lg hover:brightness-110 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying RLS Permissions...</span>
                </>
              ) : (
                <>
                  <span>Unlock Executive Console</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 mt-6 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="text-xs font-bold text-slate-400 hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Return to Standard Walker Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
