// models/index.js
const Sequelize = require("sequelize");
const sequelize = require("../config/db");

// ====== Modelos ======
const Usuario             = require("./Usuario");
const Cajon               = require("./Cajon");
const Actuador            = require("./Actuador");
const Sensor              = require("./Sensor");
const SolicitudVisita     = require("./SolicitudVisita");
const Asignacion          = require("./Asignacion");
const Acceso              = require("./Acceso");
const HistorialAsignacion = require("./HistorialAsignacion");

// (Opcional, si existe en tu proyecto)
let Vehiculo;
try {
  Vehiculo = require("./Vehiculo");
} catch (_) {
  // Ignora si no existe; no es crítico para reportes
}

// ====== Relaciones entre modelos ======

// Usuario ↔ SolicitudVisita
Usuario.hasMany(SolicitudVisita, { foreignKey: "id_usu" });
SolicitudVisita.belongsTo(Usuario, { foreignKey: "id_usu" });

// Cajon ↔ Sensor (1 a 1)
Cajon.hasOne(Sensor, { foreignKey: "id_caj" });
Sensor.belongsTo(Cajon, { foreignKey: "id_caj" });

// Cajon ↔ Actuador (1 a 1)
Cajon.hasOne(Actuador, { foreignKey: "id_caj" });
Actuador.belongsTo(Cajon, { foreignKey: "id_caj" });

// Usuario ↔ Asignacion (1 a N)
Usuario.hasMany(Asignacion, { foreignKey: "id_usu" });
Asignacion.belongsTo(Usuario, { foreignKey: "id_usu" });

// Cajon ↔ Asignacion (1 a N)
Cajon.hasMany(Asignacion, { foreignKey: "id_caj" });
Asignacion.belongsTo(Cajon,   { foreignKey: "id_caj" });

// Usuario ↔ Acceso (1 a N)
Usuario.hasMany(Acceso, { foreignKey: "id_usu" });
Acceso.belongsTo(Usuario, { foreignKey: "id_usu" });

// Cajon ↔ Acceso (1 a N)
Cajon.hasMany(Acceso, { foreignKey: "id_caj" });
Acceso.belongsTo(Cajon, { foreignKey: "id_caj" });

// Usuario ↔ HistorialAsignacion (1 a N)
Usuario.hasMany(HistorialAsignacion, { foreignKey: "id_usu" });
HistorialAsignacion.belongsTo(Usuario, { foreignKey: "id_usu" });

// Cajon ↔ HistorialAsignacion (1 a N)
Cajon.hasMany(HistorialAsignacion, { foreignKey: "id_caj" });
HistorialAsignacion.belongsTo(Cajon, { foreignKey: "id_caj" });

// ====== Ejecutar métodos associate si existen (definidos en cada modelo) ======
if (Cajon.associate)     Cajon.associate({ Actuador, Sensor, Asignacion, Acceso, HistorialAsignacion });
if (Actuador.associate)  Actuador.associate({ Cajon });
if (Sensor.associate)    Sensor.associate({ Cajon });
if (Asignacion.associate) Asignacion.associate({ Usuario, Cajon });
if (Acceso.associate)    Acceso.associate({ Usuario, Cajon });
if (Usuario.associate)   Usuario.associate({ SolicitudVisita, Asignacion, Acceso, HistorialAsignacion });
if (HistorialAsignacion.associate) HistorialAsignacion.associate({ Usuario, Cajon });
if (Vehiculo && Vehiculo.associate) Vehiculo.associate({ Usuario }); // solo si aplica en tu dominio

// ====== Exportar ======
module.exports = {
  sequelize,
  Sequelize, // útil para DataTypes, Op, etc. cuando se importe desde '../models'
  Usuario,
  Cajon,
  Actuador,
  Sensor,
  SolicitudVisita,
  Asignacion,
  Acceso,
  HistorialAsignacion,
  ...(Vehiculo ? { Vehiculo } : {}),
};
