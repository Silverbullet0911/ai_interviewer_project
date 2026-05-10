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
  const [ending, setEnding] = useState(false);
  const hasStarted = useRef(false);

  // 发送消息的核心函数
  const sendMessage = useCallback(async (content: string) => {
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

  // 初始加载
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
        const msgs = data.messages || [];
        setMessages(msgs);
        // 无消息时自动触发开场
        if (msgs.length === 0) {
          setSending(true);
          hasStarted.current = true;
          await sendMessage("开始面试");
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [sessionId, router]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = useCallback(async (content: string) => {
    await sendMessage(content);
  }, [sendMessage]);

  const handleSkipTopic = useCallback(() => {
    handleSend("问点别的吧，这个话题差不多了。");
  }, [handleSend]);

  const handleEndInterview = useCallback(async () => {
    if (!confirm("确定要结束面试吗？")) return;
    setEnding(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/end`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "结束面试失败");
      setEnded(true);
      router.push(`/sessions/${sessionId}`);
    } catch (e: any) {
      setError(e.message);
      setEnding(false);
    }
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <span className="flex gap-1">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
          <span className="text-gray-400 text-sm">加载面试中...</span>
          <span className="text-gray-300 text-xs">预计需要 2-3 分钟</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
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
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-sm font-semibold text-gray-700">模拟面试 #{sessionId}</h1>
        <InterviewControls
          onSkipTopic={handleSkipTopic}
          onEndInterview={handleEndInterview}
          disabled={sending || ended || ending}
        />
      </header>

      <ChatMessages messages={messages} streaming={streaming} waiting={sending} />

      <div className="shrink-0">
        {ending && (
          <div className="bg-yellow-50 border-y border-yellow-200 px-4 py-2 text-center text-sm text-yellow-700">
            <span className="flex gap-1 justify-center items-center">
              正在生成复盘报告，预计需要 2-3 分钟
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          </div>
        )}
        <ChatInput onSend={handleSend} disabled={sending || ended || ending} />
      </div>
    </div>
  );
}
