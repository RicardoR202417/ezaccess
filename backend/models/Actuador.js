const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Actuador = sequelize.define('actuadores', {
  id_act: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo_act: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  estado_act: {
    type: DataTypes.TEXT,
    defaultValue: 'bloqueado',
    validate: {
      isIn: [['liberado', 'bloqueado']],
    },
  },
  fecha_actualizacion_act: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  id_caj: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = Actuador;
