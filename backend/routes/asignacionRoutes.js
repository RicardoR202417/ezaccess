const express = require('express');
const router = express.Router();
const asignacionController = require('../controllers/asignacionController');

router.get('/asignaciones', asignacionController.obtenerAsignaciones);
router.put('/asignaciones/:id', asignacionController.actualizarEstadoAsignacion);

// NUEVO ENDPOINT: Asignación automática con procedure
router.post('/asignar-automatica', asignacionController.asignacionAutomatica);

// NUEVO ENDPOINT: Asignación manual de parqueaderos
router.post('/asignaciones/manual', asignacionController.asignacionManual);

router.get('/asignaciones/usuario/:id_usu', asignacionController.obtenerAsignacionActivaPorUsuario);


module.exports = router;
