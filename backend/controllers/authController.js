const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { Sequelize, sequelize } = require('../models'); // <-- Asegúrate de tener esto para Sequelize
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
    codigo_nfc_usu: usuario.codigo_nfc_usu, // <--- aquí debe estar
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
  const usuarios = await Usuario.findAll({
  where: { estado_usu: 'activo' }
});
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

    // 🆕 Generar automáticamente un código NFC único
    const codigoNFC = `NFC-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

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
      codigo_nfc_usu: codigoNFC, // ← Aquí se asigna automáticamente
      estado_usu: 'activo',
      fecha_reg_usu: new Date(),
    });

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      codigo_nfc_usu: codigoNFC // ← (opcional) si lo quieres mostrar
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};


// EDITAR USUARIO
exports.editarUsuario = async (req, res) => {
  const { id_usu } = req.params;
  const {
    nombre_usu,
    apellido_pat_usu,
    apellido_mat_usu,
    fecha_nac_usu,
    tipo_usu,
    tel_usu,
    correo_usu,
    ciudad_usu,
    colonia_usu,
    calle_usu,
    num_ext_usu
  } = req.body;

  try {
    const usuario = await Usuario.findByPk(id_usu);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Actualiza solo los campos recibidos
    if (nombre_usu !== undefined) usuario.nombre_usu = nombre_usu;
    if (apellido_pat_usu !== undefined) usuario.apellido_pat_usu = apellido_pat_usu;
    if (apellido_mat_usu !== undefined) usuario.apellido_mat_usu = apellido_mat_usu;
    if (fecha_nac_usu !== undefined) usuario.fecha_nac_usu = fecha_nac_usu;
    if (tipo_usu !== undefined) usuario.tipo_usu = tipo_usu;
    if (tel_usu !== undefined) usuario.tel_usu = tel_usu;
    if (correo_usu !== undefined) usuario.correo_usu = correo_usu;
    if (ciudad_usu !== undefined) usuario.ciudad_usu = ciudad_usu;
    if (colonia_usu !== undefined) usuario.colonia_usu = colonia_usu;
    if (calle_usu !== undefined) usuario.calle_usu = calle_usu;
    if (num_ext_usu !== undefined) usuario.num_ext_usu = num_ext_usu;

    await usuario.save();

    res.json({ mensaje: 'Usuario actualizado correctamente', usuario });
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
await Usuario.update(
  { estado_usu: 'inactivo' },
  { where: { id_usu: id_usu } }
);


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

// Obtener usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  const { id_usu } = req.params;
  try {
    const usuario = await Usuario.findByPk(id_usu);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// OBTENER RESIDENTES
exports.obtenerResidentes = async (req, res) => {
  try {
    console.log("Iniciando consulta para obtener residentes...");
    const [residentes] = await sequelize.query(
      `SELECT * FROM usuarios WHERE tipo_usu = 'residente' AND estado_usu = 'activo'`
    );
    console.log("Residentes encontrados:", residentes);
    res.json(residentes);
  } catch (error) {
    console.error("Error al obtener residentes:", error);
    res.status(500).json({ mensaje: "Error al obtener residentes", error: error.message });
  }
};
