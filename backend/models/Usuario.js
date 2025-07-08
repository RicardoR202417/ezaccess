const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  id_usu: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_usu: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido_pat_usu: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido_mat_usu: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  fecha_nac_usu: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  tipo_usu: {
    type: DataTypes.ENUM('residente', 'visitante', 'monitor', 'administrador'),
    allowNull: false,
  },
  tel_usu: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  correo_usu: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
  },
  pass_usu: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  ciudad_usu: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  colonia_usu: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  calle_usu: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  num_ext_usu: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  codigo_nfc_usu: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true,
  },
  estado_usu: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    allowNull: true,
    defaultValue: 'activo',
  },
  fecha_reg_usu: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'usuarios',
  timestamps: false,
  freezeTableName: true,
});

module.exports = Usuario;
