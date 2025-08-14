const { Asignacion, Usuario, Cajon, Actuador, Sensor, sequelize } = require('../models');
const { Op } = require('sequelize'); // <- asegurarnos que está importado

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

// NUEVA FUNCIÓN: Asignación automática usando stored procedure
exports.asignacionAutomatica = async (req, res) => {
  const { id_usu } = req.body;
  if (!id_usu) {
    return res.status(400).json({ mensaje: 'Falta el id de usuario' });
  }

  try {
    // Llama al procedimiento almacenado
    await sequelize.query('CALL asignar_cajon_automatico(:p_id_usu)', {
      replacements: { p_id_usu: id_usu }
    });

    // Busca la nueva asignación activa creada
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
      // No hubo asignación nueva (ya tenía una o no hay disponibles)
      return res.status(200).json({ mensaje: 'No se pudo asignar cajón (ya tiene uno o no hay disponibles)' });
    }
  } catch (error) {
    console.error('Error en asignación automática:', error);
    return res.status(500).json({ mensaje: 'Error en asignación automática', error: error.message });
  }
};

// Obtener la asignación activa de un usuario
exports.obtenerAsignacionActivaPorUsuario = async (req, res) => {
  const { id_usu } = req.params;
  try {
    const asignacion = await Asignacion.findOne({
      where: { id_usu, estado_asig: 'activa' },
      include: [
        { model: Cajon, attributes: ['id_caj', 'numero_caj', 'ubicacion_caj'] }
      ]
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

// NUEVA FUNCIÓN: Asignación manual de cajones


exports.asignacionManual = async (req, res) => {
  const { id_caj, id_usu, estado_asig } = req.body;

  console.log("Body recibido en asignacionManual:", req.body);

  try {
    // Verificar que el cajón exista
    const cajon = await Cajon.findByPk(id_caj);
    if (!cajon) {
      return res.status(404).json({ mensaje: 'Cajón no encontrado' });
    }

    // Verificar que el cajón no esté asignado en estado activa o pendiente
    const asignacionActivaCajon = await Asignacion.findOne({
      where: { id_caj, estado_asig: ['activa', 'pendiente'] }
    });
    if (asignacionActivaCajon) {
      return res.status(400).json({ mensaje: 'El cajón ya está asignado (activo o pendiente)' });
    }

    // Verificar que el usuario no tenga una asignación en estado activa o pendiente
    const asignacionActivaUsuario = await Asignacion.findOne({
      where: { id_usu, estado_asig: ['activa', 'pendiente'] }
    });
    if (asignacionActivaUsuario) {
      return res.status(400).json({ mensaje: 'El usuario ya tiene una asignación activa o pendiente' });
    }

    // Crear nueva asignación con estado recibido o "activa" por defecto
 await Asignacion.create({
  id_caj,
  id_usu,
  tipo_asig: 'manual',
  estado_asig: 'pendiente'
});


    // Si es activa, cambiar estado del cajón a ocupado
    if ((estado_asig || 'activa') === 'activa') {
      await Cajon.update({ estado_caj: 'ocupado' }, { where: { id_caj } });
    }

    res.status(200).json({ mensaje: 'Cajón asignado correctamente', asignacion: nuevaAsignacion });
  } catch (error) {
    console.error('Error en asignación manual:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};