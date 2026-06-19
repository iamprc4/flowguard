import React, { useState } from 'react';
import { Shield, Hammer, Clipboard, CheckCircle, Radio, Clock, UserCheck } from 'lucide-react';
import { TrafficEvent, ResourcePlan } from '../types.js';

interface ResourceProps {
  events: TrafficEvent[];
  selectedEventId: string | null;
  resourcePlans: ResourcePlan[];
  currentUserRole: string;
}

export default function ResourcePanel({ events, selectedEventId, resourcePlans, currentUserRole }: ResourceProps) {
  const [dispatchedOfficers, setDispatchedOfficers] = useState<Record<string, boolean>>({});
  
  // Officer level state
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [GPSLatLong, setGPSLatLong] = useState('12.9716° N, 77.5946° E (Command HQ Static)');
  const [safeArrival, setSafeArrival] = useState(false);

  const handleCheckInToggle = () => {
    if (!checkedIn) {
      setCheckedIn(true);
      setCheckInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      // Generate some mock GPS coordinates for Bangalore active beats
      const rLat = (12.9 + Math.random() * 0.1).toFixed(4);
      const rLon = (77.5 + Math.random() * 0.1).toFixed(4);
      setGPSLatLong(`${rLat}° N, ${rLon}° E (Bangalore Field Beat GPS)`);
      alert(`🛰️ GPS HANDSHAKE SECURED: Checked into active beat duty successfully!`);
    } else {
      setCheckedIn(false);
      setCheckInTime(null);
      setSafeArrival(false);
    }
  };

  const activeEvent = events.find(e => e.id === selectedEventId);
  const activePlan = resourcePlans.find(r => r.eventId === selectedEventId);

  const toggleDispatch = (name: string) => {
    if (currentUserRole !== 'admin') {
      alert('⚠️ ACCESS DENIED: Dispatched checklists are managed by Command Admin Commissioner Saleem.');
      return;
    }
    setDispatchedOfficers(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="space-y-6">
      
      {/* Overview stats header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="glass-panel rounded-2xl p-5 border border-white/5 bg-slate-900/40">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 font-mono text-[10px] uppercase">Roster Status</span>
            <span className="bg-[#00C6FF]/10 text-[#00C6FF] border border-[#00C6FF]/15 text-[9.5px] font-mono px-2 py-0.5 rounded-full">HQ Sync</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-medium text-white">
              {activePlan ? activePlan.officersNeeded : '12'}
            </span>
            <span className="text-gray-500 text-xs font-mono">Officers Allocated</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed mt-2 m-0">Recommended officer density based on crowd estimation and high-speed intersection corridors.</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 bg-slate-900/40">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 font-mono text-[10px] uppercase">Obstacle Defences</span>
            <span className="bg-amber-400/10 text-amber-400 border border-amber-400/15 text-[9.5px] font-mono px-2 py-0.5 rounded-full">Active</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-medium text-white">
              {activePlan ? activePlan.barricadesNeeded : '30'}
            </span>
            <span className="text-gray-500 text-xs font-mono">Steel Barricades</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed mt-2 m-0">Steel interlocking crowd control barricades assigned to block private vehicle left turns at nodes.</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5 bg-slate-900/40 animate-fade-in">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 font-mono text-[10px] uppercase">Utilization efficacy</span>
            <span className="bg-[#4CDE9A]/10 text-[#4CDE9A] border border-[#4CDE9A]/15 text-[9.5px] font-mono px-2 py-0.5 rounded-full">Optimizer score</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-medium text-white">
              {activePlan ? activePlan.utilizationScore : '88'}%
            </span>
            <span className="text-gray-500 text-xs font-mono">Efficacy score</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed mt-2 m-0">Predicted manpower efficiency. Reducing redundant standby officer hours saves public budget.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Physical placements Assignments */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-slate-900/30">
          <h3 className="text-base font-display font-medium text-white mb-4 flex items-center gap-2">
            <Clipboard className="w-5 h-5 text-[#00C6FF]" />
            Site-Specific Officer Allocations
          </h3>

          <div className="space-y-3">
            {activePlan && activePlan.assignments ? (
              activePlan.assignments.map((as, idx) => (
                <div key={idx} className="bg-slate-950/60 p-4 border border-white/5 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-xs font-medium font-display">{as.location}</span>
                    <span className="text-[10px] font-mono bg-slate-800 text-[#00C6FF] px-2 py-0.5 rounded border border-white/5">
                      {as.officersCount} Officers assigned
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-normal m-0">{as.details}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 text-xs font-mono">
                No active event focus. Choose an incident from the events panel to display policing lists.
              </div>
            )}
          </div>
        </div>

        {/* Shift Rosters & Mobilization Actions */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-slate-900/30">
          {currentUserRole === 'officer' ? (
            <div className="space-y-5">
              <h3 className="text-base font-display font-medium text-emerald-400 flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                GPS Duty Check-in & Beat Logs
              </h3>

              <div className="bg-slate-950/80 p-4 border border-[#4CDE9A]/20 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-gray-500 uppercase">My Badge Status</span>
                  <span className={`text-[10.5px] font-mono px-2 py-0.5 rounded ${
                    checkedIn ? 'bg-[#4CDE9A]/15 text-[#4CDE9A] border border-[#4CDE9A]/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}>
                    {checkedIn ? '🟢 ACTIVE COMPLIANCE SHIFT' : '🔴 NO SHIFT CHECK-IN'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-gray-500 block uppercase">Telemetry Beat GPS Coordinates</span>
                  <span className="text-xs text-white font-mono block">{GPSLatLong}</span>
                </div>

                {checkedIn && (
                  <div className="space-y-1.5 animate-fade-in text-[11px] text-gray-400">
                    <div className="flex justify-between">
                      <span>Roster Handshake:</span>
                      <span className="text-white font-mono">{checkInTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Visual Target Safety Inspection:</span>
                      <button 
                        type="button"
                        onClick={() => { setSafeArrival(s => !s); alert(safeArrival ? 'Inspection reset.' : 'Verified Chinnaswamy/Bannerghatta sector corridor borders are clear!'); }}
                        className={`text-[9px] font-mono px-2 py-0.5 rounded border transition ${
                          safeArrival ? 'bg-[#4CDE9A]/20 text-[#4CDE9A] border-[#4CDE9A]/45' : 'bg-slate-800 text-gray-400 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {safeArrival ? '✓ CORRIDORS CONFIRMED SECURE' : '⏳ MARK REPORT SECURE'}
                      </button>
                    </div>
                  </div>
                )}

                <button 
                  type="button"
                  onClick={handleCheckInToggle}
                  className={`w-full py-2.5 rounded-lg text-xs font-display font-semibold transition duration-200 ${
                    checkedIn 
                      ? 'bg-red-500/20 text-red-300 border border-red-500/35 hover:bg-red-500/30' 
                      : 'bg-[#4CDE9A] text-slate-950 hover:bg-opacity-95 shadow-md shadow-[#4CDE9A]/10'
                  }`}
                >
                  {checkedIn ? 'End Active Field Duty Shift' : 'Initiate Secure GPS Beat Check-in'}
                </button>
              </div>

              {/* Guidelines */}
              <div className="p-3.5 bg-[#070B14] rounded-xl border border-white/5 space-y-1">
                <span className="text-[8.5px] font-mono text-gray-500 block uppercase">IPS Duty Directive</span>
                <p className="text-[10.5px] text-slate-400 leading-relaxed m-0">
                  Field personnel are required by IPS standard protocol to hold active GPS pings on the FlowGuard grid when patrolling near congested stadium or boulevard exits.
                </p>
              </div>
            </div>
          ) : currentUserRole === 'logistics' ? (
            <div className="space-y-4">
              <h3 className="text-base font-display font-medium text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-500" />
                Staff Roster Restrictions
              </h3>
              <div className="p-12 text-center bg-slate-950/50 rounded-2xl border border-white/5 space-y-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-amber-500 border border-white/10">
                  🔒
                </div>
                <h4 className="text-sm font-display font-medium text-white my-0">Command Authorization Required</h4>
                <p className="text-xs text-gray-400 leading-normal max-w-sm mx-auto m-0">
                  Officer dispatch rosters and physical barricade deployments can only be updated by the prime administrator **IPS Chief Saleem**.
                </p>
              </div>
            </div>
          ) : (
            // Admin default view: Interactive Checklist
            <>
              <h3 className="text-base font-display font-medium text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#7B61FF]" />
                Command Officer Dispatch & Mobilize
              </h3>

              <div className="space-y-4">
                {activePlan && activePlan.shiftSchedules ? (
                  activePlan.shiftSchedules.map((sh, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center border-b border-white/5 pb-1">
                        <span className="text-gray-300 text-xs font-semibold">{sh.shiftName}</span>
                        <span className="text-[#00C6FF] text-[10px] font-mono font-bold bg-[#00C6FF]/10 px-2 rounded-full">{sh.hours}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {sh.personnel.map((p, pIdx) => {
                          const isDispatched = dispatchedOfficers[p] || false;
                          return (
                            <div 
                              key={pIdx}
                              onClick={() => toggleDispatch(p)}
                              className={`flex items-center justify-between p-2.5 border rounded-xl cursor-pointer transition select-none ${
                                isDispatched 
                                  ? 'bg-[#4CDE9A]/15 border-[#4CDE9A]/30 text-[#4CDE9A]' 
                                  : 'bg-slate-950/40 border-white/5 text-gray-400 hover:border-white/15'
                              }`}
                            >
                              <span className="text-[11px] font-mono">{p}</span>
                              {isDispatched ? (
                                <UserCheck className="w-3.5 h-3.5 text-[#4CDE9A]" />
                              ) : (
                                <span className="text-[9.5px] font-mono text-gray-600">Pending</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 text-xs font-mono">
                    Select an active event focus on the left checklist to manage physical officer dispatches.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
}
