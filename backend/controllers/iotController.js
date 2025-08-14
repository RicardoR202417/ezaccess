// controllers/iotController.js

// Estado en memoria suficiente para la maqueta.
// Si luego quieres persistir/loggear en BD, aquí mismo lo conectamos a Sequelize.
const state = {
  plumas: {
    entrada: 0,  // 0 = sin orden, 1 = abrir (one-shot)
    salida:  0,
    updatedAt: null,
  },
};

// GET /api/iot/plumas[?oneshot=true]
// Responde { entrada, salida, updatedAt }. Si ?oneshot=true, limpia órdenes al responder.
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

// POST /api/iot/plumas/set
// Body permitido: { entrada: 0|1, salida: 0|1 }
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
