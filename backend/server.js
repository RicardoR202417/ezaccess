// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/db');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const rutasProtegidas = require('./routes/protegidasRoutes'); // ✅ NUEVO

// Probar conexión a la BD
sequelize.authenticate()
  .then(() => console.log('Conexión a MySQL exitosa'))
  .catch(err => console.error('Error al conectar a MySQL:', err));

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba raíz
app.get('/', (req, res) => {
  res.send('API del sistema de acceso vehicular funcionando 🚗🔐');
});

// Rutas públicas
app.use('/api', authRoutes);

// Rutas protegidas con JWT
app.use('/api', rutasProtegidas); // ✅ NUEVO

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
