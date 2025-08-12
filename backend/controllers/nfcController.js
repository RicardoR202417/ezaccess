const Usuario = require('../models/Usuario');

// UIDs físicos fijos
const UID_ENTRADA = 'AE381C06';
const UID_SALIDA  = '1AA51C06';

exports.validarNFC = async (req, res) => {
  try {
    const { codigo_nfc, uid_tag } = req.body;

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

    let tipo_tag = null;

    if (uid_tag) {
      const uid = uid_tag.toUpperCase();
      if (uid === UID_ENTRADA) {
        tipo_tag = 'entrada';
      } else if (uid === UID_SALIDA) {
        tipo_tag = 'salida';
      } else {
        tipo_tag = 'desconocido';
      }
    }

    res.json({
      allow: true,
      id_usu: usuario.id_usu,
      tipo_usu: usuario.tipo_usu,
      tipo_tag: tipo_tag // entrada, salida o desconocido
    });

  } catch (error) {
    console.error('Error en validarNFC:', error);
    res.status(500).json({ error: "Error del servidor" });
  }
};
