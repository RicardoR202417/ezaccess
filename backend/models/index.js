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

// 👇 Nuevo modelo (reutilizado): Actuador para tope
const ActuadorTope = Actuador; // Se usará una entrada más en la tabla `actuadores`

// Relaciones entre modelos
Usuario.hasMany(SolicitudVisita, { foreignKey: "id_usu" });
SolicitudVisita.belongsTo(Usuario, { foreignKey: "id_usu" });

Cajon.hasOne(Actuador, { foreignKey: "id_caj", as: "actuadorPluma" }); // ← Actuador normal
Cajon.hasOne(Sensor, { foreignKey: "id_caj" });
Cajon.hasOne(Actuador, { foreignKey: "id_caj", as: "actuadorTope" }); // ← NUEVO: actuador del tope

Actuador.belongsTo(Cajon, { foreignKey: "id_caj" });
Sensor.belongsTo(Cajon, { foreignKey: "id_caj" });

Asignacion.belongsTo(Usuario, { foreignKey: "id_usu" });
Asignacion.belongsTo(Cajon, { foreignKey: "id_caj" });
Cajon.hasMany(Asignacion, { foreignKey: "id_caj" });

Usuario.hasMany(HistorialAsignacion, { foreignKey: "id_usu" });
HistorialAsignacion.belongsTo(Usuario, { foreignKey: "id_usu" });

Cajon.hasMany(HistorialAsignacion, { foreignKey: "id_caj" });
HistorialAsignacion.belongsTo(Cajon, { foreignKey: "id_caj" });

module.exports = {
  sequelize, // Necesario para controladores personalizados
  Usuario,
  Cajon,
  Actuador,
  ActuadorTope, // Exportación opcional para usarse directamente
  Sensor,
  SolicitudVisita,
  Asignacion,
  Acceso,
  HistorialAsignacion,
};
