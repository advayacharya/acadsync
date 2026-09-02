import React from 'react';
import { DESIGN } from '../../lib/designTokens';

export function Card({ children, className = '', leftBorderColor = '' }) {
  return (
    <div className={`
      ${DESIGN.colors.card} 
      border ${DESIGN.colors.border} 
      ${DESIGN.radius.base} 
      overflow-hidden
      ${leftBorderColor ? `border-l-[3px] ${leftBorderColor}` : ''} 
      ${className}
    `}>
      {children}
    </div>
  );
}
