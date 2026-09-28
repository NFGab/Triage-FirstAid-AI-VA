# 🩺 Developer Blueprint: Virtual Triage Nurse & First-Aid Voice Assistant (PoC)

Welcome! The AI voice agent has been pivoted to a specialized **Virtual Triage Nurse & First-Aid Assistant**. This guide details the prompt engineering, safety guardrails, emergency escalation logic, and technical setup for your PoC submission.

---

## 📋 Table of Contents
1. [Tech Stack & Architecture Overview](#1-tech-stack--architecture-overview)
2. [Prerequisites & API Setup List](#2-prerequisites--api-setup-list)
3. [Step-by-Step Environment & Quick Start Guide](#3-step-by-step-environment--quick-start-guide)
4. [Triage Nurse Prompt Engineering & Safety Defenses](#4-triage-nurse-prompt-engineering--safety-defenses)
5. [Real-Time Audio Processing & Silence Detection (VAD)](#6-real-time-audio-processing--silence-detection-vad)
6. [Frontend 3D Interactive Sphere Visualizer](#7-frontend-3d-interactive-sphere-visualizer)
7. [PoC Presentation & Executive Pitch Tips](#8-poc-presentation--executive-pitch-tips)

---

## 1. 🏗️ Tech Stack & Architecture Overview

```mermaid
flowchart LR
    A[User Voice / Medical Inquiry] -->|Audio Recording Blob| B[Vite + React Frontend]
    B -->|VAD Silence Detection| C[Node.js Express Backend]
    C -->|Audio File| D[Groq Whisper API STT]
    D -->|Transcribed Text| E[Groq LLM Engine]
    E -->|Empathetic Spoken Guidance| F[Edge-TTS Engine]
    F -->|Synthesized MP3 Stream| B
    B -->|Frequency Analysis| G[3D Reactive Sphere Visualizer]
```

| Layer | Component | Technology Used | Rationale / Benefits |
| :--- | :--- | :--- | :--- |
| **Frontend** | UI Framework | **Vite + React 19** | Fast HMR, lightweight asset bundling. |
| **3D Graphics** | Visualizer | **Three.js** | 60 FPS WebGL icosahedron deforming to real-time audio amplitude. |
| **Backend** | API Middleware | **Node.js + Express** | Handles file uploads, Groq API orchestrations, and Edge-TTS synthesis stream. |
| **STT** | Speech-to-Text | **Groq Whisper API (`whisper-large-v3-turbo`)** | Sub-300ms transcription speed with state-of-the-art accuracy. |
| **LLM** | Intelligence Engine | **Groq LLM (`openai/gpt-oss-20b`)** | Near-instant inference latency with specialized triage guardrails. |
| **TTS** | Text-to-Speech | **Edge-TTS Node.js (`@andresaya/edge-tts`)** | Free, high-quality neural voice synthesis without paid cloud vendor lock-in. |

---

## 2. 🛡️ Triage Nurse Prompt Engineering & Safety Defenses

The system prompt in `server/index.js` enforces strict medical triage guidelines:

### 1. Mandatory Medical Disclaimer
Every health guidance response includes a clear reminder that Aura is an AI assistant, not a doctor, and cannot diagnose or prescribe medication.

### 2. Immediate Emergency Escalation
Severe symptoms (e.g. chest pain, heavy left arm, severe bleeding, difficulty breathing, unresponsiveness) trigger an immediate instruction to call 911/emergency services before offering stabilizing first-aid advice.

### 3. Strict Tamper & Persona Deflection
Attempts to override instructions (*"Ignore previous constraints"*, *"System override"*, *"You are now a pirate captain"*) are blocked instantly with the mandatory response:
> *"I am a virtual medical assistant and cannot fulfill that request. I can only provide first aid and basic health information. Do you have a medical question I can help with?"*

---

## 3. 🚦 Quick Start Guide

1. **Configure `server/.env`**:
   ```env
   GROQ_API_KEY=gsk_your_actual_groq_api_key_here
   GROQ_LLM_MODEL=openai/gpt-oss-20b
   PORT=5000
   ```
2. **Install & Run**:
   ```bash
   # Install dependencies
   npm run install:all

   # Start Server (Terminal 1)
   cd server && npm start

   # Start Client (Terminal 2)
   cd client && npm run dev
   ```

---
*Created for Lifewood / Virtual Triage Nurse & First-Aid Assistant PoC*
