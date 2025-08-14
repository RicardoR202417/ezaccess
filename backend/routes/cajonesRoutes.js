const express = require('express');
const router = express.Router();
const cajonesController = require('../controllers/cajonesController');

// Rutas GET
router.get('/estado', cajonesController.obtenerCajonesConEstado);
router.get('/cajones', cajonesController.obtenerCajonesConEstado);
router.get('/cajones/estado-completo', cajonesController.obtenerEstadoCompleto);



router.get('/estado-completo', cajonesController.obtenerEstadoCompleto);

// ⚠️ Orden IMPORTANTE de las rutas PUT
router.put('/cajones/estado/todos', cajonesController.cambiarEstadoTodos);
router.put('/cajones/:id_caj/estado', cajonesController.cambiarEstadoCajon);

// Ruta para obtener el cupo por zona
router.get('/zona/:zona', cajonesController.obtenerCupoPorZona);

module.exports = router;
