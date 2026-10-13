import React, { useState } from 'react';
import {
  X,
  MapPin,
  Activity,
  Globe,
  Users,
  Lock,
  Save,
  Shield
} from 'lucide-react';
import { SocialPost, ActivityType, PostVisibility } from '../../types';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: SocialPost;
  onSave: (postId: string, updates: {
    caption: string;
    activityType: ActivityType;
    placeTag?: { name: string; city?: string };
    visibility: PostVisibility;
  }) => Promise<void>;
}

const ACTIVITY_TYPES: ActivityType[] = [
  'Walking',
  'Morning Stride',
  'Sunset Walk',
  'Power Walk',
  'Hiking',
  'Jogging',
  'Nature Trail',
  'Charity Walk'
];

export const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  onClose,
  post,
  onSave
}) => {
  const [caption, setCaption] = useState(post.caption);
  const [activityType, setActivityType] = useState<ActivityType>(post.activityType);
  const [placeName, setPlaceName] = useState(post.placeTag?.name || '');
  const [placeCity, setPlaceCity] = useState(post.placeTag?.city || '');
  const [visibility, setVisibility] = useState<PostVisibility>(post.visibility);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSave(post.id, {
        caption: caption.trim(),
        activityType,
        placeTag: placeName.trim() ? { name: placeName.trim(), city: placeCity.trim() || undefined } : undefined,
        visibility
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0b0e24] border border-white/15 rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-sm font-bold">
              ✏️
            </span>
            <h3 className="text-base font-bold text-white font-['Outfit']">Edit Stride Post</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-4 flex-1">
          {/* Caption */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              placeholder="Update your stride story..."
              className="w-full p-3.5 rounded-2xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4B4DFF]"
              required
            />
          </div>

          {/* Activity Type Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <Activity size={13} className="text-[#4B4DFF]" />
              Activity Classification
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ACTIVITY_TYPES.map((type) => {
                const active = activityType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActivityType(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? 'bg-gradient-to-r from-[#4B4DFF] to-[#6D3DFF] text-white font-bold shadow-md'
                        : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/05'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Tag */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <MapPin size={13} className="text-rose-400" />
              Location Tag
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Trail or Park Name"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4B4DFF]"
              />
              <input
                type="text"
                placeholder="City (e.g. Mumbai)"
                value={placeCity}
                onChange={(e) => setPlaceCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4B4DFF]"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
              <Shield size={11} className="text-[#4B4DFF]" />
              <span>Precise location private by default: only the venue name and city are displayed.</span>
            </p>
          </div>

          {/* Audience Visibility */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Audience & Privacy
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setVisibility('public')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  visibility === 'public'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 border-white/05 hover:text-white'
                }`}
              >
                <Globe size={14} className="mx-auto mb-1 text-emerald-400" />
                <span className="text-[11px] font-bold block">Public</span>
              </button>

              <button
                type="button"
                onClick={() => setVisibility('followers_only')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  visibility === 'followers_only'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 border-white/05 hover:text-white'
                }`}
              >
                <Users size={14} className="mx-auto mb-1 text-indigo-400" />
                <span className="text-[11px] font-bold block">Followers</span>
              </button>

              <button
                type="button"
                onClick={() => setVisibility('private')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  visibility === 'private'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 border-white/05 hover:text-white'
                }`}
              >
                <Lock size={14} className="mx-auto mb-1 text-amber-400" />
                <span className="text-[11px] font-bold block">Only Me</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/05"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !caption.trim()}
              className="gradient-btn px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <Save size={13} />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
