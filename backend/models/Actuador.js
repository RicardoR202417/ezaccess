// models/Actuador.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Actuador = sequelize.define('Actuador', {
    id_act: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // FK -> cajones.id_caj
    id_caj: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'cajones', key: 'id_caj' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    // 'pluma_entrada' | 'pluma_salida' | 'tope'
    tipo: {
      type: DataTypes.ENUM('pluma_entrada', 'pluma_salida', 'tope'),
      allowNull: false,
    },

    // GPIO en el ESP32 que controla el actuador
    gpio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Estado lógico guardado por backend (por si se consulta desde web)
    // 0 = cerrado/bloqueado | 1 = abierto/liberado
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isIn: [[0, 1]] },
    },

    // (Opcional) para telemetría o UI
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  }, {
    tableName: 'actuadores',
    timestamps: true,
    indexes: [
      // Evita dos actuadores del mismo tipo en el mismo cajón
      { unique: true, fields: ['id_caj', 'tipo'] },
    ],
  });

  Actuador.associate = (models) => {
    Actuador.belongsTo(models.Cajon, {
      foreignKey: 'id_caj',
      as: 'cajon',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Actuador;
};
