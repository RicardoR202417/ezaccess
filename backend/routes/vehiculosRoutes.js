// routes/vehiculosRoutes.js
const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculosController');
const verificarToken = require('../middlewares/verificarToken');

// 🆕 Registrar vehículo (restringido)
router.post('/crear', verificarToken, vehiculosController.crearVehiculo);

// 🔍 Obtener vehículos del usuario (restringido)
router.get('/usuario/:id_usu', verificarToken, vehiculosController.listarVehiculosPorUsuario);

// ✅ Marcar vehículo como en uso (restringido)
router.put('/en-uso', verificarToken, vehiculosController.marcarEnUso);


// ✏️ Actualizar vehículo (restringido)
router.put('/:id', verificarToken, vehiculosController.actualizarVehiculo);

// ❌ Eliminar vehículo (restringido)
router.delete('/:id', verificarToken, vehiculosController.eliminarVehiculo);

module.exports = router;
