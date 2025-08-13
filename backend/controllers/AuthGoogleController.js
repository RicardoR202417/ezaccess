const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const db = require('../models'); // Tu modelo Sequelize
const Usuario = db.Usuario; // Asegúrate de tener este modelo

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.loginConGoogle = async (req, res) => {
  const { id_token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    // 1. Buscar por google_uid
    let usuario = await Usuario.findOne({ where: { google_uid: sub } });

    // 2. Si no existe, buscar por correo
    if (!usuario) {
      usuario = await Usuario.findOne({ where: { correo_usu: email } });

      // 2.1 Si existe, asociar el UID de Google
      if (usuario) {
        usuario.google_uid = sub;
        await usuario.save();
      }
    }

    // ✅ 3. Si sigue sin existir, registrar automáticamente
    if (!usuario) {
      usuario = await Usuario.create({
        nombre_usu: name,
        correo_usu: email,
        google_uid: sub,
        tipo_usu: 'residente',
        pass_usu: '', // o una cadena aleatoria encriptada
        estado_usu: 'activo'
      });
    }

    // 4. Generar token
    const token = jwt.sign(
      { id: usuario.id_usu, tipo: usuario.tipo_usu },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, usuario });

  } catch (error) {
    console.error(error);
    console.error('Error real en login con Google:', error);
    return res.status(500).json({ error: error.message || 'Error desconocido' });

  }
};