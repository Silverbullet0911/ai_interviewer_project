"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import InterviewControls from "@/components/InterviewControls";
import type { Message } from "@/types";

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState("");
  const [sending, setSending] = useState(false);
  const [ended, setEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/sessions/${sessionId}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error);
        if (data.status === "completed") {
          router.replace(`/sessions/${sessionId}`);
          return;
        }
        if (data.status === "preparing") {
          setError("面试正在准备中，请稍候...");
          return;
        }
        setMessages(data.messages || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [sessionId, router]);

  const handleSend = useCallback(async (content: string) => {
    const userMsg: Message = {
      id: Date.now(),
      session_id: parseInt(sessionId),
      role: "user",
      content,
      topic: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);
    setStreaming("");

    try {
      const res = await fetch(`/api/sessions/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "发送失败");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.delta) {
              fullContent += data.delta;
              setStreaming(fullContent);
            }
            if (data.done) {
              const aiMsg: Message = {
                id: Date.now() + 1,
                session_id: parseInt(sessionId),
                role: "assistant",
                content: fullContent,
                topic: null,
                created_at: new Date().toISOString(),
              };
              setMessages((prev) => [...prev, aiMsg]);
              setStreaming("");
            }
            if (data.error) {
              setError(data.error);
            }
          } catch {}
        }
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }, [sessionId]);

  const handleSkipTopic = useCallback(() => {
    handleSend("问点别的吧，这个话题差不多了。");
  }, [handleSend]);

  const handleEndInterview = useCallback(async () => {
    if (!confirm("确定要结束面试吗？")) return;
    setSending(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/end`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "结束面试失败");
      setEnded(true);
      router.push(`/sessions/${sessionId}`);
    } catch (e: any) {
      setError(e.message);
      setSending(false);
    }
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => router.push("/")} className="text-blue-600 hover:underline text-sm">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-sm font-semibold text-gray-700">模拟面试 #{sessionId}</h1>
        <InterviewControls
          onSkipTopic={handleSkipTopic}
          onEndInterview={handleEndInterview}
          disabled={sending || ended}
        />
      </header>

      <ChatMessages messages={messages} streaming={streaming} />

      <ChatInput onSend={handleSend} disabled={sending || ended} />
    </div>
  );
}
