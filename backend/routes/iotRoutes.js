const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/iotController');

// ======== PLUMAS ========
// El ESP32 consulta estado (puedes usar ?oneshot=true para limpiar la orden tras leerla)
router.get('/plumas', ctrl.getPlumasEstado);

// La web ordena abrir/cerrar plumas (body: { entrada: 0|1, salida: 0|1 })
router.post('/plumas/set', ctrl.setPlumasEstado);

// Atajos opcionales (triggers directos)
router.post('/plumas/entrada/open', (req, res) => {
  req.body = { entrada: 1 };
  return ctrl.setPlumasEstado(req, res);
});
router.post('/plumas/salida/open', (req, res) => {
  req.body = { salida: 1 };
  return ctrl.setPlumasEstado(req, res);
});

// Tercer servo
router.get('/tercero',         iotController.getTerceroEstado);
router.post('/tercero/open',   iotController.openTercero);
router.post('/tercero/close',  iotController.closeTercero);
router.post('/tercero/toggle', iotController.toggleTercero);
router.post('/tercero/ack',    iotController.ackTercero); // opcional

module.exports = router;
