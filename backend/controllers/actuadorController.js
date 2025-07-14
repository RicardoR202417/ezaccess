const Actuador = require('../models/Actuador');

exports.obtenerActuador = async (req, res) => {
  try {
    const actuador = await Actuador.findByPk(req.params.id);

    if (!actuador) {
      return res.status(404).json({ mensaje: 'Actuador no encontrado' });
    }

    res.json(actuador);
  } catch (error) {
    console.error('Error al obtener actuador:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

exports.cambiarEstado = async (req, res) => {
  const { estado_act } = req.body;

  if (!['bloqueado', 'liberado'].includes(estado_act)) {
    return res.status(400).json({ mensaje: 'Estado inválido' });
  }

  try {
    const actuador = await Actuador.findByPk(req.params.id);

    if (!actuador) {
      return res.status(404).json({ mensaje: 'Actuador no encontrado' });
    }

    actuador.estado_act = estado_act;
    actuador.fecha_actualizacion_act = new Date();
    await actuador.save();

    res.json({ mensaje: `Actuador actualizado a ${estado_act}`, actuador });
  } catch (error) {
    console.error('Error al cambiar el estado del actuador:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};
