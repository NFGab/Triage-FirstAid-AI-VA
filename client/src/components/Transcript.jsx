import React, { useEffect, useRef } from 'react';
import { HeartPulse, User, Activity } from 'lucide-react';

export default function Transcript({ messages = [], status = 'idle' }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  return (
    <div className="w-full h-full flex flex-col bg-white border-2 border-[#046241]/20 rounded-2xl overflow-hidden shadow-lg shadow-[#133020]/5">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[#046241]/15 bg-[#133020] text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-lg bg-[#046241] text-[#FFC370]">
            <HeartPulse className="w-4 h-4 animate-pulse" />
          </div>
          <h2 className="text-sm font-bold tracking-wide text-[#F9F7F7]">LifeAid Triage Transcript</h2>
        </div>
        <span className="text-[11px] font-semibold text-[#FFC370] bg-[#046241]/40 px-2.5 py-0.5 rounded-full border border-[#046241]">
          Live Sync
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F9F7F7]/60">
        {messages.length === 0 && status !== 'thinking' ? (
          <div className="h-full flex flex-col items-center justify-center text-[#133020]/50 text-xs">
            <Activity className="w-8 h-8 opacity-40 mb-2 text-[#046241]" />
            <p className="font-medium">No conversation history yet. Speak or type to start LifeAid.</p>
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
                      ? 'bg-[#133020] text-[#FFC370]'
                      : 'bg-[#046241] text-white border border-[#046241]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <HeartPulse className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-[#046241] text-white rounded-tr-none font-medium'
                      : 'bg-white text-[#133020] border border-[#046241]/20 rounded-tl-none font-medium'
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className={`block mt-1 text-[9px] opacity-75 ${isUser ? 'text-[#FFC370] text-right' : 'text-[#133020]/60 text-right'}`}>
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
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 shadow-sm bg-[#046241] text-white border border-[#046241]">
              <HeartPulse className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-white text-[#133020] border border-[#046241]/20 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs shadow-sm flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#046241] mr-1">LifeAid thinking</span>
              <span className="w-2 h-2 bg-[#FFB347] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-[#FFB347] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-[#FFB347] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
