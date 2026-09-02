import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, BrainCircuit } from 'lucide-react';
import { DESIGN } from '../../lib/designTokens';

export function MobileNav({ onLogout }) {
  const tabs = [
    { to: '/dashboard', label: 'Overview' },
    { to: '/calendar', label: 'Calendar' },
    { to: '/planner', label: 'Study Planner' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/integrations', label: 'Integrations' },
  ];

  return (
    <>
      <header className={`md:hidden ${DESIGN.colors.sidebar} border-b ${DESIGN.colors.border} p-4 flex justify-between items-center shrink-0`}>
        <div className={`flex items-center gap-2 ${DESIGN.colors.textPrimary} font-semibold tracking-tight`}>
          <BrainCircuit className="w-5 h-5 text-[#D2A24C]" /> AcadSync
        </div>
        <button onClick={onLogout} className={DESIGN.colors.textMuted}>
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <div className={`md:hidden flex ${DESIGN.colors.sidebar} border-b ${DESIGN.colors.border} overflow-x-auto shrink-0`}>
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex-1 py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                isActive ? 'text-[#D2A24C] border-[#D2A24C]' : `${DESIGN.colors.textMuted} border-transparent`
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </>
  );
}
