// middlewares/verificarToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('❌ Token ausente o mal formado');
    return res.status(403).json({ mensaje: 'Token no proporcionado o mal formado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'elpepe');

    if (!decoded.id) {
      console.warn('⚠️ Token válido pero sin ID');
      return res.status(401).json({ mensaje: 'Token inválido: sin ID de usuario' });
    }

    req.usuario = decoded; // contiene al menos el id
    next();

  } catch (error) {
    console.error('❌ Error verificando token:', error.message);
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};
