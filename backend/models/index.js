const Sequelize = require("sequelize");
const sequelize = require("../config/db");

// Modelos
const Usuario = require("./Usuario");
const Cajon = require("./Cajon");
const Actuador = require("./Actuador");
const Sensor = require("./Sensor");
const SolicitudVisita = require("./SolicitudVisita");
const Asignacion = require("./Asignacion");
const Acceso = require("./Acceso");
const HistorialAsignacion = require("./HistorialAsignacion");

// Relaciones entre modelos
Usuario.hasMany(SolicitudVisita, { foreignKey: "id_usu" });
SolicitudVisita.belongsTo(Usuario, { foreignKey: "id_usu" });

Cajon.hasOne(Actuador, { foreignKey: "id_caj" });
Cajon.hasOne(Sensor, { foreignKey: "id_caj" });
Actuador.belongsTo(Cajon, { foreignKey: "id_caj" });
Sensor.belongsTo(Cajon, { foreignKey: "id_caj" });

Asignacion.belongsTo(Usuario, { foreignKey: "id_usu" });
Asignacion.belongsTo(Cajon, { foreignKey: "id_caj" });
// ← RELACIÓN QUE FALTABA:
Cajon.hasMany(Asignacion, { foreignKey: "id_caj" });

Usuario.hasMany(HistorialAsignacion, { foreignKey: "id_usu" });
HistorialAsignacion.belongsTo(Usuario, { foreignKey: "id_usu" });

Cajon.hasMany(HistorialAsignacion, { foreignKey: "id_caj" });
HistorialAsignacion.belongsTo(Cajon, { 
  as: 'cajon',
  foreignKey: "id_caj" });

module.exports = {
  sequelize, // NECESARIO para controladores personalizados
  Usuario,
  Cajon,
  Actuador,
  Sensor,
  SolicitudVisita,
  Asignacion,
  Acceso,
  HistorialAsignacion,
};
