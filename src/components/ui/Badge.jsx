import React from 'react';
import { DESIGN } from '../../lib/designTokens';

export function Badge({ children, variant = 'neutral', className = '' }) {
  const base = `inline-flex items-center px-2 py-0.5 ${DESIGN.radius.sm} text-xs font-medium border`;
  const variants = {
    neutral: `bg-[#0F1D16] ${DESIGN.colors.textSecondary} ${DESIGN.colors.border}`,
    primary: 'bg-[#D2A24C]/10 text-[#D2A24C] border-[#D2A24C]/20',
    success: 'bg-[#4A7C59]/10 text-[#4A7C59] border-[#4A7C59]/20',
    warning: 'bg-[#D2A24C]/10 text-[#D2A24C] border-[#D2A24C]/20',
    danger: 'bg-[#C2664A]/10 text-[#C2664A] border-[#C2664A]/20',
  };
  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
}
