const express = require('express');
const router = express.Router();
const AccessLog = require('../models/AccessLog');

// POST /api/login-log (Mounted at /api in server.js, so path is /login-log)
router.post('/login-log', async (req, res) => {
  const log = new AccessLog({
    usuario: req.body.usuario,
    caducidad: req.body.caducidad,
    token: req.body.token,
    timestamp: req.body.timestamp || Date.now()
  });

  try {
    const newLog = await log.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/logs (Mounted at /api in server.js, so path is /logs)
router.get('/logs', async (req, res) => {
  try {
    const logs = await AccessLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
