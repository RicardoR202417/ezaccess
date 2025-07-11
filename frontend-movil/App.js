const express = require('express');
const cors = require('cors'); // 👈 importa cors

const app = express();

// ✅ Habilita CORS para todos los orígenes
app.use(cors());

// Middleware estándar
app.use(express.json());

// Tus rutas
app.use('/api', require('./routes/auth')); // O tus rutas reales

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
