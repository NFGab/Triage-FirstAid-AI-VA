import { useState, useRef, useEffect, useCallback } from 'react';

export function useVoiceAssistant() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking'
  const [isListeningActive, setIsListeningActive] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! Welcome to LifeAid, your virtual triage nurse and first-aid assistant. Please remember I am an AI, not a doctor. How can I help you with first aid or medical guidance today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState('en-US-AvaMultilingualNeural');
  const [customApiKey, setCustomApiKey] = useState('');

  // Audio Context & Analyser Refs
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const isSpeakingDetectedRef = useRef(false);
  const currentAudioElementRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Initialize Web Audio Context
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Helper to find supported audio MIME type
  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus'
    ];
    for (const type of types) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  };

  // Stop current AI audio playback if playing
  const stopPlayback = useCallback(() => {
    if (currentAudioElementRef.current) {
      currentAudioElementRef.current.pause();
      currentAudioElementRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setAudioLevel(0);
  }, []);

  // Process recorded user audio -> send to backend API
  const sendAudioToBackend = useCallback(async (audioBlob, mimeType) => {
    setStatus('thinking');
    setAudioLevel(0);

    const ext = mimeType.includes('mp4') ? '.mp4' : mimeType.includes('ogg') ? '.ogg' : '.webm';
    const formData = new FormData();
    formData.append('audio', audioBlob, `speech${ext}`);
    formData.append('voice', selectedVoice);
    formData.append('history', JSON.stringify(messages.slice(-6))); // Send recent context

    try {
      const headers = {};
      if (customApiKey) {
        headers['x-groq-api-key'] = customApiKey;
      }

      const response = await fetch('/api/process-voice', {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Voice processing server error');
      }

      if (!data.transcript) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply || "I couldn't hear any clear speech. Please try speaking again.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setStatus('idle');
        return;
      }

      // Add user transcript and assistant reply to chat history
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [
        ...prev,
        { role: 'user', content: data.transcript, timestamp: now },
        { role: 'assistant', content: data.reply, timestamp: now }
      ]);

      // Playback AI Response Audio with Audio Visualizer tracking
      if (data.audioBase64) {
        playAudioResponse(data.audioBase64);
      } else {
        setStatus('idle');
      }

    } catch (err) {
      console.error('Error processing audio request:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Notice: ${err.message || 'Failed to connect to backend server.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setStatus('idle');
    }
  }, [selectedVoice, messages, customApiKey]);

  // Play synthetic TTS audio and hook up frequency analyzer for 3D sphere reactivity
  const playAudioResponse = (audioBase64) => {
    stopPlayback();
    setStatus('speaking');

    const audio = new Audio(audioBase64);
    currentAudioElementRef.current = audio;

    const audioCtx = getAudioContext();
    const source = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateAudioLevel = () => {
      if (audio.paused || audio.ended) {
        setStatus('idle');
        setAudioLevel(0);
        return;
      }
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      setAudioLevel(avg / 255.0); // Normalize 0..1
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };

    audio.onplay = () => {
      updateAudioLevel();
    };

    audio.onended = () => {
      setStatus('idle');
      setAudioLevel(0);
      if (isListeningActive) {
        startListening();
      }
    };

    audio.play().catch(e => {
      console.error('Audio play error:', e);
      setStatus('idle');
    });
  };

  // Start Mic Recording & Voice Activity Detection (VAD)
  const startListening = useCallback(async () => {
    stopPlayback();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioCtx = getAudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);

      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : {};
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Clean up stream tracks ONLY after recording is stopped safely
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        if (audioBlob.size > 1500) {
          sendAudioToBackend(audioBlob, mimeType || 'audio/webm');
        } else {
          setStatus('idle');
        }
      };

      mediaRecorder.start(100);
      setStatus('listening');
      isSpeakingDetectedRef.current = false;

      // Volume monitoring for VAD / silence detection
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      let silenceStart = null;

      const checkMicVolume = () => {
        if (!mediaStreamRef.current) return;

        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avgVolume = sum / bufferLength / 255.0;
        setAudioLevel(avgVolume);

        const SPEECH_THRESHOLD = 0.035;
        const SILENCE_DURATION_MS = 1800; // 1.8s silence after speech triggers submission

        if (avgVolume > SPEECH_THRESHOLD) {
          isSpeakingDetectedRef.current = true;
          silenceStart = null;
        } else if (isSpeakingDetectedRef.current) {
          if (!silenceStart) {
            silenceStart = Date.now();
          } else if (Date.now() - silenceStart > SILENCE_DURATION_MS) {
            // Silence detected after speech! Stop recording
            stopListening();
            return;
          }
        }

        animationFrameRef.current = requestAnimationFrame(checkMicVolume);
      };

      checkMicVolume();

    } catch (err) {
      console.error('Microphone access error:', err);
      alert('Microphone access denied or unavailable. Please enable mic permissions.');
      setStatus('idle');
      setIsListeningActive(false);
    }
  }, [getAudioContext, sendAudioToBackend, stopPlayback]);

  // Stop Mic Recording safely
  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    setAudioLevel(0);
  }, []);

  // Master Toggle for Listening ON / OFF
  const toggleListening = () => {
    if (status === 'listening') {
      setIsListeningActive(false);
      stopListening();
      setStatus('idle');
    } else {
      setIsListeningActive(true);
      startListening();
    }
  };

  // Send typed text message fallback
  const sendTextMessage = async (text) => {
    if (!text.trim()) return;
    stopPlayback();
    setStatus('thinking');

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedMessages = [...messages, { role: 'user', content: text, timestamp: now }];
    setMessages(updatedMessages);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (customApiKey) headers['x-groq-api-key'] = customApiKey;

      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: updatedMessages.slice(-6),
          userQuery: text
        })
      });

      const chatData = await chatRes.json();
      if (!chatRes.ok) throw new Error(chatData.error || 'Chat API error');

      const replyText = chatData.reply;

      setMessages(prev => [...prev, { role: 'assistant', content: replyText, timestamp: now }]);

      const ttsRes = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText, voice: selectedVoice })
      });

      if (ttsRes.ok) {
        const audioBlob = await ttsRes.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        playAudioResponse(audioUrl);
      } else {
        setStatus('idle');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Error: ${err.message}`, timestamp: now }
      ]);
      setStatus('idle');
    }
  };

  useEffect(() => {
    return () => {
      stopListening();
      stopPlayback();
    };
  }, [stopListening, stopPlayback]);

  return {
    status,
    audioLevel,
    messages,
    isListeningActive,
    selectedVoice,
    setSelectedVoice,
    customApiKey,
    setCustomApiKey,
    toggleListening,
    sendTextMessage,
    stopPlayback
  };
}
