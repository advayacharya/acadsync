import React from 'react';
import { Clock } from 'lucide-react';
import { DESIGN } from '../../lib/designTokens';

/**
 * Converts 24-hour time string ("HH:MM") to 12-hour components
 */
function parse24to12(time24) {
  if (!time24 || !time24.includes(':')) {
    return { hour: '09', minute: '00', period: 'AM' };
  }
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  const hourStr = String(h12).padStart(2, '0');
  const minStr = String(Math.floor(m / 5) * 5).padStart(2, '0');
  return { hour: hourStr, minute: minStr, period };
}

/**
 * Converts 12-hour components to 24-hour time string ("HH:MM")
 */
function format12to24(hourStr, minStr, period) {
  let h = Number(hourStr);
  if (period === 'PM' && h < 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  const h24 = String(h).padStart(2, '0');
  const m24 = String(minStr).padStart(2, '0');
  return `${h24}:${m24}`;
}

export function CustomTimePicker({ label, value, onChange, disabled = false }) {
  const { hour, minute, period } = parse24to12(value);

  const hoursList = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutesList = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

  const handleHourChange = (e) => {
    const newH = e.target.value;
    const val24 = format12to24(newH, minute, period);
    onChange(val24);
  };

  const handleMinuteChange = (e) => {
    const newM = e.target.value;
    const val24 = format12to24(hour, newM, period);
    onChange(val24);
  };

  const handlePeriodToggle = (newPeriod) => {
    if (newPeriod === period) return;
    const val24 = format12to24(hour, minute, newPeriod);
    onChange(val24);
  };

  return (
    <div className="flex flex-col gap-1 w-full min-w-0">
      {label && (
        <span className={`text-[11px] font-medium ${DESIGN.colors.textSecondary}`}>
          {label}
        </span>
      )}
      <div className={`flex items-center justify-between px-2.5 py-1.5 border ${DESIGN.colors.border} bg-[#182A20] ${DESIGN.radius.base} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} w-full`}>
        {/* Time Selector Group */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#D2A24C] shrink-0" />

          {/* Hour Select */}
          <div className="relative">
            <select
              value={hour}
              onChange={handleHourChange}
              disabled={disabled}
              className="appearance-none bg-[#0F1D16] text-[#F1F5F0] border border-[#2E4A3A] hover:border-[#D2A24C]/60 rounded px-1.5 py-0.5 text-xs font-semibold text-center w-9 focus:outline-none focus:border-[#D2A24C] cursor-pointer"
            >
              {hoursList.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          <span className="text-[#D2A24C] font-bold text-xs">:</span>

          {/* Minute Select */}
          <div className="relative">
            <select
              value={minute}
              onChange={handleMinuteChange}
              disabled={disabled}
              className="appearance-none bg-[#0F1D16] text-[#F1F5F0] border border-[#2E4A3A] hover:border-[#D2A24C]/60 rounded px-1.5 py-0.5 text-xs font-semibold text-center w-9 focus:outline-none focus:border-[#D2A24C] cursor-pointer"
            >
              {minutesList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* AM/PM Segmented Control */}
        <div className="flex bg-[#0F1D16] border border-[#2E4A3A] rounded p-0.5 text-[10px] font-semibold shrink-0">
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePeriodToggle('AM')}
            className={`px-2 py-0.5 rounded transition-all ${
              period === 'AM'
                ? 'bg-[#D2A24C] text-[#0F1D16] font-bold shadow-sm'
                : 'text-[#6B8577] hover:text-white'
            }`}
          >
            AM
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePeriodToggle('PM')}
            className={`px-2 py-0.5 rounded transition-all ${
              period === 'PM'
                ? 'bg-[#D2A24C] text-[#0F1D16] font-bold shadow-sm'
                : 'text-[#6B8577] hover:text-white'
            }`}
          >
            PM
          </button>
        </div>
      </div>
    </div>
  );
}
