const express = require('express');
const router = express.Router();

// Controlador que contiene la lógica para la vista vehicular
const consultasController = require('../controllers/consultasController');

// Ruta GET para obtener la vista clasificada de ingresos vehiculares
router.get('/vehicular-clasificado', consultasController.obtenerVehicularClasificado);

module.exports = router;
