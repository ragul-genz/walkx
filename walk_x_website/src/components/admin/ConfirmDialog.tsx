import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-rose-400" />,
          iconBg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
          btnBg: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25',
          border: 'border-rose-500/30'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
          iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
          btnBg: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/25',
          border: 'border-amber-500/30'
        };
      default:
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-purple-400" />,
          iconBg: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
          btnBg: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25',
          border: 'border-purple-500/30'
        };
    }
  };

  const style = getVariantStyles();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        className={`w-full max-w-md bg-[#0c1024] border ${style.border} rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 space-y-4`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${style.iconBg}`}>
              {style.icon}
            </div>
            <div>
              <h3 className="font-['Outfit'] font-bold text-lg text-white tracking-tight">
                {title}
              </h3>
              <p className="text-xs text-slate-400">Administrative Confirmation Required</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
          {message}
        </p>

        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-xs shadow-lg transition-all active:scale-95 ${style.btnBg}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
