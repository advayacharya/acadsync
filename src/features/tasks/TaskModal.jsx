import React, { useState } from 'react';
import { X, Calendar, AlertTriangle, Moon, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SyncStatus } from '../../components/ui/SyncStatus';
import { ToggleSwitch } from '../../components/ui/ToggleSwitch';
import { CustomTimePicker } from '../../components/ui/CustomTimePicker';
import { DESIGN } from '../../lib/designTokens';

const TASK_TYPES = {
  'Exam': { urgency: 3 },
  'Assignment': { urgency: 2 },
  'Lab': { urgency: 1.5 },
  'Quiz': { urgency: 1 },
};

function addHoursToTime(timeStr, hours) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const totalMinutes = h * 60 + m + Math.round(hours * 60);
  const newH = Math.floor((totalMinutes / 60) % 24);
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

function formatTime12h(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function checkTimeRange(startTime, endTime) {
  if (!startTime || !endTime) return { isValid: true, isOvernight: false, error: '' };
  if (startTime === endTime) {
    return { isValid: false, isOvernight: false, error: 'Start time and end time cannot be identical.' };
  }
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const sMin = sh * 60 + sm;
  const eMin = eh * 60 + em;

  if (eMin < sMin) {
    const diffMinutes = (eMin + 1440) - sMin;
    if (diffMinutes <= 720) {
      return { isValid: true, isOvernight: true, error: '' };
    } else {
      const startFormatted = formatTime12h(startTime);
      const endFormatted = formatTime12h(endTime);
      return {
        isValid: false,
        isOvernight: false,
        error: `Invalid timing: End time (${endFormatted}) cannot be earlier than start time (${startFormatted}) on the same day.`
      };
    }
  }

  return { isValid: true, isOvernight: false, error: '' };
}

export function TaskModal({ task, onClose, onSave }) {
  const initialIsAllDay = task
    ? (task.isAllDay !== undefined ? Boolean(task.isAllDay) : (!task.startTime && !task.endTime))
    : true;

  const [formData, setFormData] = useState(task || {
    subject: '',
    type: 'Assignment',
    deadline: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    isAllDay: true,
    weightage: 10,
    difficulty: 3,
    studyHours: 2,
    notes: ''
  });

  const [isAllDay, setIsAllDay] = useState(initialIsAllDay);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [isSaving, setIsSaving] = useState(false);

  const timeValidation = checkTimeRange(formData.startTime, formData.endTime);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: ['weightage', 'difficulty', 'studyHours'].includes(name) ? Number(value) : value
      };
      return next;
    });
  };

  const handleStartTimeChange = (newStart) => {
    setFormData((prev) => {
      const next = { ...prev, startTime: newStart };
      if (!prev.endTime) {
        next.endTime = addHoursToTime(newStart, prev.studyHours || 1);
      }
      return next;
    });
  };

  const handleEndTimeChange = (newEnd) => {
    setFormData((prev) => ({ ...prev, endTime: newEnd }));
  };

  const handleToggleAllDay = (e) => {
    const checked = e.target.checked;
    setIsAllDay(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        startTime: '',
        endTime: '',
        isAllDay: true
      }));
    } else {
      const defaultStart = formData.startTime || '09:00';
      const defaultEnd = formData.endTime || addHoursToTime(defaultStart, formData.studyHours || 2);
      setFormData((prev) => ({
        ...prev,
        startTime: defaultStart,
        endTime: defaultEnd,
        isAllDay: false
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAllDay && !timeValidation.isValid) {
      return;
    }

    setIsSaving(true);
    setSyncStatus('syncing');

    const payload = {
      ...formData,
      isAllDay,
      startTime: isAllDay ? '' : formData.startTime,
      endTime: isAllDay ? '' : formData.endTime
    };

    try {
      const syncResult = await onSave(payload);

      if (syncResult && syncResult.success === false) {
        setSyncStatus('error');
        setTimeout(() => setSyncStatus('idle'), 3000);
      } else {
        setSyncStatus('success');
        setTimeout(() => {
          setSyncStatus('idle');
          onClose();
        }, 1500);
      }
    } catch (error) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#14231C]/80 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-lg ${DESIGN.colors.card} ${DESIGN.radius.base} overflow-hidden border ${DESIGN.colors.border} shadow-2xl`}>
        <div className={`px-6 py-4 border-b ${DESIGN.colors.border} flex justify-between items-center bg-[#0F1D16]`}>
          <h2 className={`text-sm font-semibold ${DESIGN.colors.textPrimary} tracking-tight uppercase flex items-center gap-2`}>
            <Calendar className="w-4 h-4 text-[#D2A24C]" />
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className={`${DESIGN.colors.textMuted} hover:${DESIGN.colors.textPrimary} transition-colors`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={`block text-sm font-medium ${DESIGN.colors.textPrimary} mb-1.5`}>Subject</label>
            <input
              type="text"
              required
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. Database Systems Project"
              className={`w-full px-3 py-2 border ${DESIGN.colors.border} bg-[#182A20] ${DESIGN.colors.textPrimary} ${DESIGN.radius.base} focus:outline-none focus:ring-1 focus:ring-[#D2A24C] focus:border-[#D2A24C] text-sm transition-colors`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${DESIGN.colors.textPrimary} mb-1.5`}>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${DESIGN.colors.border} bg-[#182A20] ${DESIGN.colors.textPrimary} ${DESIGN.radius.base} focus:outline-none focus:ring-1 focus:ring-[#D2A24C] focus:border-[#D2A24C] text-sm transition-colors`}
              >
                {Object.keys(TASK_TYPES).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium ${DESIGN.colors.textPrimary} mb-1.5`}>Deadline Date</label>
              <input
                type="date"
                required
                name="deadline"
                value={formData.deadline ? new Date(formData.deadline).toISOString().split('T')[0] : ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${DESIGN.colors.border} bg-[#182A20] ${DESIGN.colors.textPrimary} ${DESIGN.radius.base} focus:outline-none focus:ring-1 focus:ring-[#D2A24C] focus:border-[#D2A24C] text-sm transition-colors`}
              />
            </div>
          </div>

          {/* Event Schedule Box */}
          <div className={`p-4 border ${DESIGN.colors.border} bg-[#14231C] ${DESIGN.radius.base} space-y-3.5`}>
            <div className="flex items-center justify-between pb-2 border-b border-[#2E4A3A]/40">
              <span className="text-xs font-semibold text-[#D2A24C] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Event Schedule
              </span>
              <ToggleSwitch
                checked={isAllDay}
                onChange={handleToggleAllDay}
                label="All-day event"
              />
            </div>

            {!isAllDay && (
              <div className="space-y-3 pt-1 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <CustomTimePicker
                    label="Start Time"
                    value={formData.startTime}
                    onChange={handleStartTimeChange}
                  />
                  <CustomTimePicker
                    label="End Time"
                    value={formData.endTime}
                    onChange={handleEndTimeChange}
                  />
                </div>

                {/* Validation Error Banner */}
                {!timeValidation.isValid && (
                  <div className="flex items-center gap-2 p-2.5 rounded bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-medium animate-fadeIn">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{timeValidation.error}</span>
                  </div>
                )}

                {/* Overnight Badge Banner */}
                {timeValidation.isValid && timeValidation.isOvernight && (
                  <div className="flex items-center gap-2 p-2 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-medium animate-fadeIn">
                    <Moon className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Overnight Event — Ends next day ({formatTime12h(formData.endTime)})</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${DESIGN.colors.textPrimary} mb-1.5`}>Weightage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                required
                name="weightage"
                value={formData.weightage}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${DESIGN.colors.border} bg-[#182A20] ${DESIGN.colors.textPrimary} ${DESIGN.radius.base} focus:outline-none focus:ring-1 focus:ring-[#D2A24C] focus:border-[#D2A24C] text-sm transition-colors`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${DESIGN.colors.textPrimary} mb-1.5`}>Est. Hours</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                required
                name="studyHours"
                value={formData.studyHours}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${DESIGN.colors.border} bg-[#182A20] ${DESIGN.colors.textPrimary} ${DESIGN.radius.base} focus:outline-none focus:ring-1 focus:ring-[#D2A24C] focus:border-[#D2A24C] text-sm transition-colors`}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`block text-sm font-medium ${DESIGN.colors.textPrimary}`}>Difficulty Level</label>
              <span className={`text-xs font-semibold ${DESIGN.colors.textPrimary} bg-[#0F1D16] border ${DESIGN.colors.border} px-2 py-0.5 rounded-sm`}>
                {formData.difficulty}/5
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full accent-[#D2A24C]"
            />
            <div className={`flex justify-between text-xs ${DESIGN.colors.textMuted} mt-1`}>
              <span>Low</span><span>High</span>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${DESIGN.colors.textPrimary} mb-1.5`}>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes or details for this task..."
              rows="3"
              disabled={isSaving}
              className={`w-full px-3 py-2 border ${DESIGN.colors.border} bg-[#182A20] ${DESIGN.colors.textPrimary} ${DESIGN.radius.base} focus:outline-none focus:ring-1 focus:ring-[#D2A24C] focus:border-[#D2A24C] text-sm transition-colors resize-none ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>

          {syncStatus !== 'idle' && (
            <SyncStatus status={syncStatus} />
          )}

          <div className={`pt-5 flex gap-3 border-t ${DESIGN.colors.border} mt-2`}>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving} className="flex-1">Cancel</Button>
            <Button
              type="submit"
              disabled={isSaving || (!isAllDay && !timeValidation.isValid)}
              className="flex-1"
            >
              {isSaving ? 'Saving...' : 'Save Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
