const express = require('express');
const router = express.Router();
const asignacionController = require('../controllers/asignacionController');

router.get('/asignaciones', asignacionController.obtenerAsignaciones);
router.put('/asignaciones/:id', asignacionController.actualizarEstadoAsignacion);

module.exports = router;
