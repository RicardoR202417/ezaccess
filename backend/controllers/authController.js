// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
require('dotenv').config();

// LOGIN
exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    console.log('\nIntento de login');
    console.log('Correo recibido:', correo);

    const usuario = await Usuario.findOne({
      where: {
        correo_usu: correo,
        estado_usu: 'activo',
      },
    });

    if (!usuario) {
      console.log('Usuario no encontrado o inactivo');
      return res.status(401).json({ mensaje: 'Usuario no encontrado o inactivo' });
    }

    console.log('Usuario encontrado:', usuario.correo_usu);
    console.log('Tipo:', usuario.tipo_usu);
    console.log('Hash guardado:', usuario.pass_usu);
    console.log('Contraseña recibida:', contrasena);

    const contraseñaValida = await bcrypt.compare(contrasena, usuario.pass_usu);

    if (!contraseñaValida) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.id_usu,
        tipo: usuario.tipo_usu,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    console.log('Login exitoso, enviando token...');

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id_usu,
        nombre: usuario.nombre_usu,
        tipo: usuario.tipo_usu,
      },
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};
