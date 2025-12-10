const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  lugar: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lon: {
    type: Number,
    required: true
  },
  organizador: {
    type: String, // email del creador
    required: true
  },
  imagen: {
    type: String, // URI
    required: false
  }
});

module.exports = mongoose.model('Event', EventSchema);
