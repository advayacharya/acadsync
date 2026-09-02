const Task = require('../models/Task');

const isRelevantTask = (task) => {
  if (!task || !task.subject || !task.deadline) return false;

  const subject = task.subject.toLowerCase();
  if (/happy birthday|birthday|anniversary|celebration|yearly|annual/.test(subject)) {
    return false;
  }

  const deadline = new Date(task.deadline);
  if (Number.isNaN(deadline.getTime())) return false;

  return deadline.getFullYear() === new Date().getFullYear();
};

const generatePlanForUser = async (userId, hoursAvailable) => {
  const tasks = await Task.find({ userId, status: 'Pending' }).sort({ priority: -1, deadline: 1 });
  const relevantTasks = tasks.filter(isRelevantTask);

  let remaining = hoursAvailable;
  const plan = [];

  for (const task of relevantTasks) {
    if (remaining <= 0) break;

    const availableForTask = Math.min(task.studyHours, remaining);
    if (availableForTask <= 0) continue;

    plan.push({
      task: {
        id: task._id,
        subject: task.subject,
        type: task.type,
        deadline: task.deadline,
        weightage: task.weightage,
        difficulty: task.difficulty,
        studyHours: task.studyHours,
        status: task.status,
        priority: task.priority
      },
      allocatedHours: Number(availableForTask.toFixed(2))
    });

    remaining -= availableForTask;
  }

  return {
    hoursAvailable,
    hoursAllocated: Number((hoursAvailable - remaining).toFixed(2)),
    plan
  };
};

module.exports = { generatePlanForUser };
