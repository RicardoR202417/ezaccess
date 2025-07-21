const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// Modelos
const Usuario = require('./Usuario');
const Acceso = require('./Acceso');
const SolicitudVisita = require('./SolicitudVisita');
const Cajon = require('./Cajon');
const Actuador = require('./Actuador');
const Sensor = require('./Sensor');

// Relaciones existentes
Usuario.hasMany(SolicitudVisita, { foreignKey: 'id_usu' });
SolicitudVisita.belongsTo(Usuario, { foreignKey: 'id_usu' });

// Relaciones nuevas para vista de cajones
Cajon.hasOne(Actuador, { foreignKey: 'id_caj' });
Cajon.hasOne(Sensor, { foreignKey: 'id_caj' });

Actuador.belongsTo(Cajon, { foreignKey: 'id_caj' });
Sensor.belongsTo(Cajon, { foreignKey: 'id_caj' });

module.exports = {
  sequelize,
  Usuario,
  Acceso,
  SolicitudVisita,
  Cajon,
  Actuador,
  Sensor,
};