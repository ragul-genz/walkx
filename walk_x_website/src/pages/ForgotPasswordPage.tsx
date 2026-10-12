import React, { useState } from 'react';
import { PageId } from '../types';
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  KeyRound
} from 'lucide-react';
import { requestPasswordReset, updatePassword, isSupabaseConfigured } from '../services/supabaseAuth';

interface ForgotPasswordPageProps {
  onNavigate: (page: PageId) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // New Password Simulation Mode (Step 2)
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError('Please enter your registered email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await requestPasswordReset(cleanEmail);
      if (!res.success) {
        setError(res.error || 'Unable to process reset request.');
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while requesting password reset.');
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await updatePassword(newPassword);
      setIsLoading(false);
      if (!res.success) {
        setError(res.error || 'Unable to update password.');
        return;
      }
      setResetComplete(true);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Failed to update password.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2.5 cursor-pointer mb-4 group"
            onClick={() => onNavigate('landing')}
          >
            <img
              src="/logo.png"
              alt="WalkX Logo"
              className="w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-lg group-hover:scale-105 transition-transform"
            />
            <span className="font-['Outfit'] font-black text-3xl gradient-logo-text">
              WalkX
            </span>
          </div>
          <h2 className="font-['Outfit'] font-black text-2xl text-white">
            Reset Account Password 🔐
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Secure recovery for your WalkX profile & Points Wallet
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0b0e22] border border-white/[0.08] rounded-3xl p-7 sm:p-8 shadow-2xl purple-glow">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {resetComplete ? (
            <div className="text-center py-4 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-white">Password Successfully Updated!</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your credentials have been securely refreshed. You can now sign in with your new password.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="w-full py-3.5 rounded-xl gradient-btn font-bold text-xs cursor-pointer shadow-lg"
              >
                Sign In to WalkX
              </button>
            </div>
          ) : submitted ? (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-sm font-bold text-white">Recovery Link Dispatched</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We've sent recovery instructions to <strong className="text-cyan-300">{email}</strong>.
                </p>
                <span className="text-[10px] text-slate-500 block pt-1">
                  {isSupabaseConfigured
                    ? 'Check your inbox for the official Supabase verification email.'
                    : 'Demo Sandbox: You can test setting a new password below.'}
                </span>
              </div>

              {/* Demo Mode: Set New Password Form */}
              <form onSubmit={handleUpdatePassword} className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <KeyRound size={14} className="text-purple-400" />
                  <span>Set New Password Now (Demo Sandbox)</span>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password (min 8 chars)"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl gradient-btn font-bold text-xs cursor-pointer shadow-md"
                >
                  Save & Update Password
                </button>
              </form>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-xs font-bold text-slate-400 hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Return to Sign In</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Enter your registered WalkX email address. We'll send an authenticated password reset link through Supabase auth rails.
              </p>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="walker@walkx.app"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl gradient-btn font-extrabold text-sm flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-lg disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Transmitting Recovery Request...</span>
                  </>
                ) : (
                  <>
                    <span>Send Password Reset Link</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="pt-4 text-center">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-xs font-bold text-slate-400 hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
