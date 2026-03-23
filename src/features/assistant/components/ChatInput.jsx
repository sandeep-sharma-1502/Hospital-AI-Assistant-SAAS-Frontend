import React, { useState } from "react";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";

export default function ChatInput({ sendMessage, isConnected, isThinking, isRecording, onMicStart, onMicStop }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || !isConnected || isThinking) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleMic = () => {
    if (!isConnected) return;
    if (isRecording) onMicStop?.();
    else onMicStart?.();
  };

  return (
    <div className="px-4 pb-5 pt-2">
      <div className="max-w-3xl mx-auto relative">
        <div className="flex items-center gap-2 bg-zinc-800/70 border border-zinc-700/60 rounded-2xl px-3 py-2 focus-within:border-blue-500/50 transition-colors">

          {/* MIC BUTTON */}
          <button
            onClick={handleMic}
            disabled={!isConnected}
            title={isRecording ? "Stop recording" : "Click to record voice"}
            className={`flex-shrink-0 p-2 rounded-xl transition-all ${
              !isConnected
                ? "text-zinc-700 cursor-not-allowed"
                : isRecording
                ? "text-rose-400 bg-rose-500/10 ring-2 ring-rose-500/30 animate-pulse"
                : "text-zinc-400 hover:text-blue-400 hover:bg-zinc-700/50"
            }`}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* TEXT INPUT */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={isConnected ? "Message MedFlow AI..." : "Connect to start chatting..."}
            disabled={!isConnected || isThinking || isRecording}
            className="flex-1 bg-transparent outline-none text-white placeholder:text-zinc-600 text-sm py-1 disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* SEND / THINKING INDICATOR */}
          {isThinking ? (
            <div className="flex-shrink-0 p-2">
              <Loader2 size={20} className="text-blue-400 animate-spin" />
            </div>
          ) : (
            <button
              onClick={handleSend}
              disabled={!isConnected || !input.trim() || isThinking}
              className={`flex-shrink-0 p-2 rounded-xl transition-all active:scale-90 ${
                isConnected && input.trim()
                  ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                  : "text-zinc-700 cursor-not-allowed"
              }`}
            >
              <Send size={20} />
            </button>
          )}
        </div>

        {isRecording && (
          <p className="text-center text-[10px] text-rose-400 uppercase tracking-widest mt-2 animate-pulse">
            🎤 Recording — click mic to send
          </p>
        )}
      </div>
    </div>
  );
}