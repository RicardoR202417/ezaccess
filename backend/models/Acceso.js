const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Acceso = sequelize.define('Acceso', {
  id_acc: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usu: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_caj: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_ent_acc: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_sal_acc: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'accesos',
  timestamps: false,
  freezeTableName: true
});

module.exports = Acceso;
