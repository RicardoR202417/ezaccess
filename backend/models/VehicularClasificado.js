// models/VehicularClasificado.js
module.exports = (sequelize, DataTypes) => {
  const VehicularClasificado = sequelize.define(
    'VehicularClasificado',
    {
      id_usu: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      nombre_usu: {
        type: DataTypes.STRING
      },
      total_solicitudes: {
        type: DataTypes.INTEGER
      },
      vehiculares: {
        type: DataTypes.INTEGER
      },
      porcentaje_vehicular: {
        // Si en la vista lo declaraste NUMERIC(5,2) o similar, usa DECIMAL
        type: DataTypes.DECIMAL(10, 2)
      },
      clasificacion_vehicular: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'v_vehicular_clasificado',
      timestamps: false,
      freezeTableName: true
    }
  );

  // Es una vista (solo lectura): evita operaciones de escritura
  VehicularClasificado.removeAttribute('id'); // nos aseguramos de que no agregue "id" artificial

  return VehicularClasificado;
};
