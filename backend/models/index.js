const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// Modelos
const Acceso = require('./Acceso');
const SolicitudVisita = require('./SolicitudVisita');
const Cajon = require('./Cajon');
const Actuador = require('./Actuador');
const Sensor = require('./Sensor');
const Asignacion = require('./Asignacion');
const Usuario = require('./Usuario');

// Relaciones
Usuario.hasMany(SolicitudVisita, { foreignKey: 'id_usu' });
SolicitudVisita.belongsTo(Usuario, { foreignKey: 'id_usu' });

Cajon.hasOne(Actuador, { foreignKey: 'id_caj' });
Cajon.hasOne(Sensor, { foreignKey: 'id_caj' });

Actuador.belongsTo(Cajon, { foreignKey: 'id_caj' });
Sensor.belongsTo(Cajon, { foreignKey: 'id_caj' });

// Relación: Una asignación pertenece a un usuario y a un cajón
Asignacion.belongsTo(Usuario, { foreignKey: 'id_usu' });
Asignacion.belongsTo(Cajon, { foreignKey: 'id_caj' });

module.exports = {
  sequelize,
  Usuario,
  Acceso,
  SolicitudVisita,
  Cajon,
  Actuador,
  Sensor,
};