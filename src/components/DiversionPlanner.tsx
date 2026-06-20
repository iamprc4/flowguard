import React, { useState } from 'react';
import { Navigation, Clock, Timer, Milestone, HelpCircle, CheckSquare } from 'lucide-react';
import { TrafficEvent, DiversionRoute } from '../types.js';

interface RouteProps {
  events: TrafficEvent[];
  selectedEventId: string | null;
  routes: DiversionRoute[];
  currentUserRole: string;
}

export default function DiversionPlanner({ events, selectedEventId, routes, currentUserRole }: RouteProps) {
  const activeEvent = events.find(e => e.id === selectedEventId);
  const activeRoute = routes.find(r => r.eventId === selectedEventId);

  // Logistics-only simulator state
  const [simulating, setSimulating] = useState(false);
  const [syncedFleetCount, setSyncedFleetCount] = useState(45);
  const [bmtcDelayMin, setBmtcDelayMin] = useState(12);
  const [hasBroadcast, setHasBroadcast] = useState(false);

  const triggerFleetSimulation = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      // Simulate improving delays with routing
      setBmtcDelayMin(4);
      setSyncedFleetCount(prev => prev + 12);
      alert(`🔄 BMTC TRANSIT LOOP COMPLETE: Simulated bypass routing activated for ${activeEvent?.location || 'active zone'}. Fleet turnaround delays reduced from ${bmtcDelayMin} minutes to 4 minutes across 57 BMTC buses on the affected corridor.`);
    }, 1200);
  };

  const handleManifestExport = () => {
    alert(`📥 DOWNLOAD COMPLETE: Exported BMTC Fleet Manifest for ${activeEvent?.location || 'active zone'} — 57 buses, 3 corridors (Mysore Road, Hosur Road, Outer Ring Road) to local workstation.`);
  };

  const handleBroadcastAdvisory = () => {
    setHasBroadcast(true);
    alert(`📢 BROADCAST SENT: Live public advisory feeds dispatched to 14 VMS panels across Bengaluru Traffic Management Centre. Affected corridors near ${activeEvent?.location || 'the active incident zone'} have been notified on Mysore Road, Hosur Road, and Outer Ring Road digital signboards.`);
  };

  return (
    <div className="space-y-6">

      {/* Empty state when no event is selected */}
      {!activeEvent && (
        <div className="glass-panel rounded-2xl p-10 border border-white/10 bg-slate-900/30 text-center">
          <div className="w-16 h-16 bg-[#00C6FF]/10 border border-[#00C6FF]/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Navigation className="w-8 h-8 text-[#00C6FF]" />
          </div>
          <h3 className="text-lg font-display font-semibold text-white mb-2">No Event Selected</h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-4">
            Select or create an event from the <span className="text-[#00C6FF] font-medium">Event Operations</span> tab to see AI-generated diversion routes, bypass corridors, and transit fleet simulations.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-950/60 border border-white/5 rounded-full text-xs text-gray-500 font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            Routes are generated automatically when an event is focused
          </div>
        </div>
      )}

      {activeEvent && (
        <>
      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-white/5 bg-slate-900/40">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 font-mono text-[10px] uppercase">Transit Time Saved</span>
            <span className="bg-[#4CDE9A]/10 text-[#4CDE9A] border border-[#4CDE9A]/15 text-[9.5px] font-mono px-2 py-0.5 rounded-full">Optimal</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white">
              {activeRoute ? activeRoute.estimatedTimeSavings : '15'}
            </span>
            <span className="text-gray-400 text-xs font-mono">Min per driver</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed mt-2 m-0 mt-2">The calculated difference between traversing the congested incident corridor versus the active primary bypass route.</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 bg-slate-900/40">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 font-mono text-[10px] uppercase">Rerouted Traffic Ratio</span>
            <span className="bg-[#00C6FF]/10 text-[#00C6FF] border border-[#00C6FF]/15 text-[9.5px] font-mono px-2 py-0.5 rounded-full">SLA</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white">30%</span>
            <span className="text-gray-400 text-xs font-mono">Target Ratio</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed mt-2 m-0 mt-2">Desired fraction of municipal commuter traffic redirected by digital variable signage boards (VMS).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Diversion Detailed Pathways */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/10 bg-slate-900/30">
          <h3 className="text-base font-display font-medium text-white mb-4 flex items-center gap-2">
            <Milestone className="w-5 h-5 text-[#00C6FF]" />
            AI Rerouting Detour Plans
          </h3>

          <div className="space-y-4">
            {activeRoute ? (
              <>
                {/* Primary Route */}
                <div className="bg-slate-950/60 p-4 border-l-4 border-[#00C6FF] rounded-r-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-xs font-medium uppercase font-mono tracking-widest text-[#00C6FF]">Primary Bypass Route</span>
                    <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#4CDE9A]" />
                      Fastest option
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-semibold my-0 mb-1 font-display">
                      {activeRoute.primaryRouteName.toUpperCase()}
                    </h4>
                    {/* Path steps list */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {activeRoute.primaryPath.map((road, rIdx) => (
                        <React.Fragment key={rIdx}>
                          <span className="bg-slate-900 border border-white/5 text-[10px] px-2.5 py-1 rounded-md text-gray-300 font-mono">
                            {road}
                          </span>
                          {rIdx < activeRoute.primaryPath.length - 1 && (
                            <span className="text-gray-600 font-mono text-xs">➔</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Secondary Route */}
                <div className="bg-slate-950/60 p-4 border-l-4 border-[#7B61FF] rounded-r-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-xs font-medium uppercase font-mono tracking-widest text-[#7B61FF]">Secondary Alternative</span>
                    <span className="text-[10px] font-mono text-gray-500">Commercial / Freight Bypass</span>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-semibold my-0 mb-1 font-display">
                      {activeRoute.secondaryRouteName.toUpperCase()}
                    </h4>
                    {/* Path steps list */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {activeRoute.secondaryPath.map((road, rIdx) => (
                        <React.Fragment key={rIdx}>
                          <span className="bg-slate-900 border border-white/5 text-[10px] px-2.5 py-1 rounded-md text-gray-400 font-mono">
                            {road}
                          </span>
                          {rIdx < activeRoute.secondaryPath.length - 1 && (
                            <span className="text-gray-600 font-mono text-xs">➔</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500 text-xs font-mono">
                Please focus an event from the main dashboard card to generate specific routing bypass steps.
              </div>
            )}
          </div>
        </div>

        {/* Comparison Index Matrix / BMTC TRANSIT LOGISTICS DASHBOARD */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-slate-900/30">
          {currentUserRole === 'logistics' ? (
            <div className="space-y-5">
              <h3 className="text-base font-display font-medium text-cyan-400 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-cyan-400 animate-pulse" />
                BMTC & Transit Fleet Console
              </h3>

              <div className="bg-slate-950/80 p-4 border border-cyan-500/20 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-gray-500 uppercase">Active Synced Fleet</span>
                  <span className="text-sm font-bold font-mono text-white">
                    {syncedFleetCount} Buses Online
                  </span>
                </div>

                <div className="space-y-1 bg-[#070B14]/60 p-3 rounded-lg border border-white/5">
                  <span className="text-[8px] font-mono text-gray-500 block uppercase">Projected Loop Turnaround Delay</span>
                  <span className="text-lg font-bold font-mono block mt-0.5 text-cyan-400">
                    {simulating ? 'Simulating Calculation...' : `${bmtcDelayMin} Minutes Added`}
                  </span>
                </div>

                <div className="space-y-2">
                  <button 
                    type="button"
                    onClick={triggerFleetSimulation}
                    disabled={simulating}
                    className="w-full bg-cyan-500 text-slate-950 py-2 rounded-lg text-xs font-semibold font-display hover:bg-opacity-90 disabled:opacity-50 transition active:scale-95"
                  >
                    {simulating ? 'Analyzing Node Multicast...' : 'Run Bypass Fleet Simulation'}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button"
                      onClick={handleManifestExport}
                      className="bg-slate-800 hover:bg-slate-700 text-gray-200 py-1.5 rounded-lg text-[10px] border border-white/5 font-mono"
                    >
                      Export Manifest
                    </button>
                    <button 
                      type="button"
                      onClick={handleBroadcastAdvisory}
                      className={`py-1.5 rounded-lg text-[10px] border font-mono transition ${
                        hasBroadcast
                          ? 'bg-[#4CDE9A]/15 text-[#4CDE9A] border-[#4CDE9A]/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-gray-200 border-white/5'
                      }`}
                    >
                      {hasBroadcast ? 'Advisory Sent' : 'Send Advisory'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Transit Sector Health alerts */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Transit Line Health (Grid status)</span>
                <div className="p-3 bg-slate-950/65 rounded-xl border border-white/5 text-[11px] leading-relaxed text-gray-400">
                  <div className="flex justify-between border-b border-white/5 pb-1.5 mb-1.5">
                    <b className="text-white">Majestic - Outer Ring Road</b>
                    <span className="text-[#4CDE9A] font-mono font-bold">Stable (32km/h)</span>
                  </div>
                  <div className="flex justify-between">
                    <b className="text-white">Bannerghatta Expressway</b>
                    <span className="text-red-400 font-mono font-bold animate-pulse">Critical (8km/h)</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-base font-display font-medium text-white mb-4 flex items-center gap-2">
                <Timer className="w-5 h-5 text-[#4CDE9A]" />
                Congestion Metrics
              </h3>

              <div className="space-y-3">
                {activeRoute ? (
                  activeRoute.congestionComparisonList.map((comp, idx) => (
                    <div key={idx} className="bg-slate-950/60 p-3.5 border border-white/5 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-white text-[11px] font-medium block">{comp.route}</span>
                        <span className="text-[10px] text-gray-500 font-mono">Est: {comp.travelTimeMinutes} mins</span>
                      </div>
                      <span className={`text-[9.5px] font-mono uppercase px-2 py-0.5 rounded border ${
                        comp.congestionLevel === 'critical' || comp.congestionLevel === 'high'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                          : comp.congestionLevel === 'medium'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {comp.congestionLevel}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 text-xs font-mono">
                    No active metrics.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>

        </>
      )}
    </div>
  );
}
