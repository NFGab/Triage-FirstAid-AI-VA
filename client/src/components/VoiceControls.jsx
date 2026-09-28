import React, { useState } from 'react';
import { Mic, MicOff, Send, Volume2, Sparkles, Settings, ShieldAlert } from 'lucide-react';

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
    listening: { label: 'LISTENING (SPEAK NOW)', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 animate-pulse' },
    thinking: { label: 'AURA THINKING...', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40 animate-pulse' },
    speaking: { label: 'AURA SPEAKING...', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse' },
    idle: { label: 'IDLE (READY)', color: 'bg-slate-800/80 text-slate-400 border-slate-700' }
  };

  const voices = [
    { id: 'en-US-AvaMultilingualNeural', name: 'Ava (Female - Natural)' },
    { id: 'en-US-AndrewMultilingualNeural', name: 'Andrew (Male - Natural)' },
    { id: 'en-US-EmmaNeural', name: 'Emma (Female - Expressive)' },
    { id: 'en-US-BrianNeural', name: 'Brian (Male - Clear)' },
    { id: 'en-GB-SoniaNeural', name: 'Sonia (British Female)' }
  ];

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Status Badge */}
      <div className="flex items-center gap-3">
        <div className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider border backdrop-blur-md transition-all ${statusConfig[status].color}`}>
          <span className="inline-block w-2 h-2 rounded-full bg-current mr-2 animate-ping" />
          {statusConfig[status].label}
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-slate-300 transition-all hover:scale-105"
          title="Voice & API Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Main Microphone Toggle Button */}
      <div className="relative flex items-center justify-center">
        {/* Glow rings */}
        {status === 'listening' && (
          <>
            <div className="absolute w-32 h-32 rounded-full bg-cyan-500/20 animate-ping opacity-75" />
            <div className="absolute w-28 h-28 rounded-full bg-cyan-500/30 animate-pulse" />
          </>
        )}

        <button
          onClick={toggleListening}
          className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-2xl border ${
            status === 'listening'
              ? 'bg-gradient-to-tr from-cyan-600 to-teal-400 border-cyan-300 shadow-cyan-500/50 scale-105'
              : 'bg-gradient-to-tr from-slate-800 to-slate-900 border-slate-700 hover:border-slate-500 text-slate-200 shadow-black/50'
          }`}
        >
          {status === 'listening' ? (
            <Mic className="w-10 h-10 text-white animate-bounce" />
          ) : (
            <MicOff className="w-10 h-10 text-slate-400 hover:text-white" />
          )}
        </button>
      </div>

      <p className="text-xs text-slate-400 font-medium">
        {isListeningActive ? 'Click button to stop listening' : 'Click microphone button to start voice conversation'}
      </p>

      {/* Text Fallback Input Bar */}
      <form onSubmit={handleSubmit} className="w-full max-w-lg flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Or type a message to Aura..."
          disabled={status === 'thinking' || status === 'listening'}
          className="flex-1 bg-slate-900/80 border border-slate-800 focus:border-cyan-500/60 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || status === 'thinking'}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white p-2.5 rounded-xl transition-all font-medium flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Settings Modal overlay */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" /> Settings & Defense Config
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-300">Edge-TTS Neural Voice</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {voices.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-300">
                Custom Groq API Key (Optional Override)
              </label>
              <input
                type="password"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500">
                If left blank, the backend server GROQ_API_KEY from .env will be used.
              </p>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4" /> Medical Safety & Tamper Defenses Active
              </div>
              <p className="text-[11px] text-slate-400">
                Includes mandatory medical disclaimers, emergency 911 escalation logic, and strict deflection of persona manipulation/jailbreaks.
              </p>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-xl text-sm transition-all"
            >
              Close Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
