import React from 'react';
import { DESIGN } from '../../lib/designTokens';

export function ProgressRing({ percentage = 0, label = 'Progress', size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 80) return '#4A7C59';
    if (percentage >= 50) return '#D2A24C';
    return '#C2664A';
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2E4A3A"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="text-center">
        <div className={`text-2xl font-bold ${DESIGN.colors.textPrimary}`}>{Math.round(percentage)}%</div>
        <div className={`text-xs ${DESIGN.colors.textMuted} mt-0.5`}>{label}</div>
      </div>
    </div>
  );
}
