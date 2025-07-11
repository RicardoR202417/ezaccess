const express = require('express');
const router = express.Router();
const visitaController = require('../controllers/visitaController');

router.post('/solicitudes-visita', visitaController.crearSolicitud);

module.exports = router;
