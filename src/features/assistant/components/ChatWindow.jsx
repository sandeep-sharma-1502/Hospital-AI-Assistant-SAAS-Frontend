import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages, streamText, compact }) {
  const scrollRef = useRef(null);

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
      className={`flex-1 overflow-y-auto ${compact ? "px-4 py-3 space-y-2 max-h-48" : "px-6 py-6 space-y-1"} custom-scrollbar`}
    >
      {/* All completed messages */}
      {messages.map((m, i) => (
        <MessageBubble
          key={i}
          role={m.role}
          text={m.content}
          action={m.action}
          data={m.data}
        />
      ))}

      {/* Live streaming text (ChatGPT typing effect) */}
      {streamText && (
        <MessageBubble role="bot" text={streamText} />
      )}

      {/* Scroll anchor */}
      <div className="h-2" />
    </div>
  );
}