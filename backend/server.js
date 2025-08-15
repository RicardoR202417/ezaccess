// server.js (robusto)
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();

// === Marcas para confirmar que se ejecuta ESTE archivo ===
console.log('🧭 Iniciando server.js de EZACCESS');
console.log('🗂️  __dirname =', __dirname);

// ====== DB (Sequelize) ======
const sequelize = require('./config/db');

// Forzar carga de al menos un modelo que declare asociaciones
require('./models/Vehiculo');

// ====== Rutas ======
const iotRoutes         = require('./routes/iotRoutes');
const nfcRoutes         = require('./routes/nfcRoutes');
const asignacionRoutes  = require('./routes/asignacionRoutes');
const cajonesRoutes     = require('./routes/cajonesRoutes');
const actuadorRoutes    = require('./routes/actuadorRoutes');
const authRoutes        = require('./routes/authRoutes');
const rutasProtegidas   = require('./routes/protegidasRoutes');
const visitaRoutes      = require('./routes/visitaRoutes');
const reportesRoutes    = require('./routes/reportes');
const vehiculosRoutes   = require('./routes/vehiculosRoutes');

// ====== CORS ======
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8081',
    'http://localhost:8082',
    'http://localhost:5173',
    'https://ezaccess.onrender.com',
    'https://ezaccess-backend.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// ====== Ruta base ======
app.get('/', (_req, res) => {
  res.send('API del sistema de acceso vehicular funcionando');
});

// ====== Montaje de rutas ======
app.use('/api', authRoutes);
app.use('/api', visitaRoutes);
app.use('/api', asignacionRoutes);
app.use('/api/cajones', cajonesRoutes);
app.use('/api', actuadorRoutes);
app.use('/api', nfcRoutes);
app.use('/api/nfc', nfcRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api', rutasProtegidas);
app.use('/api/iot', iotRoutes);

// ====== 404 & Error handler ======
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Recurso no encontrado', path: req.originalUrl });
});

app.use((err, _req, res, _next) => {
  console.error('🔥 Error no controlado en middleware:', err);
  res.status(500).json({ mensaje: 'Error del servidor', error: err?.message || 'unknown' });
});

// ====== Servidor HTTP con handlers ======
const PORT = Number(process.env.PORT) || 5000; // Fuerza 5000 por defecto
const HOST = process.env.HOST || '0.0.0.0';
const server = http.createServer(app);

// Errores del servidor (puerto en uso, permisos, etc.)
server.on('error', (err) => {
  console.error('❌ Error del servidor HTTP:', err.code || err.message, err);
  // NO hacemos process.exit aquí; dejamos que lo veas en consola
});

// Confirmación de escucha
server.on('listening', () => {
  const addr = server.address();
  console.log(`🚀 Servidor corriendo en http://${addr.address}:${addr.port} (pid=${process.pid})`);
});

// Señales del sistema
process.on('SIGINT', () => {
  console.warn('⚠️  SIGINT recibido. Cerrando servidor…');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente (SIGINT).');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.warn('⚠️  SIGTERM recibido. Cerrando servidor…');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente (SIGTERM).');
    process.exit(0);
  });
});

// Errores no capturados (no mates el proceso sin log)
process.on('uncaughtException', (err) => {
  console.error('💥 uncaughtException:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('💥 unhandledRejection:', reason);
});

// Conexión BD y arranque
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL exitosa');
  } catch (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err);
  } finally {
    // Arranca siempre para ver logs en HTTP aunque la BD falle
    server.listen(PORT, HOST);
  }
})();
