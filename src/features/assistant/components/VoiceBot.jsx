"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Activity, MessageSquare, Mic, MicOff, Power, PowerOff,
  Loader2, Volume2, VolumeX
} from "lucide-react";
import { useAssistant } from "../hooks/useAssistant";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

// ─── Animated Voice Orb ───────────────────────────────────────────────────────
function VoiceOrb({ status, isRecording }) {
  const stateClass = {
    idle: "scale-100 opacity-80",
    listening: "scale-110 opacity-100",
    thinking: "scale-95 opacity-70",
    speaking: "scale-105 opacity-100",
  }[status] || "scale-100 opacity-80";

  const bgGradient = {
    idle: "from-zinc-700 to-zinc-800",
    listening: "from-blue-500 to-indigo-600",
    thinking: "from-amber-500 to-orange-600",
    speaking: "from-emerald-500 to-teal-600",
  }[status] || "from-zinc-700 to-zinc-800";

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulse rings */}
      {(status === "listening" || status === "speaking") && (
        <>
          <div className={`absolute w-56 h-56 rounded-full bg-gradient-to-br ${bgGradient} opacity-10 animate-ping`} />
          <div className={`absolute w-48 h-48 rounded-full bg-gradient-to-br ${bgGradient} opacity-20 animate-pulse`} />
        </>
      )}
      {status === "thinking" && (
        <div className="absolute w-48 h-48 rounded-full border border-amber-500/30 animate-spin" style={{ animationDuration: "3s" }} />
      )}

      {/* Main orb */}
      <div className={`w-36 h-36 rounded-full bg-gradient-to-br ${bgGradient} flex items-center justify-center shadow-2xl transition-all duration-500 ${stateClass}`}>
        {status === "thinking" ? (
          <Loader2 className="w-14 h-14 text-white animate-spin" />
        ) : status === "speaking" ? (
          <Volume2 className="w-14 h-14 text-white" />
        ) : isRecording ? (
          <Mic className="w-14 h-14 text-white animate-pulse" />
        ) : (
          <Mic className="w-14 h-14 text-white/60" />
        )}
      </div>
    </div>
  );
}

// ─── Status Label ────────────────────────────────────────────────────────────
function StatusLabel({ status, isRecording }) {
  const labels = {
    idle: { text: "Tap to speak", color: "text-zinc-500" },
    listening: { text: "Listening...", color: "text-blue-400" },
    thinking: { text: "AI is thinking...", color: "text-amber-400" },
    speaking: { text: "AI is speaking", color: "text-emerald-400" },
  };
  const { text, color } = labels[status] || labels.idle;
  return <p className={`text-sm font-semibold uppercase tracking-widest mt-6 transition-colors ${color}`}>{text}</p>;
}

// ─── Main VoiceBot Component ─────────────────────────────────────────────────
export default function VoiceBot() {
  const {
    messages, streamText,
    isConnected, mode, setMode,
    isRecording, isSpeaking, isThinking, status,
    connect, disconnect, sendMessage,
    startRecording, stopRecording,
  } = useAssistant();

  const [isMuted, setIsMuted] = useState(false);

  const toggleConnection = () => {
    if (isConnected) disconnect();
    else connect();
  };

  const handleMicPress = () => {
    if (!isConnected) return;
    if (isRecording) stopRecording();
    else startRecording();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 font-sans">
      <div className="max-w-5xl mx-auto h-screen flex flex-col p-4 md:p-6">

        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${isConnected ? "bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]" : "bg-zinc-800"}`}>
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">MedFlow AI</h1>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                  {isConnected ? "Live" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Toggle */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-1">
              <button
                onClick={() => setMode("chat")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${mode === "chat" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <MessageSquare size={14} /> Chat
              </button>
              <button
                onClick={() => setMode("voice")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${mode === "voice" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <Mic size={14} /> Voice
              </button>
            </div>

            {/* Connect/Disconnect */}
            <button
              onClick={toggleConnection}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${
                isConnected
                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white"
                  : "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_8px_20px_rgba(37,99,235,0.3)]"
              }`}
            >
              {isConnected ? <><PowerOff size={14} /> End</> : <><Power size={14} /> Connect</>}
            </button>
          </div>
        </header>

        {/* ── MAIN PANEL ──────────────────────────────────────────────── */}
        <main className={`flex-1 rounded-[2.5rem] border flex flex-col overflow-hidden transition-all duration-500 min-h-0 ${
          isConnected ? "bg-zinc-900/40 border-zinc-800" : "bg-zinc-900/20 border-white/[0.03] opacity-50"
        }`}>

          {/* ── Welcome screen ── */}
          {!isConnected && messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-5">
              <div className="p-7 bg-zinc-800/30 rounded-full border border-white/[0.03]">
                <Activity size={44} className="text-zinc-700" />
              </div>
              <div className="max-w-xs space-y-2">
                <h2 className="text-xl font-bold tracking-tight">AI Medical Assistant</h2>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Connect to start a real-time conversation — voice or chat.
                </p>
              </div>
              <button
                onClick={connect}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-blue-500 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.3)] active:scale-95"
              >
                Connect Now
              </button>
            </div>
          )}

          {/* ── VOICE MODE ── */}
          {isConnected && mode === "voice" && (
            <div className="flex-1 flex flex-col">
              {/* Top: chat transcript (scroll) */}
              {messages.length > 0 && (
                <div className="flex-1 min-h-0 overflow-hidden">
                  <ChatWindow messages={messages} streamText={streamText} compact />
                </div>
              )}

              {/* Bottom: Orb + mic button */}
              <div className="flex flex-col items-center justify-center py-10 space-y-4 shrink-0">
                <VoiceOrb status={isConnected ? status : "idle"} isRecording={isRecording} />
                <StatusLabel status={isConnected ? status : "idle"} isRecording={isRecording} />

                {/* Push-to-Talk Button */}
                <button
                  onPointerDown={handleMicPress}
                  onPointerUp={isRecording ? handleMicPress : undefined}
                  disabled={!isConnected}
                  className={`mt-4 w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-xl active:scale-95 ${
                    isRecording
                      ? "bg-rose-500 shadow-rose-500/30 ring-4 ring-rose-500/20 animate-pulse"
                      : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
                  } ${!isConnected ? "opacity-30 cursor-not-allowed" : ""}`}
                >
                  {isRecording ? <MicOff size={26} /> : <Mic size={26} />}
                </button>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                  {isRecording ? "Release to send" : "Tap to speak"}
                </p>
              </div>
            </div>
          )}

          {/* ── CHAT MODE ── */}
          {isConnected && mode === "chat" && (
            <div className="flex-1 flex flex-col min-h-0">
              {messages.length === 0 && !streamText && (
                <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
                  Say hello to start your conversation...
                </div>
              )}
              {(messages.length > 0 || streamText) && (
                <ChatWindow messages={messages} streamText={streamText} />
              )}
              <div className="shrink-0">
                <ChatInput
                  sendMessage={sendMessage}
                  isConnected={isConnected}
                  isThinking={isThinking}
                  isRecording={isRecording}
                  onMicStart={startRecording}
                  onMicStop={stopRecording}
                />
              </div>
            </div>
          )}

          {/* Messages shown in voice mode after connection established */}
          {isConnected && mode === "voice" && messages.length === 0 && !streamText && status === "idle" && (
            <div className="text-center text-zinc-600 text-xs pb-2 px-4">
              Tap the mic and speak — your words will appear here
            </div>
          )}
        </main>

        {/* ── FOOTER ── */}
        <footer className="mt-3 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-blue-500" : "bg-zinc-700"}`} />
            Encrypted AI Channel
          </div>
          <div>MedFlow OS • Powered by GPT-4o</div>
        </footer>

      </div>
    </div>
  );
}