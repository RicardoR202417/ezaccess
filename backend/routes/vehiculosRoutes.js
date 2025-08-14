// routes/vehiculosRoutes.js
const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculosController');
const verificarToken = require('../middlewares/verificarToken');

// Crear
router.post('/crear', verificarToken, vehiculosController.crearVehiculo);

// Listar por usuario
router.get('/usuario/:id_usu', verificarToken, vehiculosController.listarVehiculos);

// Activar
router.put('/:id/activar', verificarToken, vehiculosController.activarVehiculo);
router.put('/en-uso', verificarToken, vehiculosController.activarVehiculo);

// Eliminar
router.delete('/:id', verificarToken, vehiculosController.eliminarVehiculo);

module.exports = router;
