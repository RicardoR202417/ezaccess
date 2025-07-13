// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/db');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const rutasProtegidas = require('./routes/protegidasRoutes');
const visitaRoutes = require('./routes/visitaRoutes');

// ==================== CONFIGURAR CORS CORRECTAMENTE ====================
app.use(cors({
  origin: [
    'http://localhost:3000',     // frontend web en local
    'http://localhost:8081',     // otro posible frontend local
    'http://localhost:8082',     // ⚠️ tu frontend que lanza el error
    'http://localhost:5173',     // React Native web (opcional)
    'https://ezaccess.onrender.com',          // producción frontend
    'https://ezaccess-backend.onrender.com'   // producción backend (por si se conecta entre sí)
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // 🔥 necesario si el frontend envía cookies o headers auth
}));

// Middleware para leer JSON
app.use(express.json());

// ==================== CONEXIÓN A BASE DE DATOS ====================
sequelize.authenticate()
  .then(() => console.log('✅ Conexión a PostgreSQL exitosa'))
  .catch(err => console.error('❌ Error al conectar a PostgreSQL:', err));

// ==================== RUTAS ====================
app.get('/', (req, res) => {
  res.send('API del sistema de acceso vehicular funcionando');
});

app.use('/api', authRoutes);         // Rutas públicas de autenticación
app.use('/api', visitaRoutes);       // Rutas para visitas
app.use('/api', rutasProtegidas);   // Rutas protegidas con JWT

// ==================== PUERTO Y SERVIDOR ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});
