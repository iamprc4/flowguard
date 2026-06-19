import React, { useState, useEffect } from 'react';
import { X, ArrowRight, MapPin, Bot, Shield, Sparkles, Database, ChevronRight, Zap, FileText, Navigation, CheckCircle2 } from 'lucide-react';

interface OnboardingOverlayProps {
  onDismiss: () => void;
}

export default function OnboardingOverlay({ onDismiss }: OnboardingOverlayProps) {
  const [currentView, setCurrentView] = useState<'overview' | 'steps'>('overview');
  const [isVisible, setIsVisible] = useState(false);
  const [animateSteps, setAnimateSteps] = useState(false);

  useEffect(() => {
    // Animate in after a brief delay
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // When switching to steps view, trigger staggered animation
  useEffect(() => {
    if (currentView === 'steps') {
      const timer = setTimeout(() => setAnimateSteps(true), 200);
      return () => clearTimeout(timer);
    } else {
      setAnimateSteps(false);
    }
  }, [currentView]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const handleContinue = () => {
    if (currentView === 'overview') {
      setCurrentView('steps');
    } else {
      handleDismiss();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#070B14]/90 backdrop-blur-lg" />
      
      {/* Modal */}
      <div className={`relative w-full max-w-2xl transform transition-all duration-500 ${
        isVisible ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'
      }`}>
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00C6FF]/20 via-[#7B61FF]/20 to-[#FF5C5C]/20 rounded-3xl blur-xl opacity-60" />
        
        <div className="relative bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-[#0a1628] px-6 py-4 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-tr from-[#00C6FF] to-[#7B61FF] rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-white font-display font-semibold text-sm block">What is FlowGuard?</span>
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Quick Guide · 10 Second Overview</span>
              </div>
            </div>
            <button 
              onClick={handleDismiss}
              className="text-gray-500 hover:text-white p-1 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            
            {currentView === 'overview' ? (
              /* === OVERVIEW SCREEN === */
              <div className="space-y-5">
                {/* Hero tagline */}
                <div className="text-center space-y-3 py-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00C6FF]/10 border border-[#00C6FF]/20 rounded-full">
                    <Zap className="w-3.5 h-3.5 text-[#00C6FF]" />
                    <span className="text-[11px] font-mono text-[#00C6FF] font-bold uppercase tracking-wider">AI-Powered Traffic Intelligence</span>
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white m-0 leading-tight">
                    Predict Congestion. Deploy Resources.{' '}
                    <span className="bg-gradient-to-r from-[#00C6FF] to-[#7B61FF] bg-clip-text text-transparent">Save Time.</span>
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed m-0 max-w-lg mx-auto">
                    FlowGuard is your AI command center for Bengaluru traffic management — powered by 
                    real incident data from 54 police stations and Gemini AI.
                  </p>
                </div>

                {/* 3-Step Preview Flow — horizontal timeline */}
                <div className="bg-slate-950/60 border border-white/5 rounded-xl p-5">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-4">HOW IT WORKS — 3 SIMPLE STEPS</span>
                  
                  <div className="flex items-start gap-0">
                    {/* Step 1 */}
                    <div className="flex-1 text-center group">
                      <div className="w-12 h-12 mx-auto bg-[#FF5C5C]/10 border border-[#FF5C5C]/25 rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6 text-[#FF5C5C]" />
                      </div>
                      <span className="text-[9px] font-mono text-[#FF5C5C] uppercase tracking-widest font-bold block">Step 1</span>
                      <span className="text-xs text-white font-display font-semibold block mt-1">Enter Event</span>
                      <span className="text-[10px] text-gray-500 block mt-0.5">Log accidents, rallies, or construction</span>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center pt-5 px-1">
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </div>

                    {/* Step 2 */}
                    <div className="flex-1 text-center group">
                      <div className="w-12 h-12 mx-auto bg-[#00C6FF]/10 border border-[#00C6FF]/25 rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                        <Bot className="w-6 h-6 text-[#00C6FF]" />
                      </div>
                      <span className="text-[9px] font-mono text-[#00C6FF] uppercase tracking-widest font-bold block">Step 2</span>
                      <span className="text-xs text-white font-display font-semibold block mt-1">AI Predicts Impact</span>
                      <span className="text-[10px] text-gray-500 block mt-0.5">Gemini analyzes historical patterns</span>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center pt-5 px-1">
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </div>

                    {/* Step 3 */}
                    <div className="flex-1 text-center group">
                      <div className="w-12 h-12 mx-auto bg-[#4CDE9A]/10 border border-[#4CDE9A]/25 rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                        <Navigation className="w-6 h-6 text-[#4CDE9A]" />
                      </div>
                      <span className="text-[9px] font-mono text-[#4CDE9A] uppercase tracking-widest font-bold block">Step 3</span>
                      <span className="text-xs text-white font-display font-semibold block mt-1">Get Deploy Plan</span>
                      <span className="text-[10px] text-gray-500 block mt-0.5">Officers, barricades & diversion routes</span>
                    </div>
                  </div>
                </div>

                {/* Data badge */}
                <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                  <Database className="w-4 h-4 text-[#00C6FF] shrink-0" />
                  <span className="text-[11px] text-gray-400 font-mono">
                    Trained on <strong className="text-white">8,173 verified incidents</strong> from Bengaluru Traffic Police across <strong className="text-[#00C6FF]">54 stations</strong> and <strong className="text-[#7B61FF]">10 zones</strong>
                  </span>
                </div>
              </div>

            ) : (
              /* === DETAILED STEPS SCREEN === */
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono text-[#00C6FF] uppercase tracking-widest font-bold">Where to find each feature</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* Step 1 Detail */}
                <div 
                  className={`flex gap-4 bg-slate-950/40 border border-white/5 rounded-xl p-4 transition-all duration-500 ${
                    animateSteps ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: '0ms' }}
                >
                  <div className="w-11 h-11 bg-[#FF5C5C]/10 border border-[#FF5C5C]/25 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#FF5C5C]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-mono text-[#FF5C5C] uppercase tracking-widest font-bold px-2 py-0.5 bg-[#FF5C5C]/10 rounded border border-[#FF5C5C]/20">Step 1</span>
                      <span className="text-sm font-display font-semibold text-white">Report or Select an Event</span>
                    </div>
                    <p className="text-[11px] text-gray-400 m-0 leading-relaxed">
                      Go to <strong className="text-[#00C6FF]">Event Operations</strong> in the sidebar to log new incidents — accidents, rallies, construction, VIP movements. 
                      Or click any hotspot on the live map to explore real data.
                    </p>
                  </div>
                </div>

                {/* Connecting line */}
                <div className="flex items-center pl-9">
                  <div className="w-px h-3 bg-gradient-to-b from-[#FF5C5C]/30 to-[#00C6FF]/30 mx-auto" />
                </div>

                {/* Step 2 Detail */}
                <div 
                  className={`flex gap-4 bg-slate-950/40 border border-white/5 rounded-xl p-4 transition-all duration-500 ${
                    animateSteps ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: '150ms' }}
                >
                  <div className="w-11 h-11 bg-[#00C6FF]/10 border border-[#00C6FF]/25 rounded-xl flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-[#00C6FF]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-mono text-[#00C6FF] uppercase tracking-widest font-bold px-2 py-0.5 bg-[#00C6FF]/10 rounded border border-[#00C6FF]/20">Step 2</span>
                      <span className="text-sm font-display font-semibold text-white">AI Predicts Traffic Impact</span>
                    </div>
                    <p className="text-[11px] text-gray-400 m-0 leading-relaxed">
                      Gemini AI analyzes historical patterns, GPS data from 54 police stations, and sensor feeds across 15 corridors 
                      to predict congestion levels and peak hours. See results on the <strong className="text-[#00C6FF]">Command Dashboard</strong>.
                    </p>
                  </div>
                </div>

                {/* Connecting line */}
                <div className="flex items-center pl-9">
                  <div className="w-px h-3 bg-gradient-to-b from-[#00C6FF]/30 to-[#4CDE9A]/30 mx-auto" />
                </div>

                {/* Step 3 Detail */}
                <div 
                  className={`flex gap-4 bg-slate-950/40 border border-white/5 rounded-xl p-4 transition-all duration-500 ${
                    animateSteps ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: '300ms' }}
                >
                  <div className="w-11 h-11 bg-[#4CDE9A]/10 border border-[#4CDE9A]/25 rounded-xl flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-[#4CDE9A]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-mono text-[#4CDE9A] uppercase tracking-widest font-bold px-2 py-0.5 bg-[#4CDE9A]/10 rounded border border-[#4CDE9A]/20">Step 3</span>
                      <span className="text-sm font-display font-semibold text-white">Get Deployment & Diversion Plan</span>
                    </div>
                    <p className="text-[11px] text-gray-400 m-0 leading-relaxed">
                      Check <strong className="text-[#00C6FF]">Resource Optimizer</strong> for officer deployments and barricade placements, 
                      and <strong className="text-[#00C6FF]">Diversion Planner</strong> for optimal re-routing — all AI-generated from real Bengaluru data.
                    </p>
                  </div>
                </div>

                {/* Completion badge */}
                <div 
                  className={`flex items-center gap-2 bg-[#4CDE9A]/5 border border-[#4CDE9A]/15 rounded-xl px-4 py-2.5 transition-all duration-500 ${
                    animateSteps ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{ transitionDelay: '450ms' }}
                >
                  <CheckCircle2 className="w-4 h-4 text-[#4CDE9A] shrink-0" />
                  <span className="text-[11px] text-[#4CDE9A] font-mono">
                    You're all set! Use the <strong>sidebar navigation</strong> to explore each section.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/5 bg-slate-950/40 flex justify-between items-center">
            {/* View indicators */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('overview')}
                className={`transition-all duration-300 rounded-full ${
                  currentView === 'overview' 
                    ? 'w-8 h-2 bg-[#00C6FF]' 
                    : 'w-2 h-2 bg-gray-700 hover:bg-gray-600'
                }`}
              />
              <button
                onClick={() => setCurrentView('steps')}
                className={`transition-all duration-300 rounded-full ${
                  currentView === 'steps' 
                    ? 'w-8 h-2 bg-[#4CDE9A]' 
                    : 'w-2 h-2 bg-gray-700 hover:bg-gray-600'
                }`}
              />
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleDismiss}
                className="text-xs text-gray-500 hover:text-white font-mono transition"
              >
                Skip
              </button>
              <button 
                onClick={handleContinue}
                className="bg-gradient-to-r from-[#00C6FF] to-[#7B61FF] text-slate-950 font-display font-semibold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition cursor-pointer"
              >
                {currentView === 'overview' ? (
                  <>See Where <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Get Started <Sparkles className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
