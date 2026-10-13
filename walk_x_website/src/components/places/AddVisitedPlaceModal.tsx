import React, { useState } from 'react';
import {
  X,
  MapPin,
  Trees,
  Armchair,
  Droplets,
  Accessibility,
  Sparkles,
  Shield,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { PlaceDifficulty, PlaceSuitability, UserVisitedPlaceInput } from '../../types';

interface AddVisitedPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: UserVisitedPlaceInput) => void;
  defaultCity?: string;
}

const CATEGORIES: ('Urban Park' | 'Waterfront Promenade' | 'Nature Trail' | 'Historic Walk' | 'Neighborhood Loop')[] = [
  'Urban Park',
  'Waterfront Promenade',
  'Nature Trail',
  'Historic Walk',
  'Neighborhood Loop'
];

const PHOTO_PRESETS = [
  {
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    label: 'Botanical Canopy'
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    label: 'Waterfront Promenade'
  },
  {
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    label: 'Nature Ridge'
  },
  {
    url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
    label: 'Heritage Monument'
  },
  {
    url: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1000&q=80',
    label: 'Urban Green Loop'
  }
];

export const AddVisitedPlaceModal: React.FC<AddVisitedPlaceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultCity = 'Bengaluru'
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Urban Park' | 'Waterfront Promenade' | 'Nature Trail' | 'Historic Walk' | 'Neighborhood Loop'>('Urban Park');
  const [city, setCity] = useState(defaultCity === 'All' ? 'Bengaluru' : defaultCity);
  const [location, setLocation] = useState('');
  const [distanceKm, setDistanceKm] = useState('3.5');
  const [difficulty, setDifficulty] = useState<PlaceDifficulty>('Gentle & Flat');
  const [selectedSuitability, setSelectedSuitability] = useState<PlaceSuitability[]>([
    'All Ages',
    'Senior Friendly'
  ]);
  const [hasShade, setHasShade] = useState(true);
  const [hasBenches, setHasBenches] = useState(true);
  const [hasWaterFountains, setHasWaterFountains] = useState(false);
  const [isWheelchairAccessible, setIsWheelchairAccessible] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(PHOTO_PRESETS[0].url);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tips, setTips] = useState('');
  const [dateVisited, setDateVisited] = useState(() => new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleSuitability = (suit: PlaceSuitability) => {
    if (selectedSuitability.includes(suit)) {
      setSelectedSuitability(selectedSuitability.filter((s) => s !== suit));
    } else {
      setSelectedSuitability([...selectedSuitability, suit]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide the name of the place you visited.');
      return;
    }
    if (!city.trim()) {
      setError('Please provide the city name.');
      return;
    }

    const distNum = parseFloat(distanceKm);
    if (isNaN(distNum) || distNum <= 0) {
      setError('Please enter a valid walking distance in km.');
      return;
    }

    const finalPhoto = customPhotoUrl.trim() && customPhotoUrl.startsWith('http')
      ? customPhotoUrl.trim()
      : selectedPhoto;

    onSubmit({
      title: title.trim(),
      category,
      city: city.trim(),
      location: location.trim() || city.trim(),
      distanceKm: distNum,
      difficulty,
      suitability: selectedSuitability,
      description: description.trim() || `Scenic walking trail in ${city.trim()} discovered by a community strider.`,
      tips: tips.trim() || 'Great for morning or evening walks.',
      dateVisited,
      imageUrl: finalPhoto,
      hasShade,
      hasBenches,
      hasWaterFountains,
      isWheelchairAccessible
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#0b0e24] border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0d122d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#0b0e24] rounded-[14px] flex items-center justify-center text-emerald-400 font-bold">
                <MapPin size={20} />
              </div>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Add Place I Visited</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Personal Passport
                </span>
              </h2>
              <p className="text-xs text-slate-400">Record a scenic trail or park in your lifetime explored log</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Place Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Place Name / Landmark *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sankey Tank Perimeter Loop"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4B4DFF]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#4B4DFF]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* City & General Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                City / Region *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru, Chennai, Mumbai"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4B4DFF]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Neighborhood / Public Access Area
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Malleshwaram 11th Cross"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4B4DFF]"
              />
            </div>
          </div>

          {/* Distance & Terrain */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Route Distance (km)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="50"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#4B4DFF]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Terrain Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#4B4DFF]"
              >
                <option value="Gentle & Flat">Gentle & Flat</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging Incline">Challenging Incline</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1">
                <Calendar size={13} />
                Date Visited
              </label>
              <input
                type="date"
                value={dateVisited}
                onChange={(e) => setDateVisited(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#4B4DFF]"
              />
            </div>
          </div>

          {/* Suitability Pills */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Age & Accessibility Suitability
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  'All Ages',
                  'Senior Friendly',
                  'Stroller & Family',
                  'Pet Friendly',
                  'Brisk Walkers'
                ] as PlaceSuitability[]
              ).map((suit) => {
                const active = selectedSuitability.includes(suit);
                return (
                  <button
                    key={suit}
                    type="button"
                    onClick={() => toggleSuitability(suit)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-sm'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {suit} {active ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Route Amenities Checklist */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Available Amenities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/05 cursor-pointer hover:bg-white/[0.06]">
                <input
                  type="checkbox"
                  checked={hasShade}
                  onChange={(e) => setHasShade(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <Trees size={14} className="text-emerald-400" />
                <span className="text-slate-300">Shade / Trees</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/05 cursor-pointer hover:bg-white/[0.06]">
                <input
                  type="checkbox"
                  checked={hasBenches}
                  onChange={(e) => setHasBenches(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <Armchair size={14} className="text-amber-400" />
                <span className="text-slate-300">Rest Benches</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/05 cursor-pointer hover:bg-white/[0.06]">
                <input
                  type="checkbox"
                  checked={hasWaterFountains}
                  onChange={(e) => setHasWaterFountains(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <Droplets size={14} className="text-cyan-400" />
                <span className="text-slate-300">Water Fountains</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/05 cursor-pointer hover:bg-white/[0.06]">
                <input
                  type="checkbox"
                  checked={isWheelchairAccessible}
                  onChange={(e) => setIsWheelchairAccessible(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <Accessibility size={14} className="text-indigo-400" />
                <span className="text-slate-300">Accessible Paving</span>
              </label>
            </div>
          </div>

          {/* Photo Presets & Custom URL */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <ImageIcon size={14} className="text-purple-400" />
              Trail Cover Photo
            </label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {PHOTO_PRESETS.map((preset) => {
                const isSelected = selectedPhoto === preset.url && !customPhotoUrl;
                return (
                  <div
                    key={preset.url}
                    onClick={() => {
                      setSelectedPhoto(preset.url);
                      setCustomPhotoUrl('');
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square cursor-pointer border-2 transition-all ${
                      isSelected
                        ? 'border-emerald-500 scale-102 shadow-md shadow-emerald-500/30'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <CheckCircle2 size={10} />
                      </div>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 truncate px-1">
                      {preset.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <input
              type="url"
              value={customPhotoUrl}
              onChange={(e) => setCustomPhotoUrl(e.target.value)}
              placeholder="Or paste an image URL (https://...)"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4B4DFF]"
            />
          </div>

          {/* Walker Notes & Reflections */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Walker Tips & Experience
            </label>
            <textarea
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="Best time to walk, parking details, morning shadow coverage, senior safety..."
              rows={2}
              maxLength={300}
              className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4B4DFF] resize-none"
            />
          </div>

          {/* Privacy & Zero Background Tracking Notice */}
          <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
              <Shield size={14} className="text-[#4B4DFF]" />
              <span>Privacy & Location Protection Guaranteed</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              🛡️ Precise residential coordinates are strictly private. Only the general park/trail name and city will be saved in your community record.
            </p>
            <p className="text-[11px] text-emerald-400 font-medium">
              ⚡ Zero background GPS tracking: WalkX never tracks your device in the background.
            </p>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0d122d] border-t border-white/10 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-400" />
            Increases your Places Explored counter
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 active:scale-95 text-white text-xs font-black shadow-lg shadow-teal-500/30 transition-all cursor-pointer"
            >
              Save Visited Place
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
