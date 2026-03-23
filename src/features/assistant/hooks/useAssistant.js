import { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = "http://localhost:7000";

// ─────────────────────────────────────────────────────────────────────────────
// useAssistant — ChatGPT-style real-time AI conversation
// Supports: Text Chat + Voice Mode
// Audio: Gapless playback via AudioContext queue (no double-voice)
// Voice: MediaRecorder → base64 → Socket → STT → GPT stream → TTS → speaker
// ─────────────────────────────────────────────────────────────────────────────

export const useAssistant = () => {
    const [messages, setMessages] = useState([]);
    const [streamText, setStreamText] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [mode, setMode] = useState("chat"); // "chat" | "voice"
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [status, setStatus] = useState("idle"); // idle | thinking | speaking | listening

    const socketRef = useRef(null);
    const audioCtxRef = useRef(null);
    const audioQueueRef = useRef([]);
    const isPlayingRef = useRef(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const streamTextRef = useRef(""); // Track stream for commit

    // ─── AudioContext (gapless playback) ───────────────────────────────────
    const getAudioContext = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    };

    const playNextInQueue = useCallback(async () => {
        if (isPlayingRef.current || audioQueueRef.current.length === 0) return;

        isPlayingRef.current = true;
        setIsSpeaking(true);
        setStatus("speaking");

        const base64 = audioQueueRef.current.shift();
        try {
            const ctx = getAudioContext();
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

            const audioBuffer = await ctx.decodeAudioData(bytes.buffer);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.start();

            source.onended = () => {
                isPlayingRef.current = false;
                if (audioQueueRef.current.length > 0) {
                    playNextInQueue();
                } else {
                    setIsSpeaking(false);
                    setStatus(isConnected ? "idle" : "idle");
                }
            };
        } catch (err) {
            console.warn("Audio decode error:", err);
            isPlayingRef.current = false;
            playNextInQueue();
        }
    }, [isConnected]);

    const enqueueAudio = useCallback((base64Audio) => {
        audioQueueRef.current.push(base64Audio);
        playNextInQueue();
    }, [playNextInQueue]);

    const stopAudio = useCallback(() => {
        audioQueueRef.current = [];
        isPlayingRef.current = false;
        setIsSpeaking(false);
        if (audioCtxRef.current) {
            audioCtxRef.current.close().catch(() => {});
            audioCtxRef.current = null;
        }
    }, []);

    // ─── Socket Connect ────────────────────────────────────────────────────
    const connect = useCallback(() => {
        if (socketRef.current?.connected) return;

        // Unlock AudioContext on first user interaction
        getAudioContext();

        const socket = io(BACKEND_URL, { transports: ["websocket"] });
        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);
            setStatus("idle");
            console.log("✅ Connected to AI Assistant");
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
            setStatus("idle");
            console.log("❌ Disconnected");
        });

        // ── Text streaming (ChatGPT typing effect) ──
        socket.on("ai_thinking", () => {
            setIsThinking(true);
            setStatus("thinking");
            streamTextRef.current = "";
        });

        socket.on("ai_stream", ({ text }) => {
            setIsThinking(false);
            streamTextRef.current += text;
            setStreamText((prev) => prev + text);
        });

        socket.on("ai_stream_end", ({ text }) => {
            setMessages((prev) => [...prev, { role: "bot", content: text }]);
            setStreamText("");
            streamTextRef.current = "";
            if (!isSpeaking) setStatus("idle");
        });

        // ── Audio playback (TTS chunks) ──
        socket.on("ai_audio", ({ audio }) => {
            if (audio) enqueueAudio(audio);
        });

        // ── Transcription (voice → text user bubble) ──
        socket.on("transcription", ({ text }) => {
            setMessages((prev) => [...prev, { role: "user", content: text }]);
            setStatus("thinking");
        });

        // ── Tool/Action results (structured UI data) ──
        socket.on("ai_action", ({ action, data }) => {
            setMessages((prev) => [...prev, { role: "action", action, data }]);
        });

        socket.on("ai_error", ({ message }) => {
            setIsThinking(false);
            setStatus("idle");
            setMessages((prev) => [...prev, { role: "bot", content: `⚠️ ${message}` }]);
        });

    }, [enqueueAudio, isSpeaking]);

    // ─── Socket Disconnect ─────────────────────────────────────────────────
    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        stopAudio();
        setIsConnected(false);
        setStatus("idle");
    }, [stopAudio]);

    // ─── Send Text Message ─────────────────────────────────────────────────
    const sendMessage = useCallback((text) => {
        if (!text?.trim() || !socketRef.current?.connected) return;

        // Interrupt any ongoing stream + audio
        socketRef.current.emit("interrupt");
        stopAudio();

        setMessages((prev) => [...prev, { role: "user", content: text }]);

        socketRef.current.emit("user_message", {
            text,
            history: messages,
        });
    }, [messages, stopAudio]);

    // ─── Voice Recording ───────────────────────────────────────────────────
    const startRecording = useCallback(async () => {
        if (isRecording) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorder.start(100); // Collect every 100ms
            setIsRecording(true);
            setStatus("listening");

            // Stop any AI audio when user speaks (interrupt)
            socketRef.current?.emit("interrupt");
            stopAudio();

        } catch (err) {
            console.error("Mic access denied:", err);
        }
    }, [isRecording, stopAudio]);

    const stopRecording = useCallback(async () => {
        if (!isRecording || !mediaRecorderRef.current) return;

        setIsRecording(false);
        setStatus("thinking");

        return new Promise((resolve) => {
            mediaRecorderRef.current.onstop = async () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const arrayBuffer = await blob.arrayBuffer();
                const base64 = btoa(
                    new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
                );

                socketRef.current?.emit("voice_audio", {
                    audio: base64,
                    history: messages,
                });

                // Stop all mic tracks
                mediaRecorderRef.current?.stream?.getTracks().forEach((t) => t.stop());
                resolve();
            };
            mediaRecorderRef.current.stop();
        });
    }, [isRecording, messages]);

    // ─── Cleanup on unmount ────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            socketRef.current?.disconnect();
            stopAudio();
        };
    }, [stopAudio]);

    return {
        messages,
        setMessages,
        streamText,
        isConnected,
        mode,
        setMode,
        isRecording,
        isSpeaking,
        isThinking,
        status,
        connect,
        disconnect,
        sendMessage,
        startRecording,
        stopRecording,
    };
};