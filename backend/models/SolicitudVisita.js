const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SolicitudVisita = sequelize.define('SolicitudVisita', {
  id_sol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_sol: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido_pat_sol: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  apellido_mat_sol: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  tel_sol: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  correo_sol: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  fecha_visita_sol: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  motivo_sol: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estado_sol: {
    type: DataTypes.ENUM('pendiente', 'aceptada', 'rechazada'),
    defaultValue: 'pendiente',
  },
  fecha_reg_sol: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'solicitudes_visita',
  timestamps: false,
});

module.exports = SolicitudVisita;
