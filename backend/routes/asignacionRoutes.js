const express = require('express');
const router = express.Router();
const asignacionController = require('../controllers/asignacionController');
const verificarToken = require('../middlewares/verificarToken');

router.get('/asignaciones', verificarToken, asignacionController.obtenerAsignaciones);
router.put('/asignaciones/:id', verificarToken, asignacionController.actualizarEstadoAsignacion);

// NUEVO ENDPOINT: Asignación automática con procedure
router.post('/asignar-automatica', asignacionController.asignacionAutomatica);

// NUEVO ENDPOINT: Asignación manual de parqueaderos
router.post('/asignaciones/manual', asignacionController.asignacionManual);

router.get('/asignaciones/usuario/:id_usu', asignacionController.obtenerAsignacionActivaPorUsuario);


module.exports = router;
