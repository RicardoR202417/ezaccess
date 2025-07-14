const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SolicitudVisita = sequelize.define('solicitudes_visita', {
  id_sol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_sol: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  motivo_sol: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado_sol: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'pendiente',
    validate: {
      isIn: [['pendiente', 'aceptada', 'rechazada']]
    }
  },
  fecha_reg_sol: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  tipo_ingreso_sol: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  modelo_veh_sol: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  placas_veh_sol: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  id_usu: { // 👈 NUEVO CAMPO
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios', // nombre de la tabla en la BD
      key: 'id_usu'
    }
  }
}, {
  timestamps: false
});

module.exports = SolicitudVisita;
