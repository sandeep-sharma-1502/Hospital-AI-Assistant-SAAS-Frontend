import { useEffect, useState, useCallback, useRef } from "react";
import { usePipecatClient } from "@pipecat-ai/client-react";

export const useVoice = () => {
  const client = usePipecatClient();
  const [status, setStatus] = useState("idle");
  const [messages, setMessages] = useState([]);

  const streamRef = useRef(null);

  // -------------------------------
  // Client Events
  // -------------------------------
  useEffect(() => {
    if (!client) return;

    const handleStateChange = (state) => {
      if (state === "connected") setStatus("connected");
      else if (state === "disconnected") setStatus("idle");
    };

    const handleBotText = (event) => {
      const text = event?.text?.trim();
      if (!text) return;

      setMessages((prev) => [
        ...prev,
        { role: "bot", text }
      ]);
    };

    client.on("transport-state-changed", handleStateChange);
    client.on("bot-tts-text", handleBotText);

    return () => {
      client.off("transport-state-changed", handleStateChange);
      client.off("bot-tts-text", handleBotText);
    };
  }, [client]);

  // -------------------------------
  // CONNECT WITHOUT MIC
  // -------------------------------
  const connect = useCallback(async () => {
    if (!client) return;

    try {
      await client.connect({
        webrtcUrl: "http://localhost:8765/offer",
        audio: false // 🔥 IMPORTANT — prevents auto mic request
      });
    } catch (err) {
      console.error("Connection failed", err);
    }
  }, [client]);

  // -------------------------------
  // REQUEST MIC ONLY WHEN NEEDED
  // -------------------------------
  const enableMic = useCallback(async () => {
    if (!client) return;

    if (!streamRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const track = stream.getAudioTracks()[0];
      client.addTrack(track); // dynamically attach mic
    }

    streamRef.current.getAudioTracks()[0].enabled = true;
  }, [client]);

  const disableMic = useCallback(() => {
    if (!streamRef.current) return;

    streamRef.current.getAudioTracks()[0].enabled = false;
  }, []);

  // -------------------------------
  // SEND MESSAGE
  // -------------------------------
  const sendMessage = useCallback(async (text) => {
    if (!client || !text.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: text.trim() }
    ]);

    await client.sendClientMessage("user-text", { text });
  }, [client]);

  return {
    status,
    messages,
    connect,
    sendMessage,
    enableMic,
    disableMic,
    streamRef
  };
};