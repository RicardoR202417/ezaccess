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

module.exports = Cajon;
