const express = require('express');
const router = express.Router();
const visitaController = require('../controllers/visitaController');

router.post('/solicitudes-visita', visitaController.crearSolicitud);
router.get('/solicitudes', visitaController.obtenerSolicitudes); 

module.exports = router;
