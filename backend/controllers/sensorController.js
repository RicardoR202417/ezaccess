const Sensor = require('../models/Sensor');

// Obtener un sensor específico
exports.obtenerSensor = async (req, res) => {
  try {
    const sensor = await Sensor.findByPk(req.params.id);
    if (!sensor) {
      return res.status(404).json({ mensaje: 'Sensor no encontrado' });
    }
    res.json(sensor);
  } catch (error) {
    console.error('Error al obtener sensor:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Cambiar el estado del sensor (activo/inactivo)
exports.cambiarEstado = async (req, res) => {
  const { estado_sen } = req.body;

  if (!['activo', 'inactivo'].includes(estado_sen)) {
    return res.status(400).json({ mensaje: 'Estado inválido' });
  }

  try {
    const sensor = await Sensor.findByPk(req.params.id);
    if (!sensor) {
      return res.status(404).json({ mensaje: 'Sensor no encontrado' });
    }

    sensor.estado_sen = estado_sen;
    sensor.fecha_lectura_sen = new Date();
    await sensor.save();

    res.json({ mensaje: `Sensor actualizado a ${estado_sen}`, sensor });
  } catch (error) {
    console.error('Error al cambiar el estado del sensor:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};
