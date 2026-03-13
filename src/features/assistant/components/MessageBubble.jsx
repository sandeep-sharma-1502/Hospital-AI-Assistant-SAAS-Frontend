import React from "react";
import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";

export default function MessageBubble({ role, text }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >

      {/* BOT ICON */}
      {!isUser && (
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white shrink-0">
          <Bot size={16} />
        </div>
      )}

      {/* MESSAGE BUBBLE */}
      <div
        className={`max-w-[75%] px-3 py-2 rounded-2xl shadow-md ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-none"
            : "bg-[var(--card)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-tl-none"
        }`}
      >
        <p className="text-sm leading-relaxed font-medium">{text}</p>
      </div>

      {/* USER ICON */}
      {isUser && (
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-500 text-white shrink-0">
          <User size={16} />
        </div>
      )}

    </motion.div>
  );
}