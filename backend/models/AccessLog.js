const mongoose = require('mongoose');

const AccessLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  usuario: {
    type: String, // email
    required: true
  },
  caducidad: {
    type: Date, // Date/String per requirements, using Date for better handling
    required: true
  },
  token: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('AccessLog', AccessLogSchema);
