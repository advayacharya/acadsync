const Task = require('../models/Task');
const calculatePriority = require('../utils/priority');
const { upsertTaskToGoogleCalendar, deleteFromGoogleCalendar } = require('../services/googleSyncService');

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

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ priority: -1, deadline: 1 });
    return res.status(200).json(tasks.filter(isRelevantTask));
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { subject, type, deadline, startTime, endTime, isAllDay, weightage, difficulty, studyHours, notes } = req.body;
    if (!subject || !type || !deadline || !weightage || !difficulty || !studyHours) {
      return res.status(400).json({ message: 'Missing task fields' });
    }

    const priority = calculatePriority({ type, weightage, difficulty, deadline });

    const finalIsAllDay = isAllDay !== undefined ? Boolean(isAllDay) : (!startTime && !endTime);

    const task = new Task({
      userId: req.user.id,
      subject,
      type,
      deadline,
      startTime: startTime || '',
      endTime: endTime || '',
      isAllDay: finalIsAllDay,
      weightage,
      difficulty,
      studyHours,
      status: 'Pending',
      priority,
      notes: notes || ''
    });

    // Attempt 2-way Google sync
    const syncResult = await upsertTaskToGoogleCalendar(req.user.id, task);
    if (syncResult.success && syncResult.eventId) {
      task.integrationEventId = syncResult.eventId;
    }

    await task.save();
    return res.status(201).json({
      task,
      googleSync: {
        success: syncResult.success,
        error: syncResult.error
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const updates = req.body;

    const task = await Task.findOne({ _id: taskId, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const allowedFields = [
      'subject',
      'type',
      'deadline',
      'startTime',
      'endTime',
      'isAllDay',
      'weightage',
      'difficulty',
      'studyHours',
      'status',
      'notes'
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        task[field] = updates[field];
      }
    });

    if (updates.startTime !== undefined || updates.endTime !== undefined || updates.isAllDay !== undefined) {
      if (updates.isAllDay === true) {
        task.isAllDay = true;
      } else if (updates.startTime || updates.endTime) {
        task.isAllDay = false;
      }
    }

    if (
      updates.type !== undefined ||
      updates.deadline !== undefined ||
      updates.weightage !== undefined ||
      updates.difficulty !== undefined ||
      updates.status !== undefined
    ) {
      task.priority = calculatePriority({
        type: task.type,
        weightage: task.weightage,
        difficulty: task.difficulty,
        deadline: task.deadline,
        status: task.status
      });
    }

    // 2-way Google Calendar update
    const syncResult = await upsertTaskToGoogleCalendar(req.user.id, task);
    if (syncResult.success && syncResult.eventId && !task.integrationEventId) {
      task.integrationEventId = syncResult.eventId;
    }

    await task.save();
    return res.status(200).json({
      task,
      googleSync: {
        success: syncResult.success,
        error: syncResult.error
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const deleted = await Task.findOneAndDelete({ _id: taskId, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }

    let googleSync = { success: true, error: null };
    if (deleted.integrationEventId) {
      googleSync = await deleteFromGoogleCalendar(req.user.id, deleted.integrationEventId);
    }

    return res.status(200).json({
      message: 'Task deleted successfully',
      googleSync
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
