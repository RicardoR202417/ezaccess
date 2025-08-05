const Usuario = require('../models/usuarios');

exports.validarNFC = async (req, res) => {
  try {
    const { codigo_nfc } = req.body;

    if (!codigo_nfc) {
      return res.status(400).json({ error: "Código NFC requerido" });
    }

    const usuario = await Usuario.findOne({
      where: {
        codigo_nfc_usu: codigo_nfc,
        estado_usu: 'activo'
      }
    });

    if (!usuario) {
      return res.status(403).json({ allow: false, message: "Acceso denegado" });
    }

    res.json({
      allow: true,
      id_usu: usuario.id_usu,
      tipo_usu: usuario.tipo_usu
    });
  } catch (error) {
    console.error('Error en validarNFC:', error);
    res.status(500).json({ error: "Error del servidor" });
  }
};
