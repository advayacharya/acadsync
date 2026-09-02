import React from 'react';
import { Trophy, Flame, Clock } from 'lucide-react';
import { DESIGN } from '../../lib/designTokens';

const ACHIEVEMENT_ICONS = {
  completion: Trophy,
  streak: Flame,
  time: Clock
};

export function AchievementBadge({ type = 'completion', label = '', value = 0, maxValue = null }) {
  const Icon = ACHIEVEMENT_ICONS[type] || Trophy;

  const getColor = () => {
    switch (type) {
      case 'streak':
        return '#C2664A';
      case 'time':
        return '#D2A24C';
      default:
        return '#4A7C59';
    }
  };

  const displayValue = maxValue ? `${value}/${maxValue}` : value;
  const progress = maxValue ? (value / maxValue) * 100 : null;

  return (
    <div
      className={`flex flex-col items-center justify-center px-4 py-3 border ${DESIGN.colors.border} ${DESIGN.radius.base} bg-[#0F1D16] hover:bg-[#1F3329] transition-colors cursor-default`}
      style={{
        borderLeftColor: getColor(),
        borderLeftWidth: '4px'
      }}
    >
      <Icon className="w-4 h-4 mb-1" style={{ color: getColor() }} />
      <div className={`text-sm font-semibold ${DESIGN.colors.textPrimary}`}>{displayValue}</div>
      <div className={`text-xs ${DESIGN.colors.textMuted} text-center`}>{label}</div>
      {progress !== null && (
        <div className="w-full bg-[#182A20] rounded-full h-1.5 mt-1.5">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: getColor()
            }}
          />
        </div>
      )}
    </div>
  );
}
