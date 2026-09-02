import React from 'react';
import { Card } from '../../components/ui/Card';
import { MetricCard } from '../../components/ui/MetricCard';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { BarChart } from '../../components/ui/BarChart';
import { PieChart } from '../../components/ui/PieChart';
import { DESIGN } from '../../lib/designTokens';
import { calculateCompletionRate, calculateHoursByType, calculateDifficultyDistribution } from '../../lib/dashboardMetrics';

export function AnalyticsView({ tasks }) {
  const visibleTasks = Array.isArray(tasks) ? tasks : [];
  const totalTasks = visibleTasks.length;
  const completedTasks = visibleTasks.filter((t) => t.status === 'Completed').length;
  const completionRate = calculateCompletionRate(visibleTasks);

  const totalEstimatedHours = visibleTasks.reduce((acc, t) => acc + (t.studyHours || 0), 0);
  const totalActualHours = visibleTasks.reduce((acc, t) => acc + (t.actualHours || t.studyHours || 0), 0);

  const typeCounts = visibleTasks.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + 1;
    return acc;
  }, {});

  const hoursData = calculateHoursByType(visibleTasks);
  const difficultyData = calculateDifficultyDistribution(visibleTasks);

  return (
    <div className="space-y-8">
      <div className={`grid grid-cols-1 md:grid-cols-3 border ${DESIGN.colors.border} ${DESIGN.radius.base} ${DESIGN.colors.card}`}>
        <MetricCard label="Completion Rate" value={`${completionRate}%`} trendLabel={`${completedTasks} of ${totalTasks} completed`} className={`border-b md:border-b-0 md:border-r ${DESIGN.colors.border}`} />
        <MetricCard label="Est. Total Hours" value={`${totalEstimatedHours}h`} trendLabel="Scheduled study workload" className={`border-b md:border-b-0 md:border-r ${DESIGN.colors.border}`} />
        <MetricCard label="Actual Hours Logged" value={`${totalActualHours}h`} trendLabel="Time spent across tasks" />
      </div>

      {/* Progress Ring and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col items-center justify-center min-h-[280px]">
          <ProgressRing percentage={completionRate} label="Completion Progress" size={140} />
        </Card>

        <Card className="p-6">
          <BarChart data={hoursData} title="Hours by Task Type" height={220} />
        </Card>
      </div>

      {/* Difficulty Distribution and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <PieChart data={difficultyData} title="Task Distribution by Difficulty" size={200} />
        </Card>

        <Card className="p-6">
          <h3 className={`${DESIGN.typography.cardTitle} mb-4`}>Academic Efficiency Insights</h3>
          <ul className={`space-y-3 ${DESIGN.typography.body}`}>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D2A24C]"></span>
              High urgency exams represent {typeCounts['Exam'] || 0} items in your task queue.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4A7C59]"></span>
              Overall completion pace is currently sitting at {completionRate}%.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C2664A]"></span>
              Estimated average task effort is {(totalTasks > 0 ? totalEstimatedHours / totalTasks : 0).toFixed(1)} hours per task.
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
