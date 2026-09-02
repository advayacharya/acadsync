import React from 'react';
import { DESIGN } from '../../lib/designTokens';

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = `inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors ${DESIGN.radius.base} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D2A24C] focus:ring-offset-[#182A20] disabled:opacity-50 disabled:cursor-not-allowed`;
  const variants = {
    primary: `${DESIGN.colors.primary} text-white hover:${DESIGN.colors.primaryHover} border border-transparent`,
    secondary: `bg-[#1F3329] ${DESIGN.colors.textPrimary} hover:bg-[#2E4A3A] border ${DESIGN.colors.border}`,
    ghost: `bg-transparent ${DESIGN.colors.textSecondary} hover:${DESIGN.colors.textPrimary} hover:bg-[#1F3329] border border-transparent`,
    danger: `bg-[#1F3329] text-[#C2664A] hover:bg-[#C2664A]/10 border ${DESIGN.colors.border}`
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
}
