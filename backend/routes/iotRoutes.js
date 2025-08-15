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

// ======== TOPE (NUEVO) ========
// ESP32 consulta si debe bajar el tope (por ID de cajón)
router.get('/tope/:id_cajon', ctrl.getEstadoTope);

// Web o backend ordena bajar el tope de un cajón específico
router.post('/tope/:id_cajon/down', ctrl.bajarTope);

module.exports = router;
