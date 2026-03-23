"use client";

import { Activity, ShieldCheck, Power, PowerOff } from "lucide-react";
import { useAssistant } from "../hooks/useAssistant";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

export default function VoiceBot() {
  const { messages, streamText, isConnected, connect, disconnect, sendMessage } = useAssistant();

  const toggleConnection = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">
      <div className="max-w-6xl mx-auto h-screen flex flex-col p-4 md:p-8">

        {/* HEADER */}
        <header className="flex items-center justify-between mb-8 shrink-0">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isConnected ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-zinc-800'}`}>
              <Activity className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">MedFlow AI Assistant</h1>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                  {isConnected ? "Real-time AI Active" : "System Standby"}
                </p>
              </div>
            </div>
          </div>

          {/* SESSION CONTROL */}
          <button
            onClick={toggleConnection}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${
              isConnected 
              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white' 
              : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_10px_20px_rgba(37,99,235,0.2)]'
            }`}
          >
            {isConnected ? (
              <><PowerOff size={16} /> Disconnect</>
            ) : (
              <><Power size={16} /> Establish Link</>
            )}
          </button>
        </header>

        {/* MAIN INTERFACE */}
        <main className={`flex-1 bg-zinc-900/40 border rounded-[2.5rem] flex flex-col overflow-hidden transition-all duration-500 min-h-0 ${isConnected ? 'border-zinc-800' : 'border-white/[0.02] opacity-60'}`}>
          
          {/* Welcome Screen when disconnected */}
          {!isConnected && messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-6">
              <div className="p-8 bg-zinc-800/30 rounded-full border border-white/[0.02]">
                <Activity size={48} className="text-zinc-700" />
              </div>
              <div className="max-w-md space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">AI Diagnostic Interface</h2>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Establish a secure encrypted link to begin your medical consultation and symptom analysis.
                </p>
              </div>
            </div>
          )}

          {/* CHAT WINDOW */}
          {(isConnected || messages.length > 0) && (
            <ChatWindow messages={messages} streamText={streamText} />
          )}

          {/* INPUT AREA */}
          <div className="mt-auto">
            <ChatInput sendMessage={sendMessage} isConnected={isConnected} />
          </div>
        </main>

        {/* FOOTER */}
        <footer className="mt-6 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
          <div className="flex items-center gap-3">
            <ShieldCheck size={14} className={isConnected ? "text-blue-500" : "text-zinc-700"} />
            Secure AI Channel
          </div>
          <div>
            AI Powered Assistant • MedFlow OS
          </div>
        </footer>

      </div>
    </div>
  );
}