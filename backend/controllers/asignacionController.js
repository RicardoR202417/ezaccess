const { Asignacion, Usuario, Cajon, Actuador, Sensor } = require('../models');

exports.obtenerAsignaciones = async (req, res) => {
  try {
    const asignaciones = await Asignacion.findAll({
      include: [
        { model: Usuario, attributes: ['id_usu', 'nombre_usu'] },
        { 
          model: Cajon, 
          attributes: ['id_caj', 'numero_caj', 'ubicacion_caj'],
          include: [
            { model: Actuador, attributes: ['id_act', 'estado_act'] },
            { model: Sensor, attributes: ['id_sen', 'estado_sen', 'fecha_lectura_sen'] }
          ]
        }
      ]
    });
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

    // Consulta relacional para devolver la asignación completa
    const asignacionCompleta = await Asignacion.findByPk(id, {
      include: [
        { model: Usuario, attributes: ['id_usu', 'nombre_usu'] },
        { 
          model: Cajon, 
          attributes: ['id_caj', 'numero_caj', 'ubicacion_caj'],
          include: [
            { model: Actuador, attributes: ['id_act', 'estado_act'] },
            { model: Sensor, attributes: ['id_sen', 'estado_sen', 'fecha_lectura_sen'] }
          ]
        }
      ]
    });

    res.json({ mensaje: 'Estado actualizado', asignacion: asignacionCompleta });
  } catch (error) {
    console.error('Error al actualizar asignación:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};
