const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models'); // Asegúrate de que tu carpeta models/index.js exporta Usuario
const Usuario = db.Usuario;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.loginConGoogle = async (req, res) => {
  const { id_token } = req.body;

  try {
    // Verificar token de Google
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    if (!email || !name) {
      return res.status(400).json({ error: 'No se pudo extraer la información del perfil de Google.' });
    }

    // Separar nombre y apellido (simple)
    const [nombre, apellido] = name.split(' ');
    const nombreFinal = nombre || 'NombreDesconocido';
    const apellidoFinal = apellido || 'ApellidoDesconocido';

    // 1. Buscar usuario por google_uid
    let usuario = await Usuario.findOne({ where: { google_uid: sub } });

    // 2. Si no existe por google_uid, buscar por correo
    if (!usuario) {
      usuario = await Usuario.findOne({ where: { correo_usu: email } });

      // 2.1 Si existe, asociar UID de Google
      if (usuario) {
        usuario.google_uid = sub;
        await usuario.save();
        console.log('✅ Usuario existente vinculado con UID de Google');
      }
    }

    // 3. Si no existe ninguno, registrar automáticamente
    if (!usuario) {
      const passHash = await bcrypt.hash(sub + process.env.JWT_SECRET, 10);

      usuario = await Usuario.create({
        nombre_usu: nombreFinal,
        apellido_pat_usu: apellidoFinal,
        correo_usu: email,
        google_uid: sub,
        tipo_usu: 'residente', // Puedes cambiar según lo necesites
        pass_usu: passHash,
        estado_usu: 'activo'
      });

      console.log('✅ Usuario nuevo registrado automáticamente:', usuario.correo_usu);
    }

    // 4. Generar token
    const token = jwt.sign(
      { id: usuario.id_usu, tipo: usuario.tipo_usu },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, usuario });

  } catch (error) {
    console.error('❌ Error en login con Google:', error);
    res.status(500).json({ error: error.message || 'Error interno en login con Google.' });
  }
};
