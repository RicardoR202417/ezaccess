const { Cajon, Asignacion, Actuador, Sensor, Usuario } = require('../models');

// ✅ Obtener todos los cajones con su estado (libre u ocupado)
exports.obtenerCajonesConEstado = async (req, res) => {
  try {
    const cajones = await Cajon.findAll();

    const resultado = await Promise.all(
      cajones.map(async (cajon) => {
        const asignacionActiva = await Asignacion.findOne({
          where: {
            id_caj: cajon.id_caj,
            estado_asig: 'activa'
          },
          include: { model: Usuario }
        });

        return {
          id_caj: cajon.id_caj,
          numero_caj: cajon.numero_caj,
          ubicacion_caj: cajon.ubicacion_caj,
          estado: asignacionActiva ? 'ocupado' : 'libre',
          usuario: asignacionActiva?.usuario?.nombre_usu || null
        };
      })
    );

    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener cajones con estado:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// ✅ Activar o finalizar la asignación de un cajón
exports.cambiarEstadoCajon = async (req, res) => {
  const { id_caj } = req.params;
  const { accion, id_usu } = req.body;

  try {
    const cajon = await Cajon.findByPk(id_caj);
    if (!cajon) {
      return res.status(404).json({ mensaje: 'Cajón no encontrado' });
    }

    if (accion === 'activar') {
      const asignacionExistente = await Asignacion.findOne({
        where: { id_caj, estado_asig: 'activa' }
      });

      if (asignacionExistente) {
        return res.status(400).json({ mensaje: 'Ese cajón ya está asignado actualmente' });
      }

      if (!id_usu) {
        return res.status(400).json({ mensaje: 'Falta el id_usu para registrar asignación' });
      }

      const nueva = await Asignacion.create({
        id_caj,
        id_usu,
        tipo_asig: 'manual',
        estado_asig: 'activa'
      });

      return res.status(200).json({
        mensaje: 'Cajón asignado exitosamente',
        asignacion: nueva
      });

    } else if (accion === 'finalizar') {
      const asignacionActiva = await Asignacion.findOne({
        where: { id_caj, estado_asig: 'activa' }
      });

      if (!asignacionActiva) {
        return res.status(400).json({ mensaje: 'Ese cajón no tiene asignación activa' });
      }

      asignacionActiva.estado_asig = 'finalizada';
      await asignacionActiva.save();

      return res.status(200).json({ mensaje: 'Asignación finalizada correctamente' });

    } else {
      return res.status(400).json({ mensaje: 'Acción no válida. Usa "activar" o "finalizar"' });
    }
  } catch (error) {
    console.error('Error al cambiar estado del cajón:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// ✅ Vista más detallada opcional (con sensores y actuadores)
exports.obtenerEstadoCompleto = async (req, res) => {
  try {
    const cajones = await Cajon.findAll({
      include: [
        {
          model: Asignacion,
          where: { estado_asig: 'activa' },
          required: false
        },
        {
          model: Actuador,
          attributes: ['id_act', 'estado_act'],
          required: false
        },
        {
          model: Sensor,
          attributes: ['id_sen', 'estado_sen', 'fecha_lectura_sen'],
          required: false
        }
      ]
    });

    const resultado = cajones.map(cajon => ({
      id_caj: cajon.id_caj,
      numero_caj: cajon.numero_caj,
      ubicacion_caj: cajon.ubicacion_caj,
      estado: cajon.asignacions?.length > 0 ? 'ocupado' : 'libre',
      actuador: cajon.actuadore || null,
      sensor: cajon.sensore || null
    }));

    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener estado completo:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};
