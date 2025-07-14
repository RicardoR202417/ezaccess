const Asignacion = require('../models/Asignacion');

exports.obtenerAsignaciones = async (req, res) => {
  try {
    const asignaciones = await Asignacion.findAll();
    res.json(asignaciones);
  } catch (error) {
    console.error('Error al obtener asignaciones:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

exports.actualizarEstadoAsignacion = async (req, res) => {
  const { id } = req.params;
  const { estado_asig } = req.body;

  if (!['activa', 'finalizada'].includes(estado_asig)) {
    return res.status(400).json({ mensaje: 'Estado no válido' });
  }

  try {
    const asignacion = await Asignacion.findByPk(id);
    if (!asignacion) {
      return res.status(404).json({ mensaje: 'Asignación no encontrada' });
    }

    asignacion.estado_asig = estado_asig;
    await asignacion.save();

    // Aquí puedes agregar lógica para comunicar al IoT, si es necesario.

    res.json({ mensaje: 'Estado actualizado', asignacion });
  } catch (error) {
    console.error('Error al actualizar asignación:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};
