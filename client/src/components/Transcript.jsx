import React, { useEffect, useRef } from 'react';
import { Dumbbell, User, Activity } from 'lucide-react';

export default function Transcript({ messages = [], status = 'idle' }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  return (
    <div className="w-full h-full flex flex-col bg-white border-2 border-[#4A90D9]/20 rounded-2xl overflow-hidden shadow-lg shadow-[#1A1A2E]/5">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[#4A90D9]/15 bg-[#1A1A2E] text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-lg bg-[#4A90D9] text-white">
            <Dumbbell className="w-4 h-4 animate-pulse" />
          </div>
          <h2 className="text-sm font-bold tracking-wide text-[#F9F7F7]">FitBuddy Workout Transcript</h2>
        </div>
        <span className="text-[11px] font-semibold text-[#FF6B35] bg-[#FF6B35]/20 px-2.5 py-0.5 rounded-full border border-[#FF6B35]/40">
          Live Sync
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F9F7F7]/60">
        {messages.length === 0 && status !== 'thinking' ? (
          <div className="h-full flex flex-col items-center justify-center text-[#1A1A2E]/50 text-xs">
            <Activity className="w-8 h-8 opacity-40 mb-2 text-[#4A90D9]" />
            <p className="font-medium">No conversation history yet. Speak or type to start your workout consultation.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 shadow-sm ${
                    isUser
                      ? 'bg-[#1A1A2E] text-[#FF6B35]'
                      : 'bg-[#4A90D9] text-white border border-[#4A90D9]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Dumbbell className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-[#4A90D9] text-white rounded-tr-none font-medium'
                      : 'bg-white text-[#1A1A2E] border border-[#4A90D9]/20 rounded-tl-none font-medium'
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className={`block mt-1 text-[9px] opacity-75 ${isUser ? 'text-[#FFB088] text-right' : 'text-[#1A1A2E]/60 text-right'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* 3 Bouncing Ellipses Thinking Indicator */}
        {status === 'thinking' && (
          <div className="flex gap-2.5 flex-row">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 shadow-sm bg-[#4A90D9] text-white border border-[#4A90D9]">
              <Dumbbell className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-white text-[#1A1A2E] border border-[#4A90D9]/20 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs shadow-sm flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#4A90D9] mr-1">FitBuddy thinking</span>
              <span className="w-2 h-2 bg-[#FF6B35] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-[#FF6B35] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-[#FF6B35] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
