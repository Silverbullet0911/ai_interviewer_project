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
      <p className="text-center text-text-muted py-12">暂无面试记录</p>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <Link
          key={session.id}
          href={session.status === "completed" ? `/sessions/${session.id}` : `/interview/${session.id}`}
          className="block border border-border bg-surface rounded-xl p-4 hover:border-accent hover:shadow-sm transition-all duration-150"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">面试 #{session.id}</p>
              <p className="text-xs text-text-muted mt-1">
                {new Date(session.created_at).toLocaleString("zh-CN")}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                上传：{session.materials_uploaded.map((m) => MATERIAL_LABELS[m] || m).join("、")}
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              session.status === "completed" ? "bg-success-light text-success" :
              session.status === "active" ? "bg-accent-light text-accent" :
              "bg-muted text-text-secondary"
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
