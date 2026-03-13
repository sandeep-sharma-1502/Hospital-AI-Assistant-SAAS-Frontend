import React, { useState } from "react";
import { Mic, MicOff, Send } from "lucide-react";
import { usePipecatClientMicControl } from "@pipecat-ai/client-react";
import { PipecatClientMicToggle } from "@pipecat-ai/client-react";
import { VoiceVisualizer } from "@pipecat-ai/client-react";


export default function ChatInput({ sendMessage, status, connect }) {
  const [input, setInput] = useState("");

  // const { enableMic, disableMic, isMicEnabled } = usePipecatClientMicControl();

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="px-6 pb-6">
      <div className="max-w-3xl mx-auto relative">
        <input
          placeholder="Describe your symptoms..."
          className="w-full pl-6 pr-32 py-4 bg-[var(--input-bg)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl outline-none placeholder:text-gray-500 focus:border-blue-500 transition-all"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <div className="absolute right-2 top-2 flex gap-2">
          <div className="flex items-center">
              <VoiceVisualizer
                participantType="local"
                barColor="#3B82F6"
                barGap={2}
                barWidth={3}
                barMaxHeight={20}
              />
          </div>
          <PipecatClientMicToggle>
          {({ isMicEnabled, onClick }) => (
            <button 
            onClick={() => {
                if (status === "idle") {
                  connect();
                } else {
                  onClick();
                }}}
             className={`p-2 rounded-xl transition-all ${
              isMicEnabled? "text-gray-400 hover:bg-gray-500/10":"text-red-500 bg-red-500/10"
            }`}
            >
              {isMicEnabled ?  <Mic size={20} /> : <MicOff size={20} />}
            </button>
          )}
        </PipecatClientMicToggle>
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white p-2 rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}