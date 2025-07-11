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

  try {
    const nuevaSolicitud = await SolicitudVisita.create({
      nombre_sol,
      motivo_sol,
      tipo_ingreso_sol,
      modelo_veh_sol,
      placas_veh_sol,
      estado_sol: 'pendiente',
      fecha_reg_sol: new Date()
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

// Obtener todas las solicitudes
exports.obtenerSolicitudes = async (req, res) => {
  try {
    const solicitudes = await SolicitudVisita.findAll();
    res.json({ solicitudes });
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Actualizar el estado de una solicitud
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
