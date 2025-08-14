// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/db');
const Vehiculo = require('./models/Vehiculo'); // 👈 IMPORTANTE
const iotRoutes = require('./routes/iotRoutes');

const nfcRoutes = require('./routes/nfcRoutes');
const asignacionRoutes = require('./routes/asignacionRoutes');
const cajonesRoutes = require('./routes/cajonesRoutes');
const actuadorRoutes = require('./routes/actuadorRoutes');
const authRoutes = require('./routes/authRoutes');
const rutasProtegidas = require('./routes/protegidasRoutes');
const visitaRoutes = require('./routes/visitaRoutes');
const reportesRoutes = require('./routes/reportes');
const vehiculosRoutes = require('./routes/vehiculosRoutes');

// CORS
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

sequelize.authenticate()
  .then(() => console.log('✅ Conexión a PostgreSQL exitosa'))
  .catch(err => console.error('❌ Error al conectar a PostgreSQL:', err));

// Ruta base
app.get('/', (req, res) => {
  res.send('API del sistema de acceso vehicular funcionando');
});

// Rutas
app.use('/api', authRoutes);
app.use('/api', visitaRoutes);
app.use('/api', require('./routes/asignacionRoutes'));
app.use('/api', require('./routes/cajonesRoutes'));

app.use('/api', actuadorRoutes);
app.use('/api', nfcRoutes);
app.use('/api/nfc', nfcRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api', rutasProtegidas);
app.use('/api/iot', iotRoutes); 

// Escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});
