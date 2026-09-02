const mongoose = require('mongoose');

const connectTicketSchema = new mongoose.Schema({
  ticket: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, required: true },
  expiresAt: { type: Date, required: true, expires: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ConnectTicket', connectTicketSchema);
