// routes/nfcRoutes.js

const express = require('express');
const router = express.Router();

// Controlador
const { validarUID } = require('../controllers/nfcController');

// Ruta para validar el UID del escaneo NFC
// Espera un body como: { "uid": "ABC123XYZ" }
router.post('/validar-uid', validarUID);

module.exports = router;
