// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
require('dotenv').config();

// LOGIN
exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const usuario = await Usuario.findOne({
      where: {
        correo_usu: correo,
        estado_usu: 'activo',
      },
    });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado o inactivo' });
    }

    const contraseñaValida = await bcrypt.compare(contrasena, usuario.pass_usu);

    if (!contraseñaValida) {
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

// REGISTRO
exports.registrar = async (req, res) => {
  const {
    nombre,
    apellido_pat,
    apellido_mat,
    fecha_nac,
    tipo,
    telefono,
    correo,
    contrasena,
    ciudad,
    colonia,
    calle,
    num_ext,
    codigo_nfc
  } = req.body;

  try {
    // Validación básica
    if (!nombre || !apellido_pat || !correo || !contrasena || !tipo) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    // Verificar si ya existe ese correo
    const existente = await Usuario.findOne({ where: { correo_usu: correo } });
    if (existente) {
      return res.status(400).json({ mensaje: 'Ya existe un usuario con ese correo' });
    }

    // Hashear contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // Crear nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre_usu: nombre,
      apellido_pat_usu: apellido_pat,
      apellido_mat_usu: apellido_mat,
      fecha_nac_usu: fecha_nac,
      tipo_usu: tipo,
      tel_usu: telefono,
      correo_usu: correo,
      pass_usu: hash,
      ciudad_usu: ciudad,
      colonia_usu: colonia,
      calle_usu: calle,
      num_ext_usu: num_ext,
      codigo_nfc_usu: codigo_nfc,
      estado_usu: 'activo'
    });

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: nuevoUsuario });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// OBTENER USUARIOS
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['pass_usu'] },
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
};