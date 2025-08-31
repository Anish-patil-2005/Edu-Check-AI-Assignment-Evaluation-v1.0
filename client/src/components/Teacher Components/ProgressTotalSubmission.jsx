import React from "react";

export default function SubmissionProgress({ submitted, total }) {
  const percentage = Math.round((submitted / total) * 100);
  const size = 100; // circle size
  const stroke = 8; // circle thickness
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="w-40 h-40 border-2  border-blue-400 flex flex-col items-center justify-center rounded-lg relative">
      {/* Circular Progress */}
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="lightgray"
          strokeWidth={stroke}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3b82f6"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      {/* Center Text */}
      <span className="absolute text-lg font-semibold text-gray-800">
        {submitted}/{total}
      </span>

      {/* Label */}
      <h3 className="mt-2 text-sm font-medium text-blue-700 text-center">
        Submitted Students
      </h3>
    </div>
  );
}
