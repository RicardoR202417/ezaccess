const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculosController');

// Ruta para registrar un nuevo vehículo
router.post('/vehiculos/crear', vehiculosController.crearVehiculo);

// Ruta para obtener vehículos por ID de usuario
router.get('/vehiculos/usuario/:id_usu', vehiculosController.listarVehiculosPorUsuario);

module.exports = router;
