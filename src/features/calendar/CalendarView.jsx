import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { DESIGN } from '../../lib/designTokens';

function formatTime12h(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'pm' : 'am';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')}${period}`;
}

export function CalendarView({ tasks }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const days = Array(firstDayOfMonth).fill(null).concat(Array.from({length: daysInMonth}, (_, i) => i + 1));

  const getTasksForDay = (day) => {
    if (!day) return [];
    return tasks.filter(t => {
      const d = new Date(t.deadline);
      return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });
  };

  return (
    <div className={`flex flex-col border ${DESIGN.colors.border} ${DESIGN.radius.base} overflow-hidden ${DESIGN.colors.card}`}>
      <div className={`flex justify-between items-center p-5 border-b ${DESIGN.colors.border}`}>
        <h2 className="text-base font-semibold text-[#F1F5F0] tracking-tight">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-1">
          <Button variant="secondary" className="px-2 py-1 h-8" onClick={prevMonth}><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="secondary" className="px-2 py-1 h-8" onClick={nextMonth}><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>
      
      <div className={`grid grid-cols-7 border-b ${DESIGN.colors.border} bg-[#0F1D16]`}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className={`py-2.5 text-center text-xs font-medium ${DESIGN.colors.textMuted} uppercase tracking-wider border-r ${DESIGN.colors.border} last:border-r-0`}>{d}</div>
        ))}
      </div>
      
      <div className={`grid grid-cols-7 bg-[#2E4A3A] gap-px`}>
        {days.map((day, idx) => {
          const dayTasks = getTasksForDay(day);
          const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

          return (
            <div key={idx} className={`min-h-[120px] ${day ? 'bg-[#1F3329]' : 'bg-[#182A20]'} p-2 ${isToday ? 'bg-[#D2A24C]/10' : ''}`}>
              {day && (
                <>
                  <div className={`text-xs font-medium w-6 h-6 flex items-center justify-center ${DESIGN.radius.sm} mb-2 ${isToday ? 'bg-[#D2A24C] text-white' : DESIGN.colors.textSecondary}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.map(t => {
                      const timeStr = t.startTime ? `${formatTime12h(t.startTime)} ` : '';
                      return (
                        <div key={t.id} className={`text-[11px] px-1.5 py-1 ${DESIGN.radius.sm} truncate border bg-[#0F1D16] ${DESIGN.colors.border} ${DESIGN.colors.textSecondary} font-medium`}>
                          <span className="text-[#D2A24C] font-semibold">{timeStr}</span>
                          {t.subject}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
