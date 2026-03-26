// src/features/assistant/services/assistantApi.js
import { io } from "socket.io-client";

// Backend URL jahan humne socket setup kiya hai
const socket = io("http://localhost:7000"); 

export const assistantApi = {
  // Voice transcript ya text bhejne ke liye
  sendMessage: (text, history) => {
    socket.emit("user_message", { text, history });
  },
  // AI ka response sunne ke liye listener
  onAiResponse: (callback) => {
    socket.on("ai_response", callback);
  },
  // Cleanup function
  disconnect: () => {
    socket.off("ai_response");
  }
};
