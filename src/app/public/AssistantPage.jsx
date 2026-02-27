import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Power, Moon, Sun } from 'lucide-react';

// Features & Hooks
import VoiceOrb from '../../features/assistant/components/VoiceOrb';
import Suggestions from '../../features/assistant/components/Suggestions';
import { useVoice } from '../../features/assistant/hooks/useVoice';

export default function AssistantPage() {
  const { status, messages, connect, sendMessage, streamRef } = useVoice();
  const [textInput, setTextInput] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  
  // Default is Dark for the AI feel
  const [isDarkMode, setIsDarkMode] = useState(true); 
  const scrollRef = useRef(null);

  // Sync mic hardware with local mute state
  useEffect(() => {
    if (streamRef?.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !isMuted;
      }
    }
  }, [isMuted, status, streamRef]);

  // Handle Voice Connection
  const handleConnect = async () => {
    await connect();
    setIsMuted(true); 
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!textInput.trim()) return;
    sendMessage(textInput);
    setTextInput("");
  };

  return (
    /* Yeh div Admin theme ko block karega */
    <div className={`assistant-scope ${isDarkMode ? 'dark-mode-active' : ''}`}>
      <div className="h-screen flex items-center justify-center p-4 transition-colors duration-500 bg-[var(--bg-main)]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl bg-[var(--card)] rounded-[32px] shadow-2xl border border-[var(--border-subtle)] flex flex-col h-[90vh] overflow-hidden"
        >
          
          {/* HEADER */}
          <header className="p-6 border-b border-[var(--border-subtle)] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${status !== 'idle' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
              <h1 className="font-bold text-[var(--text-primary)] tracking-tight text-lg">MedFlow AI</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-xl hover:bg-gray-500/10 text-[var(--text-secondary)] transition-all"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <span className="text-[10px] font-black px-2.5 py-1 bg-blue-500/10 text-blue-500 rounded-lg uppercase tracking-widest">
                {status}
              </span>

              <button onClick={handleConnect} className="p-2 text-[var(--text-secondary)] hover:text-blue-500 transition-colors">
                <Power size={20} />
              </button>
            </div>
          </header>

          {/* ORB SECTION */}
          <div className="pt-8 pb-2 flex flex-col items-center shrink-0">
             {/* <VoiceOrb status={status} />  */}
          </div>

          {/* MESSAGES SECTION */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-4 space-y-6 custom-scrollbar bg-opacity-10">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[75%] p-4 rounded-2xl flex gap-3 shadow-md ${
                    m.role === "user" 
                    ? "bg-blue-600 text-white rounded-tr-none" 
                    : "bg-[var(--card)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-tl-none"
                  }`}>
                    <p className="text-sm leading-relaxed font-medium">{m.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* FOOTER & INPUT */}
          <div className="bg-[var(--card)] border-t border-[var(--border-subtle)] shrink-0">
            <div className="px-6 pt-4 pb-2">
              <Suggestions onSelect={(text) => sendMessage(text)} />
            </div>

            <div className="p-6">
              <div className="max-w-3xl mx-auto relative">
                <input 
                  placeholder="Describe your symptoms..." 
                  className="w-full pl-6 pr-32 py-4 bg-[var(--input-bg)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl outline-none placeholder:text-gray-500 focus:border-blue-500 transition-all" 
                  type="text" 
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <div className="absolute right-2 top-2 flex gap-2">
                  <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className={`p-2 rounded-xl transition-all ${isMuted ? 'text-red-500 bg-red-500/10' : 'text-gray-400 hover:bg-gray-500/10'}`}
                  >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  <button 
                    onClick={handleSend} 
                    className="bg-blue-600 text-white p-2 rounded-xl shadow-lg active:scale-95 transition-transform"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}