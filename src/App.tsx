import React, { useState, useEffect } from 'react';
import {
  Shield,
  Map,
  Plus,
  Calendar,
  Navigation,
  Users,
  BarChart3,
  Bot,
  Bell,
  LogOut,
  Search,
  FileText,
  Terminal,
  Lock,
  Radio,
  User,
  Grid,
  Menu,
  X,
  AlertTriangle,
  MapPin,
  Sparkles,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

import { TrafficEvent, TrafficPrediction, ResourcePlan, DiversionRoute, HistoricalEvent, Notification, AuditLog } from './types.js';
import InteractiveMap from './components/InteractiveMap.js';
import LandingPage from './components/LandingPage.js';
import AuthPage from './components/AuthPage.js';
import AIInsightsPanel from './components/AIInsightsPanel.js';
import EventCrud from './components/EventCrud.js';
import ResourcePanel from './components/ResourcePanel.js';
import DiversionPlanner from './components/DiversionPlanner.js';
import RealDataDashboard from './components/RealDataDashboard.js';
import OnboardingOverlay from './components/OnboardingOverlay.js';

export default function App() {
  const [viewState, setViewState] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [currentTab, setCurrentTab] = useState<'overview' | 'events' | 'resources' | 'routes' | 'analytics' | 'ai-advisor'>('overview');
  const [bangaloreDataset, setBangaloreDataset] = useState<any[]>([]);
  const [hotspotData, setHotspotData] = useState<any[]>([]);
  const [datasetStats, setDatasetStats] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // App States synchronized with backend endpoints
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [events, setEvents] = useState<TrafficEvent[]>([]);
  const [predictions, setPredictions] = useState<TrafficPrediction[]>([]);
  const [resourcePlans, setResourcePlans] = useState<ResourcePlan[]>([]);
  const [routes, setRoutes] = useState<DiversionRoute[]>([]);
  const [historicalEvents, setHistoricalEvents] = useState<HistoricalEvent[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState({
    activeEventsCount: 0,
    criticalEventsCount: 0,
    totalOfficers: 0,
    totalBarricades: 0
  });

  // Interactive UI indicators
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [globalSearchCode, setGlobalSearchCode] = useState('');
  const [bellDropdownOpen, setBellDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [reloadingData, setReloadingData] = useState(false);

  // Authenticate and load initial telemetry on mount
  useEffect(() => {
    console.log('viewState changed to:', viewState);
    const token = localStorage.getItem('flowguard_token');
    console.log('token found:', token);
    if (token) {
      fetchSessionProfile();
    }
    loadPlatformData();
  }, []);

  // Per-user onboarding trigger — fires when currentUser changes (on login)
  useEffect(() => {
    if (currentUser && currentUser.id) {
      const dismissedKey = 'flowguard_onboarding_dismissed_' + currentUser.id;
      const dismissed = localStorage.getItem(dismissedKey);
      if (!dismissed) {
        setShowOnboarding(true);
      } else {
        setShowOnboarding(false);
      }
    }
  }, [currentUser]);

  // Fetch details for the selected event on-demand
  useEffect(() => {
    if (!selectedEventId) return;

    const fetchDetails = async () => {
      try {
        const [pred, resPlan, route] = await Promise.all([
          fetch(`/api/predictions/${selectedEventId}`).then(r => r.json()),
          fetch(`/api/resources/${selectedEventId}`).then(r => r.json()),
          fetch(`/api/routes/${selectedEventId}`).then(r => r.json())
        ]);

        setPredictions(prev => {
          const filtered = prev.filter(p => p.eventId !== selectedEventId);
          return [...filtered, pred];
        });
        setResourcePlans(prev => {
          const filtered = prev.filter(p => p.eventId !== selectedEventId);
          return [...filtered, resPlan];
        });
        setRoutes(prev => {
          const filtered = prev.filter(p => p.eventId !== selectedEventId);
          return [...filtered, route];
        });
      } catch (err) {
        console.error('Failed to load on-demand details for event:', selectedEventId, err);
      }
    };

    fetchDetails();
  }, [selectedEventId]);

  const fetchSessionProfile = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('flowguard_token')}` }
      });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        setViewState('dashboard');
      } else {
        localStorage.removeItem('flowguard_token');
      }
    } catch (err) {
      console.error('Session handshaking error:', err);
    }
  };

  const loadPlatformData = async () => {
    setReloadingData(true);
    try {
      const [evts, globalStats, hists, notifs, logs, dataset, hotspots, dStats] = await Promise.all([
        fetch('/api/events').then(r => r.json()),
        fetch('/api/stats').then(r => r.json()),
        fetch('/api/historical').then(r => r.json()),
        fetch('/api/notifications').then(r => r.json()),
        fetch('/api/logs').then(r => r.json()),
        fetch('/api/bangalore-dataset').then(r => r.json()).catch(() => []),
        fetch('/api/hotspot-stats').then(r => r.json()).catch(() => []),
        fetch('/api/dataset-stats').then(r => r.json()).catch(() => null)
      ]);

      setEvents(evts);
      setStats(globalStats);
      setHistoricalEvents(hists);
      setNotifications(notifs);
      setAuditLogs(logs);
      setBangaloreDataset(dataset);
      setHotspotData(hotspots);
      setDatasetStats(dStats);

      // Auto-focus first active event to populate views nicely
      if (evts.length > 0 && !selectedEventId) {
        const active = evts.find((e: any) => e.status === 'active') || evts[0];
        setSelectedEventId(active.id);
      }
    } catch (err) {
      setErrorBanner('Platform was unable to coordinate sync with the municipal database. Try reloading the dev server.');
    } finally {
      setReloadingData(false);
    }
  };

  // Log in callback
  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    setViewState('dashboard');
    setCurrentTab('overview');
  };

  // Sign out
  const handleSignOut = () => {
    localStorage.removeItem('flowguard_token');
    setCurrentUser(null);
    setViewState('login');
  };

  // CRUD events callback
  const handleCreateEvent = async (formData: any) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('flowguard_token')}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        // Load sync updates
        await loadPlatformData();
        setSelectedEventId(data.event.id);
        return data;
      } else {
        throw new Error('Events schema constraint rejected creation.');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to project event.');
      throw err;
    }
  };

  const handleUpdateEvent = async (id: string, updatedFields: any) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        await loadPlatformData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you absolute certain you wish to purge this event and associated forecast metrics?')) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedEventId(null);
        await loadPlatformData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkNotifRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      if (res.ok) {
        await loadPlatformData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter events matching unified global search
  const filteredSearchEvents = events.filter(e => {
    if (!globalSearchCode) return true;
    const cleanSearch = globalSearchCode.toLowerCase().trim();

    // Direct matches
    if (e.title.toLowerCase().includes(cleanSearch) ||
      e.location.toLowerCase().includes(cleanSearch) ||
      (e.description && e.description.toLowerCase().includes(cleanSearch))) {
      return true;
    }

    // Tokenized & spelling tolerance fallback (splits query into significant words)
    const searchTokens = cleanSearch.replace(/[^\w\s]/g, '').split(/\s+/).filter(t => t.length >= 4);
    if (searchTokens.length > 0) {
      return searchTokens.some(token => {
        // Take the prefix of the search token (e.g., 'banner' or 'chinn') to catch spelling variations
        const prefix = token.substring(0, Math.min(token.length, 5));
        return e.title.toLowerCase().includes(prefix) ||
          e.location.toLowerCase().includes(prefix);
      });
    }

    return false;
  });

  // Calculate generic dashboard statistics
  const activeEventsCount = stats.activeEventsCount;
  const criticalEventsCount = stats.criticalEventsCount;
  const totalBarricades = stats.totalBarricades;
  const totalOfficers = stats.totalOfficers;

  const activeEventObj = events.find(e => e.id === selectedEventId);
  const activePredObj = predictions.find(p => p.eventId === selectedEventId);

  // Return specific view portals
  if (viewState === 'landing') {
  return <LandingPage onGoToLogin={() => setViewState('login')} />;
}

if (viewState === 'login') {
  return <AuthPage onLoginSuccess={handleLoginSuccess} />;
}

  // Active Role description mapping
  const roleLabel =
    currentUser?.role === 'admin' ? 'Traffic Administrator' :
      currentUser?.role === 'officer' ? 'Field Officer (Beat Duty)' : 'Logistics Manager';

  return (
    <div className="min-h-screen bg-[#070B14] text-gray-100 flex flex-col md:flex-row relative selection:bg-[#00C6FF]/30 select-none">

      {/* SIDEBAR NAVIGATION GRID */}
      <aside className={`w-full md:w-64 bg-[#0A0E1A] shrink-0 border-r border-white/5 flex flex-col justify-between p-4 z-40 transition-all ${mobileMenuOpen ? 'fixed inset-0 bg-[#0A0E1A] block' : 'hidden md:flex'
        }`}>
        <div className="space-y-6">

          {/* Logo and Mobile closer */}
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-tr from-[#00C6FF] to-[#7B61FF] rounded rotate-12 flex items-center justify-center">
                <Shield className="w-4 h-4 text-slate-950 font-black" fill="#00C6FF" />
              </div>
              <div>
                <span className="font-display font-bold text-sm tracking-tight text-white block">Flow<span className="text-[#00C6FF]">Guard</span></span>
                <span className="text-[9px] text-[#00C6FF] font-mono tracking-wider uppercase block">Tactical Engine</span>
              </div>
            </div>
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User profile capsule card */}
          {currentUser && (
            <div className="bg-slate-900/60 p-3.5 border border-white/10 rounded-xl flex items-center gap-2.5 bg-gradient-to-r from-slate-900 to-slate-950">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'}
                alt="Profile Avatar"
                className="w-10 h-10 rounded-full border border-white/10 shrink-0"
              />
              <div className="overflow-hidden">
                <span className="text-white font-medium text-xs block truncate">{currentUser.name}</span>
                <span className="text-[10px] text-[#00C6FF] font-mono tracking-wider uppercase block truncate">{roleLabel}</span>
                {currentUser.badgeNumber && (
                  <span className="text-[9px] text-gray-500 font-mono block">Badge: {currentUser.badgeNumber}</span>
                )}
                <div className="mt-1">
                  {currentUser.role === 'admin' ? (
                    <span className="inline-block text-[8px] font-mono bg-red-500/10 text-red-400 border border-red-500/25 px-1.5 py-0.5 rounded font-black tracking-widest uppercase">
                      LEVEL 1 IPS CMD
                    </span>
                  ) : currentUser.role === 'officer' ? (
                    <span className="inline-block text-[8px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded font-black tracking-widest uppercase">
                      LEVEL 2 FIELD ON-DUTY
                    </span>
                  ) : (
                    <span className="inline-block text-[8px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 px-1.5 py-0.5 rounded font-black tracking-widest uppercase">
                      LEVEL 2 transit OPS
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Nav List links */}
          <nav className="space-y-1 text-xs sm:text-xs">
            <button
              onClick={() => { setCurrentTab('overview'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-mono flex items-center gap-2.5 transition ${currentTab === 'overview' ? 'bg-[#00C6FF]/10 text-[#00C6FF] border border-[#00C6FF]/15 font-bold' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
            >
              <Grid className="w-4 h-4 shrink-0" />
              Command Dashboard
            </button>

            <button
              onClick={() => { setCurrentTab('analytics'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-mono flex items-center gap-2.5 transition ${currentTab === 'analytics' ? 'bg-[#00C6FF]/10 text-[#00C6FF] border border-[#00C6FF]/15 font-bold' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              Data Intelligence
            </button>

            <button
              onClick={() => { setCurrentTab('events'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-mono flex items-center gap-2.5 transition ${currentTab === 'events' ? 'bg-[#00C6FF]/10 text-[#00C6FF] border border-[#00C6FF]/15 font-bold' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              Event Operations
            </button>

            <button
              onClick={() => { setCurrentTab('routes'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-mono flex items-center gap-2.5 transition ${currentTab === 'routes' ? 'bg-[#00C6FF]/10 text-[#00C6FF] border border-[#00C6FF]/15 font-bold' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
            >
              <Navigation className="w-4 h-4 shrink-0" />
              Diversion Planner
            </button>

            <button
              onClick={() => { setCurrentTab('resources'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-mono flex items-center gap-2.5 transition ${currentTab === 'resources' ? 'bg-[#00C6FF]/10 text-[#00C6FF] border border-[#00C6FF]/15 font-bold' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              Resource Optimizer
            </button>

            <button
              onClick={() => { setCurrentTab('ai-advisor'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-mono flex items-center gap-2.5 transition ${currentTab === 'ai-advisor' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/15 font-bold' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
            >
              <Bot className="w-4 h-4 shrink-0 animate-pulse" />
              Gemini AI Chat Advisor
            </button>
          </nav>
        </div>

        {/* Dataset Stats Card — proves real data before analysis */}
        {datasetStats && datasetStats.totalIncidents > 0 && (
          <div className="bg-gradient-to-b from-[#00C6FF]/5 to-transparent p-3 rounded-xl border border-[#00C6FF]/10 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-[#4CDE9A] rounded-full animate-pulse" />
              <span className="text-[9px] text-[#00C6FF] font-mono uppercase tracking-widest font-bold">Trained on Real Data</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-mono">Incidents</span>
                <span className="text-xs text-white font-bold font-mono">{datasetStats.totalIncidents.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-mono">Police Stations</span>
                <span className="text-xs text-white font-bold font-mono">{datasetStats.policeStations}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-mono">Traffic Zones</span>
                <span className="text-xs text-white font-bold font-mono">{datasetStats.zones}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-mono">Major Corridors</span>
                <span className="text-xs text-white font-bold font-mono">{datasetStats.corridors}</span>
              </div>
            </div>
            <div className="text-[8px] text-gray-600 font-mono pt-1 border-t border-white/5">
              Source: Bengaluru Traffic Police &bull; Mar 2023 – Mar 2024
            </div>
          </div>
        )}

        {/* Quick presets switcher and signout */}
        <div className="space-y-3 pt-6 border-t border-white/5">
          {events.length > 0 && selectedEventId && (
            <div className="bg-slate-900/40 p-2.5 rounded-lg border border-white/5 space-y-1">
              <span className="text-[9.5px] text-gray-500 font-mono uppercase block">Focusing sector:</span>
              <span className="text-[11px] text-[#00C6FF] font-mono block truncate">{activeEventObj?.title}</span>
            </div>
          )}

          <button
            onClick={handleSignOut}
            className="w-full bg-slate-900 hover:bg-red-500/20 hover:text-red-400 border border-white/5 text-gray-400 text-xs py-2.5 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer font-mono"
          >
            <LogOut className="w-4 h-4" />
            Lock Console
          </button>
        </div>
      </aside>

      {/* MAIN LAYOUT CANVAS */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* TOP STATUS HEADER BAR */}
        <header className="bg-[#0A0E1A]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 flex justify-between items-center z-30 sticky top-0">

          <div className="flex items-center gap-2 md:gap-0">
            {/* Mobile menu toggle */}
            <button className="md:hidden text-gray-400 hover:text-white p-1" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2.5 bg-slate-950/60 border border-white/10 rounded-xl px-3 py-1.5 w-64 md:w-80">
              <Search className="w-4 h-4 text-gray-500 shrink-0" />
              <input
                type="text"
                value={globalSearchCode}
                onChange={e => setGlobalSearchCode(e.target.value)}
                placeholder="Global filter: Search city events..."
                className="bg-transparent border-0 text-xs text-white focus:outline-none w-full placeholder:text-gray-500"
              />
              {globalSearchCode && (
                <button onClick={() => setGlobalSearchCode('')} className="text-gray-500 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">

            {/* Status light */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-950/40 border border-white/5 px-3 py-1.5 rounded-xl font-mono text-[10px]">
              <span className="w-2 h-2 bg-[#4CDE9A] rounded-full animate-pulse" />
              <span className="text-gray-400">INCIDENT RESPONSE: SECURE</span>
            </div>

            {/* Notification alert bell dropdown system */}
            <div className="relative">
              <button
                onClick={() => setBellDropdownOpen(!bellDropdownOpen)}
                className="relative p-2.5 bg-slate-900 border border-white/10 rounded-xl hover:border-white/20 transition text-gray-400 hover:text-white"
              >
                <Bell className="w-4 h-4" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#FF5C5C] text-slate-950 font-sans font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0A0E1A]">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {bellDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-fade-in text-xs">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="font-display font-semibold text-white">Active Dispatch Warnings</span>
                    <span className="text-[10px] text-[#00C6FF] font-mono">Real-Time Inflow</span>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => { handleMarkNotifRead(n.id); if (n.eventId) setSelectedEventId(n.eventId); setBellDropdownOpen(false); }}
                        className={`p-2.5 rounded-lg border cursor-pointer transition text-[11px] ${n.read
                          ? 'bg-slate-900/40 border-white/5 text-gray-400'
                          : 'bg-slate-900 border-[#FFB547]/20 text-white hover:border-[#00C6FF]/30'
                          }`}
                      >
                        <div className="flex justify-between items-start mb-1 gap-1">
                          <span className="font-semibold block line-clamp-1">{n.title}</span>
                          {!n.read && <span className="w-1.5 h-1.5 bg-[#00C6FF] rounded-full shrink-0 mt-1" />}
                        </div>
                        <p className="m-0 leading-normal line-clamp-2 text-gray-400">{n.message}</p>
                        <span className="text-[9px] text-gray-500 font-mono block mt-1">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <span className="text-gray-500 font-mono text-center block py-4">No warnings currently recorded.</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick presets helper */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setShowOnboarding(true)}
                className="bg-slate-900 hover:bg-[#7B61FF]/20 text-gray-400 hover:text-[#7B61FF] font-mono text-xs px-3 py-2 rounded-xl border border-white/10 hover:border-[#7B61FF]/40 transition flex items-center gap-1.5"
                title="What is this? — View the quick guide"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                What is this?
              </button>
              <button
                onClick={loadPlatformData}
                disabled={reloadingData}
                className="bg-slate-900 hover:bg-slate-800 text-gray-300 font-mono text-xs px-3.5 py-2 rounded-xl border border-white/10 hover:border-[#00C6FF]/40 transition flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${reloadingData ? 'animate-spin' : ''}`} />
                Platform Reload
              </button>
            </div>
          </div>
        </header>

        {/* ERROR PANEL WARNING */}
        {errorBanner && (
          <div className="bg-red-500/10 border-y border-red-500/20 text-red-400 px-6 py-3 text-xs flex justify-between items-center animate-shake z-10 shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorBanner}</span>
            </div>
            <button onClick={() => setErrorBanner(null)} className="text-red-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* INNER DENSE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

          {/* Focus warning if some search code is on */}
          {globalSearchCode && (
            <div className="bg-[#00C6FF]/5 border border-[#00C6FF]/15 rounded-xl px-4 py-2.5 text-xs text-[#00C6FF] flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
              <span>Interactive Filter active: showcasing {filteredSearchEvents.length} events matching keyword "<b>{globalSearchCode}</b>".</span>
            </div>
          )}

          {/* currentTab dispatcher rendering */}
          {/* PRIMARY HIGH-FIDELITY SUMMARY HERO */}
          {currentTab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

              {/* 1 */}
              <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 font-mono text-[10px] uppercase">Active Disrupted Zones</span>
                  <h3 className="text-2xl font-display font-bold text-[#FF5C5C] my-1">{activeEventsCount}</h3>
                  <span className="text-[10px] text-gray-500 font-mono block">Real-time alerts active</span>
                </div>
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20 text-[#FF5C5C] shrink-0">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
              </div>

              {/* 2 */}
              <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 font-mono text-[10px] uppercase">Critical Severity Events</span>
                  <h3 className="text-2xl font-display font-bold text-amber-400 my-1">{criticalEventsCount}</h3>
                  <span className="text-[10px] text-gray-500 font-mono block">Severe bypass required</span>
                </div>
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 text-amber-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>

              {/* 3 */}
              <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 font-mono text-[10px] uppercase">Mobilized Personnel</span>
                  <h3 className="text-2xl font-display font-bold text-[#00C6FF] my-1">{totalOfficers}</h3>
                  <span className="text-[10px] text-gray-500 font-mono block">Assigned patrols live</span>
                </div>
                <div className="w-10 h-10 bg-[#00C6FF]/10 rounded-xl flex items-center justify-center border border-[#00C6FF]/20 text-[#00C6FF] shrink-0">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* 4 */}
              <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 font-mono text-[10px] uppercase">Deployed Barriers</span>
                  <h3 className="text-2xl font-display font-bold text-[#4CDE9A] my-1">{totalBarricades}</h3>
                  <span className="text-[10px] text-gray-500 font-mono block">Lane intersections blocked</span>
                </div>
                <div className="w-10 h-10 bg-[#4CDE9A]/10 rounded-xl flex items-center justify-center border border-[#4CDE9A]/20 text-[#4CDE9A] shrink-0">
                  <Navigation className="w-5 h-5" />
                </div>
              </div>

            </div>
          )}

          {/* CORE ROW: INTERACTIVE TACTICAL MAP (PERSISTENT IN DOM) */}
          <div style={{ display: currentTab === 'overview' ? 'block' : 'none' }} className="mb-6">
            <InteractiveMap
              events={filteredSearchEvents}
              selectedEventId={selectedEventId}
              onSelectEvent={setSelectedEventId}
              routes={routes}
              isVisible={currentTab === 'overview'}
              hotspotData={hotspotData}
              heatmapPoints={datasetStats?.heatmapPoints || []}
            />
          </div>

          {currentTab === 'overview' && (
            <div className="space-y-6">

              {/* RE-ROUTING ANALYTIC SPLIT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* AI Risk Score gauge block */}
                <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-slate-900/30 flex flex-col justify-between">
                  <div>
                    <span className="text-[#00C6FF] font-mono text-[10px] uppercase tracking-wider block mb-1">Dynamic Risk Profiling</span>
                    <h3 className="text-lg font-display font-semibold text-white my-0 mb-4">Municipal Risk Meter</h3>

                    {activeEventObj ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-slate-950/60 p-4 border border-white/5 rounded-xl">
                          <div>
                            <span className="text-slate-500 font-mono text-[10px] uppercase block">Assigned Risk Index</span>
                            <span className={`text-2xl font-bold font-mono tracking-tight block ${activeEventObj.riskScore > 80 ? 'text-red-400' :
                              activeEventObj.riskScore > 50 ? 'text-amber-400' : 'text-cyan-400'
                              }`}>
                              {activeEventObj.riskScore}% severity
                            </span>
                          </div>
                          <div className={`text-xs font-mono px-3 py-1.5 rounded uppercase font-bold ${activeEventObj.severity === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            activeEventObj.severity === 'high' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-[#00C6FF]/10 text-[#00C6FF] border border-[#00C6FF]/20'
                            }`}>
                            {activeEventObj.severity} Risk
                          </div>
                        </div>

                        {/* Progress meter bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono text-gray-500">
                            <span>Safe Normal</span>
                            <span>Congested Limit</span>
                          </div>
                          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-white/5">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${activeEventObj.riskScore > 80 ? 'bg-red-400' :
                                activeEventObj.riskScore > 50 ? 'bg-amber-400' : 'bg-[#00C6FF]'
                                }`}
                              style={{ width: `${activeEventObj.riskScore}%` }}
                            />
                          </div>
                          <p className={`text-[11px] font-medium mt-2 m-0 font-sans ${activeEventObj.riskScore > 80 ? 'text-red-400' :
                            activeEventObj.riskScore > 50 ? 'text-amber-400' : 'text-cyan-400'
                            }`}>
                            {activeEventObj.riskScore > 80
                              ? '⚠ High risk — deploy additional officers before event starts'
                              : activeEventObj.riskScore > 50
                                ? '⚡ Moderate risk — activate standby units and monitor VMS feeds'
                                : '✓ Low risk — standard monitoring, no extra deployment needed'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500 text-xs font-mono">
                        Select an event coordinate markers on the map to query index curves.
                      </div>
                    )}
                  </div>

                  {activeEventObj && (
                    <div className="border-t border-white/5 pt-4 mt-6">
                      <span className="text-[10px] text-gray-500 font-mono uppercase block mb-1">RECOMMENDED COMMAND ACTIONS:</span>
                      <p className="text-xs text-gray-300 font-mono m-0 font-sans leading-normal">
                        {activeEventObj.severity === 'critical'
                          ? '👉 Mobilize extra standby squad units inside sector immediately. Verify VMS displays detour routes.'
                          : '👉 Regular gantry warnings initiated. Continue to sweep intersections with mobile police patrols.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* AI written tactical dispatch */}
                <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/10 bg-slate-900/30 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-[#7B61FF] font-mono text-[10px] uppercase tracking-wider block mb-0.5">Automated Explainable outputs</span>
                        <h3 className="text-lg font-display font-medium text-white my-0">Smart City Dispatch Advice</h3>
                      </div>
                      <span className="text-[10px] font-mono text-gray-500">POWERED BY GEMINI-3.5</span>
                    </div>

                    {activePredObj ? (
                      <div className="space-y-4">
                        <div className="bg-slate-950/60 p-4 border border-white/5 rounded-xl text-xs sm:text-xs">
                          <span className="text-[#00C6FF] font-mono text-[10px] uppercase tracking-wider block mb-1.5 font-bold">Historical Context Match</span>
                          <p className="text-gray-300 m-0 leading-normal font-sans">{activePredObj.historicalComparison}</p>
                        </div>

                        {/* list of recommendations */}
                        <div className="space-y-2">
                          <span className="text-[#7B61FF] font-mono text-[10px] uppercase tracking-wider block font-bold">AI Recommended Guidelines</span>
                          <div className="space-y-1.5">
                            {activePredObj.recommendations.map((rec, rIdx) => (
                              <div key={rIdx} className="flex gap-2 text-xs leading-normal items-start">
                                <span className="text-[#4CDE9A] font-mono">✓</span>
                                <span className="text-gray-300 font-sans">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16 text-gray-500 text-xs font-mono">
                        Select an event above to show AI compiled dispatch advisories.
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center">
                    <span className="text-gray-500 text-[10px] font-mono">FLOWGUARD ADVICE ENGINE v3</span>
                    <button
                      onClick={() => setCurrentTab('ai-advisor')}
                      className="text-xs text-cyan-400 hover:underline flex items-center gap-1.5 font-mono"
                    >
                      Ask AI custom query
                      <span>➔</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* BANGALORE SMART SENSORS DATASET FEEDS */}
              <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-slate-900/40 mt-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00C6FF]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-2 relative z-10">
                  <div>
                    <span className="text-[#00C6FF] font-mono text-[10px] uppercase tracking-wider block mb-0.5 animate-pulse">Live Bangalore IoT Inflow Feeds</span>
                    <h3 className="text-lg font-display font-medium text-white my-0">Adaptive Bangalore Traffic Sensor Dataset Context</h3>
                  </div>
                  <div className="bg-[#00C6FF]/10 text-[#00C6FF] border border-[#00C6FF]/25 text-[10px] font-mono px-2.5 py-1.5 rounded-lg uppercase tracking-wide">
                    {bangaloreDataset.length} Active Bangalore Sensors
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                  {bangaloreDataset.map((sensor, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/65 p-4 border border-white/5 hover:border-[#00C6FF]/35 transition-all duration-300 rounded-xl flex flex-col justify-between hover:translate-y-[-2px]"
                    >
                      <div>
                        {/* Sensor ID & Junction Header */}
                        <div className="flex justify-between items-start mb-2.5">
                          <span className="text-gray-500 font-mono text-[9px] uppercase tracking-widest">{sensor.sensorId}</span>
                          <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${sensor.congestionIndex > 90 ? 'bg-red-500/10 text-red-400' :
                            sensor.congestionIndex > 75 ? 'bg-amber-500/10 text-amber-400' :
                              'bg-emerald-500/10 text-emerald-400'
                            }`}>
                            Index: {sensor.congestionIndex}%
                          </span>
                        </div>

                        <h4 className="text-white text-sm font-display font-medium my-0 truncate">{sensor.junction}</h4>
                        <span className="text-gray-400 text-[10px] block font-sans truncate mb-3">{sensor.location}</span>

                        {/* Speed or telemetry */}
                        <div className="grid grid-cols-2 gap-2 bg-[#070B14]/60 p-2.5 rounded-lg border border-white/5 mb-3">
                          <div>
                            <span className="text-[8px] text-gray-500 font-mono block">SPEED LIMIT</span>
                            <span className={`text-sm font-bold font-mono block mt-0.5 ${sensor.avgSpeedKmh < 12 ? 'text-red-400' : 'text-emerald-400'}`}>
                              {sensor.avgSpeedKmh} km/h
                            </span>
                          </div>
                          <div>
                            <span className="text-[8px] text-gray-500 font-mono block">LIVE TREND</span>
                            <span className={`text-xs font-mono font-medium capitalize block mt-0.5 ${sensor.trend === 'increasing' ? 'text-red-400' :
                              sensor.trend === 'decreasing' ? 'text-emerald-400' : 'text-gray-400'
                              }`}>
                              {sensor.trend === 'increasing' ? '▲ Inflow' :
                                sensor.trend === 'decreasing' ? '▼ Clearance' : '■ Stable'}
                            </span>
                          </div>
                        </div>

                        {/* Primary bottleneck reason */}
                        <div className="space-y-1">
                          <span className="text-[8px] text-gray-500 font-mono block uppercase">Primary Bottleneck Factor</span>
                          <p className="text-[11px] text-slate-300 font-sans leading-relaxed m-0 line-clamp-2">
                            {sensor.primaryBottleneckReason}
                          </p>
                        </div>
                      </div>

                      {/* Affected sectors tags list */}
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <div className="flex flex-wrap gap-1">
                          {sensor.affectedSectors.slice(0, 3).map((sec: string, sIdx: number) => (
                            <span
                              key={sIdx}
                              className="text-[9px] font-mono bg-[#070B14] text-gray-400 px-2 py-0.5 rounded border border-white/5"
                            >
                              {sec}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                  {bangaloreDataset.length === 0 && (
                    <div className="lg:col-span-3 text-center py-6 text-gray-500 text-xs font-mono">
                      Establishing handshake with Bangalore smart telemetry stream...
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {currentTab === 'events' && (
            <EventCrud
              events={filteredSearchEvents}
              selectedEventId={selectedEventId}
              onSelectEvent={setSelectedEventId}
              onCreateEvent={handleCreateEvent}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
              currentUserRole={currentUser?.role || 'admin'}
            />
          )}

          {currentTab === 'resources' && (
            <ResourcePanel
              events={events}
              selectedEventId={selectedEventId}
              resourcePlans={resourcePlans}
              currentUserRole={currentUser?.role || 'admin'}
            />
          )}

          {currentTab === 'routes' && (
            <DiversionPlanner
              events={events}
              selectedEventId={selectedEventId}
              routes={routes}
              currentUserRole={currentUser?.role || 'admin'}
            />
          )}

          {currentTab === 'analytics' && (
            <RealDataDashboard
              datasetStats={datasetStats}
              auditLogs={auditLogs}
              currentUserRole={currentUser?.role || 'admin'}
            />
          )}

          {currentTab === 'ai-advisor' && (
            <AIInsightsPanel
              selectedEventTitle={activeEventObj?.title}
              selectedEventLocation={activeEventObj?.location}
            />
          )}

        </div>
      </main>

      {/* Onboarding Overlay — shows on first visit per user */}
      {showOnboarding && viewState === 'dashboard' && (
        <OnboardingOverlay
          onDismiss={() => {
            setShowOnboarding(false);
            if (currentUser && currentUser.id) {
              localStorage.setItem('flowguard_onboarding_dismissed_' + currentUser.id, 'true');
            }
          }}
        />
      )}

    </div>
  );
}
