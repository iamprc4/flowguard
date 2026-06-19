import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Shield, Info, Radio, Database } from 'lucide-react';
import { TrafficEvent, DiversionRoute } from '../types.js';

interface HotspotData {
  junction: string;
  lat: number;
  lng: number;
  count: number;
  topCause: string;
  peakHour: number;
}

interface MapProps {
  events: TrafficEvent[];
  selectedEventId: string | null;
  onSelectEvent: (id: string | null) => void;
  routes: DiversionRoute[];
  isVisible?: boolean;
  hotspotData?: HotspotData[];
  heatmapPoints?: [number, number][];
}

export default function InteractiveMap({ events, selectedEventId, onSelectEvent, routes, isVisible = true, hotspotData = [], heatmapPoints = [] }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerClusterGroupRef = useRef<any>(null);
  const polylinesRef = useRef<any[]>([]);
  const markerCacheRef = useRef<Record<string, any>>({});
  const hotspotMarkersRef = useRef<any[]>([]);
  const heatLayerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Map on Mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) {
      console.error('Leaflet library not loaded.');
      return;
    }

    // Initialize Leaflet Map centered on Bangalore
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      minZoom: 10,
      maxZoom: 18
    }).setView([12.9715987, 77.5945627], 12);

    mapRef.current = map;

    // Add Dark Cyber Map Tile Layer from CartoDB
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Initialize Marker Cluster Group
    const markerClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      chunkedLoading: true
    });
    map.addLayer(markerClusterGroup);
    markerClusterGroupRef.current = markerClusterGroup;

    setMapLoaded(true);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Trigger invalidateSize when map visibility changes
  useEffect(() => {
    const map = mapRef.current;
    if (map && isVisible) {
      setTimeout(() => {
        map.invalidateSize({ animate: true });
      }, 100);
    }
  }, [isVisible]);

  // Render heatmap layer from real incident coordinates
  useEffect(() => {
    const L = (window as any).L;
    const map = mapRef.current;
    if (!L || !map || !mapLoaded || !L.heatLayer) return;

    // Remove old heat layer
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (heatmapPoints.length > 0) {
      const heat = L.heatLayer(
        heatmapPoints.map(([lat, lng]) => [lat, lng, 0.6]),
        {
          radius: 18,
          blur: 25,
          maxZoom: 15,
          max: 1.0,
          gradient: {
            0.2: '#0a1628',
            0.4: '#00C6FF',
            0.6: '#7B61FF',
            0.8: '#FFB547',
            1.0: '#FF5C5C'
          }
        }
      ).addTo(map);
      heatLayerRef.current = heat;
    }
  }, [heatmapPoints, mapLoaded]);

  // Render permanent hotspot junction markers
  useEffect(() => {
    const L = (window as any).L;
    const map = mapRef.current;
    if (!L || !map || !mapLoaded) return;

    // Clear old hotspot markers
    hotspotMarkersRef.current.forEach(m => map.removeLayer(m));
    hotspotMarkersRef.current = [];

    hotspotData.forEach((spot) => {
      // Create a custom pulsing marker with the count
      const sizeBase = Math.min(40, Math.max(22, 16 + spot.count * 0.3));
      const color = spot.count > 50 ? '#FF5C5C' : spot.count > 30 ? '#FFB547' : '#00C6FF';
      
      const icon = L.divIcon({
        html: `<div style="
          position: relative;
          width: ${sizeBase}px;
          height: ${sizeBase}px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            position: absolute;
            inset: 0;
            background: ${color};
            border-radius: 50%;
            opacity: 0.15;
            animation: hotspot-pulse 2.5s ease-in-out infinite;
          "></div>
          <div style="
            position: relative;
            width: ${sizeBase * 0.7}px;
            height: ${sizeBase * 0.7}px;
            background: ${color};
            border-radius: 50%;
            border: 2px solid #070B14;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'JetBrains Mono', monospace;
            font-size: ${Math.max(8, sizeBase * 0.25)}px;
            font-weight: 700;
            color: #070B14;
            box-shadow: 0 0 15px ${color}66, 0 0 30px ${color}33;
          ">${spot.count}</div>
        </div>`,
        className: 'hotspot-marker',
        iconSize: [sizeBase, sizeBase],
        iconAnchor: [sizeBase / 2, sizeBase / 2]
      });

      const marker = L.marker([spot.lat, spot.lng], { icon, zIndexOffset: 1000 });

      const formatHour = (h: number) => {
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hr = h % 12 || 12;
        return `${hr}:00 ${ampm}`;
      };

      marker.bindTooltip(`
        <div style="font-family: 'JetBrains Mono', monospace; padding: 4px; min-width: 180px;">
          <strong style="color: ${color}; font-size: 12px; display: block; margin-bottom: 4px;">📍 ${spot.junction}</strong>
          <div style="display: grid; grid-template-columns: auto 1fr; gap: 2px 8px; font-size: 10px;">
            <span style="color: #64748B;">Incidents:</span>
            <span style="color: #fff; font-weight: 700;">${spot.count} recorded</span>
            <span style="color: #64748B;">Top Cause:</span>
            <span style="color: #FFB547;">${spot.topCause}</span>
            <span style="color: #64748B;">Peak Hour:</span>
            <span style="color: #00C6FF;">${formatHour(spot.peakHour)}</span>
          </div>
          <div style="margin-top: 6px; font-size: 9px; color: #475569; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px;">
            Source: Bengaluru Traffic Police Dataset
          </div>
        </div>
      `, {
        direction: 'top',
        className: 'custom-leaflet-tooltip',
        offset: [0, -(sizeBase / 2 + 5)],
        opacity: 0.97
      });

      marker.addTo(map);
      hotspotMarkersRef.current.push(marker);
    });
  }, [hotspotData, mapLoaded]);

  // Update Markers when events list changes
  useEffect(() => {
    const L = (window as any).L;
    const map = mapRef.current;
    const markerClusterGroup = markerClusterGroupRef.current;
    if (!L || !map || !markerClusterGroup || !mapLoaded) return;

    // Clear cluster group layers
    markerClusterGroup.clearLayers();

    // Re-populate markers from cache or create new ones
    const markers: any[] = [];
    events.forEach(evt => {
      const lat = evt.latitude;
      const lng = evt.longitude;
      if (lat === undefined || lng === undefined) return;

      let marker = markerCacheRef.current[evt.id];
      if (!marker) {
        const color =
          evt.status === 'completed' ? '#4CDE9A' :
          evt.severity === 'critical' ? '#FF5C5C' :
          evt.severity === 'high' ? '#FFB547' : '#00C6FF';

        const icon = L.divIcon({
          html: `<div style="
            background-color: ${color};
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid #070B14;
            box-shadow: 0 0 10px ${color};
          "></div>`,
          className: 'custom-leaflet-marker',
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });

        marker = L.marker([lat, lng], { icon });

        // Marker Click Selection
        marker.on('click', () => {
          onSelectEvent(evt.id);
        });

        // Tooltip
        marker.bindTooltip(`
          <div style="font-family: monospace; padding: 2px;">
            <strong style="color: #fff;">${evt.title}</strong><br/>
            <span style="color: #94A3B8; font-size: 10px;">Sector: ${evt.location}</span><br/>
            <span style="color: ${color}; font-size: 10px; font-weight: bold; text-transform: uppercase;">${evt.severity} severity</span>
          </div>
        `, {
          direction: 'top',
          className: 'custom-leaflet-tooltip',
          offset: [0, -10],
          opacity: 0.95
        });

        markerCacheRef.current[evt.id] = marker;
      }

      markers.push(marker);
    });

    // Add to group in one bulk transaction
    markerClusterGroup.addLayers(markers);
  }, [events, mapLoaded]);

  // Update selection centering & routing polylines (only real affected segments)
  useEffect(() => {
    const L = (window as any).L;
    const map = mapRef.current;
    if (!L || !map || !mapLoaded) return;

    // Clear old polylines
    polylinesRef.current.forEach(p => p.remove());
    polylinesRef.current = [];

    if (selectedEventId) {
      const selectedEvent = events.find(e => e.id === selectedEventId);
      if (selectedEvent && selectedEvent.latitude && selectedEvent.longitude) {
        const lat = selectedEvent.latitude;
        const lng = selectedEvent.longitude;

        // Pan map smoothly to focused event
        map.setView([lat, lng], 15, { animate: true });

        // Draw affected jam line segment — ONLY when real end-coordinates exist from CSV data
        if (selectedEvent.endlatitude && selectedEvent.endlongitude && selectedEvent.endlatitude !== 0) {
          const jamPolyline = L.polyline([
            [lat, lng],
            [selectedEvent.endlatitude, selectedEvent.endlongitude]
          ], {
            color: '#FF5C5C',
            weight: 5,
            opacity: 0.8,
            dashArray: '8, 8'
          }).addTo(map);

          jamPolyline.bindTooltip('<b>Affected Street (Congested Segment)</b>', { sticky: true, className: 'custom-leaflet-tooltip' });
          polylinesRef.current.push(jamPolyline);
        }

        // Draw a congestion radius circle around the incident
        const radiusCircle = L.circle([lat, lng], {
          radius: 300,
          color: '#FF5C5C',
          fillColor: '#FF5C5C',
          fillOpacity: 0.08,
          weight: 1,
          dashArray: '4, 6'
        }).addTo(map);
        polylinesRef.current.push(radiusCircle);
      }
    }
  }, [selectedEventId, mapLoaded]);

  const handleReset = () => {
    if (mapRef.current) {
      mapRef.current.setView([12.9715987, 77.5945627], 12, { animate: true });
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const activeEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-white/10 shadow-2xl">
      
      {/* Custom Styles for Tooltips and Clusters */}
      <style>{`
        .custom-leaflet-tooltip {
          background-color: #0F172A !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #fff !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
          padding: 6px 10px !important;
        }
        .custom-leaflet-tooltip::before {
          border-top-color: #0F172A !important;
        }
        .marker-cluster-small {
          background-color: rgba(0, 198, 255, 0.15) !important;
        }
        .marker-cluster-small div {
          background-color: rgba(0, 198, 255, 0.5) !important;
          color: #fff !important;
          font-family: monospace !important;
          font-weight: bold !important;
        }
        .marker-cluster-medium {
          background-color: rgba(123, 97, 255, 0.15) !important;
        }
        .marker-cluster-medium div {
          background-color: rgba(123, 97, 255, 0.5) !important;
          color: #fff !important;
          font-family: monospace !important;
          font-weight: bold !important;
        }
        .marker-cluster-large {
          background-color: rgba(255, 92, 92, 0.15) !important;
        }
        .marker-cluster-large div {
          background-color: rgba(255, 92, 92, 0.5) !important;
          color: #fff !important;
          font-family: monospace !important;
          font-weight: bold !important;
        }
        .marker-cluster {
          border-radius: 50% !important;
        }
        @keyframes hotspot-pulse {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.8); opacity: 0.05; }
        }
        .hotspot-marker {
          background: transparent !important;
          border: none !important;
        }
      `}
      </style>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <span className="text-[#00C6FF] font-mono text-xs tracking-wider uppercase">Live Operations Console</span>
          <h2 className="text-xl font-display font-medium text-white flex items-center gap-2 mt-0.5">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            Bengaluru Traffic Intelligence Grid
          </h2>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
          {hotspotData.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <Database className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-mono text-[10px]">{hotspotData.length} real hotspots loaded</span>
            </span>
          )}
          <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-slate-900/60 px-2.5 py-1 rounded-full border border-white/5">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            Active incident
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-slate-900/60 px-2.5 py-1 rounded-full border border-white/5">
            <span className="w-2.5 h-2.5 bg-[#00C6FF] rounded-full" />
            Heatmap overlay
          </span>
        </div>
      </div>

      {/* Map Stage Container */}
      <div className="w-full h-[380px] sm:h-[450px] bg-slate-950/80 rounded-xl relative overflow-hidden border border-white/5">
        
        {/* Floating Zoom & Reset Controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-[1000]">
          <button 
            type="button"
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg bg-slate-900/90 border border-white/10 text-white flex items-center justify-center font-bold text-sm hover:bg-slate-800 active:scale-95 transition cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <button 
            type="button"
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg bg-slate-900/90 border border-white/10 text-white flex items-center justify-center font-bold text-sm hover:bg-slate-800 active:scale-95 transition cursor-pointer"
            title="Zoom Out"
          >
            &minus;
          </button>
          <button 
            type="button"
            onClick={handleReset}
            className="w-8 h-8 rounded-lg bg-slate-900/90 border border-[#00C6FF]/35 text-[#00C6FF] flex items-center justify-center text-xs hover:bg-[#00C6FF]/10 active:scale-95 transition font-mono font-bold cursor-pointer"
            title="Reset Map View"
          >
            RESET
          </button>
        </div>

        {/* Info Overlay */}
        <div className="absolute top-3 left-3 bg-[#070B14]/85 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/5 text-[9.5px] font-mono text-gray-400 z-[1000] pointer-events-none">
          💡 Numbered circles = real hotspot junctions from CSV &bull; Heatmap = 8,173 incidents
        </div>

        {/* Map Mount Target */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Selected Event Details overlay inside map */}
        {activeEvent && (
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-xl p-3 flex justify-between items-center z-[1000] animate-fade-in shadow-2xl">
            <div className="flex items-start gap-2.5">
              <div className="bg-slate-850 p-2 rounded text-red-400 mt-0.5 border border-white/5">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-white font-medium text-sm truncate max-w-xs">{activeEvent.title}</span>
                  <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    activeEvent.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    activeEvent.severity === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-[#00C6FF]/10 text-[#00C6FF] border border-[#00C6FF]/30'
                  }`}>
                    {activeEvent.severity} risk
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 max-w-sm sm:max-w-xl truncate m-0">{activeEvent.description}</p>
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onSelectEvent(null); }}
              className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-500/20 px-3 py-1.5 rounded-lg border border-white/5 transition shrink-0 ml-2 cursor-pointer font-mono"
            >
              Clear Focus
            </button>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 block animate-pulse" />
          <span className="text-xs text-gray-400">Critical / Emergency Incident</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block" />
          <span className="text-xs text-gray-400">High Risk Assembly / Construction</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-[#00C6FF]/20 border border-[#00C6FF]/50 flex items-center justify-center text-[7px] text-[#00C6FF] font-bold">N</span>
          <span className="text-xs text-gray-400">Real Hotspot Junction (CSV Data)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 bg-gradient-to-r from-[#00C6FF] via-[#7B61FF] to-[#FF5C5C] block rounded" />
          <span className="text-xs text-gray-400">Incident Heatmap Density</span>
        </div>
      </div>
    </div>
  );
}
