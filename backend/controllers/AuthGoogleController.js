const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const Usuario = db.Usuario;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.loginConGoogle = async (req, res) => {
  const { id_token } = req.body;

  try {
    if (!id_token) {
      return res.status(400).json({ error: 'Falta el id_token en la solicitud.' });
    }

    // Verificar el token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log('✅ Payload de Google recibido:', payload);

    const { sub, email, name } = payload;

    if (!email || !name) {
      console.warn('⚠️ Payload incompleto. email:', email, 'name:', name);
      return res.status(400).json({ error: 'No se pudo extraer la información del perfil de Google.' });
    }

    // Separar nombre y apellido
    const [nombre, apellido] = name.split(' ');
    const nombreFinal = nombre || 'NombreDesconocido';
    const apellidoFinal = apellido || 'ApellidoDesconocido';

    // Buscar usuario
    let usuario = await Usuario.findOne({ where: { google_uid: sub } });

    if (!usuario) {
      usuario = await Usuario.findOne({ where: { correo_usu: email } });

      if (usuario) {
        usuario.google_uid = sub;
        await usuario.save();
        console.log('🔗 Usuario existente vinculado a cuenta Google.');
      }
    }

    if (!usuario) {
      const passHash = await bcrypt.hash(sub + process.env.JWT_SECRET, 10);

      usuario = await Usuario.create({
        nombre_usu: nombreFinal,
        apellido_pat_usu: apellidoFinal,
        correo_usu: email,
        google_uid: sub,
        tipo_usu: 'residente',
        pass_usu: passHash,
        estado_usu: 'activo'
      });

      console.log('🆕 Usuario nuevo registrado:', email);
    }

    const token = jwt.sign(
      { id: usuario.id_usu, tipo: usuario.tipo_usu },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, usuario });

  } catch (error) {
    console.error('❌ Error en loginConGoogle:', error.message);
    res.status(500).json({ error: 'Token inválido o mal formado. ' + error.message });
  }
};
