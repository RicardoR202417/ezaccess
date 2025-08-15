const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cajon = sequelize.define('Cajon', { // <-- Nombre del modelo en singular
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
  tableName: 'cajones', // <-- Nombre real de la tabla
  timestamps: false,
});


Cajon.associate = (models) => {
  Cajon.hasOne(models.Actuador, { foreignKey: 'id_caj', as: 'actuadorTope' });
  Cajon.hasOne(models.Actuador, { foreignKey: 'id_caj', as: 'actuadorPluma' });
};


module.exports = Cajon;
