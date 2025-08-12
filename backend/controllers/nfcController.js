const Usuario = require('../models/Usuario');

// UIDs físicos fijos
const UID_ENTRADA = 'AE381C06';
const UID_SALIDA  = '1AA51C06';

exports.validarNFC = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = req.usuario; // 👈 Asegúrate de que sea `usuario` y no `user`

    if (!uid || !usuario?.id) {
      return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
    }

    const UID_ENTRADA = 'AE381C06';
    const UID_SALIDA  = '1AA51C06';

    const tipo_tag = uid.toUpperCase() === UID_ENTRADA
      ? 'entrada'
      : uid.toUpperCase() === UID_SALIDA
      ? 'salida'
      : null;

    if (!tipo_tag) {
      return res.status(403).json({ mensaje: 'UID no reconocido' });
    }

    // Lógica posterior: asignar cajón o registrar salida, según tipo_tag

    return res.json({
      mensaje: `UID detectado como ${tipo_tag}`,
      tipo: tipo_tag,
      usuario: usuario.nombre || 'Desconocido', // Opcional para debug
    });

  } catch (error) {
    console.error('Error en validarNFC:', error);
    return res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

