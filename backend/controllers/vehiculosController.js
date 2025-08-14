// controllers/vehiculosController.js
const { Sequelize } = require('sequelize');
const Vehiculo = require('../models/Vehiculo');
const sequelize = require('../config/db');

// ✅ Crear nuevo vehículo (máx. 3 por usuario; si es el primero, se marca activo opcionalmente)
const crearVehiculo = async (req, res) => {
  try {
    const { id_usu, marca_veh, modelo_veh, desc_veh, placas_veh } = req.body;

    if (!id_usu || !marca_veh || !modelo_veh || !placas_veh) {
      return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    // Regla: máximo 3 vehículos por usuario
    const totalUsuario = await Vehiculo.count({ where: { id_usu } });
    if (totalUsuario >= 3) {
      return res.status(409).json({ error: 'Límite alcanzado: máximo 3 vehículos por usuario.' });
    }

    // Opcional: si no tiene vehículos, crear el primero como activo
    const en_uso = totalUsuario === 0;

    const nuevoVehiculo = await Vehiculo.create({
      id_usu,
      marca_veh,
      modelo_veh,
      desc_veh,
      placas_veh,
      en_uso,
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

    const vehiculos = await Vehiculo.findAll({
      where: { id_usu },
      order: [['id_veh', 'ASC']],
    });

    res.json(vehiculos);
  } catch (error) {
    console.error('❌ Error al obtener vehículos:', error);
    res.status(500).json({ error: 'Error del servidor al obtener vehículos.' });
  }
};

// ✅ Activar un vehículo (deja solo 1 activo por usuario, desactiva los demás)
// Puedes mantener esta ruta como /en-uso o /:id/activar; aquí dejo ambas soportadas.
const activarVehiculo = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id_veh = req.params.id || req.body.id_veh;

    if (!id_veh) {
      await t.rollback();
      return res.status(400).json({ mensaje: 'ID del vehículo requerido' });
    }

    const vehiculo = await Vehiculo.findByPk(id_veh, { transaction: t });
    if (!vehiculo) {
      await t.rollback();
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    const id_usu = vehiculo.id_usu;

    // Desactivar todos los vehículos del usuario
    await Vehiculo.update(
      { en_uso: false },
      { where: { id_usu }, transaction: t }
    );

    // Activar el seleccionado
    vehiculo.en_uso = true;
    await vehiculo.save({ transaction: t });

    await t.commit();
    res.json({ mensaje: 'Vehículo activado correctamente', vehiculo });
  } catch (error) {
    console.error('❌ Error al activar vehículo:', error.message);
    await t.rollback();
    res.status(500).json({ mensaje: 'Error interno al activar vehículo' });
  }
};

// ✏️ Actualizar vehículo (no altera en_uso a menos que lo envíes explícito)
const actualizarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    // Evitar que por accidente envíen en_uso=true a varios; usar el endpoint de activar
    if (typeof datos.en_uso !== 'undefined') {
      delete datos.en_uso;
    }

    await vehiculo.update(datos);
    res.json({ mensaje: 'Vehículo actualizado', vehiculo });
  } catch (error) {
    console.error('❌ Error al actualizar vehículo:', error.message);
    res.status(500).json({ mensaje: 'Error interno al actualizar vehículo' });
  }
};

// ❌ Eliminar vehículo (si es el activo, no se reasigna automáticamente)
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

module.exports = {
  crearVehiculo,
  listarVehiculosPorUsuario,
  activarVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
};
