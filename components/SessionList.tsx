"use client";

import Link from "next/link";
import type { SessionListItem } from "@/types";

const MATERIAL_LABELS: Record<string, string> = {
  resume: "简历",
  notification: "通知",
  past_exams: "真题",
  statement: "个人陈述",
  transcript: "成绩单",
};

interface Props {
  sessions: SessionListItem[];
}

export default function SessionList({ sessions }: Props) {
  if (sessions.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">暂无面试记录</p>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <Link
          key={session.id}
          href={session.status === "completed" ? `/sessions/${session.id}` : `/interview/${session.id}`}
          className="block border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">面试 #{session.id}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(session.created_at).toLocaleString("zh-CN")}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                上传：{session.materials_uploaded.map((m) => MATERIAL_LABELS[m] || m).join("、")}
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              session.status === "completed" ? "bg-green-100 text-green-700" :
              session.status === "active" ? "bg-blue-100 text-blue-700" :
              "bg-gray-100 text-gray-600"
            }`}>
              {session.status === "completed" ? "已完成" :
               session.status === "active" ? "进行中" : "准备中"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
