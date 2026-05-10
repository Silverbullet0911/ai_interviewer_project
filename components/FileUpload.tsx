"use client";

import { useState } from "react";

interface Props {
  onUpload: (files: Record<string, File>) => Promise<void>;
  uploading: boolean;
}

const FILE_FIELDS = [
  { key: "resume", label: "个人简历", required: true, accept: ".pdf,.txt" },
  { key: "notification", label: "面试通知", required: false, accept: ".pdf,.txt" },
  { key: "past_exams", label: "往年真题", required: false, accept: ".pdf,.txt" },
  { key: "statement", label: "个人陈述", required: false, accept: ".pdf,.txt" },
  { key: "transcript", label: "成绩单", required: false, accept: ".pdf,.txt" },
];

export default function FileUpload({ onUpload, uploading }: Props) {
  const [files, setFiles] = useState<Record<string, File | null>>({});

  const handleFileChange = (key: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid: Record<string, File> = {};
    for (const [key, file] of Object.entries(files)) {
      if (file) valid[key] = file;
    }
    if (!valid.resume) return;
    await onUpload(valid);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {FILE_FIELDS.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="file"
            accept={field.accept}
            onChange={(e) => handleFileChange(field.key, e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={uploading || !files.resume}
        className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {uploading ? "解析材料并生成面试..." : "开始模拟面试"}
      </button>
    </form>
  );
}
