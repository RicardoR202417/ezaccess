// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/db');

// ==================== MIDDLEWARES ====================
app.use(cors({
  origin: [
    'http://localhost:3000',     // frontend web en local
    'http://localhost:8081',     // otro posible frontend local
    'http://localhost:8082',     // otra variante
    'http://localhost:5173',     // React Native web (opcional)
    'https://ezaccess.onrender.com',          // producción frontend
    'https://ezaccess-backend.onrender.com'   // producción backend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json()); // Middleware para leer JSON

// ==================== CONEXIÓN A BASE DE DATOS ====================
sequelize.authenticate()
  .then(() => console.log('✅ Conexión a PostgreSQL exitosa'))
  .catch(err => console.error('❌ Error al conectar a PostgreSQL:', err));

// ==================== RUTAS ====================

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('API del sistema de acceso vehicular funcionando');
});

// Rutas API
const authRoutes = require('./routes/authRoutes');
const rutasProtegidas = require('./routes/protegidasRoutes');
const visitaRoutes = require('./routes/visitaRoutes');
const nfcRoutes = require('./routes/nfcRoutes'); // ✅ Rutas NFC

// Montar rutas
app.use('/api', authRoutes);         // Autenticación
app.use('/api', visitaRoutes);       // Solicitudes de visita
app.use('/api', rutasProtegidas);    // Rutas con JWT
app.use('/api', nfcRoutes);          // ✅ Escaneo NFC

// ==================== PUERTO Y SERVIDOR ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});
