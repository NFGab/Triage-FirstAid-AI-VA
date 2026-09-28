import React from 'react';
import SphereVisualizer from './components/SphereVisualizer';
import VoiceControls from './components/VoiceControls';
import Transcript from './components/Transcript';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { Radio, ShieldCheck, Cpu } from 'lucide-react';

export default function App() {
  const {
    status,
    audioLevel,
    messages,
    isListeningActive,
    selectedVoice,
    setSelectedVoice,
    customApiKey,
    setCustomApiKey,
    toggleListening,
    sendTextMessage
  } = useVoiceAssistant();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]">
      {/* Background ambient lighting blur effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              AURA VIRTUAL TRIAGE & FIRST-AID ASSISTANT
            </h1>
            <p className="text-[11px] text-emerald-400 font-medium">
              Medical Triage • Emergency Escalation • Groq AI Pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict Tamper Defenses</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800 text-slate-300">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Groq LLM Engine</span>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left / Center Column: 3D Visualizer & Voice Controls */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-4">
          <div className="w-full max-w-md h-[340px] relative">
            <SphereVisualizer audioLevel={audioLevel} status={status} />
          </div>

          <VoiceControls
            status={status}
            isListeningActive={isListeningActive}
            toggleListening={toggleListening}
            sendTextMessage={sendTextMessage}
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
            customApiKey={customApiKey}
            setCustomApiKey={setCustomApiKey}
          />
        </div>

        {/* Right Column: Interactive Transcript Log */}
        <div className="lg:col-span-5 h-[520px] w-full">
          <Transcript messages={messages} />
        </div>

      </main>

      {/* Footer info */}
      <footer className="w-full py-4 text-center text-slate-500 text-xs z-10 border-t border-slate-900">
        Web AI Voice Agent PoC • Built with Vite, React, Express & Groq Infrastructure
      </footer>
    </div>
  );
}
