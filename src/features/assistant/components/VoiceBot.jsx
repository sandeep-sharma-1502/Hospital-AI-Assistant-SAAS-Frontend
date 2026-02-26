import { useEffect, useState } from "react";
import { usePipecatClient } from "@pipecat-ai/client-react";

export default function VoiceBot() {
  const client = usePipecatClient();

  const [connected, setConnected] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!client) return;

    // ---------------- CONNECTION STATE ----------------
    const handleStateChange = (state) => {
      console.log("Transport state:", state);
      setConnected(state === "connected");
    };

    client.on("transport-state-changed", handleStateChange);

    // ---------------- BOT SPOKEN TEXT ----------------
    // This captures text that was actually spoken by TTS
    const handleBotText = (event) => {
      const text = event?.text;
      if (!text || text.trim().length <= 1) return;

      const clean = text.trim();

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "bot" && last.text === clean) {
          return prev; // prevent duplicates
        }
        return [...prev, { role: "bot", text: clean }];
      });
    };

    client.on("bot-tts-text", handleBotText);

    // ---------------- CLEANUP ----------------
    return () => {
      client.off("transport-state-changed", handleStateChange);
      client.off("bot-tts-text", handleBotText);
    };
  }, [client]);

  // ---------------- CONNECT ----------------
  const connect = async () => {
    if (!client) return;

    await client.connect({
      webrtcUrl: "http://localhost:8765/offer",
    });
  };

  // ---------------- SEND TEXT ----------------
  const sendText = async () => {
    if (!client || !input.trim()) return;

    const text = input.trim();

    // Add user message locally
    setMessages((prev) => [...prev, { role: "user", text }]);

    // Send to backend (RTVI correct)
    await client.sendClientMessage("user-text", {
      text,
    });

    setInput("");
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>🏥 Hospital AI</h2>

      {!connected && (
        <button onClick={connect}>
          🎤 Start Voice Bot
        </button>
      )}

      {/* ---------------- CHAT AREA ---------------- */}
      <div style={{ marginTop: 20 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <b>{m.role === "user" ? "You" : "Bot"}:</b> {m.text}
          </div>
        ))}
      </div>

      {/* ---------------- TEXT INPUT ---------------- */}
      <div style={{ marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ width: "70%" }}
        />
        <button onClick={sendText}>
          Send
        </button>
      </div>
    </div>
  );
}


