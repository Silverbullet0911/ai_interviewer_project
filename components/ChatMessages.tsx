"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/types";

interface Props {
  messages: Message[];
  streaming: string;
}

export default function ChatMessages({ messages, streaming }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-800"
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}

      {streaming && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-white border border-gray-200 text-gray-800">
            {streaming}
            <span className="inline-block w-1.5 h-4 bg-gray-400 ml-0.5 animate-pulse" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
