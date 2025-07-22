const express = require('express');
const router = express.Router();
const cajonesController = require('../controllers/cajonesController');

// ✅ Ruta para obtener todos los cajones con su estado (necesaria para la vista)
router.get('/cajones', cajonesController.obtenerCajonesConEstado);

// ✅ Ruta para cambiar el estado de un cajón (activar/finalizar asignación manual)
router.put('/cajones/:id_caj/estado', cajonesController.cambiarEstadoCajon);

// (Opcional) Ruta para obtener estado completo, si la necesitas en otra vista
router.get('/estado-completo', cajonesController.obtenerEstadoCompleto);

module.exports = router;
