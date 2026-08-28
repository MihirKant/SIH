'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MapPin, Navigation, Compass, CheckCircle2, Loader2 } from 'lucide-react';

interface LocationPickerMapProps {
  initialLat?: number;
  initialLng?: number;
  district: string;
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    locationName: string;
    detectedDistrict?: string;
  }) => void;
}

// Jharkhand District default coordinates lookup
const DISTRICT_COORDS: Record<string, { lat: number; lng: number }> = {
  Ranchi: { lat: 23.3441, lng: 85.3854 },
  'East Singhbhum': { lat: 22.8046, lng: 86.2029 },
  Dhanbad: { lat: 23.7957, lng: 86.4304 },
  Hazaribagh: { lat: 23.9925, lng: 85.3637 },
  Latehar: { lat: 23.7434, lng: 84.4965 },
  Khunti: { lat: 23.0768, lng: 85.2778 },
  Simdega: { lat: 22.6148, lng: 84.509 },
  Bokaro: { lat: 23.6693, lng: 85.956 },
  Deoghar: { lat: 24.4826, lng: 86.6967 },
  Dumka: { lat: 24.2676, lng: 87.2483 },
  Palamu: { lat: 24.0435, lng: 84.0722 },
  Giridih: { lat: 24.1895, lng: 86.3039 },
};

export default function LocationPickerMap({
  initialLat,
  initialLng,
  district,
  onLocationSelect,
}: LocationPickerMapProps) {
  const defaultCoords = DISTRICT_COORDS[district] || { lat: 23.3441, lng: 85.3854 };
  const [lat, setLat] = useState<number>(initialLat || defaultCoords.lat);
  const [lng, setLng] = useState<number>(initialLng || defaultCoords.lng);
  const [address, setAddress] = useState<string>('');
  const [loadingGeocode, setLoadingGeocode] = useState<boolean>(false);
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapInstance = useRef<any>(null);
  const leafletMarkerInstance = useRef<any>(null);

  // Update map when district prop changes
  useEffect(() => {
    if (DISTRICT_COORDS[district] && !initialLat) {
      const coords = DISTRICT_COORDS[district];
      setLat(coords.lat);
      setLng(coords.lng);
      if (leafletMapInstance.current) {
        leafletMapInstance.current.setView([coords.lat, coords.lng], 12);
        if (leafletMarkerInstance.current) {
          leafletMarkerInstance.current.setLatLng([coords.lat, coords.lng]);
        }
      }
      reverseGeocode(coords.lat, coords.lng);
    }
  }, [district]);

  // Load Leaflet dynamically on browser mount
  useEffect(() => {
    let isMounted = true;

    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      // Inject Leaflet CSS if not present
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Import Leaflet JS dynamically
      const L = (await import('leaflet')).default;

      if (!isMounted || !mapRef.current) return;

      // Fix default marker icon paths in Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!leafletMapInstance.current) {
        const map = L.map(mapRef.current).setView([lat, lng], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        const marker = L.marker([lat, lng], { draggable: true }).addTo(map);

        marker.on('dragend', (event: any) => {
          const position = event.target.getLatLng();
          setLat(position.lat);
          setLng(position.lng);
          reverseGeocode(position.lat, position.lng);
        });

        map.on('click', (e: any) => {
          marker.setLatLng(e.latlng);
          setLat(e.latlng.lat);
          setLng(e.latlng.lng);
          reverseGeocode(e.latlng.lat, e.latlng.lng);
        });

        leafletMapInstance.current = map;
        leafletMarkerInstance.current = marker;

        // Perform initial reverse geocode
        reverseGeocode(lat, lng);
      }
    };

    loadLeaflet();

    return () => {
      isMounted = false;
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
      }
    };
  }, []);

  // Free Reverse Geocoding via OpenStreetMap Nominatim API
  const reverseGeocode = async (latitude: number, longitude: number) => {
    setLoadingGeocode(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      const data = await res.json();
      if (data && data.address) {
        const village = data.address.village || data.address.suburb || data.address.town || data.address.hamlet || '';
        const county = data.address.county || data.address.state_district || data.address.district || '';
        const state = data.address.state || 'Jharkhand';
        const formatted = [village, county, state].filter(Boolean).join(', ') || data.display_name;
        
        setAddress(formatted);
        onLocationSelect({
          lat: latitude,
          lng: longitude,
          locationName: formatted,
          detectedDistrict: county,
        });
      } else {
        const fallback = `Ward/Panchayat near GPS (${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E)`;
        setAddress(fallback);
        onLocationSelect({ lat: latitude, lng: longitude, locationName: fallback });
      }
    } catch (e) {
      const fallback = `GPS Coordinates: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`;
      setAddress(fallback);
      onLocationSelect({ lat: latitude, lng: longitude, locationName: fallback });
    } finally {
      setLoadingGeocode(false);
    }
  };

  // 1-Tap Browser GPS Location
  const handleCurrentLocation = () => {
    setIsGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latitude = pos.coords.latitude;
          const longitude = pos.coords.longitude;
          setLat(latitude);
          setLng(longitude);
          if (leafletMapInstance.current) {
            leafletMapInstance.current.setView([latitude, longitude], 15);
            if (leafletMarkerInstance.current) {
              leafletMarkerInstance.current.setLatLng([latitude, longitude]);
            }
          }
          reverseGeocode(latitude, longitude);
          setIsGpsLoading(false);
        },
        (err) => {
          console.warn('GPS position error:', err);
          setIsGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setIsGpsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>Interactive Location Pin Picker (OpenStreetMap)</span>
        </label>

        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={isGpsLoading}
          className="text-xs font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-xl border border-cyan-500/30 flex items-center gap-1.5 transition-colors"
        >
          {isGpsLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          ) : (
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          )}
          <span>{isGpsLoading ? 'Locating...' : 'Use My GPS Location'}</span>
        </button>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
        <div ref={mapRef} className="w-full h-full z-0 bg-slate-900" />

        {/* Map Overlay helper instruction */}
        <div className="absolute top-2 left-2 z-[400] bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-300 font-medium flex items-center gap-1.5 pointer-events-none">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tap/Click anywhere or drag pin to adjust location</span>
        </div>
      </div>

      {/* Address & Lat/Lng Output */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-white flex items-center gap-2">
            <span>Selected Location:</span>
            {loadingGeocode && <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />}
          </div>
          <p className="text-slate-300 font-medium leading-relaxed">
            {address || 'Fetching reverse geocoded address...'}
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            GPS Coordinates: {lat.toFixed(5)}° N, {lng.toFixed(5)}° E
          </p>
        </div>
      </div>
    </div>
  );
}
