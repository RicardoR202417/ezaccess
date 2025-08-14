const { Asignacion, Usuario, Cajon, Actuador, Sensor, sequelize } = require('../models');
const { Op } = require('sequelize');

// Obtener todas las asignaciones
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

// Actualizar estado de una asignación
exports.actualizarEstadoAsignacion = async (req, res) => {
  const { id } = req.params;
  const { estado_asig } = req.body;

  if (!['activa', 'finalizada', 'pendiente'].includes(estado_asig)) {
    return res.status(400).json({ mensaje: 'Estado no válido' });
  }

  try {
    const asignacion = await Asignacion.findByPk(id);
    if (!asignacion) {
      return res.status(404).json({ mensaje: 'Asignación no encontrada' });
    }

    asignacion.estado_asig = estado_asig;
    await asignacion.save();

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

// Asignación automática usando stored procedure
exports.asignacionAutomatica = async (req, res) => {
  const { id_usu } = req.body;
  if (!id_usu) {
    return res.status(400).json({ mensaje: 'Falta el id de usuario' });
  }

  try {
    await sequelize.query('CALL asignar_cajon_automatico(:p_id_usu)', {
      replacements: { p_id_usu: id_usu }
    });

    const [ultimaAsignacion] = await sequelize.query(
      `
      SELECT a.*, c.numero_caj, c.ubicacion_caj
      FROM asignaciones a
      JOIN cajones c ON a.id_caj = c.id_caj
      WHERE a.id_usu = :id_usu
        AND a.estado_asig = 'activa'
      ORDER BY a.fecha_asig DESC
      LIMIT 1
      `,
      { replacements: { id_usu }, type: sequelize.QueryTypes.SELECT }
    );

    if (ultimaAsignacion) {
      return res.json({
        mensaje: 'Cajón asignado automáticamente',
        asignacion: ultimaAsignacion
      });
    } else {
      return res.status(200).json({ mensaje: 'No se pudo asignar cajón (ya tiene uno o no hay disponibles)' });
    }
  } catch (error) {
    console.error('Error en asignación automática:', error);
    return res.status(500).json({ mensaje: 'Error en asignación automática', error: error.message });
  }
};

// Obtener asignación activa/pendiente de un usuario
exports.obtenerAsignacionActivaPorUsuario = async (req, res) => {
  try {
    const idUsuario = req.usuario?.id || req.usuario?.id_usu || req.params.id_usu;
    if (!idUsuario) {
      return res.status(400).json({ mensaje: 'Falta el id del usuario' });
    }

    const asignacion = await Asignacion.findOne({
      where: {
        id_usu: idUsuario,
        estado_asig: { [Op.in]: ['activa', 'pendiente'] }
      },
      include: [{ model: Cajon, attributes: ['id_caj', 'numero_caj', 'ubicacion_caj'] }]
    });

    if (!asignacion) {
      return res.json({ mensaje: 'No hay cajón asignado', asignacion: null });
    }
    res.json({ mensaje: 'Asignación encontrada', asignacion });
  } catch (error) {
    console.error('Error al obtener asignación:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Asignación manual de cajones
exports.asignacionManual = async (req, res) => {
  const { id_caj, id_usu } = req.body;

  try {
    const cajon = await Cajon.findByPk(id_caj);
    if (!cajon) {
      return res.status(404).json({ mensaje: 'Cajón no encontrado' });
    }

    const asignacionActivaCajon = await Asignacion.findOne({
      where: { id_caj, estado_asig: { [Op.in]: ['activa', 'pendiente'] } }
    });
    if (asignacionActivaCajon) {
      return res.status(400).json({ mensaje: 'El cajón ya está asignado (activo o pendiente)' });
    }

    const asignacionActivaUsuario = await Asignacion.findOne({
      where: { id_usu, estado_asig: { [Op.in]: ['activa', 'pendiente'] } }
    });
    if (asignacionActivaUsuario) {
      return res.status(400).json({ mensaje: 'El usuario ya tiene una asignación activa o pendiente' });
    }

    const nuevaAsignacion = await Asignacion.create({
      id_caj,
      id_usu,
      tipo_asig: 'manual',
      estado_asig: 'pendiente' // siempre pendiente hasta que pase por entrada NFC
    });

    res.status(200).json({ mensaje: 'Cajón asignado como pendiente', asignacion: nuevaAsignacion });
  } catch (error) {
    console.error('Error en asignación manual:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};
