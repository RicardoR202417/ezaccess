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

// Relaciones
Usuario.hasMany(SolicitudVisita, { foreignKey: "id_usu" });
SolicitudVisita.belongsTo(Usuario, { foreignKey: "id_usu" });

Cajon.hasOne(Actuador, { foreignKey: "id_caj", as: "actuadorPluma" }); // Entrada o salida
Cajon.hasOne(Actuador, { foreignKey: "id_caj", as: "actuadorTope" });  // Tope
Cajon.hasOne(Sensor,   { foreignKey: "id_caj" });

Actuador.belongsTo(Cajon, { foreignKey: "id_caj", as: "cajon" });
Sensor.belongsTo(Cajon,   { foreignKey: "id_caj" });

Asignacion.belongsTo(Usuario, { foreignKey: "id_usu" });
Asignacion.belongsTo(Cajon,   { foreignKey: "id_caj" });
Cajon.hasMany(Asignacion,    { foreignKey: "id_caj" });

Usuario.hasMany(HistorialAsignacion, { foreignKey: "id_usu" });
HistorialAsignacion.belongsTo(Usuario, { foreignKey: "id_usu" });

Cajon.hasMany(HistorialAsignacion, { foreignKey: "id_caj" });
HistorialAsignacion.belongsTo(Cajon, { foreignKey: "id_caj" });

// Asociaciones explícitas si existen métodos associate
if (Cajon.associate) Cajon.associate({ Actuador, Sensor });
if (Actuador.associate) Actuador.associate({ Cajon });
if (Sensor.associate) Sensor.associate?.({ Cajon }); // Opcional

// Exportar
module.exports = {
  sequelize,
  Usuario,
  Cajon,
  Actuador,
  Sensor,
  SolicitudVisita,
  Asignacion,
  Acceso,
  HistorialAsignacion,
};
