// routes/sensorRoutes.js
const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

router.get('/:id', sensorController.obtenerSensor);
router.put('/:id/estado', sensorController.cambiarEstado);

module.exports = router;
