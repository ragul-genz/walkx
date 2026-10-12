import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { ReportReason } from '../../types';

interface ReportPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  authorName: string;
  onConfirmReport: (reason: ReportReason, details?: string) => Promise<void>;
}

const REPORT_REASONS: ReportReason[] = [
  'Spam or Bot Activity',
  'False Step / Activity Telemetry',
  'Inappropriate Media',
  'Harassment or Hate Speech',
  'Other Policy Violation'
];

export const ReportPostModal: React.FC<ReportPostModalProps> = ({
  isOpen,
  onClose,
  authorName,
  onConfirmReport
}) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason>(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirmReport(selectedReason, details.trim());
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0b0e24] border border-rose-500/30 rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Report Content</h3>
              <p className="text-[11px] text-slate-400">Post by {authorName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="text-base font-bold text-white">Report Received</h4>
            <p className="text-xs text-slate-400">
              Thank you for keeping WalkX safe. Our community trust team has flagged this post for immediate moderation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-4 space-y-4">
            <p className="text-xs text-slate-300">
              Why are you reporting this post? Your report is confidential and the author will not be notified of your identity.
            </p>

            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <label
                    key={reason}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                      isSelected
                        ? 'bg-rose-500/15 border-rose-500/40 text-white font-semibold'
                        : 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05]'
                    }`}
                  >
                    <span>{reason}</span>
                    <input
                      type="radio"
                      name="report_reason"
                      checked={isSelected}
                      onChange={() => setSelectedReason(reason)}
                      className="accent-rose-500"
                    />
                  </label>
                );
              })}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400">
                Additional context (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide extra details to help our safety review..."
                rows={2}
                maxLength={300}
                className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
