// models/Vehiculo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vehiculo = sequelize.define('Vehiculo', {
  id_veh: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usu: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  marca_veh: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  modelo_veh: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  desc_veh: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  placas_veh: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: true,
  },
  en_uso: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'vehiculos',
  timestamps: false,
});

module.exports = Vehiculo;
