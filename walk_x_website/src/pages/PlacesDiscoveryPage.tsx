import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Star,
  CheckCircle2,
  Filter,
  Search,
  Footprints,
  Accessibility,
  Trees,
  Armchair,
  Droplets,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { WalkingPlace, PlaceDifficulty, PlaceSuitability, PageId } from '../types';
import { communityService } from '../services/communityService';

interface PlacesDiscoveryPageProps {
  onNavigate: (page: PageId) => void;
  showToast: (msg: string) => void;
}

const CATEGORIES = ['All', 'Urban Park', 'Waterfront Promenade', 'Nature Trail', 'Historic Walk'];
const SUITABILITY_FILTERS: (PlaceSuitability | 'All')[] = [
  'All',
  'All Ages',
  'Senior Friendly',
  'Stroller & Family',
  'Pet Friendly',
  'Brisk Walkers'
];

export const PlacesDiscoveryPage: React.FC<PlacesDiscoveryPageProps> = ({
  onNavigate,
  showToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSuitability, setSelectedSuitability] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<PlaceDifficulty | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingPlace, setInspectingPlace] = useState<WalkingPlace | null>(null);

  const places = communityService.getPlaces({
    category: selectedCategory,
    suitability: selectedSuitability,
    difficulty: selectedDifficulty,
    search: searchQuery
  });

  const handleToggleCheckIn = (place: WalkingPlace) => {
    const checked = communityService.toggleCheckIn(place.id);
    showToast(
      checked
        ? `Checked into ${place.title}! Recorded in your Places Explored.`
        : `Removed check-in from ${place.title}.`
    );
    // Refresh inspecting place if open
    if (inspectingPlace?.id === place.id) {
      setInspectingPlace({
        ...inspectingPlace,
        isCheckedIn: checked,
        checkInsCount: checked ? inspectingPlace.checkInsCount + 1 : inspectingPlace.checkInsCount - 1
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950 via-[#0c102a] to-purple-950 border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#4B4DFF]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4B4DFF]/20 border border-[#4B4DFF]/30 text-indigo-300 text-xs font-semibold mb-3">
              <Compass size={14} className="text-[#4B4DFF] animate-spin-slow" />
              <span>Places & Trail Discovery</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Discover Scenic Walking Routes For All Ages
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Explore urban green loops, refreshing coastal promenades, shaded parks with senior-friendly benches, and scenic weekend hikes verified by local community striders.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar Cluster */}
        <div className="bg-[#0b0e24] border border-white/10 rounded-2xl p-4 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search trails, city parks, lake loops, gardens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4B4DFF]"
              />
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium shrink-0 flex items-center gap-1">
                <Filter size={13} />
                Terrain:
              </span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                className="bg-slate-900 border border-white/10 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#4B4DFF]"
              >
                <option value="All">All Terrains</option>
                <option value="Gentle & Flat">Gentle & Flat</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging Incline">Challenging Incline</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-[#4B4DFF] text-white shadow-[0_0_12px_rgba(75,77,255,0.35)]'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/05'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Age & Accessibility Suitability Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-white/05 pt-3">
            <span className="text-[11px] font-semibold text-slate-500 shrink-0">Age / Suitability:</span>
            {SUITABILITY_FILTERS.map((s) => {
              const active = selectedSuitability === s;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedSuitability(s)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                    active
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold'
                      : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 border border-white/05'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-[#0b0e24] border border-white/10 rounded-3xl">
              <Compass size={40} className="mx-auto text-indigo-400 mb-3 opacity-60" />
              <h3 className="text-lg font-bold text-white mb-1">No matching walking places found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                Try loosening your filters or searching for another city, trail, or neighborhood park.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSuitability('All');
                  setSelectedDifficulty('All');
                  setSearchQuery('');
                }}
                className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold text-white"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            places.map((place) => (
              <div
                key={place.id}
                className="group bg-[#0b0e24] border border-white/10 rounded-3xl overflow-hidden hover:border-[#4B4DFF]/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(75,77,255,0.15)] flex flex-col"
              >
                {/* Image Cover */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-900 cursor-pointer" onClick={() => setInspectingPlace(place)}>
                  <img
                    src={place.imageUrl}
                    alt={place.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e24] via-transparent to-black/40" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {place.category}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold backdrop-blur-md border ${
                        place.difficulty === 'Gentle & Flat'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : place.difficulty === 'Moderate'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {place.difficulty}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10">
                    <Star size={11} className="fill-amber-400" />
                    <span>{place.rating}</span>
                  </div>

                  <div className="absolute bottom-2 left-3 text-xs text-slate-300 flex items-center gap-1">
                    <MapPin size={12} className="text-rose-400 shrink-0" />
                    <span className="truncate font-medium">{place.location}, {place.city}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2
                      onClick={() => setInspectingPlace(place)}
                      className="text-base font-bold text-white group-hover:text-[#4B4DFF] transition-colors cursor-pointer"
                    >
                      {place.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {place.description}
                    </p>

                    {/* Stride Metrics Strip */}
                    <div className="grid grid-cols-3 gap-2 my-4 py-2.5 px-3 rounded-2xl bg-white/[0.03] border border-white/05 text-center">
                      <div>
                        <span className="text-xs font-bold text-white block">{place.distanceKm} km</span>
                        <span className="text-[10px] text-slate-400">Distance</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-cyan-400 block">{place.estimatedSteps.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400">Est. Steps</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-indigo-300 block">{place.durationMinutes} min</span>
                        <span className="text-[10px] text-slate-400">Avg Pace</span>
                      </div>
                    </div>

                    {/* Suitability Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {place.suitability.map((suit) => (
                        <span
                          key={suit}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-300 border border-white/05"
                        >
                          {suit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Check-in */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleCheckIn(place)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        place.isCheckedIn
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-white/[0.06] text-slate-200 hover:bg-[#4B4DFF]/20 hover:text-white border border-white/10'
                      }`}
                    >
                      <CheckCircle2 size={13} className={place.isCheckedIn ? 'text-emerald-400' : 'text-slate-400'} />
                      <span>{place.isCheckedIn ? 'Walked Here ✓' : 'Walked Here'}</span>
                      <span className="text-[10px] opacity-70">({place.checkInsCount})</span>
                    </button>

                    <button
                      onClick={() => setInspectingPlace(place)}
                      className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-all"
                      title="Inspect trail details"
                    >
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Place Detail Inspector Modal */}
      {inspectingPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0b0e24] border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header Cover */}
            <div className="relative h-60 sm:h-72 w-full bg-slate-900 shrink-0">
              <img
                src={inspectingPlace.imageUrl}
                alt={inspectingPlace.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e24] via-black/30 to-black/60" />
              <button
                onClick={() => setInspectingPlace(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white backdrop-blur-md"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                  {inspectingPlace.category} • {inspectingPlace.difficulty}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                  {inspectingPlace.title}
                </h2>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                  <MapPin size={12} className="text-rose-400" />
                  <span>{inspectingPlace.location}, {inspectingPlace.city}</span>
                </p>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Telemetry Strip */}
              <div className="grid grid-cols-4 gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/05 text-center">
                <div>
                  <span className="text-sm font-bold text-white block">{inspectingPlace.distanceKm} km</span>
                  <span className="text-[10px] text-slate-400">Route Length</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-cyan-400 block">{inspectingPlace.estimatedSteps.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400">Step Target</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-indigo-300 block">{inspectingPlace.durationMinutes} min</span>
                  <span className="text-[10px] text-slate-400">Duration</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-amber-400 block">{inspectingPlace.rating} ★</span>
                  <span className="text-[10px] text-slate-400">({inspectingPlace.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Description & Tips */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About This Trail</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {inspectingPlace.description}
                </p>
              </div>

              {/* Stride Community Tips */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20">
                <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-bold mb-1">
                  <Sparkles size={13} />
                  <span>Walker Tips & Best Hours</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {inspectingPlace.tips}
                </p>
                <p className="text-[11px] text-indigo-400 font-semibold mt-2">
                  Peak Stride Window: {inspectingPlace.popularTime}
                </p>
              </div>

              {/* Amenities Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Route Amenities & Accessibility</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${inspectingPlace.hasShade ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-white/[0.02] border-white/05 text-slate-500'}`}>
                    <Trees size={14} />
                    <span>Tree Canopies {inspectingPlace.hasShade ? '✓' : '✗'}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${inspectingPlace.hasBenches ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-white/[0.02] border-white/05 text-slate-500'}`}>
                    <Armchair size={14} />
                    <span>Rest Benches {inspectingPlace.hasBenches ? '✓' : '✗'}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${inspectingPlace.isWheelchairAccessible ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-white/[0.02] border-white/05 text-slate-500'}`}>
                    <Accessibility size={14} />
                    <span>Accessible {inspectingPlace.isWheelchairAccessible ? '✓' : '✗'}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${inspectingPlace.hasWaterFountains ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-white/[0.02] border-white/05 text-slate-500'}`}>
                    <Droplets size={14} />
                    <span>Hydration {inspectingPlace.hasWaterFountains ? '✓' : '✗'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-slate-900/60 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => handleToggleCheckIn(inspectingPlace)}
                className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  inspectingPlace.isCheckedIn
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-white/[0.08] text-white hover:bg-white/[0.15] border border-white/10'
                }`}
              >
                <CheckCircle2 size={14} />
                <span>{inspectingPlace.isCheckedIn ? 'Checked In ✓' : 'I Walked Here'}</span>
              </button>

              <button
                onClick={() => {
                  setInspectingPlace(null);
                  onNavigate('feed');
                  showToast(`Post a stride from ${inspectingPlace.title}!`);
                }}
                className="flex-1 py-2.5 rounded-2xl text-xs font-bold gradient-btn text-white flex items-center justify-center gap-1.5 shadow-md"
              >
                <Footprints size={14} />
                <span>Share Stride From Here</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
