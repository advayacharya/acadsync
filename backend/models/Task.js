const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
    subject: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['Exam', 'Assignment', 'Lab', 'Quiz'],
      required: true
    },
    deadline: { type: Date, required: true },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    isAllDay: { type: Boolean, default: true },
    weightage: { type: Number, required: true },
    difficulty: { type: Number, required: true, min: 1, max: 5 },
    studyHours: { type: Number, required: true, min: 0.1 },
    actualHours: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    priority: { type: Number, default: 0 },
    integrationEventId: { type: String, default: null },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
