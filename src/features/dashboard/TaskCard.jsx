import React from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle, Circle, Edit, Trash2, Moon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DESIGN } from '../../lib/designTokens';

const calculateDaysRemaining = (deadlineDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(deadlineDate);
  target.setHours(0, 0, 0, 0);
  const diffTime = target - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getPriorityStyle = (daysRemaining, priorityScore) => {
  if (daysRemaining < 0) return 'border-[#C2664A]';
  if (daysRemaining <= 2 || priorityScore > 50) return 'border-[#C2664A]';
  if (daysRemaining <= 7 || priorityScore > 20) return 'border-[#D2A24C]';
  return 'border-[#4A7C59]';
};

function formatTime12h(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function checkOvernight(startTime, endTime) {
  if (!startTime || !endTime) return false;
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const sMin = sh * 60 + sm;
  const eMin = eh * 60 + em;
  if (eMin < sMin) {
    const diff = (eMin + 1440) - sMin;
    return diff <= 720;
  }
  return false;
}

export function TaskCard({ task, onToggle, onDelete, onEdit }) {
  const isCompleted = task.status === 'Completed';
  const daysRemaining = calculateDaysRemaining(task.deadline);
  const priorityScore = task.priority || 0;
  const borderColorClass = isCompleted ? '' : getPriorityStyle(daysRemaining, priorityScore);

  const isAllDay = task.isAllDay || (!task.startTime && !task.endTime);
  const isOvernight = checkOvernight(task.startTime, task.endTime);

  const timeDisplay = isAllDay
    ? 'All Day'
    : task.endTime
    ? `${formatTime12h(task.startTime)} - ${formatTime12h(task.endTime)}${isOvernight ? ' (+1d)' : ''}`
    : formatTime12h(task.startTime);

  return (
    <Card leftBorderColor={borderColorClass} className={`p-5 flex flex-col justify-between group hover:border-[#6B8577] transition-colors ${isCompleted ? 'bg-[#182A20] opacity-60' : ''}`}>
      <div>
        <div className="flex justify-between items-start mb-3">
          <Badge variant="neutral">{task.type}</Badge>
          {!isCompleted && (
            <span className={DESIGN.typography.meta}>Pri: {priorityScore}</span>
          )}
        </div>
        <h3 className={`${DESIGN.typography.cardTitle} mb-1 ${isCompleted ? 'text-[#6B8577] line-through' : ''}`}>
          {task.subject}
        </h3>
        
        <div className="space-y-1 mt-3">
          <div className={`flex items-center gap-2 ${DESIGN.typography.meta}`}>
            <CalendarIcon className="w-3.5 h-3.5" />
            <span className={!isCompleted && daysRemaining < 0 ? 'text-[#C2664A] font-medium' : ''}>
              {new Date(task.deadline).toLocaleDateString()} 
              {!isCompleted && ` (${daysRemaining < 0 ? 'Overdue' : daysRemaining === 0 ? 'Today' : `${daysRemaining}d left`})`}
            </span>
          </div>
          <div className={`flex items-center gap-2 ${DESIGN.typography.meta}`}>
            {isOvernight ? (
              <Moon className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-[#D2A24C]" />
            )}
            <span>
              <span className="font-semibold text-white/90 mr-1.5">{timeDisplay}</span>
              <span className="text-[#6B8577]">({task.studyHours}h est.)</span>
            </span>
          </div>
          {task.notes && (
            <div className={`mt-2 pt-2 border-t ${DESIGN.colors.border} text-xs ${DESIGN.colors.textMuted} line-clamp-2`}>
              {task.notes}
            </div>
          )}
        </div>
      </div>

      <div className={`mt-5 pt-4 border-t ${DESIGN.colors.border} flex justify-between items-center`}>
        <button onClick={onToggle} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isCompleted ? DESIGN.colors.textMuted : `${DESIGN.colors.textSecondary} hover:${DESIGN.colors.textPrimary}`}`}>
          {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
          {isCompleted ? 'Done' : 'Mark Done'}
        </button>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className={`p-1.5 ${DESIGN.colors.textMuted} hover:${DESIGN.colors.textPrimary} ${DESIGN.radius.base} transition-colors`}><Edit className="w-4 h-4" /></button>
          <button onClick={onDelete} className={`p-1.5 ${DESIGN.colors.textMuted} hover:text-[#C2664A] ${DESIGN.radius.base} transition-colors`}><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    </Card>
  );
}
