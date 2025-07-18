const SolicitudVisita = require('../models/SolicitudVisita');

// Crear nueva solicitud
exports.crearSolicitud = async (req, res) => {
  try {
    const {
      nombre_sol,
      motivo_sol,
      tipo_ingreso_sol,
      modelo_veh_sol,
      placas_veh_sol
    } = req.body;

    const id_usu = req.usuario?.id;

    if (!id_usu) {
      return res.status(401).json({ mensaje: 'Usuario no autenticado (sin ID)' });
    }

    const nuevaSolicitud = await SolicitudVisita.create({
      nombre_sol,
      motivo_sol,
      tipo_ingreso_sol,
      modelo_veh_sol,
      placas_veh_sol,
      estado_sol: 'pendiente',
      fecha_reg_sol: new Date(),
      id_usu
    });

    return res.status(201).json({
      mensaje: 'Solicitud registrada correctamente',
      solicitud: nuevaSolicitud
    });

  } catch (error) {
    console.error('❌ Error al registrar la solicitud:', error);
    return res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Obtener TODAS las solicitudes (para monitor)
exports.obtenerSolicitudes = async (req, res) => {
  try {
    const solicitudes = await SolicitudVisita.findAll({
      order: [['fecha_reg_sol', 'DESC']]
    });
    return res.json({ solicitudes });
  } catch (error) {
    console.error('❌ Error al obtener solicitudes:', error);
    return res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Obtener solicitudes del usuario autenticado
exports.obtenerSolicitudesPorUsuario = async (req, res) => {
  try {
    const id_usu = req.usuario?.id;
    console.log('ID usuario recibido:', id_usu); // <-- AQUÍ

    if (!id_usu) {
      return res.status(401).json({ mensaje: 'Usuario no autenticado (sin ID)' });
    }

    const solicitudes = await SolicitudVisita.findAll({
      where: { id_usu },
      order: [['fecha_reg_sol', 'DESC']]
    });

    console.log('Solicitudes encontradas:', solicitudes); // <-- Opcional, para ver qué trae la consulta

    return res.json({ solicitudes });

  } catch (error) {
    console.error('❌ Error al obtener solicitudes del usuario:', error);
    return res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Actualizar estado de una solicitud
exports.actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoEstado } = req.body;

    const estadosPermitidos = ['aceptada', 'rechazada'];

    if (!estadosPermitidos.includes(nuevoEstado)) {
      return res.status(400).json({
        mensaje: 'Estado no válido. Usa "aceptada" o "rechazada".'
      });
    }

    const solicitud = await SolicitudVisita.findByPk(id);

    if (!solicitud) {
      return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
    }

    solicitud.estado_sol = nuevoEstado;
    await solicitud.save();

    return res.json({
      mensaje: `Estado actualizado a ${nuevoEstado}`,
      solicitud
    });

  } catch (error) {
    console.error('❌ Error al actualizar estado:', error);
    return res.status(500).json({ mensaje: 'Error del servidor' });
  }
};
