import React from 'react';

export function ToggleSwitch({ checked, onChange, label, className = '' }) {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer select-none ${className}`}>
      <span className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-9 h-5 rounded-full transition-colors duration-200 ease-in-out border ${
            checked
              ? 'bg-[#D2A24C] border-[#D2A24C]'
              : 'bg-[#182A20] border-[#2E4A3A]'
          }`}
        >
          <div
            className={`w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out mt-[2px] ml-[2px] ${
              checked ? 'translate-x-4 bg-[#0F1D16]' : 'translate-x-0 bg-[#6B8577]'
            }`}
          />
        </div>
      </span>
      {label && (
        <span className="text-xs font-medium text-[#F1F5F0] hover:text-[#D2A24C] transition-colors">
          {label}
        </span>
      )}
    </label>
  );
}
