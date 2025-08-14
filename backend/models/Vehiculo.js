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
    allowNull: false,
  },
  modelo_veh: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  desc_veh: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  placas_veh: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  en_uso: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'vehiculos',
  timestamps: false,
});

module.exports = Vehiculo;
