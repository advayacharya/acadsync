/**
 * Dashboard metrics calculation utilities
 * Computes completion rates, hours distribution, difficulty breakdown, and achievements
 */

export const calculateCompletionRate = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  return Math.round((completed / tasks.length) * 100);
};

export const calculateHoursByType = (tasks) => {
  if (!tasks || tasks.length === 0) {
    return [
      { label: 'Exam', estimated: 0, actual: 0 },
      { label: 'Assignment', estimated: 0, actual: 0 },
      { label: 'Lab', estimated: 0, actual: 0 },
      { label: 'Quiz', estimated: 0, actual: 0 }
    ];
  }

  const types = ['Exam', 'Assignment', 'Lab', 'Quiz'];
  return types.map(type => {
    const tasksOfType = tasks.filter(t => t.type === type);
    const estimated = tasksOfType.reduce((sum, t) => sum + (t.studyHours || 0), 0);
    const actual = tasksOfType.reduce((sum, t) => sum + (t.actualHours || t.studyHours || 0), 0);
    return {
      label: type,
      estimated: Math.round(estimated * 10) / 10,
      actual: Math.round(actual * 10) / 10
    };
  });
};

export const calculateDifficultyDistribution = (tasks) => {
  if (!tasks || tasks.length === 0) {
    return [
      { label: 'Level 1', value: 0 },
      { label: 'Level 2', value: 0 },
      { label: 'Level 3', value: 0 },
      { label: 'Level 4', value: 0 },
      { label: 'Level 5', value: 0 }
    ];
  }

  const distribution = Array(5).fill(0);
  tasks.forEach(task => {
    const level = task.difficulty || 1;
    if (level >= 1 && level <= 5) {
      distribution[level - 1]++;
    }
  });

  return [1, 2, 3, 4, 5].map((level, idx) => ({
    label: `Level ${level}`,
    value: distribution[idx]
  }));
};

export const calculateAchievements = (tasks) => {
  if (!tasks) {
    return {
      completedTasks: 0,
      totalHoursLogged: 0,
      streak: 0
    };
  }

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const totalHoursLogged = tasks.reduce((sum, t) => sum + (t.actualHours || t.studyHours || 0), 0);

  // Calculate streak (consecutive days with completed tasks)
  // For now, a simple proxy: count of consecutive completed tasks from most recent
  let streak = 0;
  const sortedTasks = [...tasks].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
  for (const task of sortedTasks) {
    if (task.status === 'Completed') {
      streak++;
    } else {
      break;
    }
  }

  return {
    completedTasks,
    totalHoursLogged: Math.round(totalHoursLogged * 10) / 10,
    streak
  };
};

export const getMetricColor = (value, thresholds) => {
  /**
   * thresholds: { high: x, medium: y }
   * Returns 'success' (green), 'warning' (gold), or 'danger' (red)
   */
  if (value >= thresholds.high) return '#4A7C59';
  if (value >= thresholds.medium) return '#D2A24C';
  return '#C2664A';
};

export const getCompletionColor = (percentage) => {
  if (percentage >= 80) return '#4A7C59';
  if (percentage >= 50) return '#D2A24C';
  return '#C2664A';
};

export const formatHours = (hours) => {
  return Math.round(hours * 10) / 10;
};
