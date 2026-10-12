import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Smartphone,
  Bell,
  Save,
  CheckCircle2,
  Sparkles,
  CreditCard,
  LogOut
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileSettingsPageProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
}

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({
  user,
  onUpdateUser,
  onLogout,
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    dailyGoal: user.dailyGoal,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dailyGoal: Number(formData.dailyGoal),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
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
          Customize your daily stride quotas, withdrawal UPI VPAs, and connected sensor authorizations.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="rounded-3xl bg-gradient-to-r from-[#121835] via-[#0f142a] to-[#0a0d1e] border border-purple-500/25 p-6 md:p-8 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 p-1 shadow-xl">
            <div className="w-full h-full rounded-full bg-[#0c1020] flex items-center justify-center text-3xl font-bold text-white uppercase">
              {user.name.slice(0, 2)}
            </div>
          </div>
          <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0c1020]" />
        </div>

        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              {user.memberTier}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {user.email} · Member since {user.joinDate}
          </p>
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
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details Form */}
        <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            Personal & Settlement Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

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

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Daily Step Goal Target ({formData.dailyGoal.toLocaleString()} steps)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[6000, 8000, 10000, 12000, 15000].map((goal) => (
                  <button
                    type="button"
                    key={goal}
                    onClick={() => setFormData({ ...formData, dailyGoal: goal })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      formData.dailyGoal === goal
                        ? 'bg-purple-600/30 border-purple-500 text-purple-200 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {goal.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hardware & Sensor Permissions */}
        <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-400" />
            Hardware & Biometric Sensors
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <div className="text-sm font-semibold text-white">Browser Motion Accelerometer</div>
                <div className="text-xs text-slate-400">Access DeviceMotionEvent for continuous pedometer tracking</div>
              </div>
              <input
                type="checkbox"
                checked={sensorSync.accelerometer}
                onChange={(e) => setSensorSync({ ...sensorSync, accelerometer: e.target.checked })}
                className="w-5 h-5 accent-purple-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <div className="text-sm font-semibold text-white">Health Connect / OS Sync</div>
                <div className="text-xs text-slate-400">Sync with Google Fit, Apple Health, or Samsung Health APIs</div>
              </div>
              <input
                type="checkbox"
                checked={sensorSync.healthConnect}
                onChange={(e) => setSensorSync({ ...sensorSync, healthConnect: e.target.checked })}
                className="w-5 h-5 accent-purple-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <div className="text-sm font-semibold text-white">Low-Power Background Counting</div>
                <div className="text-xs text-slate-400">Permit web worker cadence sampling while screen is locked</div>
              </div>
              <input
                type="checkbox"
                checked={sensorSync.backgroundTracking}
                onChange={(e) => setSensorSync({ ...sensorSync, backgroundTracking: e.target.checked })}
                className="w-5 h-5 accent-purple-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Alert Preferences */}
        <div className="rounded-2xl bg-[#0c1022]/90 border border-slate-800/80 p-6 md:p-8 shadow-xl space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            Notification Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.dailyMilestone}
                onChange={(e) => setNotifications({ ...notifications, dailyMilestone: e.target.checked })}
                className="mt-1 w-4 h-4 accent-purple-600"
              />
              <div className="text-xs">
                <span className="font-semibold text-white block">Daily Step Milestone Alerts</span>
                <span className="text-slate-400">Get notified when you hit 50%, 75%, and 100% of your daily goal.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.payoutAlerts}
                onChange={(e) => setNotifications({ ...notifications, payoutAlerts: e.target.checked })}
                className="mt-1 w-4 h-4 accent-purple-600"
              />
              <div className="text-xs">
                <span className="font-semibold text-white block">Instant UPI Payout Confirmations</span>
                <span className="text-slate-400">Immediate SMS and web alert upon successful bank transfer.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.streakReminders}
                onChange={(e) => setNotifications({ ...notifications, streakReminders: e.target.checked })}
                className="mt-1 w-4 h-4 accent-purple-600"
              />
              <div className="text-xs">
                <span className="font-semibold text-white block">Streak Freeze Reminders</span>
                <span className="text-slate-400">Alert at 8:00 PM if daily streak is at risk of resetting.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.weeklyReport}
                onChange={(e) => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
                className="mt-1 w-4 h-4 accent-purple-600"
              />
              <div className="text-xs">
                <span className="font-semibold text-white block">Social Impact Digest</span>
                <span className="text-slate-400">Weekly email with non-profit disbursement receipts.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Bar & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#0c1022] border border-purple-500/20">
          <div className="flex items-center gap-2">
            {savedSuccess ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Settings saved successfully!
              </span>
            ) : (
              <span className="text-xs text-slate-400">Unsaved changes will be applied instantly upon saving.</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onLogout}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-red-500/10 hover:text-red-400 border border-slate-700 text-slate-300 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              Save Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
