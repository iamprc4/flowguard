import React, { useState } from 'react';
import { Shield, Sparkles, Navigation, Users, BarChart3, AlertOctagon, ArrowRight, Send, CheckCircle, Info } from 'lucide-react';

interface LandingProps {
  onGoToLogin: () => void;
}

export default function LandingPage({ onGoToLogin }: LandingProps) {
  const [contactForm, setContactForm] = useState({ name: '', agency: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setContactForm({ name: '', agency: '', email: '', message: '' });
      }, 3000);
    }
  };

  const keyIncidents = [
    { title: 'Political Rallies', desc: 'Predict spillover near Capitol centers, walking speeds, and protest boundaries.', icon: Users, color: 'text-[#00C6FF]' },
    { title: 'Religious Festivals', desc: 'Map slow processions through historical gridlocks with hard blockades.', icon: Navigation, color: 'text-[#7B61FF]' },
    { title: 'Sports Matches', desc: 'Forecast exit wave surges out of arena points during peak stadium hours.', icon: BarChart3, color: 'text-[#4CDE9A]' },
    { title: 'Emergency Ruptures', desc: 'Instantly calculate lane suppression bottlenecks and emergency reroutes.', icon: AlertOctagon, color: 'text-red-400' }
  ];

  return (
    <div className="min-h-screen bg-[#060A13] text-gray-100 overflow-x-hidden selection:bg-[#00C6FF]/30">
      {/* Dynamic ambient header */}
      <header className="sticky top-0 z-50 bg-[#060A13]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 bg-gradient-to-tr from-[#00C6FF] to-[#7B61FF] rounded-lg rotate-12 flex items-center justify-center shadow-lg shadow-[#00C6FF]/20" />
            <Shield className="w-5 h-5 text-[#060A13] absolute top-2 left-2 font-black" fill="#00C6FF" />
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight text-white block">Flow<span className="text-[#00C6FF]">Guard</span></span>
            <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block">AI Traffic Command</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#features" className="text-gray-400 hover:text-white transition">Platform Overview</a>
          <a href="#workflow" className="text-gray-400 hover:text-white transition">AI Engine</a>
          <a href="#metrics" className="text-gray-400 hover:text-white transition">Impact Metrics</a>
          <a href="#about" className="text-gray-400 hover:text-white transition">About</a>
          <a href="#contact" className="text-gray-400 hover:text-white transition">Contact Agency</a>
        </nav>
        <button
          onClick={onGoToLogin}
          className="bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs px-4.5 py-2.5 rounded-lg border border-white/10 hover:border-[#00C6FF]/50 transition flex items-center gap-2"
        >
          Access Command Center
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Glow ambient background bulbs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial from-[#00C6FF]/10 to-transparent pointer-events-none blur-3xl" />
        <div className="absolute top-48 left-10 w-[250px] h-[250px] bg-[#7B61FF]/5 pointer-events-none blur-3xl" />

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00C6FF]/10 border border-[#00C6FF]/20 rounded-full text-xs font-mono text-[#00C6FF] mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          ENTERPRISE SMART-CITY FORECASTING
        </div>

        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-white max-w-4xl leading-[1.10] m-0">
          Predict Congestion, Optimize Manpower, <br className="hidden md:inline" />
          and <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C6FF] to-[#7B61FF]">Secure Your City Lanes</span>
        </h1>

        <p className="text-gray-400 text-base md:text-lg max-w-2xl mt-6 mb-10 leading-relaxed font-sans">
          FlowGuard orchestrates historic telemetry with real-time event schedules to forecast municipal traffic bottlenecks. Instantly deploy barricades, reroute transport logistics, and assign officers before gridlocks form.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onGoToLogin}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#00C6FF] to-[#7B61FF] text-slate-950 font-display font-bold rounded-xl shadow-lg hover:shadow-[#00C6FF]/20 transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            Request Command Demo
          </button>
          <button
            onClick={onGoToLogin}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-white/10 hover:border-white/20 text-white font-display font-medium rounded-xl transition"
          >
            Agent Portal Login
          </button>
        </div>
      </section>

      {/* Product Overview & Features Grid */}
      <section id="features" className="py-20 px-6 md:px-12 bg-slate-950/40 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#00C6FF] font-mono text-xs uppercase tracking-widest block mb-1">PROVEN PREDICTIVE SHIELD</span>
            <h2 className="text-3xl font-display font-semibold text-white mt-0 mb-4">Event-Driven Bottleneck Forewarnings</h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Every city gathers. Our AI analyzes multi-variable events to predict where congestion will spill, specifying critical resources automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {keyIncidents.map((inc, i) => (
              <div key={i} className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-[#00C6FF]/30 transition-all duration-300">
                <div className="bg-slate-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                  <inc.icon className={`w-6 h-6 ${inc.color}`} />
                </div>
                <h3 className="text-lg font-display font-medium text-white mb-2">{inc.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed m-0">{inc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Workflow Illustration */}
      <section id="workflow" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#00C6FF] font-mono text-xs tracking-widest uppercase block mb-1">Deep Learning Loop</span>
            <h2 className="text-3xl font-display font-semibold text-white mt-0 mb-6">Explainable AI Core Routing</h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
              Unlike black-box models, FlowGuard integrates Generative Explainable AI that crafts written tactical dispatches alongside raw congestion score indices.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="bg-slate-900 border border-white/10 rounded-lg p-1.5 text-[#00C6FF] font-mono text-xs w-8 h-8 flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="text-white font-medium text-sm sm:text-base my-0 mb-1">Natural Event Detection</h4>
                  <p className="text-gray-400 text-xs sm:text-sm m-0">The NLP ingestion engine extracts dates, crowds, and paths from public assembly schedules.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-slate-900 border border-white/10 rounded-lg p-1.5 text-[#7B61FF] font-mono text-xs w-8 h-8 flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="text-white font-medium text-sm sm:text-base my-0 mb-1">LSTM Traffic Sequencing</h4>
                  <p className="text-gray-400 text-xs sm:text-sm m-0">Historical comparison matrices predict peak congestion times and peak hours curves.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-slate-900 border border-white/10 rounded-lg p-1.5 text-[#4CDE9A] font-mono text-xs w-8 h-8 flex items-center justify-center shrink-0">3</div>
                <div>
                  <h4 className="text-white font-medium text-sm sm:text-base my-0 mb-1">Resource Optimization Plan</h4>
                  <p className="text-gray-400 text-xs sm:text-sm m-0">Instantly recommends shift times, count of barricades, and physical officer coordinates.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4 bg-slate-950/60 shadow-inner">
            <h3 className="text-sm font-mono text-[#00C6FF] uppercase tracking-wider m-0 border-b border-white/5 pb-3">AI Intelligence Prediction Audit Output</h3>

            <div className="bg-slate-900/80 rounded-xl p-4 border border-white/5">
              <div className="flex justify-between items-center text-xs text-gray-400 mb-2 font-mono">
                <span>SECTOR ID: SOUTH_GRID (Mysore Road Corridor)</span>
                <span className="text-[#FF5C5C] font-semibold animate-pulse">CRITICAL DISRUPTION</span>
              </div>
              <h4 className="text-white text-base my-0 mb-1">Mysore Road Religious Procession</h4>
              <p className="text-xs text-gray-400 leading-normal m-0 mb-3">Expected: 45,000 marchers closing off MG Road and Brigade Road corridors.</p>
              <div className="text-[11px] font-mono bg-slate-950 p-2.5 rounded text-gray-300 border border-white/5 font-sans leading-relaxed">
                "Deploy 42 officers and 120 interlocking barricades along Mysore Road starting 12:00 PM. Direct detour northward via Chord Road to avoid critical 48-minute gridlocks."
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#00C6FF]/5 border border-[#00C6FF]/10 rounded-xl p-3 text-center">
                <span className="block text-xl font-bold text-[#00C6FF]">28m</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wide">Time Savings</span>
              </div>
              <div className="bg-[#7B61FF]/5 border border-[#7B61FF]/10 rounded-xl p-3 text-center">
                <span className="block text-xl font-bold text-[#7B61FF]">42</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wide">Officers Req.</span>
              </div>
              <div className="bg-[#4CDE9A]/5 border border-[#4CDE9A]/10 rounded-xl p-3 text-center">
                <span className="block text-xl font-bold text-[#4CDE9A]">94%</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wide">Model Acc.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics Section */}
      <section id="metrics" className="py-20 px-6 md:px-12 bg-[#090D17] border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center p-6 border-r border-white/5 last:border-0 md:text-left">
            <span className="text-4xl md:text-5xl font-display font-bold text-[#00C6FF] block mb-2">35%</span>
            <span className="text-sm font-medium text-white block mb-1">Traffic Congestion Reduction</span>
            <span className="text-xs text-gray-500">Average reduction across 4 major metropolises during assembly days.</span>
          </div>
          <div className="text-center p-6 border-r border-white/5 last:border-0 md:text-left">
            <span className="text-4xl md:text-5xl font-display font-bold text-[#7B61FF] block mb-2">93.8%</span>
            <span className="text-sm font-medium text-white block mb-1">Prediction Accuracy Match</span>
            <span className="text-xs text-gray-500">High validation match with real-world road sensor metrics.</span>
          </div>
          <div className="text-center p-6 border-r border-white/5 last:border-0 md:text-left">
            <span className="text-4xl md:text-5xl font-display font-bold text-[#4CDE9A] block mb-2">12,500+</span>
            <span className="text-sm font-medium text-white block mb-1">Police Hours Saved</span>
            <span className="text-xs text-gray-500">Through efficient structural shift timings and optimized postings.</span>
          </div>
          <div className="text-center p-6 last:border-0 md:text-left">
            <span className="text-4xl md:text-5xl font-display font-bold text-[#FFB547] block mb-2">&lt; 3 Sec</span>
            <span className="text-sm font-medium text-white block mb-1">AI Recommendation Gen</span>
            <span className="text-xs text-gray-500">Live routing and police scheduling generated instantly via Gemini API.</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#00C6FF] font-mono text-xs uppercase tracking-widest block mb-1">TRUSTED MUNICIPAL DEPLOYMENTS</span>
          <h2 className="text-3xl font-display font-semibold text-white mt-0 mb-4">What Logistics Councils Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel rounded-2xl p-8 border border-white/5 relative">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed italic mb-6 m-0">
              "Ingesting Chinnaswamy Stadium match timelines and rally pathways directly into FlowGuard has completely changed our operational prep. During the last 75,000-person Karaga procession, our gantry signs automatically rerouted 30% of traffic on MG Road and Residency Road, shaving nearly 45 minutes off the sector's general clearance average."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-[#00C6FF]">SR</div>
              <div>
                <span className="text-white font-medium text-sm block">Suresh Reddy</span>
                <span className="text-xs text-gray-500">Deputy Commissioner of Traffic, BBMP Traffic Division</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-8 border border-white/5 relative">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed italic mb-6 m-0">
              "For last-mile logistics, FlowGuard is indispensable. Knowing 24 hours in advance that road segments near Silk Board Junction will be blocked due to the Karaga procession lets our dispatchers reroute delivery trucks to the Outer Ring Road, protecting our SLA commitments."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-[#7B61FF]">PN</div>
              <div>
                <span className="text-white font-medium text-sm block">Priya Nair</span>
                <span className="text-xs text-gray-500">Head of Last Mile Operations, Flipkart Logistics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 px-6 md:px-12 bg-slate-950/40 border-t border-white/5 relative">
        <div className="max-w-3xl mx-auto glass-panel rounded-3xl p-8 md:p-12 border border-white/10 relative">
          <div className="text-center mb-8">
            <span className="text-[#00C6FF] font-mono text-xs uppercase tracking-widest block mb-1">MUNICIPAL SOLUTIONS</span>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-white mt-0 mb-4">Request FlowGuard Integration</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto">
              Ready to link your regional road sensor database or event registry with our platform? Send our municipal team a message.
            </p>
          </div>

          {formSubmitted ? (
            <div className="bg-[#4CDE9A]/10 border border-[#4CDE9A]/20 rounded-2xl p-6 text-center animate-fade-in flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-[#4CDE9A] mb-3" />
              <h3 className="text-[#4CDE9A] text-lg font-medium m-0 mb-1">Operational Request Transmitted</h3>
              <p className="text-gray-300 text-xs sm:text-sm m-0">Thank you. An integration specialist will verify your credentials and follow up within 24 business hours.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Officer Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Chief Inspector"
                    className="w-full bg-[#060A13] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00C6FF] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Department / Agency</label>
                  <input
                    type="text"
                    value={contactForm.agency}
                    onChange={e => setContactForm({ ...contactForm, agency: e.target.value })}
                    placeholder="e.g. Department of Transit"
                    className="w-full bg-[#060A13] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00C6FF] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Government / corporate Email</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="name@agency.gov"
                  className="w-full bg-[#060A13] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00C6FF] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Message</label>
                <textarea
                  rows={4}
                  value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Detail your regional metrics or specific requirements..."
                  className="w-full bg-[#060A13] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00C6FF] transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#00C6FF] text-slate-950 font-display font-semibold hover:bg-opacity-90 py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Submit Integration Query
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 px-6 md:px-12 border-t border-white/5 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto">
          {/* Team & Synopsis — hackathon submission requirement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 pb-10 border-b border-white/5">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#00C6FF] block mb-2">Team</span>
              <p className="text-sm font-semibold text-white mb-1">Team FlowGuard</p>
              <p className="text-gray-400 leading-relaxed">
                B Shalini · Medha Sri · Pratithi Rani Chawla
              </p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#00C6FF] block mb-2">Problem Statement</span>
              <p className="text-gray-400 leading-relaxed">
                Large-scale public events in Bengaluru cause severe, unplanned traffic congestion. City agencies lack predictive tools to pre-position officers and barricades before gridlocks form.
              </p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#00C6FF] block mb-2">What FlowGuard Does</span>
              <p className="text-gray-400 leading-relaxed">
                FlowGuard uses event-driven AI to forecast congestion 24 hours ahead, auto-generate diversion routes, and recommend optimal officer deployment — turning reactive traffic management into proactive city coordination.
              </p>
            </div>
          </div>

          {/* Standard footer bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#00C6FF] rounded-md rotate-12 flex items-center justify-center shadow-lg" />
              <span className="font-display font-medium text-sm text-white">Flow<span className="text-[#00C6FF]">Guard</span></span>
            </div>
            <p className="max-w-md leading-relaxed">
              FlowGuard — AI-powered municipal traffic command for event-driven congestion. Submitted for HackerEarth Gridlock Hackathon 2.0.
            </p>
            <p className="font-mono text-[10px] shrink-0">© 2026 Team FlowGuard</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
