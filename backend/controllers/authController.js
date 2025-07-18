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

    const contraseñaValida = await bcrypt.compare(contrasena, usuario.pass_usu);

    if (!contraseñaValida) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

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

// OBTENER TODOS LOS USUARIOS
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
};

// REGISTRO
exports.registrar = async (req, res) => {
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
    const existe = await Usuario.findOne({ where: { correo_usu: correo } });

    if (existe) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    const hash = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = await Usuario.create({
      nombre_usu: nombre,
      apellido_pat_usu: apellido_paterno,
      apellido_mat_usu: apellido_materno || null,
      fecha_nac_usu: fecha_nac || null,
      tipo_usu: tipo,
      tel_usu: telefono || null,
      correo_usu: correo,
      pass_usu: hash,
      ciudad_usu: ciudad || null,
      colonia_usu: colonia || null,
      calle_usu: calle || null,
      num_ext_usu: num_ext || null,
      codigo_nfc_usu: null,
      estado_usu: 'activo',
      fecha_reg_usu: new Date(),
    });

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// EDITAR USUARIO
exports.editarUsuario = async (req, res) => {
  const { id_usu } = req.params;
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
    const usuario = await Usuario.findByPk(id_usu);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Si se recibe una nueva contraseña, la hasheamos
    if (contrasena) {
      const hash = await bcrypt.hash(contrasena, 10);
      usuario.pass_usu = hash;
    }

    // Actualizar los demás campos
    usuario.nombre_usu = nombre || usuario.nombre_usu;
    usuario.apellido_pat_usu = apellido_paterno || usuario.apellido_pat_usu;
    usuario.apellido_mat_usu = apellido_materno || usuario.apellido_mat_usu;
    usuario.fecha_nac_usu = fecha_nac || usuario.fecha_nac_usu;
    usuario.tipo_usu = tipo || usuario.tipo_usu;
    usuario.tel_usu = telefono || usuario.tel_usu;
    usuario.correo_usu = correo || usuario.correo_usu;
    usuario.ciudad_usu = ciudad || usuario.ciudad_usu;
    usuario.colonia_usu = colonia || usuario.colonia_usu;
    usuario.calle_usu = calle || usuario.calle_usu;
    usuario.num_ext_usu = num_ext || usuario.num_ext_usu;

    await usuario.save();

    res.json({
      mensaje: 'Usuario actualizado correctamente',
      usuario
    });
  } catch (error) {
    console.error('Error al editar usuario:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// ELIMINAR USUARIO (ELIMINACIÓN FÍSICA)
exports.eliminarUsuario = async (req, res) => {
  const { id_usu } = req.params;

  try {
    const usuario = await Usuario.findByPk(id_usu);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Eliminar usuario físicamente de la base de datos
    await usuario.destroy();

    res.json({
      mensaje: 'Usuario eliminado correctamente',
      usuario
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  res.json({ mensaje: 'Sesión cerrada correctamente' });
};
