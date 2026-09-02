import React, { useState } from 'react';
import { DESIGN } from '../../lib/designTokens';

export function PieChart({ data = [], title = '', size = 200, showLegend = true }) {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  if (!data || data.length === 0) {
    return <div className={`text-center py-8 ${DESIGN.colors.textMuted}`}>No data available</div>;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 10;
  const colors = ['#D2A24C', '#4A7C59', '#C2664A', '#6B8577', '#9CB0A3'];

  let currentAngle = -Math.PI / 2;
  const slices = data.map((item, idx) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const x1 = size / 2 + radius * Math.cos(startAngle);
    const y1 = size / 2 + radius * Math.sin(startAngle);
    const x2 = size / 2 + radius * Math.cos(endAngle);
    const y2 = size / 2 + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    const pathData = [
      `M ${size / 2} ${size / 2}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    const color = colors[idx % colors.length];

    currentAngle = endAngle;

    return {
      pathData,
      color,
      label: item.label,
      value: item.value,
      percentage: ((item.value / total) * 100).toFixed(1)
    };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      {title && <h3 className={`${DESIGN.typography.cardTitle}`}>{title}</h3>}
      <svg width={size} height={size}>
        {slices.map((slice, idx) => (
          <path
            key={`slice-${idx}`}
            d={slice.pathData}
            fill={slice.color}
            opacity={hoveredSlice === idx ? 1 : 0.85}
            onMouseEnter={() => setHoveredSlice(idx)}
            onMouseLeave={() => setHoveredSlice(null)}
            style={{ cursor: 'pointer', transition: 'opacity 0.2s ease' }}
          />
        ))}
      </svg>

      {showLegend && (
        <div className="flex flex-wrap gap-3 justify-center">
          {slices.map((slice, idx) => (
            <div
              key={`legend-${idx}`}
              className="flex items-center gap-2 text-xs cursor-pointer"
              onMouseEnter={() => setHoveredSlice(idx)}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              <div className="w-3 h-3 rounded" style={{ backgroundColor: slice.color }} />
              <span className={DESIGN.colors.textMuted}>
                {slice.label}: {slice.value} ({slice.percentage}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
