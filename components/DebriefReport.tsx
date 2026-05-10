"use client";

import type { DebriefReport } from "@/types";

interface Props {
  report: DebriefReport;
}

function ScoreBadge({ score }: { score: number }) {
  const colors: Record<number, string> = {
    1: "bg-destructive-light text-destructive",
    2: "bg-orange-100 text-orange-700",
    3: "bg-warning-light text-yellow-700",
    4: "bg-accent-light text-accent",
    5: "bg-success-light text-success",
  };
  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${colors[score] || colors[3]}`}>
      {score}
    </span>
  );
}

export default function DebriefReportView({ report }: Props) {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      <section>
        <h2 className="text-xl font-bold mb-4 text-text-primary">攻击路线图</h2>
        <p className="text-sm text-text-muted mb-4">面试前 AI 识别的薄弱点及计划追问策略</p>
        <div className="space-y-3">
          {report.attack_roadmap.map((point) => (
            <div key={point.id} className="border border-border bg-surface rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  point.severity === "critical" ? "bg-destructive-light text-destructive" :
                  point.severity === "major" ? "bg-orange-100 text-orange-700" :
                  "bg-muted text-text-secondary"
                }`}>
                  {point.severity === "critical" ? "严重" : point.severity === "major" ? "中等" : "轻微"}
                </span>
                <span className="text-xs text-text-muted">来源：{point.source}</span>
              </div>
              <p className="text-sm font-medium text-text-primary">{point.weakness}</p>
              <p className="text-xs text-text-muted mt-1">{point.strategy}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 text-text-primary">逐点表现分析</h2>
        <div className="space-y-4">
          {report.point_scores.map((ps) => (
            <div key={ps.attack_point_id} className="border border-border bg-surface rounded-xl p-4 flex gap-4">
              <ScoreBadge score={ps.score} />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{ps.weakness}</p>
                <p className="text-sm text-text-secondary mt-1">{ps.user_performance}</p>
                <ul className="mt-2 space-y-1">
                  {ps.improvement.map((imp, i) => (
                    <li key={i} className="text-sm text-success flex gap-1">
                      <span>•</span> {imp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 text-text-primary">整体评价</h2>
        <p className="text-sm text-text-secondary leading-relaxed">{report.overall_assessment}</p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-text-muted mb-2">已覆盖话题</h3>
            <ul className="space-y-1">
              {report.topic_coverage.map((t, i) => (
                <li key={i} className="text-sm text-success">✓ {t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-muted mb-2">跳过的话题</h3>
            <ul className="space-y-1">
              {report.skipped_topics.map((t, i) => (
                <li key={i} className="text-sm text-text-muted">⊘ {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
