import React from 'react';
import { DESIGN } from '../../lib/designTokens';

export function BarChart({ data = [], title = '', height = 200, showLegend = true }) {
  if (!data || data.length === 0) {
    return <div className={`text-center py-8 ${DESIGN.colors.textMuted}`}>No data available</div>;
  }

  const maxValue = Math.max(...data.flatMap(d => [d.estimated || 0, d.actual || 0]));
  const padding = 40;
  const chartHeight = height - padding * 2;
  const barWidth = 30;
  const groupGap = 15;
  const groupWidth = barWidth * 2 + groupGap;
  const totalWidth = Math.max(400, padding * 2 + data.length * (groupWidth + 15));

  const getColor = (type) => {
    const colors = {
      estimated: '#D2A24C',
      actual: '#4A7C59'
    };
    return colors[type] || '#6B8577';
  };

  return (
    <div className="w-full">
      {title && <h3 className={`${DESIGN.typography.cardTitle} mb-4`}>{title}</h3>}
      <div className="overflow-x-auto">
        <svg width={totalWidth} height={height} className="mx-auto">
          {/* Y-axis */}
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#2E4A3A" strokeWidth={2} />
          {/* X-axis */}
          <line x1={padding} y1={height - padding} x2={totalWidth - padding} y2={height - padding} stroke="#2E4A3A" strokeWidth={2} />

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = height - padding - tick * chartHeight;
            const value = Math.round(tick * maxValue);
            return (
              <g key={`y-${tick}`}>
                <line x1={padding - 5} y1={y} x2={padding} y2={y} stroke="#2E4A3A" strokeWidth={1} />
                <text
                  x={padding - 10}
                  y={y}
                  textAnchor="end"
                  dy="0.3em"
                  fontSize="12"
                  fill="#6B8577"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Bars and labels */}
          {data.map((item, idx) => {
            const groupX = padding + 20 + idx * (groupWidth + 15);
            const estimatedHeight = (item.estimated || 0) / maxValue * chartHeight;
            const actualHeight = (item.actual || 0) / maxValue * chartHeight;

            return (
              <g key={`group-${idx}`}>
                {/* Estimated bar */}
                <rect
                  x={groupX}
                  y={height - padding - estimatedHeight}
                  width={barWidth}
                  height={estimatedHeight}
                  fill={getColor('estimated')}
                  opacity="0.8"
                />
                {/* Actual bar */}
                <rect
                  x={groupX + barWidth + groupGap}
                  y={height - padding - actualHeight}
                  width={barWidth}
                  height={actualHeight}
                  fill={getColor('actual')}
                  opacity="0.8"
                />
                {/* Label */}
                <text
                  x={groupX + barWidth + groupGap / 2}
                  y={height - padding + 15}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#9CB0A3"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {showLegend && (
        <div className="flex gap-4 justify-center mt-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4" style={{ backgroundColor: getColor('estimated') }} />
            <span className={`text-xs ${DESIGN.colors.textMuted}`}>Estimated</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4" style={{ backgroundColor: getColor('actual') }} />
            <span className={`text-xs ${DESIGN.colors.textMuted}`}>Actual</span>
          </div>
        </div>
      )}
    </div>
  );
}
