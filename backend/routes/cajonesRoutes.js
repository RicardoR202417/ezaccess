const express = require('express');
const router = express.Router();
const cajonesController = require('../controllers/cajonesController');

// Ruta principal para obtener todos los cajones
router.get('/', cajonesController.obtenerCajonesConEstado);

router.get('/estado-completo', cajonesController.obtenerEstadoCompleto);
router.get('/estado', cajonesController.obtenerCajonesConEstado);

// ⚠️ Orden IMPORTANTE de las rutas PUT
router.put('/estado/todos', cajonesController.cambiarEstadoTodos);
router.put('/:id_caj/estado', cajonesController.cambiarEstadoCajon);

// Ruta para obtener el cupo por zona
router.get('/cajones/zona/:zona', cajonesController.obtenerCupoPorZona);

module.exports = router;
