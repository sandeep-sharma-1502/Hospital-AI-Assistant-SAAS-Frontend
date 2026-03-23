import { useEffect, useState, useRef } from "react";
import { Room } from "livekit-client";
import { useDispatch } from "react-redux";
import {
  addMessage,
  setAiSpeaking,
  setStatus,
} from "../../../store/slices/assistantSlice";

export const useVoice = () => {
  const dispatch = useDispatch();

  const [room, setRoom] = useState(null);
  const [status, setLocalStatus] = useState("idle");
  const [isRecording, setIsRecording] = useState(false);

  const audioRef = useRef(null);

  // 🔥 AUDIO UNLOCK
  useEffect(() => {
    const unlock = () => {
      const audio = new Audio();
      audio.muted = true;
      audio.play().catch(() => {});
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("click", unlock);
  }, []);

  // ================= CONNECT =================
  useEffect(() => {
    let livekitRoom;

    const init = async () => {
      try {
        // ✅ token backend se
        const res = await fetch("http://localhost:7000/api/livekit/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomName: "hospital-room",
            userName: "sandeep",
          }),
        });

        const data = await res.json();

        // ✅ Room create karo
        livekitRoom = new Room();

        await livekitRoom.connect(data.url, data.token);

        setRoom(livekitRoom);
        setLocalStatus("connected");
        dispatch(setStatus("connected"));

        // 🔊 AI audio receive
        livekitRoom.on("trackSubscribed", (track) => {
          if (track.kind === "audio") {
            const stream = new MediaStream([track.mediaStreamTrack]);

            const audio = new Audio();
            audio.srcObject = stream;
            audio.autoplay = true;

            audioRef.current = audio;

            dispatch(setAiSpeaking(true));

            audio.onended = () => {
              dispatch(setAiSpeaking(false));
            };

            audio.play().catch(() => {
              dispatch(setAiSpeaking(false));
            });
          }
        });

        // 💬 AI text receive
        livekitRoom.on("dataReceived", (payload) => {
          const text = new TextDecoder().decode(payload);
          dispatch(addMessage({ role: "bot", content: text }));
        });

      } catch (err) {
        console.error("LiveKit error:", err);
        setLocalStatus("error");
        dispatch(setStatus("error"));
      }
    };

    init();

    return () => {
      if (livekitRoom) livekitRoom.disconnect();
    };
  }, [dispatch]);

  // 🎤 MIC START
  const startRecording = async () => {
    if (!room) return;
    await room.localParticipant.setMicrophoneEnabled(true);
    setIsRecording(true);
  };

  // 🛑 MIC STOP
  const stopRecording = async () => {
    if (!room) return;
    await room.localParticipant.setMicrophoneEnabled(false);
    setIsRecording(false);
  };

  // 💬 TEXT SEND
  const sendMessage = (text) => {
    if (!room || !text.trim()) return;

    dispatch(addMessage({ role: "user", content: text }));

    room.localParticipant.publishData(
      new TextEncoder().encode(text),
      { reliable: true }
    );
  };

  return {
    sendMessage,
    startRecording,
    stopRecording,
    isRecording,
    status,
  };
};