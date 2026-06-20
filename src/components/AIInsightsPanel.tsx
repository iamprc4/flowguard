import React, { useState } from 'react';
import { Send, Sparkles, Terminal, Info, Loader2, Bot, HelpCircle } from 'lucide-react';

interface AIProps {
  selectedEventTitle?: string;
  selectedEventLocation?: string;
}

export default function AIInsightsPanel({ selectedEventTitle, selectedEventLocation }: AIProps) {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; timestamp: Date }>>([
    {
      sender: 'ai',
      text: `Hi! I'm the FlowGuard AI Advisor, trained on 8,173 real Bengaluru traffic incidents.

Here's what the live data is showing right now:
- Silk Board Junction is nearing critical congestion — consider deploying barricades on the Hosur Road side before 5 PM.
- Mekhri Circle is the highest-risk spot in the city (64 incidents) — post at least 6 officers here for any event over 10,000 people.
- Traffic incidents spike around 9 PM across Bengaluru — make sure all deployments are in place an hour before.

Ask me anything — officer count, diversion routes, barricade placement, timing — I'll give you a straight answer.`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  // If an event is selected, make the first prompt specific to that event
  const samplePrompts = selectedEventTitle ? [
    `How many officers are needed for "${selectedEventTitle}" at ${selectedEventLocation || 'the venue'}?`,
    `What diversion routes should activate for "${selectedEventTitle}"?`,
    `Suggest a barricade plan for "${selectedEventTitle}" — what are the top 3 actions?`
  ] : [
    'How many officers should be deployed at Silk Board Junction for an IPL match at Chinnaswamy Stadium?',
    'What diversion routes should activate if Mekhri Circle reaches critical congestion on Mysore Road?',
    'Suggest a barricade plan for a political rally on Bellary Road with 50,000 attendees.'
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage = { sender: 'user' as const, text: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);
    setIsThinking(true);
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          systemContext: `You are FlowGuard AI for Bengaluru Traffic Police. Only reference real Bengaluru roads, junctions, and zones. Context: The city dataset has 8,173 recorded incidents. Top hotspots: Mekhri Circle (64 incidents), Yeshwanthpura Circle (38), Silk Board Junction (33). Peak incident hour is 21:00 IST.`
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: data.response,
          timestamp: new Date()
        }]);
      } else {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: 'Error generating AI recommendations: ' + (data.error || 'Server error'),
          timestamp: new Date()
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: 'Failed to establish connection to the remote Gemini client. Please check server logs.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
      setIsThinking(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[500px] shadow-2xl relative">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-slate-950 to-slate-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center border border-cyan-500/30">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="text-white font-medium text-sm block">Gemini AI Dispatch Advisor</span>
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">Real-Time Explainable Analytics</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C6FF] animate-pulse" />
          <span className="text-[9px] font-mono text-cyan-400 uppercase">Interactive Core</span>
        </div>
      </div>

      {/* Chat Terminal logs */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-950/40">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${m.sender === 'user' ? 'bg-[#7B61FF] text-white' : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
              }`}>
              {m.sender === 'user' ? 'U' : <Terminal className="w-3.5 h-3.5" />}
            </div>

            <div className={`rounded-xl p-3.5 text-xs inline-block shadow-lg ${m.sender === 'user'
                ? 'bg-gradient-to-tr from-[#7B61FF] to-[#00C6FF] text-slate-950 font-medium'
                : 'bg-[#0f172a] text-gray-200 border border-white/5 font-mono whitespace-pre-wrap leading-relaxed'
              }`}>
              {m.text}
              <span className="block text-[9px] mt-1.5 opacity-60 text-right font-sans">
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-7 h-7 rounded-full bg-[#00C6FF]/10 border border-[#00C6FF]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#00C6FF]" />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900 border border-white/5 rounded-2xl px-4 py-3">
              <span className="w-2 h-2 bg-[#00C6FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-[#00C6FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-[#00C6FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Sample presets rail */}
      <div className="bg-slate-950 border-t border-white/5 px-4 py-2.5 overflow-x-auto whitespace-nowrap flex gap-2 shrink-0 scrollbar-none select-none">
        <HelpCircle className="w-3.5 h-3.5 text-gray-500 my-auto" />
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(p)}
            className="bg-slate-900 hover:bg-slate-800 text-gray-400 hover:text-white border border-white/5 text-[9.5px] px-2.5 py-1 rounded-md transition font-sans inline-block"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input panel Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
        className="bg-slate-900 border-t border-white/10 px-4 py-3 flex gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={selectedEventTitle ? `Ask advice about: "${selectedEventTitle}"...` : "Request optimal traffic marshalling, barricade, or detour dispatches..."}
          className="flex-1 bg-[#060A13] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400 transition"
        />
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-[#00C6FF] text-slate-950 font-mono font-medium rounded-xl px-4 transition shrink-0 flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
