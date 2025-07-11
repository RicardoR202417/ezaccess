const express = require('express');
const router = express.Router();
const visitaController = require('../controllers/visitaController');

router.post('/solicitudes-visita', visitaController.crearSolicitud);
router.get('/solicitudes', visitaController.obtenerSolicitudes); 
router.put('/solicitudes/:id/estado', visitaController.actualizarEstado);

module.exports = router;
