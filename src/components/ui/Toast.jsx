import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';
import { DESIGN } from '../../lib/designTokens';

export function Toast({ message, type = 'error', onClose }) {
  const isSuccess = type === 'success';

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onClose, 5000);
    return () => clearTimeout(id);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 border ${DESIGN.radius.base} shadow-xl backdrop-blur-md animate-fade-in ${
        isSuccess
          ? 'bg-[#1F3329] border-[#4A7C59] text-[#F1F5F0]'
          : 'bg-[#1F3329] border-[#C2664A] text-[#F1F5F0]'
      }`}
      style={{ maxWidth: '360px' }}
    >
      <span className="flex-shrink-0">
        {isSuccess
          ? <CheckCircle className="w-5 h-5 text-[#4A7C59]" />
          : <AlertTriangle className="w-5 h-5 text-[#C2664A]" />
        }
      </span>
      <span className="text-sm font-medium leading-snug">{message}</span>
      <button
        onClick={onClose}
        className="p-1 text-[#6B8577] hover:text-[#F1F5F0] transition-colors flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
