import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DESIGN } from '../../lib/designTokens';

export function StudyPlannerView({ tasks, isPlannerLoading, setIsPlannerLoading, setPlannerData, showToast }) {
  const [hoursAvailable, setHoursAvailable] = useState(4);
  const [plan, setPlan] = useState([]);
  const lastTaskSignatureRef = useRef('');

  const pendingTasks = useMemo(() =>
    Array.isArray(tasks)
      ? tasks.filter((task) => task.status !== 'Completed')
      : [],
    [tasks]
  );

  const taskSignature = useMemo(
    () => pendingTasks.map(task => `${task.id || task._id || 'task'}-${task.status}-${task.priority || 0}-${task.deadline || ''}-${task.subject || ''}`).join('|'),
    [pendingTasks]
  );

  const fetchPlanner = useCallback(async () => {
    if (pendingTasks.length === 0) {
      setPlan([]);
      setPlannerData([]);
      return;
    }

    try {
      setIsPlannerLoading(true);
      const response = await api.generatePlan(hoursAvailable);
      const planResult = response.plan || [];
      setPlan(planResult);
      setPlannerData(planResult);
      lastTaskSignatureRef.current = taskSignature;
      setIsPlannerLoading(false);
    } catch (err) {
      console.error('Planner generate error:', err);
      setIsPlannerLoading(false);
      const message = err.error || 'Failed to generate planner';
      setPlannerData([]);
      setPlan([]);
      if (showToast) showToast(message, 'error');
    }
  }, [hoursAvailable, pendingTasks.length, setIsPlannerLoading, setPlannerData, showToast, taskSignature]);

  useEffect(() => {
    if (!pendingTasks.length) {
      setPlan([]);
      setPlannerData([]);
      lastTaskSignatureRef.current = '';
      return;
    }

    if (lastTaskSignatureRef.current === taskSignature) {
      return;
    }

    lastTaskSignatureRef.current = taskSignature;
    fetchPlanner();
  }, [fetchPlanner, pendingTasks.length, setPlannerData, taskSignature]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className={`lg:col-span-4 h-fit border ${DESIGN.colors.border} ${DESIGN.radius.base} p-6 ${DESIGN.colors.card}`}>
        <h3 className="text-sm font-semibold text-[#F1F5F0] tracking-tight flex items-center gap-2 mb-2">
          Availability Configuration
        </h3>
        <p className={`${DESIGN.typography.body} mb-6`}>
          Set your available study hours. Tasks are allocated by priority algorithm.
        </p>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className={`text-sm font-medium ${DESIGN.colors.textPrimary}`}>Study Hours</label>
            <span className={`text-sm font-semibold ${DESIGN.colors.textPrimary} px-2 py-0.5 border ${DESIGN.colors.border} bg-[#0F1D16] ${DESIGN.radius.base}`}>{hoursAvailable}h</span>
          </div>
          <input 
            type="range" min="1" max="12" step="0.5" value={hoursAvailable}
            onChange={(e) => setHoursAvailable(Number(e.target.value))}
            className="w-full accent-[#D2A24C]"
          />
        </div>
        <Button onClick={fetchPlanner} className="w-full">
          Generate Schedule
        </Button>
      </div>

      <div className="lg:col-span-8 min-h-[360px]">
        <div className={`flex items-center justify-between pb-3 border-b ${DESIGN.colors.border} mb-4`}>
          <h2 className="text-base font-semibold text-[#F1F5F0] tracking-tight">Suggested Schedule</h2>
          <span className={DESIGN.typography.meta}>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>

        <div className={`min-h-[280px] border ${DESIGN.colors.border} ${DESIGN.radius.base} ${DESIGN.colors.card} overflow-hidden divide-y divide-[#2E4A3A]`}>
          {isPlannerLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-7 h-7 rounded bg-[#1B2B21]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-[#1B2B21]" />
                    <div className="h-3 w-1/2 rounded bg-[#1B2B21]" />
                  </div>
                  <div className="h-6 w-16 rounded bg-[#1B2B21]" />
                </div>
              </div>
            ))
          ) : plan.length === 0 ? (
            <div className={`flex min-h-[280px] items-center justify-center p-8 text-center ${DESIGN.colors.textMuted}`}>
              {pendingTasks.length === 0 ? "Inbox zero! No pending tasks." : "Configure hours and generate your plan."}
            </div>
          ) : (
            <>
              {plan.map((item, index) => (
                <div key={item.task.id} className="p-4 flex items-center gap-4 hover:bg-[#2E4A3A]/30 transition-colors">
                  <div className={`w-7 h-7 bg-[#0F1D16] ${DESIGN.colors.textMuted} ${DESIGN.radius.sm} flex items-center justify-center text-xs font-semibold shrink-0`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium ${DESIGN.colors.textPrimary} truncate`}>{item.task.subject}</h4>
                    <div className={`flex gap-3 text-xs ${DESIGN.colors.textMuted} mt-1`}>
                      <span>{item.task.type}</span>
                      <span className="text-[#2E4A3A]">•</span>
                      <span>Pri: {item.priority}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant="neutral">{item.allocatedHours} hrs</Badge>
                  </div>
                </div>
              ))}

              {plan.reduce((acc, curr) => acc + curr.allocatedHours, 0) < hoursAvailable && pendingTasks.length > 0 && (
                <div className={`p-4 text-xs ${DESIGN.colors.textMuted} bg-[#0F1D16]/50 text-center`}>
                  Time allocation complete. Remaining high priority tasks do not require immediate attention today.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
