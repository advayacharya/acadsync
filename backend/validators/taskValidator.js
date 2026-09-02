const { z } = require('zod');

const createTaskSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  type: z.enum(['Exam', 'Assignment', 'Lab', 'Quiz']),
  deadline: z.string().min(1, 'Deadline is required'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isAllDay: z.boolean().optional(),
  weightage: z.number().min(0).max(100),
  difficulty: z.number().min(1).max(5),
  studyHours: z.number().positive('Study hours must be greater than 0'),
  notes: z.string().optional()
});

const updateTaskSchema = z.object({
  subject: z.string().min(1).optional(),
  type: z.enum(['Exam', 'Assignment', 'Lab', 'Quiz']).optional(),
  deadline: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isAllDay: z.boolean().optional(),
  weightage: z.number().min(0).max(100).optional(),
  difficulty: z.number().min(1).max(5).optional(),
  studyHours: z.number().positive().optional(),
  status: z.enum(['Pending', 'Completed']).optional(),
  notes: z.string().optional()
});

module.exports = { createTaskSchema, updateTaskSchema };
