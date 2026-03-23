// src/features/assistant/components/MessageBubble.jsx
import React from "react";
import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";

export default function MessageBubble({ role, text }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 mb-2 ${
        isUser ? "flex-row-reverse justify-start" : "justify-start"
      }`}
    >
      {/* ICON SECTION */}
      <div className={`w-9 h-9 flex items-center justify-center rounded-full shrink-0 shadow-sm ${
        isUser ? "bg-zinc-500 text-white" : "bg-blue-600 text-white"
      }`}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      {/* MESSAGE CONTENT */}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm border ${
          isUser
            ? "bg-blue-600 text-white border-blue-500 rounded-tr-none"
            : "bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 border-gray-100 dark:border-zinc-700 rounded-tl-none"
        }`}
      >
        <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">
          {text}
        </p>
        
        {/* Optional: Time stamp dikhane ke liye */}
        <span className={`text-[10px] block mt-1 opacity-50 ${isUser ? "text-right" : "text-left"}`}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}
