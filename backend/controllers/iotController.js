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
exports.getEstadoTope = (req, res) => {
  const idCajon = String(req.params.id_cajon);
  const oneshot = String(req.query.oneshot || '').toLowerCase() === 'true';

  const down = state.topes_down[idCajon] === 1 ? 1 : 0;
  const up   = state.topes_up[idCajon]   === 1 ? 1 : 0;

  if (oneshot) {
    if (down === 1) state.topes_down[idCajon] = 0;
    if (up   === 1) state.topes_up[idCajon]   = 0;
  }

  return res.json({ id_cajon: idCajon, tope_down: down, tope_up: up, updatedAt: new Date().toISOString() });
};

// POST /api/iot/tope/:id_cajon/down
exports.bajarTope = async (req, res) => {
  const idCajon = String(req.params.id_cajon);
  try {
    const actuador = await Actuador.findOne({ where: { id_caj: idCajon, tipo: 'tope' } });
    if (!actuador) return res.status(404).json({ error: 'No se encontró actuador tipo tope para este cajón' });

    state.topes_down[idCajon] = 1; // one-shot para bajar
    state.topes_up[idCajon]   = 0; // opcional: anula “up” pendiente

    return res.json({ ok: true, mensaje: `Tope del cajón ${idCajon} marcado para BAJAR (one-shot).` });
  } catch (error) {
    console.error('🔥 Error bajando tope:', error);
    return res.status(500).json({ error: 'Error interno del servidor', detalle: error.message || String(error) });
  }
};

// POST /api/iot/tope/:id_cajon/up
exports.subirTope = async (req, res) => {
  const idCajon = String(req.params.id_cajon);
  try {
    const actuador = await Actuador.findOne({ where: { id_caj: idCajon, tipo: 'tope' } });
    if (!actuador) return res.status(404).json({ error: 'No se encontró actuador tipo tope para este cajón' });

    state.topes_up[idCajon]   = 1; // one-shot para subir
    state.topes_down[idCajon] = 0; // opcional: anula “down” pendiente

    return res.json({ ok: true, mensaje: `Tope del cajón ${idCajon} marcado para SUBIR (one-shot).` });
  } catch (error) {
    console.error('🔥 Error subiendo tope:', error);
    return res.status(500).json({ error: 'Error interno del servidor', detalle: error.message || String(error) });
  }
};
