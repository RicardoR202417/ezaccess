// routes/vehiculosRoutes.js
const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculosController');
const verificarToken = require('../middlewares/verificarToken');

// 🆕 Registrar vehículo (restringido)
router.post('/crear', verificarToken, vehiculosController.crearVehiculo);

// 🔍 Obtener vehículos del usuario (restringido)
router.get('/usuario/:id_usu', verificarToken, vehiculosController.listarVehiculosPorUsuario);

// ✅ Activar vehículo (dos formas soportadas)
// Opción RESTful: /vehiculos/:id/activar
router.put('/:id/activar', verificarToken, vehiculosController.activarVehiculo);

// Compatibilidad con tu ruta previa: /vehiculos/en-uso { id_veh }
router.put('/en-uso', verificarToken, vehiculosController.activarVehiculo);

// ✏️ Actualizar vehículo (restringido)
router.put('/:id', verificarToken, vehiculosController.actualizarVehiculo);

// ❌ Eliminar vehículo (restringido)
router.delete('/:id', verificarToken, vehiculosController.eliminarVehiculo);

module.exports = router;
