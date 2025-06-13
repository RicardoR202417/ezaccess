const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/verificarToken');

// Ruta protegida de ejemplo
router.get('/ruta-protegida', verificarToken, (req, res) => {
  res.json({ mensaje: 'Acceso autorizado', usuario: req.usuario });
});

module.exports = router;
