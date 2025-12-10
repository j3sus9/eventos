const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create event
router.post('/', async (req, res) => {
  const event = new Event({
    nombre: req.body.nombre,
    timestamp: req.body.timestamp,
    lugar: req.body.lugar,
    lat: req.body.lat,
    lon: req.body.lon,
    organizador: req.body.organizador,
    imagen: req.body.imagen
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (req.body.nombre != null) event.nombre = req.body.nombre;
    if (req.body.timestamp != null) event.timestamp = req.body.timestamp;
    if (req.body.lugar != null) event.lugar = req.body.lugar;
    if (req.body.lat != null) event.lat = req.body.lat;
    if (req.body.lon != null) event.lon = req.body.lon;
    if (req.body.organizador != null) event.organizador = req.body.organizador;
    if (req.body.imagen != null) event.imagen = req.body.imagen;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
