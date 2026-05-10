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
        className="text-sm px-3 py-1.5 rounded-lg border border-yellow-500 text-yellow-600 hover:bg-yellow-50 disabled:opacity-50 transition"
      >
        跳过当前话题 →
      </button>
      <button
        onClick={onEndInterview}
        disabled={disabled}
        className="text-sm px-3 py-1.5 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
      >
        结束面试
      </button>
    </div>
  );
}
