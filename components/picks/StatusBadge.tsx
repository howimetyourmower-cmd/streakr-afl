'use client';

import { QuestionStatus } from "@/lib/fixtures";

interface StatusBadgeProps {
  status: QuestionStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const baseClasses = "px-2 py-1 text-xs font-bold rounded-full";
  const statusClasses: Record<QuestionStatus, string> = {
    start: "bg-blue-500 text-white",
    open: "bg-green-500 text-white",
    pending: "bg-yellow-500 text-black",
    final: "bg-gray-500 text-white",
    void: "bg-gray-700 text-white",
    regrade: "bg-purple-500 text-white",
  };

  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}
