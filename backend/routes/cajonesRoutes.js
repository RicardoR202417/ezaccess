const express = require('express');
const router = express.Router();
const cajonesController = require('../controllers/cajonesController');

// PUT /api/asignaciones/:id_asig/cambiar-estado
router.put('/asignaciones/:id_asig/cambiar-estado', cajonesController.actualizarEstadoAsignacion);

module.exports = router;
