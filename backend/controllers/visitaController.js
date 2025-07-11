const SolicitudVisita = require('../models/SolicitudVisita');

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
