"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DebriefReportView from "@/components/DebriefReport";
import ChatMessages from "@/components/ChatMessages";
import type { DebriefReport, Message } from "@/types";

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"debrief" | "chat">("debrief");

  useEffect(() => {
    fetch(`/api/sessions/${sessionId}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        setData(d);
      })
      .catch(() => router.push("/"))
      .finally(() => setLoading(false));
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-text-muted">加载中...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-text-secondary">
              面试 #{sessionId}
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                data.status === "completed" ? "bg-success-light text-success" : "bg-accent-light text-accent"
              }`}>
                {data.status === "completed" ? "已完成" : "进行中"}
              </span>
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              {new Date(data.created_at).toLocaleString("zh-CN")}
            </p>
          </div>
          <button onClick={() => router.push("/")} className="text-sm text-accent hover:underline">
            返回首页
          </button>
        </div>
      </header>

      {data.status === "completed" && data.debrief_report && (
        <div className="bg-surface border-b border-border">
          <div className="max-w-3xl mx-auto flex gap-4 px-4">
            <button
              onClick={() => setTab("debrief")}
              className={`py-3 text-sm font-medium border-b-2 transition-all duration-150 ${
                tab === "debrief"
                  ? "border-accent text-accent"
                  : "border-transparent text-text-muted hover:text-text-secondary"
              }`}
            >
              复盘报告
            </button>
            <button
              onClick={() => setTab("chat")}
              className={`py-3 text-sm font-medium border-b-2 transition-all duration-150 ${
                tab === "chat"
                  ? "border-accent text-accent"
                  : "border-transparent text-text-muted hover:text-text-secondary"
              }`}
            >
              对话记录
            </button>
          </div>
        </div>
      )}

      <div className="px-4">
        {tab === "debrief" && data.debrief_report ? (
          <DebriefReportView report={data.debrief_report as DebriefReport} />
        ) : (
          <div className="max-w-3xl mx-auto py-4">
            <ChatMessages messages={(data.messages || []) as Message[]} streaming="" waiting={false} />
          </div>
        )}
      </div>
    </div>
  );
}
