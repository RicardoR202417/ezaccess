const { Cajon, Asignacion, Actuador, Sensor } = require('../models');

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

// Cambiar el estado de todos los cajones a la vez
exports.cambiarEstadoTodos = async (req, res) => {
  const { accion } = req.body; // 'activar' o 'finalizar'
  try {
    const cajones = await Cajon.findAll();

    if (accion === 'activar') {
      let count = 0;
      for (const cajon of cajones) {
        const asignacionExistente = await Asignacion.findOne({
          where: { id_caj: cajon.id_caj, estado_asig: 'activa' }
        });
        if (!asignacionExistente) {
          await Asignacion.create({
            id_caj: cajon.id_caj,
            id_usu: 1, // Ajusta según tu lógica de usuario
            tipo_asig: 'manual',
            estado_asig: 'activa'
          });
          count++;
        }
      }
      return res.json({ mensaje: `Se activaron ${count} cajones.` });
    } else if (accion === 'finalizar') {
      const asignaciones = await Asignacion.findAll({
        where: { estado_asig: 'activa' }
      });
      for (const asig of asignaciones) {
        asig.estado_asig = 'finalizada';
        await asig.save();
      }
      return res.json({ mensaje: `Se finalizaron ${asignaciones.length} cajones.` });
    } else {
      return res.status(400).json({ mensaje: 'Acción no válida. Usa "activar" o "finalizar".' });
    }
  } catch (error) {
    console.error('Error al cambiar el estado de todos los cajones:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Obtener el estado completo de los cajones con asignaciones, actuadores y sensores
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
    console.error('Error al obtener el estado completo de los cajones:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};