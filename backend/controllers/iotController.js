const { Actuador, Cajon } = require('../models');

// Estado en memoria suficiente para la maqueta.
const state = {
  plumas: {
    entrada: 0,
    salida:  0,
    updatedAt: null,
  },
  topes: {
    // Estructura dinámica por id_caj: { [id_caj]: 0|1 }
    // Ejemplo: 1: 1 → bajar tope del cajón 1
  }
};

// ===== PLUMAS =====

exports.getPlumasEstado = (req, res) => {
  const oneshot = String(req.query.oneshot || '').toLowerCase() === 'true';

  const payload = {
    entrada: state.plumas.entrada,
    salida:  state.plumas.salida,
    updatedAt: state.plumas.updatedAt,
  };

  if (oneshot && (state.plumas.entrada === 1 || state.plumas.salida === 1)) {
    state.plumas.entrada = 0;
    state.plumas.salida  = 0;
    state.plumas.updatedAt = new Date().toISOString();
  }

  return res.json(payload);
};

exports.setPlumasEstado = (req, res) => {
  const { entrada, salida } = req.body || {};

  if (entrada !== undefined) {
    const val = Number(entrada);
    if (![0,1].includes(val)) return res.status(400).json({ error: 'entrada debe ser 0 ó 1' });
    state.plumas.entrada = val;
  }
  if (salida !== undefined) {
    const val = Number(salida);
    if (![0,1].includes(val)) return res.status(400).json({ error: 'salida debe ser 0 ó 1' });
    state.plumas.salida = val;
  }

  state.plumas.updatedAt = new Date().toISOString();

  return res.json({
    ok: true,
    plumas: {
      entrada: state.plumas.entrada,
      salida:  state.plumas.salida,
      updatedAt: state.plumas.updatedAt,
    },
  });
};

// ===== TOPE =====

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
