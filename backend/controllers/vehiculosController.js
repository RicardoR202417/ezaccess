// controllers/vehiculosController.js
const Vehiculo = require('../models/Vehiculo');
const sequelize = require('../config/db');

// Crear vehículo (máximo 3 por usuario, primero va en uso)
const crearVehiculo = async (req, res) => {
  try {
    const { id_usu, marca_veh, modelo_veh, desc_veh, placas_veh } = req.body;
    if (!id_usu || !marca_veh || !modelo_veh || !placas_veh) {
      return res.status(400).json({ error: 'Datos incompletos.' });
    }

    const count = await Vehiculo.count({ where: { id_usu } });
    if (count >= 3) {
      return res.status(409).json({ error: 'Límite de vehículos alcanzado.' });
    }

    const nuevo = await Vehiculo.create({
      id_usu,
      marca_veh,
      modelo_veh,
      desc_veh,
      placas_veh,
      en_uso: count === 0,
    });

    res.status(201).json({ mensaje: 'Vehículo creado', vehiculo: nuevo });
  } catch (error) {
    console.error('❌ Crear:', error.message);
    res.status(500).json({ error: 'Error interno al crear vehículo.' });
  }
};

// Listar vehículos por usuario
const listarVehiculos = async (req, res) => {
  try {
    const { id_usu } = req.params;
    const vehiculos = await Vehiculo.findAll({
      where: { id_usu },
      order: [['id_veh', 'ASC']],
    });
    res.json(vehiculos);
  } catch (error) {
    console.error('❌ Listar:', error.message);
    res.status(500).json({ error: 'Error al obtener vehículos.' });
  }
};

// Activar vehículo y desactivar los demás
const activarVehiculo = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id_veh = req.params.id || req.body.id_veh;
    if (!id_veh) {
      await t.rollback();
      return res.status(400).json({ mensaje: 'ID requerido.' });
    }

    const vehiculo = await Vehiculo.findByPk(id_veh, { transaction: t });
    if (!vehiculo) {
      await t.rollback();
      return res.status(404).json({ mensaje: 'Vehículo no encontrado.' });
    }

    await Vehiculo.update(
      { en_uso: false },
      { where: { id_usu: vehiculo.id_usu }, transaction: t }
    );

    vehiculo.en_uso = true;
    await vehiculo.save({ transaction: t });

    await t.commit();

    const actualizado = await Vehiculo.findByPk(id_veh); // vuelve a consultarlo
    res.json({ mensaje: 'Vehículo activado', vehiculo: actualizado });
  } catch (error) {
    await t.rollback();
    console.error('❌ Activar:', error.message);
    res.status(500).json({ mensaje: 'Error al activar vehículo.' });
  }
};

// Eliminar
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
    console.error('❌ Eliminar:', error.message);
    res.status(500).json({ mensaje: 'Error al eliminar vehículo.' });
  }
};

module.exports = {
  crearVehiculo,
  listarVehiculos,
  activarVehiculo,
  eliminarVehiculo,
};
