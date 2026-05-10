"use client";

import { useEffect, useRef, useCallback } from "react";
import type { Message } from "@/types";

interface Props {
  messages: Message[];
  streaming: string;
  waiting: boolean;
}

export default function ChatMessages({ messages, streaming, waiting }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isNearBottom = useRef(true);

  const checkNearBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    isNearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }, []);

  useEffect(() => {
    if (isNearBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streaming]);

  return (
    <div
      ref={containerRef}
      onScroll={checkNearBottom}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
    >
      {messages.length === 0 && waiting && (
        <div className="flex justify-center pt-20">
          <span className="text-gray-400 text-sm">正在生成面试开场...</span>
        </div>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
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
          <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-white border border-gray-200 text-gray-800 whitespace-pre-wrap">
            {streaming}
            <span className="inline-block w-1.5 h-4 bg-gray-400 ml-0.5 animate-pulse align-middle" />
          </div>
        </div>
      )}

      {waiting && !streaming && messages.length > 0 && (
        <div className="flex justify-start">
          <div className="rounded-2xl px-4 py-3 bg-white border border-gray-200">
            <span className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
