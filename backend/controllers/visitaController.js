const SolicitudVisita = require('../models/SolicitudVisita');

exports.crearSolicitud = async (req, res) => {
  const { nombre_sol, motivo_sol } = req.body;

  try {
    const nuevaSolicitud = await SolicitudVisita.create({ nombre_sol, motivo_sol });
    res.status(201).json({
      mensaje: 'Solicitud registrada exitosamente',
      solicitud: nuevaSolicitud,
    });
  } catch (error) {
    console.error('Error al registrar la solicitud:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};
