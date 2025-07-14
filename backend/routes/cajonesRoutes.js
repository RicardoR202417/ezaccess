const express = require('express');
const router = express.Router();
const cajonesController = require('../controllers/cajonesController');

// PUT /api/asignaciones/:id_asig/cambiar-estado
// ✅ USAMOS LA FUNCIÓN QUE SÍ EXISTE EN TU CONTROLADOR
router.put('/cajones/:id_caj/estado', cajonesController.cambiarEstadoCajon);


module.exports = router;
