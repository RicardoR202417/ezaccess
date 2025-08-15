// controllers/iotController.js
const { Actuador, Cajon } = require('../models');
const state = require('../helpers/state');

// ======== PLUMAS (entrada/salida/tope global “legacy”) ========

// GET /api/iot/plumas?oneshot=true
exports.getPlumasEstado = (req, res) => {
  const oneshot = String(req.query.oneshot || '').toLowerCase() === 'true';

  const payload = {
    entrada:     state.plumas.entrada,
    salida:      state.plumas.salida,
    tope:        state.plumas.tope,
    tope_reset:  state.plumas.tope_reset,
    updatedAt:   state.plumas.updatedAt,
  };

  if (oneshot) {
    state.plumas.entrada = 0;
    state.plumas.salida = 0;
    state.plumas.tope = 0;
    state.plumas.tope_reset = 0;
    state.plumas.updatedAt = new Date().toISOString();
  }

  return res.json(payload);
};

// POST /api/iot/plumas/set
// Body: { entrada: 0|1, salida: 0|1, tope: 0|1, tope_reset: 0|1 }
exports.setPlumasEstado = (req, res) => {
  const { entrada, salida, tope, tope_reset } = req.body || {};

  if (entrada !== undefined) {
    const val = Number(entrada);
    if (![0, 1].includes(val)) return res.status(400).json({ error: 'entrada debe ser 0 ó 1' });
    state.plumas.entrada = val;
  }

  if (salida !== undefined) {
    const val = Number(salida);
    if (![0, 1].includes(val)) return res.status(400).json({ error: 'salida debe ser 0 ó 1' });
    state.plumas.salida = val;
  }

  if (tope !== undefined) {
    const val = Number(tope);
    if (![0, 1].includes(val)) return res.status(400).json({ error: 'tope debe ser 0 ó 1' });
    state.plumas.tope = val;
  }

  if (tope_reset !== undefined) {
    const val = Number(tope_reset);
    if (![0, 1].includes(val)) return res.status(400).json({ error: 'tope_reset debe ser 0 ó 1' });
    state.plumas.tope_reset = val;
  }

  state.plumas.updatedAt = new Date().toISOString();

  return res.json({
    ok: true,
    plumas: {
      entrada: state.plumas.entrada,
      salida: state.plumas.salida,
      tope: state.plumas.tope,
      tope_reset: state.plumas.tope_reset,
      updatedAt: state.plumas.updatedAt,
    },
  });
};

// ======== TOPE POR ID DE CAJÓN (down/up oneshot) ========

// GET /api/iot/tope/:id_cajon?oneshot=true
// Devuelve “one-shot” para ambas acciones y limpia si oneshot=true
// ======== TERCER SERVO (open/close one-shot y toggle) ========

// GET /api/iot/tercero?oneshot=true
// Devuelve flags one-shot {tercero_open, tercero_close} y limpia si oneshot=true
exports.getTerceroEstado = (req, res) => {
  const oneshot = String(req.query.oneshot || '').toLowerCase() === 'true';

  const payload = {
    tercero_open:  state.tercero.open ? 1 : 0,
    tercero_close: state.tercero.close ? 1 : 0,
    lastState:     state.tercero.lastState ? 1 : 0, // 1 abierto, 0 cerrado (informativo)
    updatedAt:     state.tercero.updatedAt,
  };

  if (oneshot) {
    // limpia sólo los flags one-shot (no cambiamos lastState aquí)
    state.tercero.open  = 0;
    state.tercero.close = 0;
    state.tercero.updatedAt = new Date().toISOString();
  }

  return res.json(payload);
};

// POST /api/iot/tercero/open
exports.openTercero = (req, res) => {
  state.tercero.open  = 1;
  state.tercero.close = 0;                // anula close pendiente
  state.tercero.updatedAt = new Date().toISOString();
  return res.json({ ok: true, mensaje: 'Tercer servo marcado para OPEN (one-shot).' });
};

// POST /api/iot/tercero/close
exports.closeTercero = (req, res) => {
  state.tercero.close = 1;
  state.tercero.open  = 0;                // anula open pendiente
  state.tercero.updatedAt = new Date().toISOString();
  return res.json({ ok: true, mensaje: 'Tercer servo marcado para CLOSE (one-shot).' });
};

// POST /api/iot/tercero/toggle
// Alterna el estado lógico y emite el one-shot correspondiente
exports.toggleTercero = (req, res) => {
  const next = state.tercero.lastState ? 0 : 1;  // si estaba abierto -> cerrar; si cerrado -> abrir
  if (next === 1) {
    state.tercero.open  = 1;
    state.tercero.close = 0;
  } else {
    state.tercero.close = 1;
    state.tercero.open  = 0;
  }
  state.tercero.updatedAt = new Date().toISOString();
  return res.json({ ok: true, mensaje: `Toggle: nuevo estado lógico = ${next ? 'ABIERTO' : 'CERRADO'}` });
};

// (Opcional) Endpoint para que el ESP confirme el estado físico alcanzado
// POST /api/iot/tercero/ack   body: { isOpen: 0|1 }
exports.ackTercero = (req, res) => {
  const { isOpen } = req.body || {};
  const v = Number(isOpen);
  if (![0,1].includes(v)) return res.status(400).json({ error: 'isOpen debe ser 0 o 1' });
  state.tercero.lastState = v;
  state.tercero.updatedAt = new Date().toISOString();
  return res.json({ ok: true, lastState: state.tercero.lastState });
};
