const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const db = require('../models'); // Tu modelo Sequelize
const Usuario = db.Usuario; // Asegúrate de tener este modelo

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.loginConGoogle = async (req, res) => {
  const { id_token } = req.body;

  try {
    // 1. Verifica el token con Google
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    // 2. Verifica si ya existe un usuario
    let usuario = await Usuario.findOne({ where: { google_uid: sub } });

    // 3. Si no existe, busca por correo (vinculación previa)
    if (!usuario) {
      usuario = await Usuario.findOne({ where: { correo_usu: email } });

      if (usuario) {
        // vincular cuenta Google
        usuario.google_uid = sub;
        await usuario.save();
      }
    }

    // 4. Si sigue sin existir, rechaza o registra (tú decides)
    if (!usuario) {
      return res.status(403).json({ error: 'Usuario no registrado en el sistema.' });
    }

    // 5. Generar token
    const token = jwt.sign({ id: usuario.id_usu, tipo: usuario.tipo_usu }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({ token, usuario });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};
