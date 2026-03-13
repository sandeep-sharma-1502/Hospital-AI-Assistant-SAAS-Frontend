import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useVoice } from "../hooks/useVoice";
import { RTVIEvent } from "@pipecat-ai/client-js";
import { useRTVIClientEvent } from "@pipecat-ai/client-react";
import { usePipecatClient } from "@pipecat-ai/client-react";

import VoiceOrb from "./VoiceOrb";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import Suggestions from "./Suggestions";

export default function VoiceBot() {
  const { status, messages, connect, sendMessage } = useVoice();
  const [isDarkMode, setIsDarkMode] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const client = usePipecatClient();

  useRTVIClientEvent(
  RTVIEvent.UserStartedSpeaking,
  useCallback(() => {
    setIsUserSpeaking(true);
  }, [])
);

useRTVIClientEvent(
  RTVIEvent.UserStoppedSpeaking,
  useCallback(() => {
    setIsUserSpeaking(false);
  }, [])
);
    
useRTVIClientEvent(
  RTVIEvent.BotStartedSpeaking,
  useCallback(() => {
    setIsSpeaking(true);
  }, [])
);

useRTVIClientEvent(
  RTVIEvent.BotStoppedSpeaking,
  useCallback(() => {
    setIsSpeaking(false);
  }, [])
);

  // const handleConnection = () => {
  //   if (status === "idle") {
  //     connect();
  //   } else if (status === "connected") {
  //     window.location.reload(); // simple disconnect fallback
  //   }
  // };

  const handleConnection = async () => {

  if (status === "idle") {
    await connect();
  }

  else if (status === "connected") {
    await client.disconnect();
  }

};

  return (
    <div className={`assistant-scope ${isDarkMode ? "dark-mode-active" : ""}`}>
      <div className="h-screen flex items-center justify-center p-4 transition-colors duration-500 bg-[var(--bg-main)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl bg-[var(--card)] rounded-[32px] shadow-2xl border border-[var(--border-subtle)] flex flex-col h-[90vh] overflow-hidden"
        >

          {/* ================= HEADER ================= */}
          <header className="px-6 py-4 border-b border-[var(--border-subtle)] flex justify-between items-center shrink-0">
            
            <div className="flex items-center gap-6">
              <div>
                {/* className={`w-3 h-3 rounded-full ${
                  status !== "idle"
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-[#FF3A3A]"
                }`} */}
                  <span className="relative inline-flex h-2.5 w-2.5">
                    {status == "connected" ? (
                      <>
                        <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                      </>
                    ) : (
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF3A3A]"></span>
                    )}
                  </span>
                </div>
              <h1 className="font-bold text-[var(--text-primary)] tracking-tight text-lg">
                MedFlow AI
              </h1>
            </div>
            <div>
              {isUserSpeaking && "🎤 User Speaking"}
              {isSpeaking && "🤖 Bot Speaking"}
            </div>
            <div className="flex items-center gap-2">

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-xl hover:bg-gray-500/10 text-[var(--text-secondary)] transition-all"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Status Badge */}
              <span className="text-sm font-bold px-4 py-1.5 bg-blue-500/10 text-blue-500 rounded-lg uppercase tracking-widest">
                {status}
              </span>

              {/* Start / Disconnect Button */}
              <button
                onClick={handleConnection}
                disabled={status === "connecting"}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all
                  ${
                    status === "idle"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : status === "connecting"
                      ? "bg-yellow-500 text-white cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }
                `}
              >
                {status === "idle" && "Start"}
                {status === "connecting" && "Connecting..."}
                {status === "connected" && "Disconnect"}
              </button>

            </div>
          </header>

          {/* ================= CHAT WINDOW ================= */}
          <ChatWindow messages={messages} />

          {/* ================= SUGGESTIONS ================= */}
          <div className="px-6 py-3 bg-[var(--card)] border-t border-[var(--border-subtle)] shrink-0">
            <Suggestions onSelect={(text) => sendMessage(text)} />
          </div>

          {/* ================= CHAT INPUT ================= */}
          <div className="bg-[var(--card)] shrink-0">
            <ChatInput
                sendMessage={sendMessage}
                status={status}
                connect={connect}
              />
          </div>

        </motion.div>
      </div>
    </div>
  );
}