const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Usuario = require('./Usuario');
const Acceso = require('./Acceso');
const SolicitudVisita = require('./SolicitudVisita');

// Relación: Un usuario tiene muchas solicitudes de visita
Usuario.hasMany(SolicitudVisita, { foreignKey: 'id_usu' });
SolicitudVisita.belongsTo(Usuario, { foreignKey: 'id_usu' });

module.exports = {
  Usuario,
  Acceso,
  SolicitudVisita
};

