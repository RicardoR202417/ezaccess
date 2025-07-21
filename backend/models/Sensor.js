const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Cajon = require('./Cajon');

const Sensor = sequelize.define('sensores', {
  id_sen: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo_sen: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  estado_sen: {
    type: DataTypes.TEXT,
    defaultValue: 'activo',
    validate: {
      isIn: [['activo', 'inactivo']],
    },
  },
  fecha_lectura_sen: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  id_caj: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cajon,
      key: 'id_caj',
    },
  },
}, {
  timestamps: false,
});

// Relación (uno a uno)
Sensor.belongsTo(Cajon, { foreignKey: 'id_caj' });

module.exports = Sensor;
