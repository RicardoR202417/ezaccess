// models/HistorialAsignacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./Usuario');
const Cajon = require('./Cajon');

const HistorialAsignacion = sequelize.define('HistorialAsignacion', {
  id_historial: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_asig: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_usu: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_caj: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_asig: {
    type: DataTypes.DATE,
    allowNull: false
  },
  tipo_asig: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  estado_asig: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  accion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'historial_asignaciones',
  timestamps: false
});

// Relaciones para poder hacer include()
HistorialAsignacion.belongsTo(Usuario, { foreignKey: 'id_usu' });
HistorialAsignacion.belongsTo(Cajon, { 
    as: 'Cajon',
    foreignKey: 'id_caj' 
});

module.exports = HistorialAsignacion;
