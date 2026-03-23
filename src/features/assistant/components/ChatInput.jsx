import React, { useState } from "react";
import { Send, Mic, MicOff } from "lucide-react";

export default function ChatInput({ sendMessage, isConnected }) {
  const [input, setInput] = useState("");
  const [isMicOn, setIsMicOn] = useState(false);

  // ================= SEND TEXT =================
  const handleSend = () => {
    if (!input.trim() || !isConnected) return;

    sendMessage(input); 
    setInput("");
  };

  // ================= MIC TOGGLE =================
  const handleMic = () => {
    if (!isConnected) return;
    setIsMicOn((prev) => !prev);
  };

  return (
    <div className="px-6 pb-6">
      <div className="max-w-3xl mx-auto relative group">

        {/* INPUT */}
        <input
          placeholder={isConnected ? "Ask your health question..." : "Establish link to start chat..."}
          disabled={!isConnected}
          className={`w-full pl-6 pr-32 py-4 bg-zinc-800 border transition-all outline-none rounded-2xl text-white placeholder:text-zinc-600 ${
            isConnected 
            ? 'border-zinc-700 focus:border-blue-500 bg-zinc-800/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]' 
            : 'border-zinc-800/50 opacity-50 cursor-not-allowed'
          }`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        {/* ACTIONS */}
        <div className="absolute right-2 top-2 flex gap-2 items-center">

          {/* MIC BUTTON */}
          <button
            onClick={handleMic}
            disabled={!isConnected}
            className={`p-2 rounded-xl transition-all ${
              !isConnected 
              ? 'text-zinc-700 cursor-not-allowed' 
              : isMicOn
                ? "text-blue-500 bg-blue-500/10"
                : "text-zinc-500 hover:bg-zinc-700/50"
            }`}
          >
            {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* SEND BUTTON */}
          <button
            onClick={handleSend}
            disabled={!isConnected || !input.trim()}
            className={`p-2 rounded-xl transition-all shadow-lg active:scale-95 ${
              isConnected && input.trim()
              ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20'
              : 'bg-zinc-800 text-zinc-700 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>

        </div>
      </div>
    </div>
  );
}