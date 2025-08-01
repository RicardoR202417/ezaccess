const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Asignacion = sequelize.define('Asignacion', {
  id_asig: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usu: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_caj: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_asig: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  tipo_asig: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      isIn: [['manual', 'automatica']],
    },
  },
  estado_asig: {
    type: DataTypes.TEXT,
    defaultValue: 'activa',
    validate: {
      isIn: [['activa', 'finalizada']],
    },
  },
}, {
  tableName: 'asignaciones',
  timestamps: false,
});

module.exports = Asignacion;
