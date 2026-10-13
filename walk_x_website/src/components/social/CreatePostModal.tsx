import React, { useState, useEffect } from 'react';
import {
  X,
  Image,
  MapPin,
  Activity,
  Globe,
  Users,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Shield,
  Search
} from 'lucide-react';
import { ActivityType, PostVisibility, UserProfile, WalkingPlace } from '../../types';
import { communityService } from '../../services/communityService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    caption: string;
    photos: string[];
    activityType: ActivityType;
    metrics?: {
      steps?: number;
      distanceKm?: number;
      durationMinutes?: number;
      pointsEarned?: number;
    };
    placeTag?: {
      name: string;
      city?: string;
    };
    visibility: PostVisibility;
  }) => Promise<void>;
  user: UserProfile;
}

const SAMPLE_PHOTO_PRESETS = [
  {
    url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000&q=80',
    label: 'Morning Trail'
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    label: 'Ocean Promenade'
  },
  {
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    label: 'Forest Canopy'
  },
  {
    url: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1000&q=80',
    label: 'Urban Stride'
  },
  {
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    label: 'Mountain Ridge'
  }
];

const POPULAR_PLACES = [
  { name: 'Cubbon Park Botanical Garden', city: 'Bengaluru' },
  { name: 'Marina Beach Promenade', city: 'Chennai' },
  { name: 'Marine Drive Queen’s Necklace', city: 'Mumbai' },
  { name: 'Lodhi Art District & Gardens', city: 'Delhi' },
  { name: 'Sukhna Lake Promenade', city: 'Chandigarh' }
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user
}) => {
  const [caption, setCaption] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('Morning Stride');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([SAMPLE_PHOTO_PRESETS[0].url]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [placeTag, setPlaceTag] = useState<{ name: string; city?: string } | null>(null);
  const [placeInput, setPlaceInput] = useState('');
  const [placeCityInput, setPlaceCityInput] = useState(user.city?.split(',')[0] || 'Bengaluru');
  const [placeFilterTab, setPlaceFilterTab] = useState<'visited' | 'all'>('visited');
  const [visibility, setVisibility] = useState<PostVisibility>('public');
  const [attachMetrics, setAttachMetrics] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic places from community service
  const visitedPlaces = communityService.getVisitedPlaces();
  const allCommunityPlaces = communityService.getPlaces();

  if (!isOpen) return null;

  const handleTogglePhoto = (url: string) => {
    if (selectedPhotos.includes(url)) {
      if (selectedPhotos.length > 1) {
        setSelectedPhotos(selectedPhotos.filter((p) => p !== url));
      }
    } else {
      setSelectedPhotos([...selectedPhotos, url]);
    }
  };

  const handleAddCustomPhoto = () => {
    if (!customPhotoUrl || !customPhotoUrl.startsWith('http')) return;
    if (!selectedPhotos.includes(customPhotoUrl)) {
      setSelectedPhotos([...selectedPhotos, customPhotoUrl]);
    }
    setCustomPhotoUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      setError('Please add a caption or brief description of your stride.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const metrics = attachMetrics
        ? {
            steps: user.stepsToday || 8400,
            distanceKm: Number(((user.stepsToday || 8400) * 0.00075).toFixed(2)),
            durationMinutes: Math.round((user.stepsToday || 8400) / 115) || 45,
            pointsEarned: Math.round((user.stepsToday || 8400) / 100) || 84
          }
        : undefined;

      // Sanitized place: privacy preserved, no exact GPS coordinates
      const finalPlace = placeTag
        ? { name: placeTag.name, city: placeTag.city }
        : placeInput.trim()
        ? { name: placeInput.trim(), city: placeCityInput.trim() || undefined }
        : undefined;

      await onSubmit({
        caption: caption.trim(),
        photos: selectedPhotos,
        activityType,
        metrics,
        placeTag: finalPlace,
        visibility
      });

      onClose();
      // Reset form
      setCaption('');
      setPlaceTag(null);
      setPlaceInput('');
    } catch (err: any) {
      setError(err.message || 'Failed to publish post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#0b0e24] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0d122d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4B4DFF] to-[#6D3DFF] p-0.5 shadow-md">
              <div className="w-full h-full bg-[#0b0e24] rounded-[14px] flex items-center justify-center text-white font-bold text-sm uppercase">
                {user.name.slice(0, 2)}
              </div>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Share Stride Activity</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                  Feed Post
                </span>
              </h2>
              <p className="text-xs text-slate-400">Inspire fellow walkers across the community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Visibility Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe size={14} className="text-[#4B4DFF]" />
              Post Audience
            </span>
            <div className="flex items-center gap-1.5 bg-[#070914] p-1 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setVisibility('public')}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  visibility === 'public'
                    ? 'bg-[#4B4DFF] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe size={12} />
                <span>Public</span>
              </button>
              <button
                type="button"
                onClick={() => setVisibility('followers_only')}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  visibility === 'followers_only'
                    ? 'bg-[#6D3DFF] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users size={12} />
                <span>Followers</span>
              </button>
              <button
                type="button"
                onClick={() => setVisibility('private')}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  visibility === 'private'
                    ? 'bg-slate-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock size={12} />
                <span>Only Me</span>
              </button>
            </div>
          </div>

          {/* Activity Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Activity size={14} className="text-cyan-400" />
              Activity Category
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Morning Stride',
                'Sunset Walk',
                'Power Walk',
                'Hiking',
                'Jogging',
                'Nature Trail',
                'Charity Walk'
              ].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActivityType(type as ActivityType)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    activityType === type
                      ? 'bg-gradient-to-r from-[#4B4DFF] to-[#6D3DFF] text-white border-transparent shadow-lg shadow-purple-600/30'
                      : 'bg-white/[0.04] text-slate-300 border-white/10 hover:border-purple-500/40 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Caption Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Caption & Reflections</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="How did your walk feel today? Share your thoughts, trail sights, or points milestone..."
              rows={3}
              maxLength={500}
              className="w-full p-4 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-[#4B4DFF] focus:outline-none text-white text-sm placeholder:text-slate-500 resize-none"
            />
            <div className="text-right text-[11px] text-slate-500">
              {caption.length}/500
            </div>
          </div>

          {/* Verified Telemetry Attachment Switch */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/30 to-blue-950/30 border border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-cyan-300 flex items-center justify-center font-bold">
                👟
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Attach Today's Stride Telemetry</span>
                <span className="text-[11px] text-slate-400">
                  {user.stepsToday.toLocaleString()} steps · {((user.stepsToday || 0) * 0.00075).toFixed(1)} km · +{Math.round((user.stepsToday || 0) / 100)} pts
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={attachMetrics}
              onChange={(e) => setAttachMetrics(e.target.checked)}
              className="w-5 h-5 rounded-lg accent-[#4B4DFF] cursor-pointer"
            />
          </div>

          {/* Photo Gallery Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Image size={14} className="text-purple-400" />
              Choose Stride Photo ({selectedPhotos.length} selected)
            </label>
            <div className="grid grid-cols-5 gap-2.5">
              {SAMPLE_PHOTO_PRESETS.map((preset) => {
                const isSelected = selectedPhotos.includes(preset.url);
                return (
                  <div
                    key={preset.url}
                    onClick={() => handleTogglePhoto(preset.url)}
                    className={`relative rounded-xl overflow-hidden aspect-square cursor-pointer border-2 transition-all ${
                      isSelected
                        ? 'border-[#4B4DFF] scale-102 shadow-lg shadow-purple-600/40'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#4B4DFF] text-white flex items-center justify-center">
                        <CheckCircle2 size={12} />
                      </div>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white font-medium text-center py-0.5 truncate px-1">
                      {preset.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Custom Photo URL Input */}
            <div className="flex gap-2 pt-1">
              <input
                type="url"
                value={customPhotoUrl}
                onChange={(e) => setCustomPhotoUrl(e.target.value)}
                placeholder="Or paste an image URL (https://...)"
                className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#4B4DFF]"
              />
              <button
                type="button"
                onClick={handleAddCustomPhoto}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all cursor-pointer"
              >
                Add Photo
              </button>
            </div>
          </div>

          {/* Place Tag Selection & Privacy Protection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <MapPin size={14} className="text-rose-400" />
                Attach Walking Place / Trail
              </label>

              {/* Sub-tab: Places I Visited vs All Trails */}
              <div className="flex items-center gap-1 bg-[#070914] p-0.5 rounded-lg border border-white/10 text-[10px]">
                <button
                  type="button"
                  onClick={() => setPlaceFilterTab('visited')}
                  className={`px-2 py-0.5 rounded font-bold transition-all ${
                    placeFilterTab === 'visited'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  My Visited Places ({visitedPlaces.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPlaceFilterTab('all')}
                  className={`px-2 py-0.5 rounded font-bold transition-all ${
                    placeFilterTab === 'all'
                      ? 'bg-[#4B4DFF]/20 text-indigo-300'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Trails
                </button>
              </div>
            </div>

            {/* Chips from dynamic places */}
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-none">
              {(placeFilterTab === 'visited' ? visitedPlaces : allCommunityPlaces).slice(0, 8).map((p) => {
                const isSelected = placeTag?.name === p.title;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      setPlaceTag(
                        isSelected ? null : { name: p.title, city: p.city }
                      )
                    }
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                        : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-slate-200'
                    }`}
                  >
                    📍 {p.title} <span className="opacity-60 text-[9px]">({p.city})</span>
                  </button>
                );
              })}
            </div>

            {/* Manual custom place input + city */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={placeInput}
                onChange={(e) => {
                  setPlaceInput(e.target.value);
                  setPlaceTag(null);
                }}
                placeholder="Or type a custom trail or park..."
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#4B4DFF]"
              />
              <input
                type="text"
                value={placeCityInput}
                onChange={(e) => setPlaceCityInput(e.target.value)}
                placeholder="City (e.g. Bengaluru)"
                className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#4B4DFF]"
              />
            </div>

            {/* Privacy indicator */}
            <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-slate-400 flex items-center gap-2">
              <Shield size={13} className="text-[#4B4DFF] shrink-0" />
              <span>Precise location private by default: only the venue name and city will be displayed.</span>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-5 border-t border-white/10 bg-[#0d122d]">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-400" />
            Earns social community bonus
          </span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4B4DFF] to-[#6D3DFF] hover:brightness-110 active:scale-95 text-white text-xs font-black shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Stride'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
