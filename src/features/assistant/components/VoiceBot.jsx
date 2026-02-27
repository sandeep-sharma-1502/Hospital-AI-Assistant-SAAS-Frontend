import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Bot, User } from "lucide-react";
import { useVoice } from "../hooks/useVoice";
import VoiceOrb from "./VoiceOrb";

export default function VoiceBot() {
  const { status, messages, connect, sendMessage } = useVoice();
  const [input, setInput] = useState("");

  const handleSend = () => {
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Orb Section */}
      <div className="flex flex-col items-center py-10">
        <VoiceOrb status={status} />
        <p className="mt-4 text-slate-400 font-medium animate-pulse capitalize">
          {status === 'idle' ? 'Ready to help' : status}
        </p>
        
        {status === "idle" && (
          <button 
            onClick={connect}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
          >
            <Mic size={20} /> Start Conversation
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 px-4 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl flex gap-3 ${
                m.role === "user" 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-white border border-slate-100 text-slate-800 shadow-sm rounded-tl-none"
              }`}>
                {m.role === "bot" && <Bot size={18} className="text-blue-500 shrink-0" />}
                <p className="text-sm leading-relaxed">{m.text}</p>
                {m.role === "user" && <User size={18} className="text-blue-200 shrink-0" />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Dock */}
      <div className="p-6">
        <div className="relative group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your symptoms or questions..."
            className="w-full pl-6 pr-16 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-2 p-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}