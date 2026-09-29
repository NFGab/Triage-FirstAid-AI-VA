import React from 'react';
import MuscleAvatar from './components/MuscleAvatar';
import VoiceControls from './components/VoiceControls';
import Transcript from './components/Transcript';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { Dumbbell, Flame, Cpu } from 'lucide-react';

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
    <div className="h-screen w-screen max-h-screen overflow-hidden bg-[#F9F7F7] text-[#1A1A2E] flex flex-col justify-between font-sans relative">
      {/* Soft background ambient gradient glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#4A90D9]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-[#FF6B35]/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full px-6 py-3 border-b border-[#4A90D9]/15 bg-white/80 backdrop-blur-md flex items-center justify-between z-10 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#4A90D9] flex items-center justify-center shadow-md shadow-[#FF6B35]/20">
            <Dumbbell className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-[#1A1A2E]">
              FitBuddy
            </h1>
            <p className="text-[11px] text-[#4A90D9] font-bold tracking-wide">
              Your Virtual Fitness Coach & Workout Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="hidden sm:flex items-center gap-2 bg-[#F9F7F7] px-3 py-1 rounded-full border border-[#FF6B35]/20 text-[#1A1A2E]">
            <Flame className="w-4 h-4 text-[#FF6B35]" />
            <span>Safety Guardrails Active</span>
          </div>
          <div className="flex items-center gap-2 bg-[#F9F7F7] px-3 py-1 rounded-full border border-[#4A90D9]/20 text-[#1A1A2E]">
            <Cpu className="w-4 h-4 text-[#4A90D9]" />
            <span>Groq AI Pipeline</span>
          </div>
        </div>
      </header>

      {/* Main Grid Content - Strictly fits in single viewport without scrolling */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center overflow-hidden z-10 max-h-[calc(100vh-85px)]">
        
        {/* Left Column: 3D Avatar & Voice Controls */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-2 h-full py-1">
          <div className="w-full max-w-sm h-[260px] relative flex items-center justify-center">
            <MuscleAvatar audioLevel={audioLevel} status={status} />
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
      <footer className="w-full py-2 text-center text-[#1A1A2E]/70 text-[11px] font-semibold z-10 border-t border-[#4A90D9]/15 bg-white/80 shrink-0">
        FitBuddy Fitness Coach PoC • Powered by Groq Whisper, LLM Guardrails & Edge-TTS
      </footer>
    </div>
  );
}
