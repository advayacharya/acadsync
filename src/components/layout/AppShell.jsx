import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { DESIGN } from '../../lib/designTokens';
import { WifiOff, RefreshCw, CloudSync, Check } from 'lucide-react';

export function AppShell({
  user,
  onLogout,
  isOffline,
  isSyncing,
  pendingQueueCount,
  onSyncClick,
  children
}) {
  return (
    <div className={`flex h-screen ${DESIGN.colors.appBg} font-sans overflow-hidden`}>
      <Sidebar user={user} onLogout={onLogout} />
      <main className={`flex-1 flex flex-col h-screen overflow-hidden ${DESIGN.colors.surface}`}>
        <MobileNav onLogout={onLogout} />

        {/* Offline / Sync Banner */}
        {isOffline ? (
          <div className="bg-amber-950/40 border-b border-amber-500/20 text-amber-300 px-6 py-2.5 flex items-center justify-between text-xs font-medium backdrop-blur-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Offline Mode — Changes are saved locally and will sync when reconnected.</span>
            </div>
            {pendingQueueCount > 0 && (
              <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 text-[11px] font-semibold">
                {pendingQueueCount} pending {pendingQueueCount === 1 ? 'change' : 'changes'}
              </span>
            )}
          </div>
        ) : isSyncing ? (
          <div className="bg-emerald-950/40 border-b border-emerald-500/20 text-emerald-300 px-6 py-2.5 flex items-center gap-2 text-xs font-medium backdrop-blur-sm animate-fadeIn">
            <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
            <span>Syncing pending changes with server…</span>
          </div>
        ) : pendingQueueCount > 0 ? (
          <div className="bg-blue-950/40 border-b border-blue-500/20 text-blue-300 px-6 py-2.5 flex items-center justify-between text-xs font-medium backdrop-blur-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{pendingQueueCount} pending {pendingQueueCount === 1 ? 'change' : 'changes'} ready to sync.</span>
            </div>
            <button
              onClick={onSyncClick}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 px-2.5 py-1 rounded border border-blue-500/30 text-[11px] font-semibold transition-colors flex items-center gap-1.5"
            >
              Sync Now
            </button>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 lg:p-12 scrollbar-gutter-stable">
          <div className="max-w-6xl mx-auto min-h-full flex flex-col justify-between">
            <div>
              {children}
            </div>
            <footer className="mt-16 pt-6 border-t border-[#2E4A3A]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B8577]">
              <span>© {new Date().getFullYear()} AcadSync</span>
              <div className="flex items-center gap-4">
                <Link to="/terms" className="hover:text-[#D2A24C] transition-colors">
                  Terms and Conditions
                </Link>
                <span className="text-[#2E4A3A]">·</span>
                <Link to="/privacy" className="hover:text-[#D2A24C] transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
