const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  fingerprint: { type: String, required: true, unique: true },
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  firstSeen:   { type: Date, default: Date.now },
  lastSeen:    { type: Date, default: Date.now },
  visitCount:  { type: Number, default: 1 },
  isOnline:    { type: Boolean, default: false },
});

module.exports = mongoose.model('Visitor', visitorSchema);