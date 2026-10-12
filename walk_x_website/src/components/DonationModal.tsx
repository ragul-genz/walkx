import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  Info,
  ArrowRight,
  X,
  Coins,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { CauseItem, UserProfile } from '../types';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cause: CauseItem | null;
  user: UserProfile;
  initialMode?: 'points' | 'monetary';
  onConfirmPointsDonation: (cause: CauseItem, points: number, inrValue: number) => void;
  onConfirmMonetaryPledge: (
    cause: CauseItem,
    inrAmount: number,
    donorName: string,
    donorEmail: string,
    paymentMethod: string
  ) => void;
  onNavigateHistory: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  cause,
  user,
  initialMode = 'points',
  onConfirmPointsDonation,
  onConfirmMonetaryPledge,
  onNavigateHistory
}) => {
  const [activeTab, setActiveTab] = useState<'points' | 'monetary'>(initialMode);

  // Points Contribution State
  const [pointsAmount, setPointsAmount] = useState<number>(1000);
  const [customPointsInput, setCustomPointsInput] = useState<string>('');
  const [pointsStep, setPointsStep] = useState<'select' | 'review' | 'success'>('select');
  const [pointsAgreed, setPointsAgreed] = useState<boolean>(true);
  const [lastPointsRef, setLastPointsRef] = useState<string>('');

  // Monetary Donation State (Prepared Integration)
  const [monetaryAmount, setMonetaryAmount] = useState<number>(250);
  const [customMonetaryInput, setCustomMonetaryInput] = useState<string>('');
  const [donorName, setDonorName] = useState<string>(user.name || '');
  const [donorEmail, setDonorEmail] = useState<string>(user.email || '');
  const [paymentChannel, setPaymentChannel] = useState<string>('Prepared UPI (Sandbox)');
  const [monetaryStep, setMonetaryStep] = useState<'select' | 'review' | 'success'>('select');
  const [lastMonetaryRef, setLastMonetaryRef] = useState<string>('');

  const prevOpenRef = useRef(isOpen);
  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setActiveTab(initialMode);
      setPointsStep('select');
      setMonetaryStep('select');
      setPointsAmount(1000);
      setMonetaryAmount(250);
      setDonorName(user.name || '');
      setDonorEmail(user.email || '');
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, initialMode, user.name, user.email]);

  if (!isOpen || !cause) return null;

  // Calculators
  const pointsInrValue = Number(((pointsAmount / 1000) * 11).toFixed(2));
  const hasSufficientPoints = user.totalPoints >= pointsAmount;

  // Handlers: Points
  const handleSelectQuickPoints = (pts: number) => {
    setPointsAmount(pts);
    setCustomPointsInput('');
  };

  const handleCustomPointsChange = (val: string) => {
    setCustomPointsInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setPointsAmount(num);
    }
  };

  const handleProceedPointsReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasSufficientPoints || pointsAmount <= 0) return;
    setPointsStep('review');
  };

  const handleExecutePointsDonation = () => {
    if (!hasSufficientPoints || pointsAmount <= 0) return;
    const refCode = `WX-PTS-${Math.floor(1000 + Math.random() * 9000)}`;
    setLastPointsRef(refCode);
    onConfirmPointsDonation(cause, pointsAmount, pointsInrValue);
    setPointsStep('success');
  };

  // Handlers: Monetary (Prepared Sandbox)
  const handleSelectQuickMonetary = (amt: number) => {
    setMonetaryAmount(amt);
    setCustomMonetaryInput('');
  };

  const handleCustomMonetaryChange = (val: string) => {
    setCustomMonetaryInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setMonetaryAmount(num);
    }
  };

  const handleProceedMonetaryReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (monetaryAmount <= 0 || !donorName.trim() || !donorEmail.trim()) return;
    setMonetaryStep('review');
  };

  const handleExecuteMonetaryPledge = () => {
    const refCode = `WX-PLG-${Math.floor(1000 + Math.random() * 9000)}`;
    setLastMonetaryRef(refCode);
    onConfirmMonetaryPledge(cause, monetaryAmount, donorName.trim(), donorEmail.trim(), paymentChannel);
    setMonetaryStep('success');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0b0f20] border border-pink-500/25 rounded-3xl p-5 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(236,72,153,0.15)] relative animate-in zoom-in-95 duration-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center text-2xl shrink-0">
              {cause.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pink-500/15 text-pink-300 border border-pink-500/30">
                  {cause.category}
                </span>
                <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Sample Cause
                </span>
              </div>
              <h3 className="font-['Outfit'] font-black text-lg sm:text-xl text-white tracking-tight mt-0.5">
                {cause.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Organization Details Summary Bar */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-white font-semibold">{cause.organizationName}</span>
              <span className="text-slate-400 text-[11px] block">{cause.organizationType} • {cause.organizationLocation}</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-1 rounded-md self-start sm:self-auto">
            Reg: {cause.registrationNumber}
          </span>
        </div>

        {/* Mode Switch Tabs */}
        <div className="mt-5 grid grid-cols-2 p-1 rounded-2xl bg-slate-950/80 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('points')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'points'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Pledge WalkX Points</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('monetary')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'monetary'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Monetary Donation (Prepared UI)</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: POINTS CONTRIBUTION WORKFLOW                           */}
        {/* ============================================================== */}
        {activeTab === 'points' && (
          <div className="mt-5">
            {/* Step 1: Select Points */}
            {pointsStep === 'select' && (
              <form onSubmit={handleProceedPointsReview} className="space-y-5">
                {/* Balance Banner */}
                <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Your Available Stride Pool</span>
                      <span className="text-white font-extrabold text-sm">{user.totalPoints.toLocaleString()} WalkX Points</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Indicative Rate</span>
                    <span className="text-purple-300 font-semibold text-[11px]">1,000 pts = ₹11.00</span>
                  </div>
                </div>

                {/* Quick Chips */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Choose Points Contribution
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[500, 1000, 2500, 5000, 10000].map((pts) => {
                      const inr = ((pts / 1000) * 11).toFixed(2);
                      const isAffordable = user.totalPoints >= pts;
                      const isSelected = pointsAmount === pts && !customPointsInput;

                      return (
                        <button
                          key={pts}
                          type="button"
                          onClick={() => handleSelectQuickPoints(pts)}
                          disabled={!isAffordable}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'bg-pink-600/30 border-pink-500 text-pink-200 shadow-md shadow-pink-600/20'
                              : isAffordable
                              ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                              : 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <div className="text-xs font-extrabold">{pts.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-400">≈ ₹{inr}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Points Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Or Enter Custom Points Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="100"
                      max={user.totalPoints}
                      step="100"
                      value={customPointsInput}
                      onChange={(e) => handleCustomPointsChange(e.target.value)}
                      placeholder={`Enter points (up to ${user.totalPoints.toLocaleString()})`}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-pink-500 font-mono"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                      pts
                    </span>
                  </div>
                  {!hasSufficientPoints && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Points amount exceeds your current balance ({user.totalPoints.toLocaleString()} pts).
                    </p>
                  )}
                </div>

                {/* Contribution Impact Preview Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/20 to-purple-950/20 border border-pink-500/20 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-medium">Selected Points:</span>
                    <span className="text-pink-300 font-extrabold text-sm">{pointsAmount.toLocaleString()} pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-medium">Indicative Community Value:</span>
                    <span className="text-white font-bold text-sm">₹{pointsInrValue.toFixed(2)} INR</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                    <span>Remaining Balance After Pledge:</span>
                    <span className={user.totalPoints - pointsAmount < 0 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                      {Math.max(0, user.totalPoints - pointsAmount).toLocaleString()} pts
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  type="submit"
                  disabled={!hasSufficientPoints || pointsAmount <= 0}
                  className={`w-full py-3.5 rounded-xl text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
                    hasSufficientPoints && pointsAmount > 0
                      ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 shadow-pink-600/20 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Review Contribution Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Step 2: Review Points Details */}
            {pointsStep === 'review' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between pb-2 border-b border-slate-800 text-slate-400">
                    <span>Target Cause:</span>
                    <span className="text-white font-semibold text-right">{cause.title}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-800 text-slate-400">
                    <span>Partner Entity:</span>
                    <span className="text-purple-300 font-semibold">{cause.organizationName}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-800 text-slate-400">
                    <span>Category:</span>
                    <span className="text-pink-300 font-semibold">{cause.category}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-800 text-slate-400">
                    <span>Points to be Debited:</span>
                    <span className="text-pink-400 font-extrabold text-sm">{pointsAmount.toLocaleString()} pts</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Indicative Value:</span>
                    <span className="text-white font-bold text-sm">₹{pointsInrValue.toFixed(2)} INR</span>
                  </div>
                </div>

                {/* Explicit Disclaimer Notice */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <span className="font-bold block text-white mb-0.5">Development Mode Disclosure:</span>
                    This points contribution will deduct <span className="font-bold text-amber-200">{pointsAmount.toLocaleString()} WalkX points</span> from your in-app profile. No bank debit or actual financial transaction occurs.
                  </div>
                </div>

                {/* Checkbox Acknowledgement */}
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={pointsAgreed}
                    onChange={(e) => setPointsAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 text-pink-600 focus:ring-0 accent-pink-500"
                  />
                  <span>
                    I confirm dedicating {pointsAmount.toLocaleString()} WalkX Points to this sample cause.
                  </span>
                </label>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPointsStep('select')}
                    className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleExecutePointsDonation}
                    disabled={!pointsAgreed}
                    className={`flex-1 py-3 rounded-xl text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
                      pointsAgreed
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-pink-600/25 active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-white/20" />
                    <span>Confirm Points Contribution</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success Confirmation */}
            {pointsStep === 'success' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-pink-500/20 border border-pink-500/30 text-pink-400 flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Points Contribution Confirmed!</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                    Thank you! <span className="text-pink-300 font-bold">{pointsAmount.toLocaleString()} WalkX Points</span> (≈ ₹{pointsInrValue.toFixed(2)}) have been debited from your profile and credited to <span className="text-white font-semibold">{cause.title}</span>.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 max-w-sm mx-auto text-xs space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Demo Ledger Reference</div>
                  <div className="font-mono text-pink-300 font-extrabold text-sm">{lastPointsRef}</div>
                  <div className="text-[10px] text-slate-400">Status: Points Pledged (Demo)</div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateHistory();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View in Donation Ledger</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: SEPARATE MONETARY DONATION UI (PREPARED INTEGRATION)   */}
        {/* ============================================================== */}
        {activeTab === 'monetary' && (
          <div className="mt-5">
            {/* Step 1: Select Monetary Amount */}
            {monetaryStep === 'select' && (
              <form onSubmit={handleProceedMonetaryReview} className="space-y-5">
                {/* Prepared Sandbox Warning Banner */}
                <div className="p-4 rounded-2xl bg-amber-950/25 border border-amber-500/40 text-xs text-amber-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Prepared Payment Provider Integration (Sandbox)</span>
                  </div>
                  <p className="text-[11px] text-amber-200/90 leading-relaxed">
                    This monetary donation interface is prepared for upcoming Razorpay / UPI payment gateway integration. <strong>No real money will be debited or transferred</strong>. All pledges recorded here are simulated demonstration records.
                  </p>
                </div>

                {/* Quick INR Chips */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Select Test Pledge Amount (INR)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[100, 250, 500, 1000].map((amt) => {
                      const isSelected = monetaryAmount === amt && !customMonetaryInput;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleSelectQuickMonetary(amt)}
                          className={`py-2.5 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'bg-amber-600/30 border-amber-500 text-amber-200 font-extrabold shadow-md shadow-amber-600/20'
                              : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-bold'
                          }`}
                        >
                          <div className="text-xs">₹{amt}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom INR Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Or Enter Custom Pledge Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="10"
                      step="10"
                      value={customMonetaryInput}
                      onChange={(e) => handleCustomMonetaryChange(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                {/* Donor Details Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Donor Name (Demo)
                    </label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address (Demo)
                    </label>
                    <input
                      type="email"
                      required
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Prepared Payment Method Channel Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Prepared Gateway Channel (Mock)
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'Prepared UPI (Sandbox)', label: 'UPI Sandbox' },
                      { id: 'Prepared Card (Sandbox)', label: 'Cards (Mock)' },
                      { id: 'Prepared Netbanking (Sandbox)', label: 'NetBanking' }
                    ].map((ch) => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setPaymentChannel(ch.id)}
                        className={`p-2 rounded-xl border text-[11px] font-semibold transition-all ${
                          paymentChannel === ch.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {ch.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit to Review */}
                <button
                  type="submit"
                  disabled={monetaryAmount <= 0 || !donorName.trim() || !donorEmail.trim()}
                  className={`w-full py-3.5 rounded-xl text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
                    monetaryAmount > 0 && donorName.trim() && donorEmail.trim()
                      ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/20 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Review Prepared Monetary Pledge</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Step 2: Review Monetary Pledge */}
            {monetaryStep === 'review' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between pb-2 border-b border-slate-800 text-slate-400">
                    <span>Target Cause:</span>
                    <span className="text-white font-semibold text-right">{cause.title}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-800 text-slate-400">
                    <span>Partner Entity:</span>
                    <span className="text-amber-300 font-semibold">{cause.organizationName}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-800 text-slate-400">
                    <span>Donor Name:</span>
                    <span className="text-white font-semibold">{donorName}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-800 text-slate-400">
                    <span>Pledge Amount:</span>
                    <span className="text-amber-400 font-extrabold text-sm">₹{monetaryAmount.toFixed(2)} INR</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Payment Channel:</span>
                    <span className="text-slate-200 font-mono text-[11px]">{paymentChannel}</span>
                  </div>
                </div>

                {/* Distinction Notice */}
                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-600/30 text-amber-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-300">
                    <Info className="w-3.5 h-3.5" />
                    <span>Distinction Notice (Demo vs Actual Transfers)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    This action records a <strong>Pledged Monetary Donation</strong> in the development ledger. No actual payment provider has been triggered, no credit card or UPI account has been charged, and no actual bank money transfer has occurred.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMonetaryStep('select')}
                    className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteMonetaryPledge}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Sandbox Monetary Pledge</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success Monetary Pledge */}
            {monetaryStep === 'success' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Monetary Pledge Recorded (Prepared UI)</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                    Your pledge of <span className="text-amber-300 font-bold">₹{monetaryAmount.toFixed(2)} INR</span> for <span className="text-white font-semibold">{cause.title}</span> has been logged into the sandbox ledger.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 max-w-sm mx-auto text-xs space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Pledge Tracking Code</div>
                  <div className="font-mono text-amber-300 font-extrabold text-sm">{lastMonetaryRef}</div>
                  <div className="text-[10px] text-slate-400">Status: Monetary Pledge (Prepared Integration)</div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateHistory();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View in Donation Ledger</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
