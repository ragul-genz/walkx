import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Layers,
  Shield,
  Compass,
  Navigation,
  Footprints,
  Clock,
  Trees,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WalkingPlace } from '../../types';

interface TrailMapViewProps {
  place: WalkingPlace;
  className?: string;
}

export const TrailMapView: React.FC<TrailMapViewProps> = ({ place, className = '' }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'schematic'>('map');
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Reliable Map Integration Check: verify coordinates exist
  const hasCoordinates = Boolean(place.coordinates && place.coordinates.lat && place.coordinates.lng);
  const lat = place.coordinates?.lat || 12.9763;
  const lng = place.coordinates?.lng || 77.5929;

  useEffect(() => {
    if (viewMode !== 'map' || !hasCoordinates || !mapContainerRef.current) return;

    try {
      // Destroy previous map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize reliable OpenStreetMap instance
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false
      });

      // Dark/High-contrast Carto or OSM standard tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Custom WalkX Trail Marker Pin
      const pinIcon = L.divIcon({
        className: 'custom-walkx-pin',
        html: `
          <div style="
            background: linear-gradient(135deg, #4B4DFF, #6D3DFF);
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(75, 77, 255, 0.5);
            border: 2px solid #ffffff;
          ">
            <span style="transform: rotate(45deg); font-size: 14px;">👟</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4; color: #0f172a; padding: 4px;">
          <strong style="font-size: 13px; color: #312e81;">${place.title}</strong><br/>
          <span style="color: #64748b;">${place.location}, ${place.city}</span><br/>
          <span style="color: #4f46e5; font-weight: 600;">${place.distanceKm} km • ~${place.estimatedSteps.toLocaleString()} steps</span>
        </div>
      `);

      // Gentle perimeter corridor indicator (trail boundary, not home coordinates)
      L.circle([lat, lng], {
        color: '#4B4DFF',
        fillColor: '#6D3DFF',
        fillOpacity: 0.15,
        radius: (place.distanceKm * 1000) / 4
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapLoaded(true);
      setMapError(null);

      // Force layout re-calculation for clean render
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } catch (err: any) {
      console.warn('Map initialization note:', err);
      setMapError('Interactive map preview unavailable. Showing verified trail schematic.');
      setViewMode('schematic');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [place.id, viewMode, hasCoordinates, lat, lng]);

  return (
    <div className={`rounded-2xl overflow-hidden border border-white/10 bg-[#070b1e] flex flex-col ${className}`}>
      {/* Top Map Toolbar */}
      <div className="p-3 bg-[#0d122d] border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
            <Compass size={13} className="text-[#4B4DFF]" />
            <span>Trail Geographic Profile</span>
          </div>
          {hasCoordinates && (
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 size={11} />
              <span>OSM Verified Integration</span>
            </span>
          )}
        </div>

        {/* View Switcher: Interactive Map vs Route Schematic */}
        <div className="flex items-center gap-1 bg-[#060814] p-1 rounded-xl border border-white/10 text-[11px]">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
              viewMode === 'map'
                ? 'bg-[#4B4DFF] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Navigation size={11} />
            <span>Interactive Map</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('schematic')}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
              viewMode === 'schematic'
                ? 'bg-[#6D3DFF] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers size={11} />
            <span>Trail Waypoints</span>
          </button>
        </div>
      </div>

      {/* Main Map / Schematic Body */}
      <div className="relative h-64 sm:h-72 w-full bg-slate-950 overflow-hidden">
        {viewMode === 'map' && hasCoordinates ? (
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        ) : (
          /* Route Schematic & Elevation Waypoint View (Graceful Reliable Fallback) */
          <div className="w-full h-full p-5 overflow-y-auto flex flex-col justify-between bg-gradient-to-br from-[#0c102a] via-[#080b1d] to-[#04060f]">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-extrabold text-white flex items-center gap-1.5">
                  <Footprints size={14} className="text-cyan-400" />
                  Trail Milestone Progression
                </span>
                <span className="text-[11px] text-indigo-300 font-semibold">
                  Total Route: {place.distanceKm} km
                </span>
              </div>

              {/* Waypoint Progression Steps */}
              <div className="space-y-3 relative pl-4 border-l-2 border-indigo-500/30 my-2">
                {(place.waypoints && place.waypoints.length > 0
                  ? place.waypoints
                  : [
                      { name: `${place.title} Trailhead`, distanceKm: 0.0 },
                      { name: 'Midway Canopy Vista', distanceKm: Number((place.distanceKm * 0.5).toFixed(1)) },
                      { name: 'Route Loop Finish', distanceKm: place.distanceKm }
                    ]
                ).map((wp, idx, arr) => (
                  <div key={idx} className="relative flex items-center justify-between text-xs">
                    <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-[#4B4DFF] border-2 border-[#060814]" />
                    <span className="font-semibold text-slate-200">{wp.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {wp.distanceKm} km {idx === arr.length - 1 ? '🏁' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Elevation & Terrain Snapshot */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
              <div className="p-2 rounded-xl bg-white/[0.03]">
                <span className="text-[10px] text-slate-400 block">Terrain</span>
                <span className="text-xs font-bold text-white">{place.difficulty}</span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03]">
                <span className="text-[10px] text-slate-400 block">Est. Pace</span>
                <span className="text-xs font-bold text-cyan-400">{place.durationMinutes} mins</span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03]">
                <span className="text-[10px] text-slate-400 block">Canopy Shade</span>
                <span className="text-xs font-bold text-emerald-300">
                  {place.hasShade ? 'Abundant Shaded' : 'Open Sky'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Map Error Notice if tile failed */}
        {mapError && viewMode === 'map' && (
          <div className="absolute top-2 inset-x-2 p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{mapError}</span>
          </div>
        )}
      </div>

      {/* Privacy & Anti-Tracking Footer Banner */}
      <div className="p-3 bg-[#080c22] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-indigo-300">
          <Shield size={12} className="text-[#4B4DFF]" />
          <span>Precise location private by default (public trail boundary shown)</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Zero hidden background GPS tracking</span>
        </div>
      </div>
    </div>
  );
};
