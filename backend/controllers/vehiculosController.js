const Vehiculo = require('../models/Vehiculo');

// ✅ Crear nuevo vehículo
exports.crearVehiculo = async (req, res) => {
  try {
    const { id_usu, marca_veh, modelo_veh, desc_veh, placas_veh } = req.body;

    if (!id_usu || !marca_veh || !modelo_veh || !placas_veh) {
      return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    const nuevoVehiculo = await Vehiculo.create({
      id_usu,
      marca_veh,
      modelo_veh,
      desc_veh,
      placas_veh,
    });

    res.status(201).json({ mensaje: 'Vehículo registrado correctamente.', vehiculo: nuevoVehiculo });
  } catch (error) {
    console.error('❌ Error al registrar vehículo:', error);
    res.status(500).json({ error: 'Error del servidor al registrar vehículo.' });
  }
};

// 🔍 Obtener todos los vehículos de un usuario
exports.listarVehiculosPorUsuario = async (req, res) => {
  try {
    const { id_usu } = req.params;
    if (!id_usu) {
      return res.status(400).json({ error: 'ID de usuario requerido.' });
    }

    const vehiculos = await Vehiculo.findAll({ where: { id_usu } });

    res.json(vehiculos);
  } catch (error) {
    console.error('❌ Error al obtener vehículos:', error);
    res.status(500).json({ error: 'Error del servidor al obtener vehículos.' });
  }
};
