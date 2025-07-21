const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cajon = sequelize.define('cajones', {
  id_caj: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  numero_caj: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  ubicacion_caj: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  timestamps: false,
});

// Relaciona este modelo con los demás (uno a uno)
const Actuador = require('./Actuador');
const Sensor = require('./Sensor');

Cajon.hasOne(Actuador, { foreignKey: 'id_caj' });
Cajon.hasOne(Sensor, { foreignKey: 'id_caj' });

module.exports = Cajon;
