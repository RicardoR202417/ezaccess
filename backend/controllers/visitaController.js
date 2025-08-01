// Crear nueva solicitud
exports.crearSolicitud = async (req, res) => {
  try {
    const {
      nombre_sol,
      motivo_sol,
      tipo_ingreso_sol,
      modelo_veh_sol,
      placas_veh_sol,
      fecha_visita_sol // 👈 nuevo campo capturado desde req.body
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
      fecha_visita_sol, // 👈 se guarda en BD
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

module.exports = {
  crearSolicitud,
  obtenerSolicitudes,
  actualizarEstado,
  obtenerSolicitudesPorUsuario
};
