// =====================================================================
// EZ ACCESS - Modelo NoSQL en MongoDB (colecciones + validadores + índices)
// =====================================================================

// 1) Selecciona / crea la BD
use ez_access;

// Helper corto para validar fechas ISO
const isodate = (s) => new Date(s);

// -------------------------------
// 2) Colección: entradas
// -------------------------------
db.createCollection("entradas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["cajon", "fecha_hora", "id_usu", "nombre_usu"],
      properties: {
        cajon:       { bsonType: "string",  description: "Código del cajón (p.ej. 'C1')." },
        fecha_hora:  { bsonType: "date",    description: "Fecha/hora del evento." },
        id_usu:      { bsonType: "int",     description: "ID de usuario (relacional)." },
        nombre_usu:  { bsonType: "string",  description: "Nombre mostrado del usuario." }
      },
      additionalProperties: false
    }
  }
});

// Índices recomendados
db.entradas.createIndex({ fecha_hora: -1 });
db.entradas.createIndex({ id_usu: 1, fecha_hora: -1 });

// Datos ejemplo (opcional)
db.entradas.insertMany([
  {
    cajon: "C1",
    fecha_hora: isodate("2025-08-13T21:01:46-06:00"),
    id_usu: 20,
    nombre_usu: "Reed"
  }
]);

// -------------------------------
// 3) Colección: salidas
// -------------------------------
db.createCollection("salidas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["cajon", "fecha_hora", "id_usu", "nombre_usu"],
      properties: {
        cajon:       { bsonType: "string" },
        fecha_hora:  { bsonType: "date" },
        id_usu:      { bsonType: "int" },
        nombre_usu:  { bsonType: "string" }
      },
      additionalProperties: false
    }
  }
});

db.salidas.createIndex({ fecha_hora: -1 });
db.salidas.createIndex({ id_usu: 1, fecha_hora: -1 });

db.salidas.insertMany([
  {
    cajon: "C1",
    fecha_hora: isodate("2025-08-15T09:37:38-06:00"),
    id_usu: 25,
    nombre_usu: "Yara"
  }
]);

// -------------------------------
// 4) Colección: alertas  (EVENTOS IoT / backend)
// -------------------------------
// Nota: Esta colección modela eventos de error/diagnóstico generados por el
//      dispositivo IoT (lector NFC / actuadores) o por el backend que integra el IoT.
//      De esta forma queda explícito su vínculo con el módulo IoT del sistema.
db.createCollection("alertas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["fecha", "modulo", "tipo_alerta", "mensaje", "id_usuario", "detalle"],
      properties: {
        fecha:       { bsonType: "date",    description: "Fecha/hora del evento de alerta." },
        modulo:      { bsonType: "string",  description: "Origen lógico (p.ej. 'Dashboard', 'IoT-Gateway', 'ReaderNFC')." },
        tipo_alerta: { bsonType: "string",  description: "Clasificación (p.ej. 'error_general_nfc')." },
        mensaje:     { bsonType: "string",  description: "Descripción breve mostrable." },
        detalle:     { bsonType: "string",  description: "Detalle técnico util para soporte." },
        id_usuario:  { bsonType: "int",     description: "ID de usuario afectado si aplica; 0/omitir si no aplica." }
      },
      additionalProperties: false
    }
  }
});

db.alertas.createIndex({ fecha: -1 });
db.alertas.createIndex({ tipo_alerta: 1, fecha: -1 });
db.alertas.createIndex({ modulo: 1, fecha: -1 });

db.alertas.insertMany([
  {
    detalle: "Error",
    fecha: isodate("2025-08-13T21:29:28-06:00"),
    id_usuario: 20,
    mensaje: "Error en el proceso de lectura NFC",
    modulo: "Dashboard",          // o "IoT-Gateway" si viene directamente del dispositivo
    tipo_alerta: "error_general_nfc"
  }
]);

// -------------------------------
// 5) Colección: historial_nfc  (LOG de transacciones NFC / IoT)
// -------------------------------
db.createCollection("historial_nfc", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "fecha", "tipo", "mensaje", "estado",
        "plataforma", "cajon", "id_usuario", "uid", "detalle"
      ],
      properties: {
        fecha:       { bsonType: "date",    description: "Fecha/hora del evento." },
        tipo:        { bsonType: "string",  description: "entrada | salida | intento | otro" },
        mensaje:     { bsonType: "string",  description: "Mensaje humano." },
        estado:      { bsonType: "string",  description: "ok | error | denegado ..." },
        plataforma:  { bsonType: "string",  description: "android | ios | iot | web" },
        cajon:       { bsonType: "string",  description: "Cajón relacionado si aplica." },
        id_usuario:  { bsonType: "int",     description: "ID de usuario (relacional)." },
        uid:         { bsonType: "string",  description: "UID NFC leído / emulado." },
        detalle:     { bsonType: "string",  description: "Información adicional (puede ser vacío)." }
      },
      additionalProperties: false
    }
  }
});

db.historial_nfc.createIndex({ fecha: -1 });
db.historial_nfc.createIndex({ uid: 1, fecha: -1 });
db.historial_nfc.createIndex({ id_usuario: 1, fecha: -1 });

db.historial_nfc.insertMany([
  {
    cajon: "C1",
    detalle: "",
    estado: "ok",
    fecha: isodate("2025-08-19T11:58:12-06:00"),
    id_usuario: 20,
    mensaje: "Salida registrada. Cajón liberado.",
    plataforma: "android",
    tipo: "salida",
    uid: "1AA51C06"
  }
]);

// -------------------------------
// 6) Colección: rechazos_visitas  (solicitudes de visitante rechazadas)
// -------------------------------
db.createCollection("rechazos_visitas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["fecha_registro", "id_sol", "comentario"],
      properties: {
        fecha_registro: { bsonType: "date",    description: "Fecha en la que se registró el rechazo." },
        id_sol:         { bsonType: "int",     description: "ID de la solicitud (relacional)." },
        comentario:     { bsonType: "string",  description: "Motivo/comentario de rechazo." }
      },
      additionalProperties: false
    }
  }
});

db.rechazos_visitas.createIndex({ fecha_registro: -1 });
db.rechazos_visitas.createIndex({ id_sol: 1, fecha_registro: -1 });

db.rechazos_visitas.insertMany([
  {
    comentario: "app web prueba",
    fecha_registro: isodate("2025-08-13T19:45:30Z"),
    id_sol: 136
  }
]);

// =====================================================================
// Listo: colecciones creadas, validadas e indexadas.
// Puedes eliminar los insertMany si no quieres datos de ejemplo.
// =====================================================================

"Modelo NoSQL creado correctamente en la BD 'ez_access'.";
