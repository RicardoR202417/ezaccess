const Vehiculo = require('../models/Vehiculo');

// ✅ Crear nuevo vehículo
const crearVehiculo = async (req, res) => {
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
const listarVehiculosPorUsuario = async (req, res) => {
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

// ✅ Marcar un vehículo como en uso
const marcarEnUso = async (req, res) => {
  try {
    const { id_veh } = req.body;

    if (!id_veh) {
      return res.status(400).json({ mensaje: 'ID del vehículo requerido' });
    }

    const vehiculo = await Vehiculo.findByPk(id_veh);
    if (!vehiculo) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    vehiculo.en_uso = true;
    await vehiculo.save();

    res.json({ mensaje: 'Vehículo marcado como en uso', vehiculo });
  } catch (error) {
    console.error('❌ Error al marcar vehículo en uso:', error.message);
    res.status(500).json({ mensaje: 'Error interno al actualizar vehículo' });
  }
};

// ✏️ Actualizar vehículo
const actualizarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    await vehiculo.update(datos);
    res.json({ mensaje: 'Vehículo actualizado', vehiculo });
  } catch (error) {
    console.error('❌ Error al actualizar vehículo:', error.message);
    res.status(500).json({ mensaje: 'Error interno al actualizar vehículo' });
  }
};

// ❌ Eliminar vehículo
const eliminarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;

    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    await vehiculo.destroy();
    res.json({ mensaje: 'Vehículo eliminado' });
  } catch (error) {
    console.error('❌ Error al eliminar vehículo:', error.message);
    res.status(500).json({ mensaje: 'Error interno al eliminar vehículo' });
  }
};

// ✅ Exportar todas las funciones correctamente
module.exports = {
  crearVehiculo,
  listarVehiculosPorUsuario,
  marcarEnUso,
  actualizarVehiculo,
  eliminarVehiculo
};
