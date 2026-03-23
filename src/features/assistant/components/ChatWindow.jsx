import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages, streamText }) {
  const scrollRef = useRef(null);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, streamText]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-6 py-6 space-y-4 custom-scrollbar"
    >
      {/* ✅ NORMAL MESSAGES */}
      {messages.map((m, i) => (
        <MessageBubble
          key={i}
          role={m.role === "user" ? "user" : "bot"}
          text={m.content}
        />
      ))}

      {/* 🔥 STREAMING MESSAGE (Typing Effect) */}
      {streamText && (
        <MessageBubble
          role="bot"
          text={streamText}
        />
      )}

      {/* SCROLL SPACE */}
      <div className="h-2" />
    </div>
  );
}