import React, { useState } from 'react';
import { PageId } from '../types';
import {
  Menu,
  X,
  Smartphone,
  Shield,
  Heart,
  Gift,
  Wallet,
  Activity,
  ArrowRight,
  Database,
  User,
  Users,
  Compass,
  Trophy,
  Zap
} from 'lucide-react';
import { isSupabaseConfigured } from '../services/supabaseClient';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isAdmin: boolean;
  onToggleAdmin: (adminState: boolean) => void;
  userName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isAdmin,
  onToggleAdmin,
  userName
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const navLinks: { label: string; page: PageId; icon?: any }[] = [
    { label: 'Overview', page: 'landing' },
    { label: 'Dashboard', page: 'dashboard', icon: Smartphone },
    { label: 'Feed', page: 'feed', icon: Users },
    { label: 'Places', page: 'places', icon: Compass },
    { label: 'Leaderboard', page: 'leaderboards', icon: Trophy },
    { label: 'Challenges', page: 'challenges', icon: Zap },
    { label: 'Activity', page: 'activity', icon: Activity },
    { label: 'Rewards', page: 'rewards', icon: Gift },
    { label: 'Causes', page: 'donation', icon: Heart },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#060913]/90 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNav('landing')}
          >
            <div className="relative">
              <img
                src="/logo.png"
                alt="WalkX Logo"
                className="w-11 h-11 rounded-2xl object-cover shadow-[0_0_20px_rgba(168,85,247,0.35)] border border-white/10 group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#060913]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-['Outfit'] font-black text-2xl tracking-tight gradient-logo-text">
                  WalkX
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-cyan-300 border border-purple-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400 font-medium tracking-wide hidden sm:block">
                Walk More. Earn More. Give More.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNav(link.page)}
                  className={`px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-purple-600/20 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {link.icon && <link.icon size={14} className={active ? 'text-cyan-400' : 'text-slate-400'} />}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Cluster: Portal Toggle & Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Backend Connectivity Status Pill */}
            <div
              title={
                isSupabaseConfigured
                  ? 'Connected to live Supabase Auth and PostgreSQL Database'
                  : 'Running in Interactive Demo Sandbox. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect.'
              }
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-slate-900/60 border-slate-800"
            >
              <Database size={11} className={isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'} />
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className={isSupabaseConfigured ? 'text-emerald-300' : 'text-amber-300'}>
                {isSupabaseConfigured ? 'Supabase Live' : 'Demo Sandbox'}
              </span>
            </div>

            {/* User vs Admin Role Toggle Button */}
            <button
              onClick={() => {
                const nextState = !isAdmin;
                onToggleAdmin(nextState);
                onNavigate(nextState ? 'admin-dashboard' : 'dashboard');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                isAdmin
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  : 'bg-slate-900 text-slate-300 border-white/10 hover:border-purple-500/30 hover:text-white'
              }`}
            >
              <Shield size={13} className={isAdmin ? 'text-cyan-300' : 'text-purple-400'} />
              <span>{isAdmin ? 'Admin Console Active' : 'Switch to Admin'}</span>
            </button>

            {/* User Profile Avatar / Quick Nav */}
            <div
              onClick={() => handleNav(isAdmin ? 'admin-reports' : 'profile')}
              className="flex items-center gap-2.5 pl-2 py-1 pr-1 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-500/40 cursor-pointer transition-all"
            >
              <div className="text-right">
                <span className="text-xs font-bold text-white block leading-tight">
                  {isAdmin ? 'System Admin' : userName}
                </span>
                <span className="text-[10px] text-cyan-400 font-semibold leading-tight block">
                  {isAdmin ? 'Full Root Access' : 'WalkX Elite'}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-[#0c1020] rounded-[10px] flex items-center justify-center font-black text-xs text-white">
                  {isAdmin ? 'AD' : userName.slice(0, 2).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Quick CTA */}
            {currentPage === 'landing' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => {
                const nextState = !isAdmin;
                onToggleAdmin(nextState);
                onNavigate(nextState ? 'admin-dashboard' : 'dashboard');
              }}
              className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-cyan-400 text-xs font-bold flex items-center gap-1"
            >
              <Shield size={14} />
              <span>{isAdmin ? 'Admin' : 'User'}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090d1c] border-b border-white/10 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-3 pt-2">
            WalkX Platform Pages
          </div>
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => handleNav(link.page)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
                currentPage === link.page
                  ? 'bg-purple-600/20 text-white border border-purple-500/30'
                  : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              {link.icon && <link.icon size={16} className="text-purple-400" />}
              <span>{link.label}</span>
            </button>
          ))}

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => handleNav('profile')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 text-slate-300 hover:bg-white/[0.05]"
            >
              <User size={16} className="text-cyan-400" />
              <span>User Profile & Settings</span>
            </button>

            <button
              onClick={() => handleNav(isAdmin ? 'admin-dashboard' : 'admin-login')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 text-cyan-300 bg-cyan-950/40 border border-cyan-800/40"
            >
              <Shield size={16} />
              <span>{isAdmin ? 'Admin Dashboard' : 'Admin Login Portal'}</span>
            </button>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleNav('login')}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-white/[0.05] border border-white/10 text-white text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('register')}
                className="flex-1 py-2 text-xs font-bold rounded-xl gradient-btn text-white text-center"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
