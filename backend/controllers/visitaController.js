const SolicitudVisita = require('../models/SolicitudVisita');

// Crear nueva solicitud
exports.crearSolicitud = async (req, res) => {
  const {
    nombre_sol,
    motivo_sol,
    tipo_ingreso_sol,
    modelo_veh_sol,
    placas_veh_sol
  } = req.body;

  const id_usu = req.usuario?.id; // ID del usuario autenticado (extraído del token)

  if (!id_usu) {
    return res.status(401).json({ mensaje: 'Usuario no autenticado' });
  }

  try {
    const nuevaSolicitud = await SolicitudVisita.create({
      nombre_sol,
      motivo_sol,
      tipo_ingreso_sol,
      modelo_veh_sol,
      placas_veh_sol,
      estado_sol: 'pendiente',
      fecha_reg_sol: new Date(),
      id_usu // ✅ se registra el ID del usuario
    });

    res.status(201).json({
      mensaje: 'Solicitud registrada correctamente',
      solicitud: nuevaSolicitud
    });
  } catch (error) {
    console.error('Error al registrar la solicitud:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Obtener todas las solicitudes (uso administrativo/monitor)
exports.obtenerSolicitudes = async (req, res) => {
  try {
    const solicitudes = await SolicitudVisita.findAll();
    res.json({ solicitudes });
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Obtener solicitudes solo del usuario autenticado
exports.obtenerSolicitudesPorUsuario = async (req, res) => {
  const id_usu = req.usuario?.id;

  if (!id_usu) {
    return res.status(401).json({ mensaje: 'Usuario no autenticado' });
  }

  try {
    const solicitudes = await SolicitudVisita.findAll({
      where: { id_usu }
    });

    res.json({ solicitudes });
  } catch (error) {
    console.error('Error al obtener solicitudes del usuario:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Actualizar el estado de una solicitud (aceptada o rechazada)
exports.actualizarEstado = async (req, res) => {
  const { id } = req.params;
  const { nuevoEstado } = req.body;

  const estadosPermitidos = ['aceptada', 'rechazada'];

  if (!estadosPermitidos.includes(nuevoEstado)) {
    return res.status(400).json({
      mensaje: 'Estado no válido. Solo se permite: aceptada o rechazada'
    });
  }

  try {
    const solicitud = await SolicitudVisita.findByPk(id);

    if (!solicitud) {
      return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
    }

    solicitud.estado_sol = nuevoEstado;
    await solicitud.save();

    res.json({
      mensaje: `Estado actualizado a ${nuevoEstado}`,
      solicitud
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};
