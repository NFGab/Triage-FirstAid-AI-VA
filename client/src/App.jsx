import React from 'react';
import SphereVisualizer from './components/SphereVisualizer';
import VoiceControls from './components/VoiceControls';
import Transcript from './components/Transcript';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { HeartPulse, ShieldCheck, Cpu } from 'lucide-react';

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
    <div className="h-screen w-screen max-h-screen overflow-hidden bg-[#F9F7F7] text-[#133020] flex flex-col justify-between font-sans relative">
      {/* Soft background ambient gradient glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#046241]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-[#FFB347]/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full px-6 py-3 border-b border-[#046241]/15 bg-white/80 backdrop-blur-md flex items-center justify-between z-10 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#133020] to-[#046241] flex items-center justify-center shadow-md shadow-[#046241]/20">
            <HeartPulse className="w-5 h-5 text-[#FFC370] animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-[#133020]">
              LifeAid
            </h1>
            <p className="text-[11px] text-[#046241] font-bold tracking-wide">
              Virtual Triage Nurse & First-Aid Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="hidden sm:flex items-center gap-2 bg-[#F9F7F7] px-3 py-1 rounded-full border border-[#046241]/20 text-[#133020]">
            <ShieldCheck className="w-4 h-4 text-[#046241]" />
            <span>Emergency 911 Guardrails</span>
          </div>
          <div className="flex items-center gap-2 bg-[#F9F7F7] px-3 py-1 rounded-full border border-[#046241]/20 text-[#133020]">
            <Cpu className="w-4 h-4 text-[#FFB347]" />
            <span>Groq AI Pipeline</span>
          </div>
        </div>
      </header>

      {/* Main Grid Content - Strictly fits in single viewport without scrolling */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center overflow-hidden z-10 max-h-[calc(100vh-85px)]">
        
        {/* Left Column: 3D Visualizer & Voice Controls */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-2 h-full py-1">
          <div className="w-full max-w-sm h-[260px] relative flex items-center justify-center">
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
        <div className="lg:col-span-5 h-full max-h-[calc(100vh-115px)] w-full py-2">
          <Transcript messages={messages} status={status} />
        </div>

      </main>

      {/* Footer Info */}
      <footer className="w-full py-2 text-center text-[#133020]/70 text-[11px] font-semibold z-10 border-t border-[#046241]/15 bg-white/80 shrink-0">
        LifeAid Virtual Triage PoC • Powered by Groq Whisper, LLM Guardrails & Edge-TTS
      </footer>
    </div>
  );
}
