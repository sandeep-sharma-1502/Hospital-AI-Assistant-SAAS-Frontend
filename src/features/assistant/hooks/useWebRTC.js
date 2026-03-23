import { useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:7000");

export const useWebRTC = () => {
  const pcRef = useRef(null);
  const audioRef = useRef(null);

  const startWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // 🎤 SEND MIC
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // 🔊 RECEIVE AI AUDIO (FINAL FIX)
      pc.ontrack = (event) => {
        try {
          console.log("🔥 TRACK RECEIVED", event);

          const incomingStream =
            event.streams[0] || new MediaStream([event.track]);

          if (!audioRef.current) {
            const audio = document.createElement("audio");
            audio.autoplay = true;
            audio.playsInline = true;
            audio.controls = false;

            document.body.appendChild(audio); // 🔥 REQUIRED

            audioRef.current = audio;
          }

          audioRef.current.srcObject = incomingStream;

          audioRef.current
            .play()
            .then(() => console.log("✅ AUDIO PLAYING"))
            .catch((err) => console.error("❌ PLAY ERROR:", err));

        } catch (err) {
          console.error("WebRTC audio error:", err);
        }
      };

      // ICE
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc_ice_candidate", {
            candidate: event.candidate,
          });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("webrtc_offer", { offer });

      socket.on("webrtc_answer", async (data) => {
        await pc.setRemoteDescription(data.answer);
      });

      socket.on("webrtc_ice_candidate", async (data) => {
        if (data.candidate) {
          await pc.addIceCandidate(data.candidate);
        }
      });

      console.log("✅ WebRTC Started");

    } catch (err) {
      console.error("❌ WebRTC error:", err);
    }
  };

  return { startWebRTC };
};