import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Bell,
  Save,
  CheckCircle2,
  Sparkles,
  CreditCard,
  LogOut,
  MapPin,
  Globe,
  Lock,
  AtSign,
  Camera,
  Image
} from 'lucide-react';
import { UserProfile } from '../types';
import { socialService } from '../services/socialService';

interface ProfileSettingsPageProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
}

const AVATAR_PRESETS = [
  {
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    label: 'Priya (Athletic)'
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    label: 'Arjun (Explorer)'
  },
  {
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    label: 'Ananya (Doctor)'
  },
  {
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    label: 'Rohan (Hiker)'
  },
  {
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    label: 'Rajesh (Veteran)'
  }
];

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({
  user,
  onUpdateUser,
  onLogout,
}) => {
  const [formData, setFormData] = useState({
    name: user.name || 'Priya Sharma',
    email: user.email || 'priya.sharma@example.com',
    phone: user.phone || '+91 98765 43210',
    username: user.username || 'priya_walker',
    bio: user.bio || 'Daily 10k morning walker & charity stride contributor. Exploring scenic trails across India 👟🌿',
    city: user.city || 'Mumbai, India',
    avatarUrl: user.avatarUrl || AVATAR_PRESETS[0].url,
    isPrivate: user.isPrivate ?? false,
    dailyGoal: user.dailyGoal || 10000,
    upiId: 'priya.sharma@okhdfcbank',
  });

  const [notifications, setNotifications] = useState({
    dailyMilestone: true,
    streakReminders: true,
    weeklyReport: false,
    payoutAlerts: true,
  });

  const [sensorSync, setSensorSync] = useState({
    accelerometer: true,
    healthConnect: true,
    backgroundTracking: false,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPayload: Partial<UserProfile> = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      username: formData.username.trim().replace(/^@/, ''),
      bio: formData.bio.trim(),
      city: formData.city.trim(),
      avatarUrl: formData.avatarUrl.trim(),
      isPrivate: formData.isPrivate,
      dailyGoal: Number(formData.dailyGoal),
    };

    onUpdateUser(updatedPayload);

    // Sync with social service
    await socialService.updateCurrentUserProfile({
      name: updatedPayload.name,
      username: updatedPayload.username,
      bio: updatedPayload.bio,
      city: updatedPayload.city,
      avatar: updatedPayload.avatarUrl,
      isPrivate: updatedPayload.isPrivate
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Account Management
          </span>
          <span className="text-xs text-slate-400">Settings & Biometric Preferences</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">User Profile & Preferences</h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize your public identity, walker bio, account privacy settings, and daily stride quotas.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="rounded-3xl bg-gradient-to-r from-[#121835] via-[#0f142a] to-[#0a0d1e] border border-purple-500/25 p-6 md:p-8 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <img
            src={formData.avatarUrl || AVATAR_PRESETS[0].url}
            alt={formData.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-purple-500/40 shadow-xl bg-slate-800"
          />
          <span
            className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-[#0c1020] flex items-center justify-center text-[10px] ${
              formData.isPrivate ? 'bg-amber-500 text-slate-900' : 'bg-emerald-500 text-slate-900'
            }`}
            title={formData.isPrivate ? 'Private Profile' : 'Public Profile'}
          >
            {formData.isPrivate ? '🔒' : '✓'}
          </span>
        </div>

        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-bold text-white">{formData.name}</h2>
            <span className="text-xs font-semibold text-cyan-300">
              @{formData.username.replace(/^@/, '')}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              {user.memberTier}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {formData.email} · Member since {user.joinDate}
          </p>
          {formData.bio && (
            <p className="text-xs text-slate-300 italic max-w-xl line-clamp-2">
              "{formData.bio}"
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs">
            <span className="text-slate-300">
              <strong className="text-white font-bold">{user.stepsToday.toLocaleString()}</strong> steps today
            </span>
            <span className="text-slate-300">
              <strong className="text-purple-400 font-bold">{user.totalPoints.toLocaleString()}</strong> WalkX points
            </span>
            <span className="text-slate-300">
              <strong className="text-amber-400 font-bold">{user.streakDays}</strong> days streak 🔥
            </span>
            {formData.city && (
              <span className="text-slate-400 flex items-center gap-1">
                <MapPin size={12} className="text-rose-400" />
                {formData.city}
              </span>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Public Profile & Identity Information */}
        <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-purple-400" />
            Social Profile & Walker Identity
          </h3>

          {/* Profile Photo Presets & Custom URL */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Choose Profile Photo Preset or Custom URL
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {AVATAR_PRESETS.map((preset) => {
                const active = formData.avatarUrl === preset.url;
                return (
                  <div
                    key={preset.label}
                    onClick={() => setFormData({ ...formData, avatarUrl: preset.url })}
                    className={`cursor-pointer group flex items-center gap-2 p-1.5 pr-3 rounded-2xl border transition-all ${
                      active
                        ? 'bg-[#4B4DFF]/20 border-[#4B4DFF] shadow-[0_0_12px_rgba(75,77,255,0.3)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <span className="text-xs font-semibold text-slate-200">{preset.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="relative pt-1">
              <Image className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="Or paste custom photo URL (https://...)"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username Handle</label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                  placeholder="username_handle"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Walker Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                placeholder="Share your walking motivation, favourite routes, or fitness philosophy..."
                className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Maximum 250 characters.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">City (Optional)</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Mumbai, India or Bengaluru"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Profile Privacy</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isPrivate: false })}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    !formData.isPrivate
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Globe size={15} className="text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold block">Public Profile</span>
                    <span className="text-[10px] text-slate-400">Open to all walkers</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isPrivate: true })}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    formData.isPrivate
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Lock size={15} className="text-amber-400" />
                  <div>
                    <span className="text-xs font-bold block">Private Profile</span>
                    <span className="text-[10px] text-slate-400">Followers only</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Personal & Contact Details */}
        <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            Contact & Settlement Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred UPI ID (VPA)</label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  placeholder="username@bank"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Daily Step Goal Target ({formData.dailyGoal.toLocaleString()} steps)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[5000, 8000, 10000, 12000].map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setFormData({ ...formData, dailyGoal: goal })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      formData.dailyGoal === goal
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {(goal / 1000).toFixed(0)}k steps
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Notification Preferences */}
        <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" />
            Stride Notifications & Community Alerts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.dailyMilestone}
                onChange={(e) => setNotifications({ ...notifications, dailyMilestone: e.target.checked })}
                className="w-4 h-4 rounded text-purple-600"
              />
              <span className="text-xs text-slate-300">Daily Step Goal & Milestone Alerts</span>
            </label>
            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.streakReminders}
                onChange={(e) => setNotifications({ ...notifications, streakReminders: e.target.checked })}
                className="w-4 h-4 rounded text-purple-600"
              />
              <span className="text-xs text-slate-300">Streak Saver & Evening Reminders</span>
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="gradient-btn px-6 py-3 rounded-2xl font-bold text-sm text-white flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              <Save size={16} />
              <span>Save Profile Preferences</span>
            </button>
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 size={16} />
                Profile preferences updated!
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </form>
    </div>
  );
};
