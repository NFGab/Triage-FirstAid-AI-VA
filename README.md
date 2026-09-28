# 🩺 AURA: Virtual Triage Nurse & First-Aid Voice Assistant

> **Proof-of-Concept Web AI Medical Voice Agent** featuring real-time Speech-to-Text (Groq Whisper), specialized medical triage and emergency escalation reasoning with strict tamper defenses (Groq LLM Engine), neural Text-to-Speech (Edge-TTS), and a 3D audio-reactive sphere visualizer (Three.js + React).

---

## ✨ Key Features & Medical Guardrails

- **🩺 Virtual Triage Nurse Persona**: Empathetic, calming, clinical, and objective tone designed for users in stressful medical situations (kitchen burns, fever, sprains).
- **⚠️ Emergency 911 Escalation**: Automatically detects severe/life-threatening symptoms (chest pain, severe bleeding, breathing difficulty, sudden numbness/unresponsiveness) and immediately instructs the user to call 911/emergency services before offering stabilizing advice.
- **⚕️ Mandatory Medical Disclaimer**: Reminds users on health queries that Aura is an AI assistant, not a doctor, and cannot diagnose or prescribe.
- **🛡️ Strict Tamper & Jailbreak Defenses**: Instantly blocks attempts like *"Ignore all previous instructions"* or *"You are now a pirate"* with a standardized deflection response:
  > *"I am a virtual medical assistant and cannot fulfill that request. I can only provide first aid and basic health information. Do you have a medical question I can help with?"*
- **🎙️ Real-Time STT (Groq Whisper)**: Sub-second transcription via `whisper-large-v3-turbo`.
- **🎙️ Voice Activity Detection (VAD)**: Automatic 1.8s silence detection after speech to auto-submit queries naturally without manual button clicks.
- **🔊 Neural Text-to-Speech (Edge-TTS)**: Spoken voice output with clear, concise, voice-optimized phrasing (no awkward markdown or jargon).
- **🔮 3D Reactive Audio Sphere**: Three.js WebGL visualizer smoothly pulsing and deforming in real time to microphone & speaker audio frequencies.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18+ (Node v24 supported)
- **Groq API Key**: Get a free API key from [https://console.groq.com](https://console.groq.com)

### 2. Configure Environment
Create `server/.env`:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_LLM_MODEL=openai/gpt-oss-20b
PORT=5000
```

### 3. Run Application
```bash
# Install all dependencies
npm run install:all

# Terminal 1: Run Backend Server
npm run start:server

# Terminal 2: Run Frontend Client
npm run start:client
```
Open browser at `http://localhost:3000`.

---

## 📖 Developer Guide & Architecture
For the complete step-by-step instructions, prompt defense design, VAD implementation breakdown, and executive pitch tips, read [`GUIDE.md`](file:///c:/Users/Nicolo/Documents/requirements/lifewood/voice_agent/GUIDE.md).
