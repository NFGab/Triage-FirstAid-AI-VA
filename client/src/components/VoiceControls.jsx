import React, { useState } from 'react';
import { Mic, MicOff, Send, HeartPulse, Settings, ShieldAlert, Sparkles } from 'lucide-react';

export default function VoiceControls({
  status,
  isListeningActive,
  toggleListening,
  sendTextMessage,
  selectedVoice,
  setSelectedVoice,
  customApiKey,
  setCustomApiKey
}) {
  const [inputText, setInputText] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendTextMessage(inputText);
      setInputText('');
    }
  };

  const statusConfig = {
    listening: { label: 'LISTENING (SPEAK NOW)', color: 'bg-[#FFC370]/30 text-[#133020] border-[#FFB347] font-bold animate-pulse' },
    thinking: { label: 'LIFEAID THINKING...', color: 'bg-[#FFB347]/30 text-[#133020] border-[#FFB347] font-bold animate-pulse' },
    speaking: { label: 'LIFEAID SPEAKING...', color: 'bg-[#046241]/20 text-[#046241] border-[#046241]/40 font-bold animate-pulse' },
    idle: { label: 'READY FOR FIRST-AID', color: 'bg-[#133020]/10 text-[#133020] border-[#133020]/20 font-semibold' }
  };

  const voices = [
    { id: 'en-US-AvaMultilingualNeural', name: 'Ava (Female - Natural)' },
    { id: 'en-US-AndrewMultilingualNeural', name: 'Andrew (Male - Natural)' },
    { id: 'en-US-EmmaNeural', name: 'Emma (Female - Expressive)' },
    { id: 'en-US-BrianNeural', name: 'Brian (Male - Clear)' },
    { id: 'en-GB-SoniaNeural', name: 'Sonia (British Female)' }
  ];

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Status Badge & Settings Toggle */}
      <div className="flex items-center gap-2.5">
        <div className={`px-4 py-1 rounded-full text-[11px] tracking-wider border backdrop-blur-md transition-all shadow-sm ${statusConfig[status].color}`}>
          <span className="inline-block w-2 h-2 rounded-full bg-current mr-2 animate-ping" />
          {statusConfig[status].label}
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1.5 rounded-full bg-white hover:bg-[#F9F7F7] border border-[#133020]/20 text-[#133020] transition-all hover:scale-105 shadow-sm"
          title="Voice & API Settings"
        >
          <Settings className="w-3.5 h-3.5 text-[#046241]" />
        </button>
      </div>

      {/* Main Microphone Toggle Button */}
      <div className="relative flex items-center justify-center py-1">
        {status === 'listening' && (
          <>
            <div className="absolute w-28 h-28 rounded-full bg-[#FFB347]/30 animate-ping opacity-75" />
            <div className="absolute w-24 h-24 rounded-full bg-[#FFC370]/40 animate-pulse" />
          </>
        )}

        <button
          onClick={toggleListening}
          className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-xl border-2 ${
            status === 'listening'
              ? 'bg-gradient-to-tr from-[#046241] to-[#FFB347] border-[#FFC370] text-white scale-105 shadow-[#046241]/40'
              : 'bg-gradient-to-tr from-[#133020] to-[#046241] border-[#046241] text-white hover:border-[#FFB347] shadow-[#133020]/30'
          }`}
        >
          {status === 'listening' ? (
            <Mic className="w-8 h-8 text-white animate-bounce" />
          ) : (
            <MicOff className="w-8 h-8 text-[#FFC370] hover:text-white" />
          )}
        </button>
      </div>

      <p className="text-[11px] text-[#133020]/75 font-semibold">
        {isListeningActive ? 'Tap button to stop listening' : 'Tap microphone button to start LifeAid voice triage'}
      </p>

      {/* Text Fallback Input Bar */}
      <form onSubmit={handleSubmit} className="w-full max-w-md flex items-center gap-2 mt-1">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Or type your health inquiry here..."
          disabled={status === 'thinking' || status === 'listening'}
          className="flex-1 bg-white border border-[#133020]/20 focus:border-[#046241] rounded-xl px-3.5 py-2 text-xs text-[#133020] placeholder-[#133020]/45 focus:outline-none focus:ring-2 focus:ring-[#046241]/20 shadow-sm transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || status === 'thinking'}
          className="bg-[#046241] hover:bg-[#133020] disabled:opacity-40 text-white p-2 rounded-xl transition-all font-medium flex items-center justify-center shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-[#133020]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#046241]/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-[#133020]">
            <div className="flex items-center justify-between pb-3 border-b border-[#133020]/10">
              <h3 className="text-base font-bold text-[#133020] flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-[#046241]" /> LifeAid Settings & Guardrails
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-[#133020]/60 hover:text-[#133020] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#133020]">Edge-TTS Neural Voice</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full bg-[#F9F7F7] border border-[#133020]/20 rounded-lg p-2 text-xs text-[#133020] font-medium focus:outline-none focus:border-[#046241]"
              >
                {voices.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#133020]">
                Custom Groq API Key Override
              </label>
              <input
                type="password"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full bg-[#F9F7F7] border border-[#133020]/20 rounded-lg p-2 text-xs text-[#133020] focus:outline-none focus:border-[#046241]"
              />
              <p className="text-[10px] text-[#133020]/60">
                If left blank, backend server GROQ_API_KEY will be used.
              </p>
            </div>

            <div className="p-3 bg-[#F9F7F7] border border-[#046241]/30 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[#046241] text-xs font-bold">
                <ShieldAlert className="w-4 h-4 text-[#FFB347]" /> Medical Triage Defenses Active
              </div>
              <p className="text-[11px] text-[#133020]/80">
                Mandatory AI disclaimer, 911 emergency escalation, and strict deflection of persona manipulation/jailbreaks.
              </p>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full bg-[#046241] hover:bg-[#133020] text-white font-bold py-2 rounded-xl text-xs transition-all shadow-sm"
            >
              Close Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
