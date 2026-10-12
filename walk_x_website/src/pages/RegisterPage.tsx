import React, { useState } from 'react';
import { PageId } from '../types';
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Info
} from 'lucide-react';
import { registerUser, isSupabaseConfigured } from '../services/supabaseAuth';

interface RegisterPageProps {
  onNavigate: (page: PageId) => void;
  onRegisterSuccess: (name: string, email: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Validation & Loading state
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
      agreeTerms?: string;
    } = {};

    const cleanName = name.trim();
    if (!cleanName) {
      newErrors.name = 'Full legal name is required.';
    } else if (cleanName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Mobile number is required for UPI disbursements.';
    } else if (!/^(\+91)?[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number (e.g. 9876543210).';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password.';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Conditions and Privacy Policy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuickFillDemo = () => {
    setName('Priya Sharma');
    setEmail(`priya.${Math.floor(100 + Math.random() * 900)}@walkx.app`);
    setPhone('9876543210');
    setPassword('WalkXSecure2026!');
    setConfirmPassword('WalkXSecure2026!');
    setAgreeTerms(true);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage(null);

    try {
      const res = await registerUser(email, password, name, phone);

      if (!res.success) {
        setErrors({ general: res.error || 'Registration failed. Please review your details.' });
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Account created successfully! Launching your WalkX experience...');

      setTimeout(() => {
        onRegisterSuccess(name.trim(), email.trim());
        onNavigate('dashboard');
      }, 700);
    } catch (err: any) {
      setErrors({ general: err.message || 'An unexpected error occurred during signup.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-lg">
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
            Join the Movement ⚡
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
                  {isSupabaseConfigured ? 'Supabase Auth Ready' : 'Demo Sandbox Registration'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/30 font-semibold text-cyan-300">
                  Instant Setup
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Full client-side and Supabase-ready user creation with live dashboard redirection.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickFillDemo}
            className="px-2.5 py-1 rounded-lg bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/40 text-[10.5px] font-bold text-cyan-300 whitespace-nowrap transition-all cursor-pointer"
          >
            Auto Fill
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
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="e.g. Priya Sharma"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                    errors.name ? 'border-rose-500 focus:border-rose-400' : 'border-white/10 focus:border-purple-500'
                  }`}
                />
              </div>
              {errors.name && (
                <span className="text-[11px] text-rose-400 font-medium block mt-1">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email and Mobile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    placeholder="name@example.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                      errors.email ? 'border-rose-500 focus:border-rose-400' : 'border-white/10 focus:border-purple-500'
                    }`}
                  />
                </div>
                {errors.email && (
                  <span className="text-[11px] text-rose-400 font-medium block mt-1">
                    {errors.email}
                  </span>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Mobile Number (for UPI)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="9876543210"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                      errors.phone ? 'border-rose-500 focus:border-rose-400' : 'border-white/10 focus:border-purple-500'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <span className="text-[11px] text-rose-400 font-medium block mt-1">
                    {errors.phone}
                  </span>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Minimum 8 characters"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl bg-white/[0.04] border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                    errors.password ? 'border-rose-500 focus:border-rose-400' : 'border-white/10 focus:border-purple-500'
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

            {/* Confirm Password Field */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  placeholder="Repeat your password"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl bg-white/[0.04] border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                    errors.confirmPassword
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-white/10 focus:border-purple-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-[11px] text-rose-400 font-medium block mt-1">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Terms and conditions checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: undefined }));
                  }}
                  className="mt-0.5 rounded border-slate-700 text-purple-600 focus:ring-0 cursor-pointer"
                />
                <span className="leading-relaxed">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('terms')}
                    className="text-cyan-400 font-bold hover:underline cursor-pointer"
                  >
                    Terms & Conditions
                  </button>{' '}
                  and acknowledge the{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('privacy')}
                    className="text-cyan-400 font-bold hover:underline cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>
              {errors.agreeTerms && (
                <span className="text-[11px] text-rose-400 font-medium block mt-1">
                  {errors.agreeTerms}
                </span>
              )}
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
                  <span>Creating Walker Profile...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Start Earning</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Social Sign up */}
          <div className="pt-6 mt-6 border-t border-white/10 text-center space-y-2">
            <p className="text-xs text-slate-400">
              Already have an active WalkX account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-cyan-400 font-bold hover:underline cursor-pointer"
              >
                Sign In Instead
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
