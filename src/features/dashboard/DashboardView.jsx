import React, { useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { MetricCard } from '../../components/ui/MetricCard';
import { AchievementBadge } from '../../components/ui/AchievementBadge';
import { TaskCard } from './TaskCard';
import { DESIGN } from '../../lib/designTokens';
import { calculateAchievements } from '../../lib/dashboardMetrics';

const calculateDaysRemaining = (deadlineDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(deadlineDate);
  target.setHours(0, 0, 0, 0);
  const diffTime = target - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export function DashboardView({ tasks, onToggle, onDelete, onEdit, isLoading }) {
  const visibleTasks = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return (tasks || []).filter((task) => {
      const date = new Date(task.deadline);
      if (Number.isNaN(date.getTime())) return false;
      return date.getFullYear() === currentYear;
    });
  }, [tasks]);

  const pendingTasks = useMemo(() => visibleTasks.filter(t => t.status !== 'Completed'), [visibleTasks]);
  const highPriorityCount = useMemo(() => pendingTasks.filter(t => {
    const p = t.priority || 0;
    const d = calculateDaysRemaining(t.deadline);
    return p > 50 || d <= 2;
  }).length, [pendingTasks]);
  const dueThisWeekCount = useMemo(() => pendingTasks.filter(t => {
    const d = calculateDaysRemaining(t.deadline);
    return d >= 0 && d <= 7;
  }).length, [pendingTasks]);

  const sortedTasks = useMemo(() => {
    return [...visibleTasks].sort((a, b) => {
      if (a.status !== b.status) return a.status === 'Completed' ? 1 : -1;
      const priorityA = a.priority || 0;
      const priorityB = b.priority || 0;
      if (priorityA !== priorityB) return priorityB - priorityA;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  }, [visibleTasks]);

  const loadingCards = Array.from({ length: 3 });
  const achievements = useMemo(() => calculateAchievements(visibleTasks), [visibleTasks]);

  return (
    <div className="space-y-8">
      <div className={`grid min-h-[160px] grid-cols-1 md:grid-cols-3 border ${DESIGN.colors.border} ${DESIGN.radius.base} ${DESIGN.colors.card}`}>
        {isLoading ? (
          loadingCards.map((_, index) => (
            <div key={index} className={`h-28 animate-pulse bg-[#1B2B21] ${index < 2 ? 'border-b md:border-b-0 md:border-r' : ''} ${DESIGN.colors.border}`} />
          ))
        ) : (
          <>
            <MetricCard label="Active Tasks" value={pendingTasks.length} className={`border-b md:border-b-0 md:border-r ${DESIGN.colors.border}`} />
            <MetricCard label="High Priority" value={highPriorityCount} trend={highPriorityCount > 0 ? 'up' : null} trendLabel={highPriorityCount > 0 ? 'Requires attention' : 'All clear'} className={`border-b md:border-b-0 md:border-r ${DESIGN.colors.border}`} />
            <MetricCard label="Due This Week" value={dueThisWeekCount} />
          </>
        )}
      </div>

      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AchievementBadge type="completion" label="Tasks Completed" value={achievements.completedTasks} maxValue={Math.max(achievements.completedTasks + 1, 5)} />
          <AchievementBadge type="time" label="Hours Logged" value={Math.round(achievements.totalHoursLogged)} />
          <AchievementBadge type="streak" label="Completion Streak" value={achievements.streak} />
        </div>
      )}

      <div className="min-h-[360px]">
        <h2 className={`${DESIGN.typography.sectionHeader} mb-4`}>Tasks</h2>
        {isLoading ? (
          <div className="grid min-h-[280px] grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {loadingCards.map((_, index) => (
              <Card key={index} className="h-44 animate-pulse bg-[#1B2B21] border border-[#2E4A3A]" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className={`min-h-[240px] text-center py-16 border border-dashed ${DESIGN.colors.border} ${DESIGN.radius.base} ${DESIGN.colors.surface}`}>
            <BookOpen className={`w-8 h-8 ${DESIGN.colors.textMuted} mx-auto mb-3`} />
            <h3 className={DESIGN.typography.cardTitle}>No tasks found</h3>
            <p className={`mt-1 ${DESIGN.typography.body}`}>Get started by creating a new task.</p>
          </div>
        ) : (
          <div className="grid min-h-[280px] grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sortedTasks.map(task => (
              <TaskCard key={task.id} task={task} onToggle={() => onToggle(task.id)} onDelete={() => onDelete(task.id)} onEdit={() => onEdit(task)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
