const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    color: { type: String, default: '#D2A24C' },
    term: { type: String, default: 'Fall 2026' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
