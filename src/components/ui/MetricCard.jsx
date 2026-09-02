import React from 'react';
import { DESIGN } from '../../lib/designTokens';

export function MetricCard({ label, value, trend, trendLabel, className = '' }) {
  return (
    <div className={`p-6 flex flex-col justify-between ${className}`}>
      <h3 className={DESIGN.typography.meta}>{label}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`text-3xl font-semibold ${DESIGN.colors.textPrimary} tracking-tight`}>{value}</span>
      </div>
      {(trend || trendLabel) && (
        <p className={`mt-2 ${DESIGN.typography.meta}`}>
          {trend && <span className={trend === 'up' ? 'text-[#C2664A] font-medium' : 'text-[#4A7C59] font-medium'}>
            {trend === 'up' ? '↑' : '↓'} 
          </span>}
          {' '}{trendLabel}
        </p>
      )}
    </div>
  );
}
