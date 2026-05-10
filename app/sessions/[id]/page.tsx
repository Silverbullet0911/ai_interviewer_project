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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-gray-700">
              面试 #{sessionId}
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                data.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
              }`}>
                {data.status === "completed" ? "已完成" : "进行中"}
              </span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(data.created_at).toLocaleString("zh-CN")}
            </p>
          </div>
          <button onClick={() => router.push("/")} className="text-sm text-blue-600 hover:underline">
            返回首页
          </button>
        </div>
      </header>

      {data.status === "completed" && data.debrief_report && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto flex gap-4 px-4">
            <button
              onClick={() => setTab("debrief")}
              className={`py-3 text-sm font-medium border-b-2 transition ${
                tab === "debrief"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              复盘报告
            </button>
            <button
              onClick={() => setTab("chat")}
              className={`py-3 text-sm font-medium border-b-2 transition ${
                tab === "chat"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
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
