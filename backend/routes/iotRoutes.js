const express = require('express');
const router = express.Router();

// Importa tu controlador
const ctrl = require('../controllers/iotController');

// ======== Rutas PLUMAS ========
router.get('/plumas', ctrl.getPlumasEstado);
router.post('/plumas/set', ctrl.setPlumasEstado);

// ======== Rutas TERCER SERVO ========
router.get('/tercero', ctrl.getTerceroEstado);
router.post('/tercero/open', ctrl.openTercero);
router.post('/tercero/close', ctrl.closeTercero);
router.post('/tercero/toggle', ctrl.toggleTercero);
router.post('/tercero/ack', ctrl.ackTercero);

module.exports = router;
