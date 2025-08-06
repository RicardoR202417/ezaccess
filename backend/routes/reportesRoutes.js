// routes/reportesRoutes.js
const express = require('express');
const router  = express.Router();
const reportes = require('../controllers/reportesController');

// GET /api/reportes/historial
router.get('/historial', reportes.getHistorial);

module.exports = router;
