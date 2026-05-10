"use client";

import { useState } from "react";

interface Props {
  onUpload: (texts: Record<string, string>, files: Record<string, File>) => Promise<void>;
  uploading: boolean;
}

const FIELDS = [
  { key: "resume", label: "个人简历", required: true },
  { key: "notification", label: "面试内容", required: false },
  { key: "past_exams", label: "参考题目", required: false },
  { key: "statement", label: "个人陈述", required: false },
  { key: "transcript", label: "成绩单", required: false },
];

export default function FileUpload({ onUpload, uploading }: Props) {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});

  const handleTextChange = (key: string, value: string) => {
    setTexts((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (key: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasResume = texts.resume?.trim() || files.resume;
    if (!hasResume) return;

    const validTexts: Record<string, string> = {};
    for (const [key, val] of Object.entries(texts)) {
      if (val.trim()) validTexts[key] = val.trim();
    }

    const validFiles: Record<string, File> = {};
    for (const [key, file] of Object.entries(files)) {
      if (file) validFiles[key] = file;
    }

    await onUpload(validTexts, validFiles);
  };

  const canSubmit = !uploading && (!!texts.resume?.trim() || !!files.resume);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {FIELDS.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            value={texts[field.key] || ""}
            onChange={(e) => handleTextChange(field.key, e.target.value)}
            placeholder={`输入${field.label}内容...`}
            rows={3}
            className="block w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-accent/30 resize-y"
          />
          <p className="text-xs text-text-muted mt-1">
            或上传文件（支持 PDF、TXT）：
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => handleFileChange(field.key, e.target.files?.[0] || null)}
              className="ml-1 text-xs text-text-muted file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-accent-light file:text-accent hover:file:bg-accent-light/70"
            />
          </p>
        </div>
      ))}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.97]"
      >
        {uploading ? "正在生成面试计划...（约 2-3 分钟）" : "开始模拟面试"}
      </button>
    </form>
  );
}
