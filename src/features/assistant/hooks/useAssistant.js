import { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";

export const useAssistant = () => {
    const [messages, setMessages] = useState([]);
    const [streamText, setStreamText] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    const connect = useCallback(() => {
        if (socketRef.current?.connected) return;

        const socket = io("http://localhost:7000");
        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);
            console.log("Connected to AI Assistant");
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
            console.log("Disconnected from AI Assistant");
        });

        socket.on("ai_stream", (data) => {
            setStreamText((prev) => prev + data.text);
        });

        socket.on("ai_stream_end", (data) => {
            setMessages((prev) => [
                ...prev,
                { role: "bot", content: data.text }
            ]);
            setStreamText("");
        });

        socket.on("ai_audio_chunk", (data) => {
            playAudio(data.audio);
        });
    }, []);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const sendMessage = (text) => {
        if (!socketRef.current?.connected) return;

        socketRef.current.emit("interrupt");

        setMessages((prev) => [
            ...prev,
            { role: "user", content: text }
        ]);

        socketRef.current.emit("user_message", {
            text,
            history: messages,
        });
    };

    return {
        messages,
        streamText,
        isConnected,
        connect,
        disconnect,
        sendMessage,
    };
};

const playAudio = (base64) => {
    const audio = new Audio(`data:audio/mp3;base64,${base64}`);
    audio.play();
};