import { useState, useCallback, useRef } from "react";
import {
  usePipecatClient,
  usePipecatClientTransportState,
  useRTVIClientEvent
} from "@pipecat-ai/client-react";
import { RTVIEvent } from "@pipecat-ai/client-js";

export const useVoice = () => {
  const client = usePipecatClient();
  const transportState = usePipecatClientTransportState();

  const [messages, setMessages] = useState([]);
  const streamRef = useRef(null);


  // ==========================
  // MAP TRANSPORT STATE → UI STATE
  // ==========================

  let status = "idle";

  if (transportState === "connecting") {
    status = "connecting";
  }

  if (transportState === "connected" || transportState === "ready") {
    status = "connected";
  }

  // ==========================
  // CONNECT
  // ==========================

const connect = useCallback(async () => {
  if (!client) return;

  try {

    // 1️⃣ browser mic permission
    await navigator.mediaDevices.getUserMedia({ audio: true });

    // 2️⃣ connect pipecat
    await client.connect({
      connection_url: "http://localhost:8765/api/v1/webrtc/offer",
    });

  } catch (err) {
    console.error("Mic permission denied or connection failed", err);
    alert("Please allow microphone access.");
  }

}, [client]);

  // ==========================
  // ENABLE MIC
  // ==========================

  // const enableMic = useCallback(async () => {
  //   if (!client) return;

  //   if (!streamRef.current) {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     streamRef.current = stream;

  //     const track = stream.getAudioTracks()[0];
  //     client.addTrack(track);
  //   }

  //   streamRef.current.getAudioTracks()[0].enabled = true;
  // }, [client]);

  // // ==========================
  // // DISABLE MIC
  // // ==========================

  // const disableMic = useCallback(() => {
  //   if (!streamRef.current) return;
  //   streamRef.current.getAudioTracks()[0].enabled = false;
  // }, []);

  // ==========================
  // SEND TEXT MESSAGE
  // ==========================

  // send user message
  const sendMessage = useCallback(
    async (text) => {
      if (!client || !text.trim()) return;

      const clean = text.trim();

      setMessages((prev) => [...prev, { role: "user", text: clean }]);

      await client.sendClientMessage("user-text", { text: clean });
    },
    [client]
  );


useRTVIClientEvent(
  RTVIEvent.BotOutput,
  useCallback((data) => {
    const text = data?.text?.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "bot", text }]);
  }, [])
);



  return {
    status,
    messages,
    connect,
    sendMessage,
    // enableMic,
    // disableMic,
  };
};