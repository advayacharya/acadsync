import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, BookOpen, Plug, LogOut, BrainCircuit, BarChart3 } from 'lucide-react';
import { DESIGN } from '../../lib/designTokens';

export function Sidebar({ user, onLogout }) {
  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard /> },
    { to: '/calendar', label: 'Calendar', icon: <Calendar /> },
    { to: '/planner', label: 'Study Planner', icon: <BookOpen /> },
    { to: '/analytics', label: 'Analytics', icon: <BarChart3 /> },
    { to: '/integrations', label: 'Integrations', icon: <Plug /> },
  ];

  return (
    <aside className={`w-64 ${DESIGN.colors.sidebar} border-r ${DESIGN.colors.border} hidden md:flex flex-col shrink-0 h-screen`}>
      <div className={`px-6 py-5 flex items-center gap-3 ${DESIGN.colors.textPrimary} font-semibold tracking-tight border-b ${DESIGN.colors.border}`}>
        <div className={`w-7 h-7 ${DESIGN.colors.primary} text-white ${DESIGN.radius.base} flex items-center justify-center`}>
          <BrainCircuit className="w-4 h-4" />
        </div>
        AcadSync
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-6 py-2 text-sm font-medium transition-colors border-l-[3px] ${
                isActive
                  ? `border-[#D2A24C] ${DESIGN.colors.textPrimary} bg-[#D2A24C]/10`
                  : `border-transparent ${DESIGN.colors.textSecondary} hover:${DESIGN.colors.textPrimary} hover:bg-[#1F3329]/50`
              }`
            }
          >
            {React.cloneElement(item.icon, { className: 'w-4 h-4' })}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={`p-4 border-t ${DESIGN.colors.border}`}>
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className={`w-8 h-8 ${DESIGN.radius.base} bg-[#1F3329] ${DESIGN.colors.textPrimary} flex items-center justify-center text-sm font-semibold border ${DESIGN.colors.border}`}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className={`text-sm font-medium ${DESIGN.colors.textPrimary} truncate`}>{user?.name}</span>
            <span className={DESIGN.typography.meta}>Student</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium ${DESIGN.colors.textSecondary} hover:${DESIGN.colors.textPrimary} transition-colors`}
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
