"use client";

interface Props {
  onSkipTopic: () => void;
  onEndInterview: () => void;
  disabled: boolean;
}

export default function InterviewControls({ onSkipTopic, onEndInterview, disabled }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onSkipTopic}
        disabled={disabled}
        className="text-sm px-4 py-2 rounded-lg border border-border text-text-secondary hover:bg-muted disabled:opacity-50 transition-all duration-150"
      >
        跳过当前话题 →
      </button>
      <button
        onClick={onEndInterview}
        disabled={disabled}
        className="text-sm px-4 py-2 rounded-lg bg-destructive-light text-destructive hover:bg-red-100 disabled:opacity-50 transition-all duration-150"
      >
        结束面试
      </button>
    </div>
  );
}
