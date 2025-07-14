const express = require('express');
const router = express.Router();
const actuadorController = require('../controllers/actuadorController');

router.get('/actuadores/:id', actuadorController.obtenerActuador);
router.put('/actuadores/:id', actuadorController.cambiarEstado);

module.exports = router;