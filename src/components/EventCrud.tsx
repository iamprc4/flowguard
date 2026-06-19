import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Calendar, MapPin, Users, Info, Sparkles, Filter, X } from 'lucide-react';
import { TrafficEvent, EventType } from '../types.js';

interface CrudProps {
  events: TrafficEvent[];
  selectedEventId: string | null;
  onSelectEvent: (id: string | null) => void;
  onCreateEvent: (newEvent: any) => Promise<any>;
  onUpdateEvent: (id: string, updatedFields: any) => void;
  onDeleteEvent: (id: string) => void;
  currentUserRole: string;
}

export default function EventCrud({
  events,
  selectedEventId,
  onSelectEvent,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  currentUserRole
}: CrudProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(50);

  React.useEffect(() => {
    setVisibleCount(50);
  }, [searchQuery, typeFilter]);

  // Field updates state for Field Officers
  const [fieldReportNotes, setFieldReportNotes] = useState('');
  const [fieldReportLevel, setFieldReportLevel] = useState('Critical Gridlock');
  const [selectedReportId, setSelectedReportId] = useState('');
  const [activeReportLogs, setActiveReportLogs] = useState<Array<{ id: string; timestamp: string; notes: string; level: string; eventTitle: string }>>([
    {
      id: 'log-1',
      timestamp: 'Just now',
      notes: 'Heavy vehicle buildup monitored at Chinnaswamy stadium West gate. Recommending holding left turns.',
      level: 'Moderate congestion',
      eventTitle: 'M. Chinnaswamy Stadium Cricket Match Dispersal Gridlock'
    }
  ]);

  const handleFieldReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldReportNotes.trim() || !selectedReportId) {
      alert('Please select an active event and input field notes.');
      return;
    }
    const targetEvt = events.find(item => item.id === selectedReportId);
    if (!targetEvt) return;
    
    const newLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: fieldReportNotes.trim(),
      level: fieldReportLevel,
      eventTitle: targetEvt.title
    };

    setActiveReportLogs(prev => [newLog, ...prev]);
    setFieldReportNotes('');
    alert(`⚡ SUCCESS: Field incident report dispatched to HQ for event: ${targetEvt.title}`);
  };

  // Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'rally' as EventType,
    location: '',
    startTime: '',
    endTime: '',
    crowdSize: 5000,
    description: '',
    status: 'scheduled' as 'scheduled' | 'active' | 'completed'
  });

  const [editEvent, setEditEvent] = useState<any>({});

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreateEvent(newEvent);
      setNewEvent({
        title: '',
        type: 'rally',
        location: '',
        startTime: '',
        endTime: '',
        crowdSize: 5000,
        description: '',
        status: 'scheduled'
      });
      setShowAddForm(false);
    } catch (err) {
      alert('Error creating event.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    onUpdateEvent(id, editEvent);
    setShowEditForm(null);
  };

  const startEdit = (evt: TrafficEvent) => {
    setEditEvent({ ...evt });
    setShowEditForm(evt.id);
  };

  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          evt.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || evt.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const locationsOptions = [
    'M. Chinnaswamy Stadium, Bengaluru',
    'Kanteerava Stadium, Cubbon Park Road',
    'Palace Grounds, Bengaluru',
    'BBMP Head Office, Hudson Circle',
    'Vidhana Soudha, Dr. Ambedkar Veedhi',
    'National College Ground, Basavanagudi',
    'Koramangala Indoor Stadium',
    'Mekhri Circle, Bengaluru',
    'Silk Board Junction, Hosur Road',
    'MG Road Metro Station',
    'Cubbon Park, Bengaluru',
    'Lalbagh Botanical Garden',
    'Electronic City, Phase 1',
    'Whitefield Main Road',
    'Marathahalli Bridge, ORR',
    'Hebbal Flyover, Bellary Road',
    'Yeshwanthpura Circle',
    'KR Market, City Market Area',
    'Town Hall Junction, Bengaluru',
    'Mysore Road Toll Gate',
  ];

  return (
    <div className="space-y-6">
      
      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-white/5">
        <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search events, sectors..."
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#00C6FF] transition"
            />
          </div>

          {/* Type dropdown */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full sm:w-44 bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00C6FF] transition appearance-none"
            >
              <option value="all">All Event Types</option>
              <option value="rally">Political Rally</option>
              <option value="festival">Religious Festival</option>
              <option value="sports">Sports Match</option>
              <option value="construction">Construction Block</option>
              <option value="emergency">Emergency Closure</option>
              <option value="gathering">Public Gathering</option>
            </select>
          </div>
        </div>

        {currentUserRole === 'admin' ? (
          <button 
            type="button"
            onClick={() => setShowAddForm(true)}
            className="w-full md:w-auto bg-[#00C6FF] text-slate-950 font-display font-semibold hover:bg-opacity-90 px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Schedule New Event
          </button>
        ) : (
          <div className="text-[10px] font-mono text-gray-500 bg-[#070B14]/40 px-3 py-2 rounded-lg border border-white/5 flex items-center gap-1.5 self-center">
            <span>🔒 SCHEDULING RESTRICTED &bull; COMMAND HQ ONLY</span>
          </div>
        )}
      </div>

      {/* SPECIAL ACTIVE ROLE OPERATIONS MODULE */}
      {currentUserRole === 'officer' && (
        <div className="glass-panel rounded-2xl p-6 border border-[#4CDE9A]/20 bg-slate-950/40 space-y-4">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <span className="text-[#4CDE9A] font-mono text-[10px] uppercase tracking-wider block">Field Officer Dispatch Desk</span>
              <h3 className="text-sm font-display font-medium text-white my-0.5">Submit Live Bangalore Spot Congestion Report</h3>
              <p className="text-gray-400 text-xs m-0">Send instant telemetry updates directly to Commissioner Saleem''s Command Dashboard.</p>
            </div>
            <span className="bg-[#4CDE9A]/10 text-[#4CDE9A] border border-[#4CDE9A]/25 text-[9px] font-mono px-2 py-1 rounded-lg uppercase tracking-wider">
              On-Field Authorization Active
            </span>
          </div>

          <form onSubmit={handleFieldReportSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/40 p-4 rounded-xl border border-white/5">
            <div>
              <label className="text-[10px] font-mono text-gray-400 block mb-1.5 uppercase">Select Target Incident Corridor</label>
              <select
                value={selectedReportId}
                onChange={e => setSelectedReportId(e.target.value)}
                className="w-full bg-slate-950/90 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4CDE9A]"
              >
                <option value="">-- Choose Incident --</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title} ({ev.location})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 block mb-1.5 uppercase">Congestion Index Level</label>
              <select
                value={fieldReportLevel}
                onChange={e => setFieldReportLevel(e.target.value)}
                className="w-full bg-slate-950/90 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4CDE9A]"
              >
                <option value="Minor Buildup">Minor Buildup (Green/Slow)</option>
                {<option value="Moderate Slowdown">Moderate Slowdown (Yellow/Creep)</option>}
                <option value="Critical Gridlock">Critical Gridlock (Red/Stopped)</option>
                <option value="Emergency Lockdown">Emergency Lockdown (Flashing/Closed)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 block mb-1.5 uppercase">Live Officer Notes / Bottleneck Details</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={fieldReportNotes}
                  onChange={e => setFieldReportNotes(e.target.value)}
                  placeholder="e.g. Broken BMTC bus on left lane, holding water drainage line..."
                  className="flex-1 bg-slate-950/90 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4CDE9A]"
                />
                <button
                  type="submit"
                  className="bg-[#4CDE9A] hover:bg-opacity-90 text-slate-950 font-bold px-4 rounded-lg text-xs"
                >
                  Post
                </button>
              </div>
            </div>
          </form>

          {/* Active reported logs stream */}
          <div className="space-y-2 mt-4">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Logged On-field Spot Reps (Mem Sync)</span>
            <div className="max-h-24 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
              {activeReportLogs.map((log) => (
                <div key={log.id} className="flex gap-2.5 items-center justify-between p-2 bg-[#070B14]/80 rounded-lg border border-white/5 text-[11px]">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[#4CDE9A] font-mono text-[9px]">{log.timestamp}</span>
                    <span className="text-amber-400 font-mono text-[9px] uppercase">[{log.level}]</span>
                    <span className="text-gray-400 font-medium truncate">&quot;{log.notes}&quot;</span>
                  </div>
                  <span className="text-[9.5px] text-gray-500 shrink-0 italic">{log.eventTitle.substring(0, 30)}...</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentUserRole === 'logistics' && (
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 bg-slate-950/40 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-cyan-400 font-mono text-[9px] uppercase tracking-wider block">BMTC Transit Logistics Advisory</span>
            <h4 className="text-sm font-display font-medium text-white my-0.5">Transit & Commercial Re-routing Active</h4>
            <p className="text-xs text-gray-400 leading-relaxed m-0">
              Your role is authorized for public bus fleet delays & terminal sync. Please use the <b className="text-cyan-400 font-mono text-[10.5px]">Diversion Routes</b> control panel tab to simulate alternative schedules and dispatch advisory alerts.
            </p>
          </div>
        </div>
      )}

      {/* Grid List of Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.slice(0, visibleCount).map(evt => {
          const isSelected = evt.id === selectedEventId;
          const statusColors = 
            evt.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            evt.status === 'active' ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' :
            'bg-blue-500/10 text-blue-400 border-blue-500/20';

          const riskColors = 
            evt.severity === 'critical' ? 'text-red-400' :
            evt.severity === 'high' ? 'text-amber-400' : 'text-cyan-400';

          return (
            <div 
              key={evt.id}
              className={`glass-panel rounded-2xl p-5 border transition-all duration-300 relative flex flex-col justify-between ${
                isSelected 
                  ? 'border-[#00C6FF] bg-slate-900/60 shadow-lg shadow-[#00C6FF]/5' 
                  : 'border-white/5 hover:border-white/10 hover:bg-slate-900/30'
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase border ${statusColors}`}>
                    {evt.status}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-gray-500">RISK:</span>
                    <span className={`text-[11px] font-mono font-bold uppercase ${riskColors}`}>
                      {evt.riskScore}% {evt.severity}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-display font-medium text-white mb-2 line-clamp-1">{evt.title}</h3>
                
                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">{evt.description}</p>

                <div className="space-y-1.5 text-xs text-gray-400 font-sans border-t border-white/5 pt-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    <span>Location Sector: <b className="text-white">{evt.location}</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <span>Timing: <span className="text-gray-300">{new Date(evt.startTime).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-gray-500" />
                    <span>Impact Size: <b className="text-white">{evt.crowdSize.toLocaleString()}</b> people</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-5 pt-3 border-t border-white/5 gap-2">
                <button 
                  onClick={() => onSelectEvent(isSelected ? null : evt.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-lg font-mono transition text-center ${
                    isSelected 
                      ? 'bg-[#00C6FF] text-slate-950 font-bold' 
                      : 'bg-slate-800 text-gray-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {isSelected ? 'Focused' : 'Focus Event'}
                </button>

                {currentUserRole === 'admin' && (
                  <div className="flex gap-1">
                    <button 
                      onClick={() => startEdit(evt)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white rounded-lg transition"
                      title="Edit telemetry"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => onDeleteEvent(evt.id)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                      title="Purge event dataset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="col-span-2 text-center py-12 glass-panel rounded-2xl border border-white/5">
            <Info className="w-10 h-10 text-gray-600 mx-auto mb-2" />
            <span className="text-sm text-gray-500 font-mono">No registered events correspond to your select criteria.</span>
          </div>
        )}
      </div>

      {filteredEvents.length > visibleCount && (
        <div className="flex justify-center pt-4">
          <button 
            type="button"
            onClick={() => setVisibleCount(prev => prev + 50)}
            className="bg-slate-900 hover:bg-[#00C6FF]/10 hover:text-[#00C6FF] border border-white/5 hover:border-[#00C6FF]/35 text-gray-300 font-mono text-xs px-6 py-2.5 rounded-xl transition cursor-pointer"
          >
            Load More Incidents (+50)
          </button>
        </div>
      )}

      {/* CREATE EVENT FULL DIAGLAM/MODAL MODIFIER */}
      {showAddForm && (
        <div className="fixed inset-0 bg-[#060A13]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-white/10 p-6 md:p-8 animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#00C6FF]" />
              <h2 className="text-xl font-display font-medium text-white my-0">Record Municipal Incident</h2>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Incident Title</label>
                <input 
                  type="text" 
                  required
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="e.g. Political Rally near Madison Plaza"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00C6FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Event Typology</label>
                  <select
                    value={newEvent.type}
                    onChange={e => setNewEvent({...newEvent, type: e.target.value as EventType})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="rally">Political Rally</option>
                    <option value="festival">Religious Festival</option>
                    <option value="sports">Sports Match</option>
                    <option value="construction">Construction Block</option>
                    <option value="emergency">Emergency Closure</option>
                    <option value="gathering">Public Gathering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Sector Location</label>
                  <select
                    value={newEvent.location}
                    onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {locationsOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Start timing</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={newEvent.startTime}
                    onChange={e => setNewEvent({...newEvent, startTime: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">End timing</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={newEvent.endTime}
                    onChange={e => setNewEvent({...newEvent, endTime: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Attendance / Scale</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={newEvent.crowdSize}
                    onChange={e => setNewEvent({...newEvent, crowdSize: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Deployment Status</label>
                  <select
                    value={newEvent.status}
                    onChange={e => setNewEvent({...newEvent, status: e.target.value as any})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active Block</option>
                    <option value="completed">Completed Shift</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Incident Description</label>
                <textarea 
                  rows={3}
                  required
                  value={newEvent.description}
                  onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Detail the exact road channels blocked, march routes, and emergency priorities..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="text-[11px] font-mono bg-slate-900 px-3 py-2.5 rounded-lg text-[#00C6FF] border border-[#00C6FF]/10 leading-relaxed font-sans mt-2">
                👉 <b>Explainable Gemini Loop active:</b> Saving triggers our server-side LLM to instantly generate congestion level projections, barricade estimations, and primary detour pathways.
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-900 border border-white/5 hover:bg-slate-800 text-gray-300 text-xs px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#00C6FF] hover:bg-opacity-90 text-slate-950 font-display font-semibold text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  {loading && <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />}
                  Schedule & Run AI Engine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EXTRAS DIALOG */}
      {showEditForm && (
        <div className="fixed inset-0 bg-[#060A13]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-white/10 p-6 md:p-8 animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowEditForm(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-display font-medium text-white mb-4">Edit Telemetry Dataset</h2>

            <form onSubmit={(e) => handleEditSubmit(e, showEditForm)} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={editEvent.title || ''}
                  onChange={e => setEditEvent({...editEvent, title: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Attendance Scale</label>
                  <input 
                    type="number" 
                    required
                    value={editEvent.crowdSize || 0}
                    onChange={e => setEditEvent({...editEvent, crowdSize: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Status</label>
                  <select
                    value={editEvent.status || 'scheduled'}
                    onChange={e => setEditEvent({...editEvent, status: e.target.value as any})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowEditForm(null)}
                  className="bg-slate-900 border border-white/5 hover:bg-slate-800 text-gray-300 text-xs px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-[#00C6FF] text-slate-950 font-display font-semibold text-xs px-5 py-2 rounded-xl cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
