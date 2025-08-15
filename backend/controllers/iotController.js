// controllers/iotController.js

const { Actuador, Cajon } = require('../models');

// ======== ESTADO EN MEMORIA PARA MAQUETA ========
const state = {
  plumas: {
    entrada: 0,           // 1 = abrir entrada
    salida: 0,            // 1 = abrir salida
    tope: 0,              // 1 = bajar tope (global para ESP32)
    tope_reset: 0,        // 1 = subir tope (reset)
    updatedAt: null,
  },

  // Topes individuales por cajón (para pruebas si se desea por ID)
  topes: {
    // id_caj: 1 => marcado para bajar
  },
};

// ======== PLUMAS (entrada/salida/tope global) ========

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

// ======== TOPE POR ID DE CAJÓN (control individual por pruebas) ========

// GET /api/iot/tope/:id_cajon?oneshot=true
exports.getEstadoTope = (req, res) => {
  const idCajon = req.params.id_cajon;
  const oneshot = String(req.query.oneshot || '').toLowerCase() === 'true';

  const estado = state.topes[idCajon] || 0;

  if (oneshot && estado === 1) {
    state.topes[idCajon] = 0;
  }

  return res.json({ id_cajon: idCajon, tope: estado });
};

// POST /api/iot/tope/:id_cajon/down
exports.bajarTope = async (req, res) => {
  const idCajon = req.params.id_cajon;

  // Validar que el cajón existe y tiene actuador tipo 'tope'
  const cajon = await Cajon.findByPk(idCajon, {
    include: {
      model: Actuador,
      where: { tipo: 'tope' },
      required: true,
    }
  });

  if (!cajon) {
    return res.status(404).json({ error: 'Cajón o actuador tipo tope no encontrado' });
  }

  // Marca el tope para bajar (se mantendrá abajo hasta que se reinicie manualmente)
  state.topes[idCajon] = 1;

  return res.json({ ok: true, mensaje: `Tope de cajón ${idCajon} marcado para bajar.` });
};
