const Usuario = require('../models/Usuario');

// UIDs físicos fijos
const UID_ENTRADA = 'AE381C06';
const UID_SALIDA  = '1AA51C06';

exports.validarNFC = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = req.user; // ✅ recuperado desde JWT

    if (!uid || !usuario?.id_usu) {
      return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
    }

    const UID_ENTRADA = 'AE381C06';
    const UID_SALIDA = '1AA51C06';

    const tipo_tag = uid.toUpperCase() === UID_ENTRADA
      ? 'entrada'
      : uid.toUpperCase() === UID_SALIDA
      ? 'salida'
      : null;

    if (!tipo_tag) {
      return res.status(403).json({ mensaje: 'UID no reconocido' });
    }

    // Aquí continuarías con la lógica real (asignar cajón, registrar salida...)

    return res.json({
      mensaje: `UID detectado como ${tipo_tag}`,
      tipo: tipo_tag,
      usuario: usuario.nombre, // opcional para debug
    });
  } catch (error) {
    console.error('Error en validarTagFijo:', error);
    return res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

