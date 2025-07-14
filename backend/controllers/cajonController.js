const Cajon = require('../models/Cajon');
const Asignacion = require('../models/Asignacion');

// Obtener todos los cajones con su estado (ocupado o libre)
exports.obtenerCajonesConEstado = async (req, res) => {
  try {
    const cajones = await Cajon.findAll();

    const cajonesConEstado = await Promise.all(
      cajones.map(async (cajon) => {
        const asignacionActiva = await Asignacion.findOne({
          where: {
            id_caj: cajon.id_caj,
            estado_asig: 'activa'
          }
        });

        return {
          ...cajon.toJSON(),
          estado: asignacionActiva ? 'ocupado' : 'libre'
        };
      })
    );

    res.json(cajonesConEstado);
  } catch (error) {
    console.error('Error al obtener los cajones:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Cambiar el estado de un cajón manualmente (activar o finalizar asignación)
exports.cambiarEstadoCajon = async (req, res) => {
  const { id_caj } = req.params;
  const { accion } = req.body; // 'activar' o 'finalizar'

  try {
    const cajon = await Cajon.findByPk(id_caj);
    if (!cajon) {
      return res.status(404).json({ mensaje: 'Cajón no encontrado' });
    }

    if (accion === 'activar') {
      // Solo se crea una asignación si no existe una activa
      const asignacionExistente = await Asignacion.findOne({
        where: {
          id_caj,
          estado_asig: 'activa'
        }
      });

      if (asignacionExistente) {
        return res.status(400).json({ mensaje: 'Ya existe una asignación activa para este cajón' });
      }

      await Asignacion.create({
        id_caj,
        id_usu: 1, // Este ID debe venir desde sesión o solicitud
        tipo_asig: 'manual',
        estado_asig: 'activa'
      });

      return res.json({ mensaje: 'Asignación activada exitosamente' });

    } else if (accion === 'finalizar') {
      const asignacionActiva = await Asignacion.findOne({
        where: {
          id_caj,
          estado_asig: 'activa'
        }
      });

      if (!asignacionActiva) {
        return res.status(400).json({ mensaje: 'No hay una asignación activa para este cajón' });
      }

      asignacionActiva.estado_asig = 'finalizada';
      await asignacionActiva.save();

      return res.json({ mensaje: 'Asignación finalizada correctamente' });

    } else {
      return res.status(400).json({ mensaje: 'Acción no válida. Usa "activar" o "finalizar".' });
    }

  } catch (error) {
    console.error('Error al cambiar el estado del cajón:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};
