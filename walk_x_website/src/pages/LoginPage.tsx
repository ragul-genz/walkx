import React, { useState } from 'react';
import { PageId } from '../types';
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Shield,
  Info
} from 'lucide-react';
import { loginUser, DEMO_CREDENTIALS, isSupabaseConfigured } from '../services/supabaseAuth';

interface LoginPageProps {
  onNavigate: (page: PageId) => void;
  onLoginSuccess: (name: string, email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Validation & UI State
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@example.com).';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuickFillDemo = () => {
    setEmail(DEMO_CREDENTIALS.user.email);
    setPassword(DEMO_CREDENTIALS.user.password);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage(null);

    try {
      const res = await loginUser(email, password);

      if (!res.success) {
        setErrors({ general: res.error || 'Authentication failed. Please check your credentials.' });
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Authentication successful! Directing to your WalkX Dashboard...');

      setTimeout(() => {
        const userName = res.user?.name || 'Priya Sharma';
        const userEmail = res.user?.email || email;
        onLoginSuccess(userName, userEmail);
        onNavigate('dashboard');
      }, 700);
    } catch (err: any) {
      setErrors({ general: err.message || 'An unexpected error occurred. Please try again.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Brand Card Header */}
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
            Welcome Back, Walker 👋
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Walk towards a healthier life. Earn rewards. Make a difference.
          </p>
        </div>

        {/* Demo Mode Notice Badge */}
        <div className="mb-4 p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 flex items-start justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">
                  {isSupabaseConfigured ? 'Supabase Auth Connected' : 'Demo Sandbox Mode'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/30 font-semibold text-cyan-300">
                  {isSupabaseConfigured ? 'Live Backend' : 'UI Prototype'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {isSupabaseConfigured
                  ? 'Connected to live Supabase backend authentication.'
                  : 'Pre-configured for Supabase Auth integration with live client ready.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickFillDemo}
            className="px-2.5 py-1 rounded-lg bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/40 text-[10.5px] font-bold text-cyan-300 whitespace-nowrap transition-all cursor-pointer"
          >
            Fill Demo
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-[#0b0e22] border border-white/[0.08] rounded-3xl p-7 sm:p-8 shadow-2xl purple-glow">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="walker@walkx.app"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                    errors.email
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-white/10 focus:border-purple-500'
                  }`}
                />
              </div>
              {errors.email && (
                <span className="text-[11px] text-rose-400 font-medium block mt-1">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl bg-white/[0.04] border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                    errors.password
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-white/10 focus:border-purple-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[11px] text-rose-400 font-medium block mt-1">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-purple-600 focus:ring-0 cursor-pointer"
                />
                <span>Remember this device</span>
              </label>
              <span className="text-[11px] text-slate-500">256-bit TLS Encrypted</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl gradient-btn font-extrabold text-sm flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to WalkX</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Social / Fast Track Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative px-3 bg-[#0b0e22] text-[11px] text-slate-500 font-semibold uppercase">
              Or Fast Track With
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                onLoginSuccess('Priya Sharma', 'priya.sharma@gmail.com');
                onNavigate('dashboard');
              }}
              className="py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Google Account</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onLoginSuccess('Karthik Raja', 'karthik.raja@icloud.com');
                onNavigate('dashboard');
              }}
              className="py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Apple ID</span>
            </button>
          </div>

          {/* Portal Switchers & Registration Link */}
          <div className="pt-6 mt-6 border-t border-white/10 text-center space-y-2.5">
            <p className="text-xs text-slate-400">
              Don't have a WalkX account yet?{' '}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="text-cyan-400 font-bold hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => onNavigate('admin-login')}
                className="text-[11.5px] font-bold text-purple-400 hover:text-purple-300 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Shield size={12} />
                <span>Separate Staff / Admin Console Portal →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
