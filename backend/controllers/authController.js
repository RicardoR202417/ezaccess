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

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
};

// REGISTRAR USUARIO (residente o monitor)
exports.registrar = async (req, res) => {
  //desestructurar los campos recibidos del body
  const {
    nombre,
    apellido_paterno,
    apellido_materno,
    fecha_nac,
    tipo,
    telefono,
    correo,
    contrasena,
    ciudad,
    colonia,
    calle,
    num_ext
  } = req.body;

  try {
    // Verificar si el correo ya está registrado
    const existe = await Usuario.findOne({ where: { correo_usu: correo } });

    if (existe) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña con bcrypt
    const hash = await bcrypt.hash(contrasena, 10);

    // Crear el nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre_usu: nombre,
      apellido_pat_usu: apellido_paterno,
      apellido_mat_usu: apellido_materno,
      fecha_nac_usu: fecha_nac || null, // puede venir nulo
      tipo_usu: tipo,
      tel_usu: telefono || null,
      correo_usu: correo,
      pass_usu: hash,
      ciudad_usu: ciudad || null,
      colonia_usu: colonia || null,
      calle_usu: calle || null,
      num_ext_usu: num_ext || null,
      codigo_nfc_usu: null, // se generará después por el sistema NFC
      estado_usu: 'activo',
      fecha_reg_usu: new Date() // se puede omitir si la columna tiene valor por defecto
    });

    console.log('Nuevo usuario registrado:', nuevoUsuario.correo_usu);

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// CIERRE DE SESIÓN (logout simbólico)
exports.logout = (req, res) => {
  // En JWT, el logout se maneja eliminando el token del cliente.
  // Aquí solo confirmamos el cierre y podrías guardar un log en DB si lo deseas.
  res.json({ mensaje: 'Sesión cerrada correctamente' });
};
