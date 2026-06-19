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
  Area
} from 'recharts';
import { BarChart3, Download, RefreshCw, Calendar, Users, Percent, CheckCircle } from 'lucide-react';
import { HistoricalEvent, AuditLog } from '../types.js';

interface HistProps {
  historicalData: HistoricalEvent[];
  auditLogs: AuditLog[];
  currentUserRole: string;
}

export default function HistoricalView({ historicalData, auditLogs, currentUserRole }: HistProps) {
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [downloadingCSV, setDownloadingCSV] = useState(false);
  const [exportComplete, setExportComplete] = useState<string | null>(null);

  // Formatted data for Recharts Graphing
  const chartData = historicalData.map(h => ({
    name: h.title.length > 20 ? h.title.substring(0, 15) + '..' : h.title,
    accuracy: h.predictionAccuracy,
    reduction: h.congestionReduction,
    crowd: h.crowdSize
  }));

  const triggerExport = (type: 'pdf' | 'csv') => {
    if (type === 'pdf') {
      setDownloadingPDF(true);
      setTimeout(() => {
        setDownloadingPDF(false);
        setExportComplete('PDF Intelligence Report successfully compiled and saved to local disk.');
        setTimeout(() => setExportComplete(null), 3000);
      }, 1500);
    } else {
      setDownloadingCSV(true);
      setTimeout(() => {
        setDownloadingCSV(false);
        
        // Build CSV contents
        const headers = 'ID,Timestamp,User,Role,Action,Details\n';
        const rows = auditLogs.map(l => `"${l.id}","${l.timestamp}","${l.userName}","${l.role}","${l.action}","${l.details}"`).join('\n');
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flowguard_traffic_audit_logs_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        setExportComplete('Audit Logs CSV file generated and downloaded successfully.');
        setTimeout(() => setExportComplete(null), 3000);
      }, 1200);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Exporters Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-900/60 rounded-xl border border-white/5 gap-3">
        <div>
          <span className="text-[#00C6FF] font-mono text-xs uppercase tracking-wider">Historical Analytics Dashboard</span>
          <h2 className="text-lg font-display text-white my-0.5">Municipal Learning System & Audit Controls</h2>
        </div>
        <div className="flex gap-2 self-stretch sm:self-center">
          <button
            onClick={() => triggerExport('csv')}
            disabled={downloadingCSV}
            className="flex-1 sm:flex-initial bg-slate-850 hover:bg-slate-800 text-gray-300 font-mono text-xs px-4 py-2.5 rounded-xl border border-white/5 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {downloadingCSV ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#00C6FF]" />
            ) : (
              <Download className="w-4 h-4 text-gray-500" />
            )}
            Audit CSV
          </button>
          <button
            onClick={() => triggerExport('pdf')}
            disabled={downloadingPDF}
            className="flex-1 sm:flex-initial bg-[#00C6FF] text-slate-950 font-display font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition hover:bg-opacity-90 cursor-pointer"
          >
            {downloadingPDF ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download Briefing PDF
          </button>
        </div>
      </div>

      {exportComplete && (
        <div className="bg-[#4CDE9A]/10 border border-[#4CDE9A]/20 text-[#4CDE9A] text-xs px-4 py-3 rounded-xl animate-fade-in flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {exportComplete}
        </div>
      )}

      {/* Analytics Recharts Curves Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Model Accuracy Comparison Recharts Curve */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-slate-900/30">
          <h3 className="text-sm font-mono text-[#00C6FF] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Prediction Accuracy & Cost Reduction %
          </h3>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="acc-gradient" cx="0" cy="0" r="1">
                    <stop offset="0%" stopColor="#00C6FF" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00C6FF" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="red-gradient" cx="0" cy="0" r="1">
                    <stop offset="0%" stopColor="#7B61FF" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#7B61FF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={9} className="font-mono" />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={9} className="font-mono" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="accuracy" name="Prediction Accuracy" stroke="#00C6FF" strokeWidth={2} fill="url(#acc-gradient)" />
                <Area type="monotone" dataKey="reduction" name="Congestion Reduction" stroke="#7B61FF" strokeWidth={2} fill="url(#red-gradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crowd size distributions */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-slate-900/30">
          <h3 className="text-sm font-mono text-[#7B61FF] uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Crowd Attendance Load vs Peak hours Index
          </h3>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="yellow-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFB547" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#FFB547" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={9} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={9} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="crowd" name="Attendees Count" fill="url(#yellow-grad)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Historical logs table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 bg-slate-900/20">
        <div className="px-5 py-4 bg-slate-950/60 border-b border-white/5 font-display font-medium text-white flex justify-between items-center">
          <span className="text-sm">Historical Incident Registry Log</span>
          <span className="text-[10px] text-gray-500 font-mono">DATABASE VERSION: FLO09-v2</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0b0f1a]/80 text-slate-400 border-b border-white/5 sm:text-xs">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Historical Incident Name</th>
                <th className="p-4">Attendees scale</th>
                <th className="p-4">Police deployed</th>
                <th className="p-4">Model Accuracy</th>
                <th className="p-4">Congestion Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {historicalData.map((h) => (
                <tr key={h.id} className="hover:bg-white/[0.02] transition">
                  <td className="p-4 font-mono text-slate-500">{h.date}</td>
                  <td className="p-4 font-sans text-white font-medium">{h.title}</td>
                  <td className="p-4">{h.crowdSize.toLocaleString()}</td>
                  <td className="p-4">{h.officersDeployed} Officers</td>
                  <td className="p-4 text-[#00C6FF] font-bold">{h.predictionAccuracy}% Mode</td>
                  <td className="p-4 text-[#4CDE9A] font-bold">-{h.congestionReduction}% saved</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CORE SYSTEM AUDIT LEDGER - ROLE PROTECTED */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 bg-slate-900/20 mt-6 font-mono">
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
            <div className="text-3xl filter saturate-50 brightness-75">
              🔐
            </div>
            <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest">Clearance Level Blocked</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed font-sans">
              System Security Ledger requires <b className="text-gray-400 font-mono text-[10px] bg-slate-950 px-1 py-0.5 rounded">Clearance Level 1 IPS PKI Encryption certificate</b>. Your role is restricted from auditing other personnel actions logs.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
