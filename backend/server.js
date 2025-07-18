// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/db');
const asignacionRoutes = require('./routes/asignacionRoutes');
const cajonesRoutes = require('./routes/cajonesRoutes'); // Agregar esta línea
const actuadorRoutes = require('./routes/actuadorRoutes');


// Importar rutas
const authRoutes = require('./routes/authRoutes');
const rutasProtegidas = require('./routes/protegidasRoutes');
const visitaRoutes = require('./routes/visitaRoutes');

// ==================== CONFIGURAR CORS CORRECTAMENTE ====================
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:8081',    // frontend web en local
    'http://localhost:8082',  
    'http://localhost:5173',   // React Native web
    'https://ezaccess.onrender.com', 
    'https://ezaccess-backend.onrender.com' // frontend web en producción (si aplica)
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para leer JSON
app.use(express.json());

// Probar conexión a la BD
sequelize.authenticate()
  .then(() => console.log('✅ Conexión a PostgreSQL exitosa'))
  .catch(err => console.error('❌ Error al conectar a PostgreSQL:', err));

// Ruta de prueba raíz
app.get('/', (req, res) => {
  res.send('API del sistema de acceso vehicular funcionando');
});

// Rutas públicas
app.use('/api', authRoutes);
app.use('/api', visitaRoutes);
app.use('/api', asignacionRoutes);
app.use('/api', cajonesRoutes); // Agregar esta línea después de otras rutas
app.use('/api', actuadorRoutes);

// Rutas protegidas con JWT
app.use('/api', rutasProtegidas);

// Puerto del servidor
const PORT = process.env.PORT || 5000;

// Escuchar en todas las interfaces para permitir acceso desde Expo
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});