import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Shield,
  Search,
  X
} from 'lucide-react';

interface CityLocationBarProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  availableCities: string[];
}

const MAJOR_CITIES = [
  'All Cities',
  'Bengaluru',
  'Chennai',
  'Mumbai',
  'New Delhi',
  'Hyderabad',
  'Chandigarh',
  'Kolkata',
  'Dehradun',
  'Pune'
];

export const CityLocationBar: React.FC<CityLocationBarProps> = ({
  selectedCity,
  onSelectCity,
  availableCities
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'info' | 'success' | 'warning'>('info');
  const [customCityInput, setCustomCityInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Combined unique cities
  const allCities = Array.from(new Set([...MAJOR_CITIES, ...availableCities]));

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('GPS hardware not available on this device. Please select your city manually below.');
      setStatusType('warning');
      return;
    }

    setIsDetecting(true);
    setLocationStatus('Requesting one-time GPS location...');
    setStatusType('info');

    // Strictly one-shot on-demand query. NEVER background watchPosition.
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetecting(false);
        const { latitude, longitude } = position.coords;

        // Approximate proximity matcher for major metropolitan walking centers
        let detected = 'Bengaluru';
        if (latitude > 28 && latitude < 29.5) detected = 'New Delhi';
        else if (latitude > 18.5 && latitude < 19.5 && longitude < 73.5) detected = 'Mumbai';
        else if (latitude > 12.5 && latitude < 13.5 && longitude > 79.5) detected = 'Chennai';
        else if (latitude > 17 && latitude < 18) detected = 'Hyderabad';
        else if (latitude > 30 && latitude < 31.5) detected = 'Chandigarh';
        else if (latitude > 22 && latitude < 23) detected = 'Kolkata';

        onSelectCity(detected);
        setLocationStatus(`Location detected: Near ${detected}. Precise GPS is private; trails filtered for your area.`);
        setStatusType('success');
      },
      (error) => {
        setIsDetecting(false);
        let msg = 'GPS permission unavailable or denied. Please choose your city or place manually below.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'GPS permission denied by browser. No problem! Select your city manually from the quick pills below.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'GPS request timed out. Select your city manually from the options below.';
        }
        setLocationStatus(msg);
        setStatusType('warning');
      },
      { timeout: 8000, maximumAge: 60000, enableHighAccuracy: false }
    );
  };

  const handleCustomCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCityInput.trim()) {
      onSelectCity(customCityInput.trim());
      setCustomCityInput('');
      setShowCustomInput(false);
      setLocationStatus(`Filtering walking places in ${customCityInput.trim()}.`);
      setStatusType('info');
    }
  };

  return (
    <div className="bg-[#0b0f2a] border border-white/10 rounded-2xl p-3.5 space-y-3">
      {/* Top Controls: City Selector & One-time GPS trigger */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-[#4B4DFF] flex items-center justify-center shrink-0">
            <MapPin size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              Active City: <span className="text-[#4B4DFF]">{selectedCity === 'All' ? 'All Regions' : selectedCity}</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Manual selection available anytime if GPS is disabled
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1.5 border border-white/10 cursor-pointer disabled:opacity-50"
          >
            <Navigation size={12} className={isDetecting ? 'animate-spin text-cyan-400' : 'text-cyan-400'} />
            <span>{isDetecting ? 'Detecting...' : 'Detect City'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1 border border-white/05 cursor-pointer"
          >
            <Search size={12} />
            <span>Other City</span>
          </button>
        </div>
      </div>

      {/* Manual Custom City Input (if open) */}
      {showCustomInput && (
        <form onSubmit={handleCustomCitySubmit} className="flex gap-2 animate-fade-in pt-1">
          <input
            type="text"
            value={customCityInput}
            onChange={(e) => setCustomCityInput(e.target.value)}
            placeholder="Type any city or town name (e.g. Mysuru, Kochi, Shimla)..."
            className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4B4DFF]"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl gradient-btn text-white text-xs font-bold"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setShowCustomInput(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X size={15} />
          </button>
        </form>
      )}

      {/* Quick City Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
        {allCities.map((city) => {
          const isSelected = selectedCity === city || (selectedCity === 'All' && city === 'All Cities');
          return (
            <button
              key={city}
              type="button"
              onClick={() => onSelectCity(city === 'All Cities' ? 'All' : city)}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#4B4DFF] text-white font-bold shadow-[0_0_12px_rgba(75,77,255,0.35)]'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.07] border border-white/05'
              }`}
            >
              {city}
            </button>
          );
        })}
      </div>

      {/* Graceful GPS Status Banner */}
      {locationStatus && (
        <div
          className={`p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 animate-fade-in ${
            statusType === 'warning'
              ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
              : statusType === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusType === 'warning' ? (
              <AlertCircle size={14} className="shrink-0" />
            ) : statusType === 'success' ? (
              <CheckCircle2 size={14} className="shrink-0" />
            ) : (
              <Navigation size={14} className="shrink-0" />
            )}
            <span>{locationStatus}</span>
          </div>
          <button
            type="button"
            onClick={() => setLocationStatus(null)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Privacy & Anti-Background-Tracking Indicator */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/05">
        <span className="flex items-center gap-1.5 text-indigo-300">
          <Shield size={12} className="text-[#4B4DFF]" />
          Precise location private by default
        </span>
        <span className="text-slate-400">
          Zero hidden background tracking
        </span>
      </div>
    </div>
  );
};
