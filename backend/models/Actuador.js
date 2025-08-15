const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Actuador = sequelize.define('Actuador', {
  id_act: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_caj: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'cajones', key: 'id_caj' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  tipo: {
    type: DataTypes.ENUM('pluma_entrada', 'pluma_salida', 'tope'),
    allowNull: false,
  },
  gpio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  estado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { isIn: [[0, 1]] },
  },
}, {
  tableName: 'actuadores',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['id_caj', 'tipo'] },
  ],
});

// ✅ Solo UNA VEZ y con un alias que no choque
Actuador.associate = (models) => {
  Actuador.belongsTo(models.Cajon, {
    foreignKey: 'id_caj',
    as: 'cajonAsociado', // ✅ nuevo alias, evita el conflicto
  });
};



module.exports = Actuador;
