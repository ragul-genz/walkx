import React, { useState } from 'react';
import { PageId } from '../types';
import {
  ArrowRight,
  Sparkles,
  Footprints,
  Coins,
  Heart,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  HeartPulse,
  Flame,
  Zap,
  Brain,
  Gift,
  Lock,
  ChevronDown,
  ChevronUp,
  Layers,
  Award,
  HelpCircle,
  Activity,
  HandHeart
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: PageId) => void;
  onOpenStepModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenStepModal }) => {
  // Interactive Step Value Estimator State
  const [calcSteps, setCalcSteps] = useState(8000);

  // FAQ Accordion State (first item open by default)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Mathematical telemetry calculations (1,000 steps = 10 pts = 1 INR)
  const calculatedPoints = Math.floor(calcSteps / 1000) * 10;
  const calculatedInr = (calcSteps / 1000).toFixed(1);
  const calculatedCalories = Math.floor(calcSteps * 0.044);
  const calculatedKm = (calcSteps * 0.00075).toFixed(2);
  const calculatedMinutes = Math.round(calcSteps / 115);

  const faqs = [
    {
      q: 'How does WalkX track my steps without draining my battery?',
      a: 'WalkX connects directly to the low-power step sensor hardware embedded in your smartphone or interfaces securely with Apple Health and Android Health Connect. It uses under 1% battery per day and operates entirely without power-hungry GPS tracking.'
    },
    {
      q: 'What is the exact conversion rate between steps, points, and money?',
      a: 'Every 1,000 verified human steps converts into WalkX Points, with a fixed business rule: 1,000 WalkX Points = ₹11 indicative reward equivalent. You can withdraw accumulated balance directly to your bank account via UPI or redeem for brand vouchers.'
    },
    {
      q: 'Do I need an expensive smartwatch or fitness tracker?',
      a: 'No smartwatch or fitness band is required. WalkX runs seamlessly using the built-in accelerometer already inside your everyday smartphone. If you do own an Apple Watch, WearOS device, or Garmin, you can optionally sync your data.'
    },
    {
      q: 'How do UPI cash withdrawals work?',
      a: 'Once your balance reaches just 1,000 points (₹11), you can enter any valid Indian UPI ID (such as name@okhdfcbank, name@paytm, or name@ybl) in your Points Wallet. Funds disburse through secure payment rails directly into your bank account.'
    },
    {
      q: 'How does the "Walk for a Cause" donation program work?',
      a: 'When you donate WalkX Points to a verified charitable partner, WalkX converts those points into real monetary funds and transfers 100% of the funds directly to the partner organization. A verifiable digital Section 80G tax receipt is generated for your records.'
    },
    {
      q: 'How does WalkX prevent cheating and artificial step shaking?',
      a: 'Our telemetry verification engine uses multi-axis frequency analysis and velocity thresholding to identify and filter out vehicle travel, bike rides, and mechanical oscillating phone shakers. Only authentic biological human movement is credited.'
    },
    {
      q: 'Are there any membership fees, subscriptions, or paywalls?',
      a: 'WalkX is 100% free to sign up, walk, earn, and donate. We do not charge subscription fees or require in-app purchases to unlock your earnings.'
    }
  ];

  return (
    <div className="space-y-32">
      {/* ==================================================== */}
      {/* 1. HERO SECTION */}
      {/* ==================================================== */}
      <section className="relative pt-8 pb-16 overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-cyan-600/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-bold mb-8 purple-glow">
            <Sparkles size={14} className="text-cyan-400" />
            <span className="tracking-wide">Health • Rewards • Social Impact</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Live Platform</span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-['Outfit'] font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight max-w-5xl mx-auto leading-[1.05] mb-6 text-white">
            Every Step Has Value.
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Walk towards a healthier life. Earn rewards. Make a difference.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
            <button
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl gradient-btn font-extrabold text-base flex items-center justify-center gap-2 group shadow-xl cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/15 font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Login</span>
            </button>
            <button
              onClick={onOpenStepModal}
              className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Footprints size={15} className="text-cyan-400" />
              <span>Simulate Steps</span>
            </button>
          </div>

          {/* Core Transparent Value Pillars (Verified Rules, No Fake Claims) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Coins size={20} />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Fixed Rate</span>
                <span className="text-sm font-bold text-white">1,000 Steps = 10 Pts</span>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Wallet size={20} />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Instant Payout</span>
                <span className="text-sm font-bold text-white">Direct UPI Transfer</span>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                <Heart size={20} />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">100% Pass-Through</span>
                <span className="text-sm font-bold text-white">Vetted Non-Profit Causes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. INTERACTIVE STRIDE VALUE ESTIMATOR */}
      {/* ==================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#121833] via-[#0b0e22] to-[#070914] border border-purple-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl purple-glow">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
              Interactive Stride Value Estimator
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
              Calculate Your Daily Walking Value
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Drag the slider to preview how your daily steps convert into physical health metrics and tangible rewards.
            </p>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            {/* Step Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-slate-300">Daily Step Count</span>
                <span className="text-2xl font-black text-cyan-400 font-['Outfit']">
                  {calcSteps.toLocaleString('en-IN')} steps
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={calcSteps}
                onChange={(e) => setCalcSteps(parseInt(e.target.value, 10))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-semibold">
                <span>1,000 steps (Light Walk)</span>
                <span>8,000 steps (Recommended)</span>
                <span>25,000 steps (High Activity)</span>
              </div>
            </div>

            {/* Calculations Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center">
                <span className="text-xs text-slate-400 block font-medium">WalkX Points</span>
                <span className="text-2xl font-black text-purple-400 font-['Outfit']">+{calculatedPoints}</span>
                <span className="text-[10px] text-slate-500 block">Daily reward</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center">
                <span className="text-xs text-slate-400 block font-medium">UPI Cash Value</span>
                <span className="text-2xl font-black text-emerald-400 font-['Outfit']">₹{calculatedInr}</span>
                <span className="text-[10px] text-slate-500 block">Directly withdrawable</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center">
                <span className="text-xs text-slate-400 block font-medium">Distance Covered</span>
                <span className="text-2xl font-black text-cyan-400 font-['Outfit']">{calculatedKm} km</span>
                <span className="text-[10px] text-slate-500 block">Approx. {calculatedMinutes} mins</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center">
                <span className="text-xs text-slate-400 block font-medium">Energy Burned</span>
                <span className="text-2xl font-black text-pink-400 font-['Outfit']">{calculatedCalories} kcal</span>
                <span className="text-[10px] text-slate-500 block">Active NEAT energy</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => onNavigate('register')}
                className="gradient-btn px-7 py-3.5 rounded-xl font-bold text-sm inline-flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Start Earning My Steps</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 font-bold text-sm inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Explore Live Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. HOW WALKX WORKS SECTION */}
      {/* ==================================================== */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold mb-3">
            <Footprints size={13} />
            <span>Frictionless Mechanics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            How WalkX Works
          </h2>
          <p className="text-base text-slate-400 mt-3 leading-relaxed">
            No expensive hardware gadgets or monthly subscriptions. Walk naturally throughout your day and watch your steps translate into real value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="glass-panel p-7 rounded-3xl border border-white/[0.08] relative hover:border-purple-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 font-black flex items-center justify-center text-xl mb-5 group-hover:scale-105 transition-transform">
                1
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                Zero Wearables Needed
              </span>
              <h3 className="text-xl font-bold text-white mb-2.5">Move & Sync Steps</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Keep your phone in your pocket. WalkX reads your natural strides from your device sensor, Apple Health, or Google Health Connect without draining GPS battery.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/[0.06] text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Native low-power pedometer</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-7 rounded-3xl border border-white/[0.08] relative hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 font-black flex items-center justify-center text-xl mb-5 group-hover:scale-105 transition-transform">
                2
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                Transparent Conversion
              </span>
              <h3 className="text-xl font-bold text-white mb-2.5">Mint WalkX Points</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every 1,000 verified steps automatically mints 10 WalkX Points in your wallet. Maintain daily walking streaks to unlock milestone bonus multipliers.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/[0.06] text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Coins size={13} className="text-cyan-400" />
              <span>1,000 Steps = 10 Points</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-7 rounded-3xl border border-white/[0.08] relative hover:border-emerald-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-xl mb-5 group-hover:scale-105 transition-transform">
                3
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Real Currency
              </span>
              <h3 className="text-xl font-bold text-white mb-2.5">Instant UPI Payout</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Withdraw your accumulated balance directly into Indian Rupees to any UPI ID (GPay, PhonePe, Paytm, BHIM) starting at a low minimum threshold of just ₹11 (1,000 points).
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/[0.06] text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Wallet size={13} className="text-emerald-400" />
              <span>Direct Bank Settlement</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="glass-panel p-7 rounded-3xl border border-white/[0.08] relative hover:border-pink-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 font-black flex items-center justify-center text-xl mb-5 group-hover:scale-105 transition-transform">
                4
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-400 block mb-1">
                Verified Philanthropy
              </span>
              <h3 className="text-xl font-bold text-white mb-2.5">Walk for a Cause</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pledge your points to vetted charity foundations sponsoring children's education, elderly nutrition, and healthcare. Receive official Section 80G digital receipts.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/[0.06] text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Heart size={13} className="text-pink-400" />
              <span>100% Non-Profit Remittance</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4. WALKING AND HEALTH BENEFITS SECTION */}
      {/* ==================================================== */}
      <section id="health-benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold mb-3">
            <HeartPulse size={13} />
            <span>Biometric Evidence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            Walking & Health Benefits
          </h2>
          <p className="text-base text-slate-400 mt-3 leading-relaxed">
            Walking is humanity's most sustainable, low-impact exercise. Consistent daily steps deliver profound physiological and psychological improvements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-[#0c1022] border border-white/[0.08] hover:border-purple-500/30 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400">
              <HeartPulse size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Cardiovascular Longevity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Brisk pedestrian walking stimulates oxygen circulation, enhances myocardial stroke efficiency, and supports long-term blood pressure regulation without overtaxing joints.
            </p>
            <div className="pt-2 text-[11px] text-purple-300 font-semibold flex items-center gap-1">
              <span>Optimizes resting heart rate</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-[#0c1022] border border-white/[0.08] hover:border-pink-500/30 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/25 flex items-center justify-center text-pink-400">
              <Flame size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Metabolic NEAT Energy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Walking elevates Non-Exercise Activity Thermogenesis (NEAT), accelerating post-meal glucose uptake into muscles and sustaining steady caloric expenditure throughout the day.
            </p>
            <div className="pt-2 text-[11px] text-pink-300 font-semibold flex items-center gap-1">
              <span>Stabilizes glycemic spikes</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-[#0c1022] border border-white/[0.08] hover:border-cyan-500/30 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Joint & Bone Preservation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlike high-impact running on asphalt, walking generates gentle compressive loading that pumps synovial fluid across knee and hip cartilage while strengthening stabilizing postural muscles.
            </p>
            <div className="pt-2 text-[11px] text-cyan-300 font-semibold flex items-center gap-1">
              <span>Zero high-impact knee shock</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-3xl bg-[#0c1022] border border-white/[0.08] hover:border-emerald-500/30 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <Brain size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Mental Clarity & Sleep</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Daily outdoor steps naturally reset circadian rhythms, stimulate endorphin and serotonin synthesis, and significantly reduce elevated cortisol from sedentary desk hours.
            </p>
            <div className="pt-2 text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
              <span>Mitigates workplace stress</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('activity')}
            className="px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            <Activity size={14} className="text-cyan-400" />
            <span>Explore Cadence & Activity Tracker</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 5. HOW POINTS AND REWARDS SYSTEM WORKS SECTION */}
      {/* ==================================================== */}
      <section id="rewards-system" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#10142b] via-[#090d1f] to-[#050814] border border-purple-500/30 rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold mb-3">
                <Coins size={13} />
                <span>Transparent Economics</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                How the Points & Rewards System Works
              </h2>
              <p className="text-base text-slate-400 mt-3 leading-relaxed">
                Clear conversion formulas, direct UPI settlement, and complete freedom over how you use your earned rewards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                  1:1
                </div>
                <h4 className="text-lg font-bold text-white">Predictable Math</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fixed rule: 1,000 WalkX Points = ₹11 indicative reward equivalent. No fluctuating cryptocurrency tokens, confusing conversion algorithms, or hidden devaluation.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                  ₹11
                </div>
                <h4 className="text-lg font-bold text-white">Low ₹11 Minimum Payout</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Withdraw to your bank account starting from just ₹11 (1,000 points). We never trap your earnings behind unreachable withdrawal thresholds.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                  <Gift size={20} />
                </div>
                <h4 className="text-lg font-bold text-white">Curated Fitness Rewards</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Optionally exchange points for activewear vouchers, athletic shoes, organic health nutrition, and fitness trials from leading brands.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="text-lg font-bold text-white">Fair Play Protection</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time cadence filtering checks step velocity and cadence regularity to block vehicles and artificial phone shakers, safeguarding honest walkers.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
              <button
                onClick={() => onNavigate('rewards')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl gradient-btn font-bold text-xs inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Gift size={15} />
                <span>Browse Rewards Storefront</span>
              </button>
              <button
                onClick={() => onNavigate('wallet')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/15 font-bold text-xs inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Wallet size={15} className="text-emerald-400" />
                <span>View Points Wallet & UPI Payouts</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 6. WALK FOR A CAUSE DONATION SECTION */}
      {/* ==================================================== */}
      <section id="walk-for-cause" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold mb-3">
            <Heart size={13} />
            <span>Social Impact Pillar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            Walk for a Cause
          </h2>
          <p className="text-base text-slate-400 mt-3 leading-relaxed">
            Channel your daily energy into direct social change. Donate points or monetary contributions to verified, audited charity foundations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cause 1 */}
          <div className="p-6 rounded-3xl bg-[#0c1022] border border-white/[0.08] hover:border-pink-500/30 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-2xl mb-4">
                📚
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300">
                Education
              </span>
              <h3 className="text-lg font-bold text-white mt-2">Childhood Education Kits</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Funds notebooks, pencils, school uniforms, and digital literacy tablets for underprivileged children in rural government schools.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] text-[11px] text-slate-300 flex items-center justify-between">
              <span>Partner: Vidyalaya Trust</span>
              <span className="font-bold text-purple-400">80G Certified</span>
            </div>
          </div>

          {/* Cause 2 */}
          <div className="p-6 rounded-3xl bg-[#0c1022] border border-white/[0.08] hover:border-pink-500/30 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/25 flex items-center justify-center text-2xl mb-4">
                🍲
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-pink-500/20 text-pink-300">
                Nutrition
              </span>
              <h3 className="text-lg font-bold text-white mt-2">Elderly Daily Meals</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Provides warm, nutritious, hygienic daily meals and regular basic wellness checkups for destitute seniors living without family support.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] text-[11px] text-slate-300 flex items-center justify-between">
              <span>Partner: Annapoorna Seva</span>
              <span className="font-bold text-pink-400">80G Certified</span>
            </div>
          </div>

          {/* Cause 3 */}
          <div className="p-6 rounded-3xl bg-[#0c1022] border border-white/[0.08] hover:border-pink-500/30 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-2xl mb-4">
                💧
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300">
                Clean Water
              </span>
              <h3 className="text-lg font-bold text-white mt-2">Rural Water Filtration</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Sponsors community solar-powered reverse osmosis filtration units, eliminating waterborne illnesses across remote villages.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] text-[11px] text-slate-300 flex items-center justify-between">
              <span>Partner: Jal Jeevan Mission</span>
              <span className="font-bold text-cyan-400">80G Certified</span>
            </div>
          </div>

          {/* Cause 4 */}
          <div className="p-6 rounded-3xl bg-[#0c1022] border border-white/[0.08] hover:border-pink-500/30 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-2xl mb-4">
                🩺
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                Healthcare
              </span>
              <h3 className="text-lg font-bold text-white mt-2">Emergency Pediatric Care</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Subsidizes essential pediatric medication, physical rehabilitation therapies, and emergency surgeries for low-income families.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] text-[11px] text-slate-300 flex items-center justify-between">
              <span>Partner: Aarogya Foundation</span>
              <span className="font-bold text-emerald-400">80G Certified</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <button
            onClick={() => onNavigate('donation')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl gradient-btn font-bold text-xs inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <HandHeart size={15} />
            <span>Sponsor a Verified Cause Today</span>
          </button>
          <button
            onClick={() => onNavigate('donation-history')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 font-bold text-xs inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ShieldCheck size={15} className="text-cyan-400" />
            <span>Audit Public Donation Transparency Ledger</span>
          </button>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 7. USER BENEFITS AND FEATURE CARDS SECTION */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold mb-3">
            <Award size={13} />
            <span>Platform Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            User Benefits & Feature Suite
          </h2>
          <p className="text-base text-slate-400 mt-3 leading-relaxed">
            Engineered with strict ethical standards: respect for user privacy, zero hardware barriers, and instant payout capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="glass-panel p-8 rounded-3xl border border-white/[0.08] space-y-4 hover:border-purple-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Footprints size={22} />
            </div>
            <h3 className="text-xl font-bold text-white">Zero Wearable Dependency</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No need to buy a costly smartwatch or fitness band. WalkX uses native accelerometer coprocessors in modern smartphones with under 1% battery overhead.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel p-8 rounded-3xl border border-white/[0.08] space-y-4 hover:border-blue-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Lock size={22} />
            </div>
            <h3 className="text-xl font-bold text-white">No GPS Route Surveillance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We never track, store, or log your precise geographic coordinates. Only step frequency and accelerometer cadence are sampled to calculate your strides.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel p-8 rounded-3xl border border-white/[0.08] space-y-4 hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wallet size={22} />
            </div>
            <h3 className="text-xl font-bold text-white">Immediate UPI Settlement</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct transfer to any Indian UPI Virtual Payment Address (GPay, PhonePe, Paytm, BHIM) starting at just ₹11 (1,000 points). Zero multi-week waiting periods.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-panel p-8 rounded-3xl border border-white/[0.08] space-y-4 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Flame size={22} />
            </div>
            <h3 className="text-xl font-bold text-white">Habit Streak Multipliers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consistency builds lifelong health. Hitting your daily step goal consecutive days unlocks badge tiers that accelerate your rewards progression.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="glass-panel p-8 rounded-3xl border border-white/[0.08] space-y-4 hover:border-pink-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Layers size={22} />
            </div>
            <h3 className="text-xl font-bold text-white">Cryptographic Public Ledger</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every charity remittance and points redemption is recorded on an immutable ledger, giving you transparent verifiable records of your social impact.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="glass-panel p-8 rounded-3xl border border-white/[0.08] space-y-4 hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-xl font-bold text-white">100% Free Forever</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              WalkX has zero monthly subscriptions, zero hidden service fees, and zero paywalls. Walking is a fundamental human activity; earning rewards should be free.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 8. FREQUENTLY ASKED QUESTIONS (FAQ) SECTION */}
      {/* ==================================================== */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold mb-3">
            <HelpCircle size={13} />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Clear, honest answers about step tracking, rewards, payouts, and platform security.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? 'bg-[#0f142b] border-purple-500/40 shadow-lg'
                    : 'bg-[#0a0d1f]/80 border-white/[0.08] hover:border-white/15'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isOpen ? 'bg-purple-500/20 text-cyan-300' : 'bg-white/[0.04] text-slate-400'
                  }`}>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.06] pt-4 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 9. PRE-FOOTER CALL TO ACTION BANNER */}
      {/* ==================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="relative overflow-hidden rounded-3xl p-10 sm:p-14 bg-gradient-to-r from-purple-900/50 via-blue-900/40 to-[#0c1020] border border-purple-500/30 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-bold">
              <Sparkles size={13} />
              <span>Join the Movement</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Outfit']">
              Every Step Has Value.
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
              Walk towards a healthier life. Earn rewards. Make a difference.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('register')}
                className="px-8 py-4 rounded-xl gradient-btn font-extrabold text-sm cursor-pointer shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>Get Started</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="px-8 py-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/20 font-bold text-sm cursor-pointer transition-all"
              >
                <span>Login</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
