import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { BarChart3, Download, RefreshCw, Database, MapPin, Clock, AlertTriangle, Shield, TrendingUp, Activity, CheckCircle, Zap } from 'lucide-react';
import { AuditLog } from '../types.js';

interface DatasetStats {
  totalIncidents: number;
  policeStations: number;
  zones: number;
  corridors: number;
  hourlyDistribution: number[];
  topCauses: { name: string; count: number }[];
  topCorridors: { name: string; count: number }[];
  topZones: { name: string; count: number }[];
  topJunctions: { name: string; count: number; lat: number; lng: number }[];
}

interface RealDataDashboardProps {
  datasetStats: DatasetStats | null;
  auditLogs: AuditLog[];
  currentUserRole: string;
}

const CAUSE_COLORS = ['#00C6FF', '#7B61FF', '#FFB547', '#FF5C5C', '#4CDE9A', '#E879F9', '#F97316', '#38BDF8', '#A78BFA', '#FB923C'];
const ZONE_COLORS = ['#00C6FF', '#7B61FF', '#FFB547', '#FF5C5C', '#4CDE9A', '#E879F9', '#F97316', '#38BDF8', '#A78BFA', '#FB923C'];

export default function RealDataDashboard({ datasetStats, auditLogs, currentUserRole }: RealDataDashboardProps) {
  const [downloadingCSV, setDownloadingCSV] = useState(false);
  const [exportComplete, setExportComplete] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'causes' | 'audit'>('overview');

  if (!datasetStats || datasetStats.totalIncidents === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#00C6FF] animate-spin mx-auto" />
          <p className="text-gray-400 text-sm font-mono">Loading Bengaluru traffic dataset intelligence...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const hourlyData = datasetStats.hourlyDistribution.map((count, hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hr = hour % 12 || 12;
    return {
      hour: `${hr}${ampm}`,
      fullHour: `${String(hour).padStart(2, '0')}:00`,
      incidents: count,
      isHighlight: count > 600
    };
  });

  const peakHour = hourlyData.reduce((max, curr) => curr.incidents > max.incidents ? curr : max, hourlyData[0]);
  const lowHour = hourlyData.reduce((min, curr) => curr.incidents < min.incidents ? curr : min, hourlyData[0]);

  const corridorData = datasetStats.topCorridors.map(c => ({
    name: c.name.length > 16 ? c.name.substring(0, 14) + '..' : c.name,
    fullName: c.name,
    incidents: c.count
  }));

  const causeData = datasetStats.topCauses.map(c => ({
    name: c.name,
    value: c.count,
    percentage: ((c.count / datasetStats.totalIncidents) * 100).toFixed(1)
  }));

  const zoneData = datasetStats.topZones.map(z => ({
    name: z.name.replace('Zone ', 'Z'),
    fullName: z.name,
    incidents: z.count
  }));

  const triggerExport = () => {
    setDownloadingCSV(true);
    setTimeout(() => {
      setDownloadingCSV(false);
      const headers = 'ID,Timestamp,User,Role,Action,Details\n';
      const rows = auditLogs.map(l => `"${l.id}","${l.timestamp}","${l.userName}","${l.role}","${l.action}","${l.details}"`).join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flowguard_audit_logs_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setExportComplete('Audit Logs CSV exported successfully.');
      setTimeout(() => setExportComplete(null), 3000);
    }, 1200);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2 shadow-2xl">
        <p className="text-[10px] text-gray-400 font-mono mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-xs font-bold" style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gradient-to-r from-slate-900/80 to-[#0a1628] rounded-2xl border border-white/5 gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00C6FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-4 h-4 text-[#00C6FF]" />
            <span className="text-[#00C6FF] font-mono text-xs uppercase tracking-wider">Real Dataset Intelligence</span>
          </div>
          <h2 className="text-lg font-display text-white my-0.5">Bengaluru Traffic Pattern Analysis</h2>
          <p className="text-xs text-gray-500 font-mono m-0">Computed from {datasetStats.totalIncidents.toLocaleString()} verified incidents &bull; Bengaluru Traffic Police</p>
        </div>
        <div className="flex gap-2 self-stretch sm:self-center relative z-10">
          <div className="flex bg-slate-950/60 rounded-xl border border-white/5 overflow-hidden">
            {(['overview', 'causes', 'audit'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSection(tab)}
                className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition ${
                  activeSection === tab
                    ? 'bg-[#00C6FF]/10 text-[#00C6FF] font-bold'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {tab === 'overview' ? 'Patterns' : tab === 'causes' ? 'Causes & Zones' : 'Audit Log'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {exportComplete && (
        <div className="bg-[#4CDE9A]/10 border border-[#4CDE9A]/20 text-[#4CDE9A] text-xs px-4 py-3 rounded-xl animate-fade-in flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {exportComplete}
        </div>
      )}

      {/* HERO STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#00C6FF]/10 flex items-center justify-center"><Activity className="w-4 h-4 text-[#00C6FF]" /></div>
          </div>
          <span className="text-2xl font-display font-bold text-white block">{datasetStats.totalIncidents.toLocaleString()}</span>
          <span className="text-[10px] text-gray-500 font-mono uppercase">Total Incidents</span>
        </div>
        <div className="glass-panel rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#7B61FF]/10 flex items-center justify-center"><Shield className="w-4 h-4 text-[#7B61FF]" /></div>
          </div>
          <span className="text-2xl font-display font-bold text-white block">{datasetStats.policeStations}</span>
          <span className="text-[10px] text-gray-500 font-mono uppercase">Police Stations</span>
        </div>
        <div className="glass-panel rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FFB547]/10 flex items-center justify-center"><MapPin className="w-4 h-4 text-[#FFB547]" /></div>
          </div>
          <span className="text-2xl font-display font-bold text-white block">{datasetStats.zones}</span>
          <span className="text-[10px] text-gray-500 font-mono uppercase">Traffic Zones</span>
        </div>
        <div className="glass-panel rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#4CDE9A]/10 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-[#4CDE9A]" /></div>
          </div>
          <span className="text-2xl font-display font-bold text-white block">{datasetStats.corridors}</span>
          <span className="text-[10px] text-gray-500 font-mono uppercase">Major Corridors</span>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Peak Hour Insight Call-out */}
          <div className="bg-gradient-to-r from-[#FF5C5C]/5 to-[#FFB547]/5 border border-[#FFB547]/15 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFB547]/10 flex items-center justify-center border border-[#FFB547]/20 shrink-0">
              <Zap className="w-6 h-6 text-[#FFB547]" />
            </div>
            <div>
              <h3 className="text-white font-display font-semibold text-sm m-0 mb-1">🔥 Key Insight: Peak Hour Pattern Detected</h3>
              <p className="text-xs text-gray-300 m-0 leading-relaxed font-sans">
                <strong className="text-[#FFB547]">{peakHour.incidents.toLocaleString()} incidents</strong> at <strong className="text-[#00C6FF]">{peakHour.fullHour} IST</strong> — 
                that's <strong className="text-[#FF5C5C]">{Math.round(peakHour.incidents / lowHour.incidents)}× more</strong> than the quietest hour ({lowHour.fullHour} with just {lowHour.incidents} incidents). 
                This pattern reveals overnight vehicle breakdowns dominate Bengaluru's incident profile. FlowGuard pre-deploys resources by 20:00 IST — 60 minutes before peak — to prevent gridlock formation across all major corridors.
              </p>
            </div>
          </div>

          {/* Incidents by Hour Chart — THE JAW DROPPER */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-slate-900/30">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-mono text-[#00C6FF] uppercase tracking-wider flex items-center gap-2 mb-0.5">
                  <Clock className="w-4 h-4" />
                  Incidents by Hour of Day (IST)
                </h3>
                <p className="text-[10px] text-gray-500 font-mono m-0">Distribution across 24 hours — {datasetStats.totalIncidents.toLocaleString()} total incidents</p>
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hour-bar-high" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF5C5C" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#FF5C5C" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="hour-bar-normal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00C6FF" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#00C6FF" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="hour" stroke="rgba(255,255,255,0.4)" fontSize={9} className="font-mono" interval={0} angle={-45} textAnchor="end" height={45} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={9} className="font-mono" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="incidents" name="Incidents" radius={[3, 3, 0, 0]}>
                    {hourlyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isHighlight ? 'url(#hour-bar-high)' : 'url(#hour-bar-normal)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TOP CORRIDORS BAR CHART */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-slate-900/30">
              <h3 className="text-sm font-mono text-[#7B61FF] uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Top Corridors by Incident Count
              </h3>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={corridorData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="corridor-grad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#00C6FF" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={9} />
                    <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={9} width={100} className="font-mono" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="incidents" name="Incidents" fill="url(#corridor-grad)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TOP HOTSPOT JUNCTIONS TABLE */}
            <div className="glass-panel rounded-2xl border border-white/10 bg-slate-900/30 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h3 className="text-sm font-mono text-[#FFB547] uppercase tracking-wider flex items-center gap-2 m-0">
                  <MapPin className="w-4 h-4" />
                  Top 15 Hotspot Junctions
                </h3>
                <p className="text-[10px] text-gray-500 font-mono m-0 mt-1">Real GPS-verified junctions from Bengaluru Traffic Police data</p>
              </div>
              <div className="overflow-y-auto max-h-[280px]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0b0f1a]/80 text-slate-400 border-b border-white/5 sticky top-0">
                    <tr>
                      <th className="px-4 py-2.5">#</th>
                      <th className="px-4 py-2.5">Junction</th>
                      <th className="px-4 py-2.5 text-right">Incidents</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {datasetStats.topJunctions.map((j, idx) => (
                      <tr key={j.name} className="hover:bg-white/[0.02] transition">
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold ${
                            idx < 3 ? 'bg-[#FF5C5C]/15 text-[#FF5C5C]' : 'bg-slate-800 text-gray-400'
                          }`}>
                            {idx + 1}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-white font-sans text-xs">{j.name}</td>
                        <td className="px-4 py-2.5 text-right">
                          <span className={`font-bold ${idx < 3 ? 'text-[#FF5C5C]' : idx < 6 ? 'text-[#FFB547]' : 'text-[#00C6FF]'}`}>
                            {j.count}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CAUSES & ZONES TAB */}
      {activeSection === 'causes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* EVENT CAUSE PIE/DONUT CHART */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-slate-900/30">
              <h3 className="text-sm font-mono text-[#FFB547] uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Incident Cause Breakdown
              </h3>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={causeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {causeData.map((_, idx) => (
                        <Cell key={`cell-${idx}`} fill={CAUSE_COLORS[idx % CAUSE_COLORS.length]} stroke="#070B14" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', fontSize: '11px' }}
                      formatter={(value: any, name: any, props: any) => [`${value.toLocaleString()} (${props.payload.percentage}%)`, props.payload.name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {causeData.slice(0, 8).map((c, idx) => (
                  <div key={c.name} className="flex items-center gap-1.5 text-[10px]">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: CAUSE_COLORS[idx % CAUSE_COLORS.length] }} />
                    <span className="text-gray-400 truncate">{c.name}</span>
                    <span className="text-gray-500 ml-auto">{c.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ZONE DISTRIBUTION */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-slate-900/30">
              <h3 className="text-sm font-mono text-[#4CDE9A] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Zone-wise Incident Distribution
              </h3>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={zoneData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="zone-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4CDE9A" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#4CDE9A" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={8} className="font-mono" angle={-35} textAnchor="end" height={50} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={9} className="font-mono" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="incidents" name="Incidents" fill="url(#zone-grad)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Zone summary */}
              <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
                {datasetStats.topZones.slice(0, 4).map((z, idx) => (
                  <div key={z.name} className="flex items-center justify-between text-[10px] bg-slate-950/40 px-2.5 py-1.5 rounded-lg border border-white/5">
                    <span className="text-gray-400 truncate">{z.name}</span>
                    <span className="text-white font-bold font-mono ml-2">{z.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vehicle Breakdown Dominance Callout */}
          <div className="bg-[#00C6FF]/5 border border-[#00C6FF]/15 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#00C6FF]/10 flex items-center justify-center border border-[#00C6FF]/20 shrink-0">
              <AlertTriangle className="w-6 h-6 text-[#00C6FF]" />
            </div>
            <div>
              <h3 className="text-white font-display font-semibold text-sm m-0 mb-1">📊 Key Finding: Vehicle Breakdown Dominance</h3>
              <p className="text-xs text-gray-300 m-0 leading-relaxed font-sans">
                <strong className="text-[#00C6FF]">{causeData[0]?.name}</strong> accounts for <strong className="text-[#FFB547]">{causeData[0]?.percentage}%</strong> of all incidents ({causeData[0]?.value.toLocaleString()} out of {datasetStats.totalIncidents.toLocaleString()}). 
                This strongly suggests that <strong className="text-white">proactive tow-truck positioning</strong> at top hotspot junctions would prevent the majority of traffic disruptions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOG TAB */}
      {activeSection === 'audit' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 font-mono">System activity audit trail</span>
            <button
              onClick={triggerExport}
              disabled={downloadingCSV}
              className="bg-slate-900 hover:bg-slate-800 text-gray-300 font-mono text-xs px-4 py-2.5 rounded-xl border border-white/5 flex items-center gap-2 transition cursor-pointer"
            >
              {downloadingCSV ? <RefreshCw className="w-4 h-4 animate-spin text-[#00C6FF]" /> : <Download className="w-4 h-4 text-gray-500" />}
              Export Audit CSV
            </button>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 bg-slate-900/20 font-mono">
            <div className="px-5 py-4 bg-slate-950/60 border-b border-white/5 flex justify-between items-center">
              <span className="text-xs uppercase font-bold tracking-widest text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse" />
                Core Security Audit Log Ledger
              </span>
              <span className="text-[9px] bg-slate-800 text-[#00C6FF] px-2 py-0.5 rounded border border-white/5 uppercase">Admin clearance: {currentUserRole === 'admin' ? 'unlocked' : 'restricted'}</span>
            </div>

            {currentUserRole === 'admin' ? (
              <div className="overflow-x-auto animate-fade-in">
                <table className="w-full text-left text-[11px] leading-relaxed">
                  <thead className="bg-[#0b0f1a]/80 text-gray-500 border-b border-white/5 uppercase font-bold tracking-widest">
                    <tr>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Operative Identity</th>
                      <th className="p-4">User Role</th>
                      <th className="p-4">Dispatched Action</th>
                      <th className="p-4">Audit Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-950/40 transition">
                        <td className="p-4 text-gray-500">{log.timestamp}</td>
                        <td className="p-4 font-medium text-white">{log.userName}</td>
                        <td className="p-4 text-[#00C6FF] uppercase font-bold">[{log.role}]</td>
                        <td className="p-4 text-emerald-400">{log.action}</td>
                        <td className="p-4 text-slate-400 font-sans">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center bg-[#070b14]/90 space-y-3 relative z-10 animate-fade-in border-t border-white/5">
                <div className="text-3xl filter saturate-50 brightness-75">🔐</div>
                <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest">Clearance Level Blocked</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed font-sans">
                  System Security Ledger requires <b className="text-gray-400 font-mono text-[10px] bg-slate-950 px-1 py-0.5 rounded">Clearance Level 1 IPS PKI Encryption certificate</b>. Your role is restricted from auditing other personnel actions logs.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
